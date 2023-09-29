import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized } from '@angular/router';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import { CommonVariableService } from '../../../dashboard/_services/commonvariable.service';
import { ActivityComponent } from '../../../components/hosts/activity/activity.component';
import { environment } from '../../../../environments/environment';
import * as $ from 'jquery';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { msg } from '../../../dashboard/_helpers/common.msg';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import 'datatables.net';
import { Subject, Subscription } from 'rxjs';
import swal from 'sweetalert';
import { Title } from '@angular/platform-browser';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthorizationService } from '../../../dashboard/_services/Authorization.service';
import { compare } from 'compare-versions';
import { moment } from 'vis-timeline';
import { saveAs } from 'file-saver';
import { filter, pairwise } from 'rxjs/operators';

declare let d3: any;
declare var alerted_entry: any;
let currentQueryID;
let gotResultsFromSocket;
var PaginationIndex
var TempIndex
var NextDataId
class log_data {
  line: string;
  message: string;
  severity: string;
  filename: string;
}

class Defender_log_data {
  columns: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

class Person {
  id: number;
  firstName: string;
  lastName: string;
}
var set_time_out;
var is_manually_closed_websocket_session:boolean=false
var str = window.location.href;
str = str.substr(str.indexOf(':') + 3);
var socket_ip = str.substring(0, str.indexOf('/'));
//for live terminal
let ws;
var live_url = environment.liveTerminal_response_socket_url;
if (live_url) {
  var socket_url = environment.liveTerminal_response_socket_url;
} else {
  var socket_url = 'wss://' + socket_ip + '/esp-ui/websocket/action/result';
}
//for quarrantine file validation
let wsq;
var live_socket_url = environment.socket_url;
if (live_socket_url) {
  var socket_live_url = environment.socket_url;
} else {
  var socket_live_url = 'wss://' + socket_ip + '/esp-ui/distributed/result';
}
//for stauslog export
let Wssl;
var Statuslog_Socketurl = environment.Statuslog_Export_Socketurl;
if (Statuslog_Socketurl) {
  var Statuslog_Live_Url = environment.Statuslog_Export_Socketurl;
} else {
  var Statuslog_Live_Url = 'wss://' + socket_ip + '/esp-ui/websocket/csv/export';
}
var status
var Timer_count = 0;
var timer_is_on = 0;

export interface CustomResponse {
  data: any;
  message: any;
  status: any;
}
@Component({
  providers:[ActivityComponent],
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})

export class NodesComponent implements AfterViewInit, OnInit, OnDestroy,OnChanges {
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  public editorOptions: JsonEditorOptions;
  text:string = "";
  live_test_code='';
  options:any = {maxLines: 1000, printMargin: false};
  id: any;
  sub: any;
  product: any;
  nodes: any;
  node_id: any;
  network_info: any;
  hostDetails: any = {'osquery_version':'', 'extension_version':''};
  node_info: any;
  data: any;
  lastcheckin: any;
  currentdate: any;
  lastcheckindate: any;
  enrolled: any;
  enrolleddate: any;
  laststatus: any;
  laststatusdate: any;
  byte_value: number;
  physical_memory:any;
  lastresult: any;
  lastresultdate: any;
  lastconfig: any;
  lastconfigdate: any;
  lastqueryread: any;
  lastqueryreaddate: any;
  lastquerywrite: any;
  lastquerywritedate: any;
  networkheadeer: any;
  additionaldata: any;
  packs_count: any;
  pack_name: any;
  query_name: any;
  query_names: any;
  pack_query_name: any;
  query_name_value: any;
  query_count: any;
  querydata: any = [];
  pack_data:any = [];
  tags:any[];
  searchText:any;
  action_status:any;
  endpoint:any;
  responseenabled:any;
  queryid:any;
  term:any;
  termQueries:any;
  log_status:any;
  log_data:any;
  errorMessage:any;
  errorMessageLogs:any;
  interval :any;
  dataRefresher: any;
  responce_action:Subscription;
  alerted_data_json:any;
  additional_config_data:any;
  status_log_checkbox=false;
  selectedItem:any;
  actionselect:any=0;
  host_identifier:any;
  os_platform:any;
  os_name:any;
  alertlist:any;
  alienvault = <any>{};
  ibmxforce = <any>{};
  rule = <any>{};
  ioc = <any>{};
  virustotal = <any>{};
  selectdays_shows: any;
  customurl : any = "";
  Filepath : any = "";
  FileExtensions : any = "";
  ProcessName : any = "";
  Quicktimepicker:any;
  fulltimepicker:any;
  fullschedulescan:number = 0;
  checkedIDs:any;
  exclusiondata:any;
  scannowdata:any;
  schedulescandata:any;
  currentsettingdata:any;
  viewcurrentdata:any;
  remove_exclusiondata:any;
  viewcurrentarray:any=[];
  Isloading:boolean=false;
  checkupdatedata:any;
  computerstatusdata:any;
  windows_defender_status:any;
  windows_defender_list = [];
  viewopenc2data :any;
  viewopenc2result:any;
  setting_openc2_id:any;
  check_openc2_id:any;
  scan_openc2_id:any;
  schedule_openc2_id:any;
  exclude_openc2_id:any;
  pendingcount = 0;
  settingstatus = 0 ;
  quarantinedata:any;
  quarantine_openc2_id:any;
  remove_exclude_openc2_id:any;
  status_openc2_id:any;
  scantype:any = 1;
  schduletype:any = 1;
  Isscanshow = false;
  Isquicksheduleshow = true;
  Isfullsheduleshow = false;
  Isfulltimeshow = true;
  keys:any;
  defenderstatus = true;
  modaltitle:any;
  successdata:any;
  loadermsg:any;
  defenderTimeout:any;
  defenderlogoutput:any;
  defenderloglist:any;
  myjson: any = JSON;
  Progress_value:number = 0;
  liveterminal_response='';
  cancel_live_terminal_request=false
  Loader_msg_based_on_time:any;
  spinner:boolean=false;
  msg_executing_or_executed:any;
  project_name=this.commonvariable.APP_NAME;
  osInfo:any;
  startedAt: any;
  hostState: any;


  configSelectControl = new FormControl('Any')

  //Recent activity
  nodesdata: any;
  activitynode: any;
  click_queryname:any;
  activitydata: any;
  activitycount: any;
  defaultData: boolean;
  queryname: any;
  recentactivitydata: any;
  activitydatanode: any;
  Events_dropdownList = [];
  Events_selectedItems = [];
  Events_dropdownSettings = {};
  export_csv_data: any = {}
  activitysearch:any;
  configListSelectedItem: any;
  additional_config_id: any;

  SelectdaysDataList = [
  {
    id: '1',
    label: 'Sunday',
    isChecked: 'checked'
  },
  {
    id: '2',
    label: 'Monday',
    isChecked: ''
  },
  {
    id: '3',
    label: 'Tuesday',
    isChecked: ''
  },
  {
    id: '4',
    label: 'Wednesday',
    isChecked: ''
  },
  {
    id: '5',
    label: 'Thursday',
    isChecked: ''
  },
  {
    id: '6',
    label: 'Friday',
    isChecked: ''
  },
  {
    id: '7',
    label: 'Saturday',
    isChecked: ''
  },
]
Malware_Events_dropdownList = []
Malware_Events_selectedItems = [];
Malware_Events_dropdownSettings = {};
scriptform: FormGroup;
file_content:File;
file_name:any;
show_live_terminal_results=false;
script_type_name=''
script_type_value=''
  public temp_var: Object=false;
    hosts_addtags_val:any;
    hosts_removetags_val:any;
    pack_addtags_val:any;
    pack_removetags_val:any;
    queries_addtags_val:any;
    queries_removetags_val:any;
  StatusdtOptions: any = {};
  ActivitydtOptions: any = {};
  DefenderdtOptions: any = {};
  testdtOptions: DataTables.Settings = {};
  DefenderdtTrigger: Subject<any> = new Subject();
  ActivitydtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  PreviousDataIds={}
  istabopen:boolean=false;
  list_of_QuarantineThreats=[]
  config_list_dropdownList = [];
  config_list_selectedItems: any;
  config_list_dropdownSettings = {}
  Live_terminal_command_id:any;
  public submit_button_disable_enable: boolean = false;
  role={'adminAccess':this.authorizationService.adminLevelAccess,'userAccess':this.authorizationService.userLevelAccess};
  compareAgentVersion:boolean;
  empty_data: boolean = false;
  openc2_id:number
  public screensize: any;
  showLoader: boolean = true;
  previousUrl: any;
  currentUrl: any;
  myRuleChart: any;
  detailPaneActive: boolean = false;
  constructor(
    private _Activatedroute: ActivatedRoute,
    private commonapi: CommonapiService,
    private commonvariable: CommonVariableService,
    private router: Router,
    private http: HttpClient,
    private _location: Location,
    private titleService: Title,
    private toastr: ToastrService,
    private activity:ActivityComponent,
    private fb: FormBuilder,
    private el: ElementRef,
    private authorizationService: AuthorizationService,
  ) {

   }
  toggle:boolean=false;
  @Input() hostData;

  ngOnInit() {
    this.hostState = history.state.hostState;
    $.fn.dataTable.ext.errMode = 'none';
    $("#Quarantine_Threats_no_data").hide();
    $('.quarantine_loader').hide();
    this.screensize = window.innerWidth;
    this.titleService.setTitle(this.commonvariable.APP_NAME + " - " + "Hosts");
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      this.getFromActivityData();
      if (this.hostData != undefined || this.hostData != null) {
        this.id = this.hostData.id;
        this.detailPaneActive = true;
      }
      else {
        this.id = params.get('id');
      }
    this.commonapi.host_name_api(this.id).subscribe(res => {
      this.activitydata = res;
      if(this.activitydata.status == "failure"){
        this.pagenotfound();
      }
      else{
      this.host_identifier = this.activitydata.data.host_identifier


      // this.nodekey = this.activitydata.data.node_key;
      if (this.activitydata.data.id == this.id) {
        this.nodes = this.activitydata.data.node_info.computer_name;
      }
    }
    });

    this.fetchData()
    let additional_config =this.commonapi.additional_config_api(this.id).subscribe(res =>{
        this.additionaldata=res;
        if(this.additionaldata != undefined){
          this.packs_count = Object.keys( this.additionaldata.data.packs ).length;
        this.pack_name = this.additionaldata.data.packs;
        this.query_count = Object.keys( this.additionaldata.data.queries ).length;
        this.query_names = this.additionaldata.data.queries;
        this.tags = this.additionaldata.data.tags;
        this.searchText;
        if(this.additionaldata.data.packs.length>0){
          this.getfirstpack_data();
        }

        if (this.additionaldata.data.queries.length>0){
          this.getfirst_data();
        }
        }

    })
    this.interval = setInterval(() => {
      this.refreshData();
    }, 10000);
    this.Getdefenderlog();




  this.commonapi.recent_activity_count_api(this.id).subscribe(res => {
    this.nodesdata = res;
    if(this.nodesdata != undefined){
        this.activitynode = this.nodesdata.data;
        this.click_queryname=this.activitynode[0].name
        this.query_name=this.activitynode[0].name;
        this.query_name = Array(this.query_name)
        this.activitycount = Object.keys(this.activitynode).length;

        this.searchText;

        this.defaultData=true;
        this.getFromActivityData();
        this.Refresh_datatable()
        this.showLoader = false;
        }
      });
    })
    this.Host_Alerted_rules();
    this.scriptform = this.fb.group({
      script_type:'',
      save_script:'',
      params:'',
      content: '',
      file_content: [''],
      // script_name:['', Validators.required]
      });
      this.config_list_dropdownSettings = {
        singleSelection: true,
        text: "Select config",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        badgeShowLimit: 1,
        enableSearchFilter: true,
        classes: "config_list_dropdown"
      };
      this.Malware_Events_dropdownSettings = {
        singleSelection: true,
        text:"Select Malware Events",
        selectAllText:'Select All',
        unSelectAllText:'UnSelect All',
        enableSearchFilter: true,
        classes:"myclass custom-class"
      };
      this.Malware_Events_dropdownList = [
      { 'id': "1006,1116", 'itemName': "Malware found" },
      { 'id': "1007", 'itemName': "Malware action taken" },
      { 'id': "1008", 'itemName': "Malware action failed" },
      // { 'id': "2000,2002", 'itemName': "Malware definitions updated" },
      // ​{ 'id': "2001,2003", 'itemName': "Malware definitions update failed" },
      ​{ 'id': "1000", 'itemName': "Malwareprotection scan started" },
      { 'id': "1001", 'itemName': "Malwareprotection scan completed" },
      { 'id': "1002", 'itemName': "Malwareprotection scan cancelled" },
      ​ { 'id': "1003", 'itemName': "Malwareprotection scan paused" },
      ​{ 'id': "1004", 'itemName': "Malwareprotection scan resumed" },
      { 'id': "1005", 'itemName': "Malwareprotection scan failed" },
      // { 'id': "1006", 'itemName': "Malwareprotection malware detected" },
      // { 'id': "1007", 'itemName': "Malwareprotection malware action taken" },
      // ​{ 'id': "1008", 'itemName': "Malwareprotection malware action failed" },
      { 'id': "1009", 'itemName': "Malwareprotection quarantine restore" },
      ​{ 'id': "1010", 'itemName': "Malwareprotection quarantine restore failed" },
      { 'id': "1011", 'itemName': "Malwareprotection quarantine delete" },
      ​{ 'id': "1012", 'itemName': "Malwareprotection quarantine delete failed" },
      { 'id': "1013", 'itemName': "Malwareprotection malware history delete" },
      ​{ 'id': "1014", 'itemName': "Malwareprotection malware history delete failed" },
      { 'id': "1015", 'itemName': "Malwareprotection behavior detected" },
      // { 'id': "1116", 'itemName': "Malwareprotection state malware detected" },
      { 'id': "1117", 'itemName': "Malwareprotection state malware action taken" },
      { 'id': "1118", 'itemName': "Malwareprotection state malware action failed" },
      { 'id': "1119", 'itemName': "Malwareprotection state malware action critically failed" },
      { 'id': "1120", 'itemName': "Malwareprotection threat hash" },
      { 'id': "1150", 'itemName': "Malwareprotection service healthy" },
      { 'id': "1151", 'itemName': "Malwareprotection service health report" },
      { 'id': "2000", 'itemName': "Malwareprotection signature updated" },
      { 'id': "2001", 'itemName': "Malwareprotection signature update failed" },
      { 'id': "2002", 'itemName': "Malwareprotection engine updated" },
      { 'id': "2003", 'itemName': "Malwareprotection engine update failed" },
      ​{ 'id': "2004", 'itemName': "Malwareprotection signature reversion" },
      ​{ 'id': "2005", 'itemName': "Malwareprotection engine update platformoutofdate" },
      { 'id': "2006", 'itemName': "Malwareprotection platform update failed " },
      { 'id': "2007", 'itemName': "Malwareprotection platform almostoutofdate" },
      { 'id': "2010", 'itemName': "Malwareprotection signature fastpath updated" },
      { 'id': "2011", 'itemName': "Malwareprotection signature fastpath deleted" },
      { 'id': "2012", 'itemName': "Malwareprotection signature fastpath update failed" },
      { 'id': "2013", 'itemName': "Malwareprotection signature fastpath deleted all" },
      { 'id': "2020", 'itemName': "Malwareprotection cloud clean restore file downloaded" },
      { 'id': "2021", 'itemName': "Malwareprotection cloud clean restore file download failed" },
      { 'id': "2030", 'itemName': "Malwareprotection offline scan installed" },
      { 'id': "2031", 'itemName': "Malwareprotection offline scan install failed" },
      { 'id': "2040", 'itemName': "Malwareprotection os expiring" },
      { 'id': "2041", 'itemName': "Malwareprotection os eol" },
      { 'id': "2042", 'itemName': "Malwareprotection protection eol" },
      { 'id': "3002", 'itemName': "Malwareprotection rtp feature failure" },
      { 'id': "3007", 'itemName': "Malwareprotection rtp feature recovered" },
      ​{ 'id': "5000", 'itemName': "Malwareprotection rtp enabled" },
      ​{ 'id': "5001", 'itemName': "Malwareprotection rtp disabled" },
      { 'id': "5004", 'itemName': "Malwareprotection rtp feature configured" },
      { 'id': "5007", 'itemName': "Malwareprotection config changed" },
      { 'id': "5008", 'itemName': "Malwareprotection engine failure" },
      ​{ 'id': "5009", 'itemName': "Malwareprotection antispyware enabled" },
      { 'id': "5010", 'itemName': "Malwareprotection antispyware disabled" },
      { 'id': "5011", 'itemName': "Malwareprotection antivirus enabled" },
      ​{ 'id': "5012", 'itemName': "Malwareprotection antivirus disabled" },
      { 'id': "5100", 'itemName': "Malwareprotection expiration warning state" },
      { 'id': "5101", 'itemName': "Malwareprotection disabled expired state" },
      ];

//Adding Recent Activity to Tab View



this.Events_dropdownSettings = {
  singleSelection: false,
  text:"Select Events",
  selectAllText:'Select All',
  unSelectAllText:'UnSelect All',
  enableSearchFilter: true,
  badgeShowLimit: 1,
  classes:"myclass custom-class",
};
this.Events_dropdownList = [
  {"id":1,"itemName":"File"},
  {"id":2,"itemName":"Process"},
  {"id":3,"itemName":"Remote Thread"},
  {"id":4,"itemName":"Process Open"},
  {"id":5,"itemName":"Removable Media"},
  {"id":6,"itemName":"Image Load"},
  {"id":7,"itemName":"Image Load Process Map"},
  {"id":8,"itemName":"HTTP"},
  {"id":9,"itemName":"SSL"},
  {"id":10,"itemName":"Socket"},
  {"id":11,"itemName":"DNS"},
  {"id":12,"itemName":"DNS Response"},
  {"id":13,"itemName":"Registry"},
  {"id":14,"itemName":"Yara"},
  {"id":15,"itemName":"Logger"},
  {"id":16,"itemName":"File Timestamp"},
  {"id":17,"itemName":"PeFile"},
  {"id":18,"itemName":"Defender Events"},
  {"id":19,"itemName":"Pipe Events"}
];


    }
    get s() { return this.scriptform.controls; }
    private async fetchData(){
      const data = await this.commonapi.host_name_api(this.id).toPromise();
      this.data = data;
      if(this.data.status == "failure"){
        this.pagenotfound();
      }
      else{
        if(this.data.data.id == this.id){
            this.nodes = this.data.data;
            this.node_id = this.nodes.id;
            this.network_info = this.nodes.network_info;
            this.host_identifier = this.nodes.host_identifier
            if(this.nodes.os_info != null){
            this.osInfo = this.nodes.os_info;
            this.os_platform = this.nodes.os_info.platform;
            this.os_name = this.nodes.os_info.name;
            }
            this.hostDetails = this.nodes.host_details;
            if(this.hostDetails['extension_version']){
              console.log(this.compareAgentVersion)
              this.compareAgentVersion=compare(this.hostDetails['extension_version'], "3.0", '<')
            }
            if(this.nodes.platform=='windows' && !this.hostDetails.hasOwnProperty('windows_security_products_status')){
              this.hideDefender(msg.unableFetchMsg);
            }
            //Security Center is supported only on Windows 8 and above
            if(this.os_name.includes("Windows 7") || this.os_name.includes("Windows Server") ){
              this.hideDefender(msg.windowsErrorMsg);
            }
            this.windows_defender_status = this.hostDetails.windows_security_products_status;
            this.node_info = this.nodes.node_info;
            this.physical_memory = this.physical_memory_formate(this.nodes.node_info.physical_memory);
            this.currentdate = new Date();

            if(!this.hostDetails){
              this.hostDetails={};
            }

            if(!this.hostDetails['osquery_version']){
              this.hostDetails['osquery_version'] = "-";
            }

            if(!this.hostDetails['extension_version']){
              this.hostDetails['extension_version'] = "-";
            }
            if(this.nodes.last_checkin==null){
              this.lastcheckin=''

            }else{
              var lastCheckinUtc = moment.utc(this.nodes.last_checkin).format();
              this.lastcheckin = moment(lastCheckinUtc).fromNow();

            }


            if(this.nodes.enrolled_on==null){
              this.enrolled=''
            }else{
              // Formatting to ISO8601 spec for Safari+Chrome support
              const temp = this.nodes.enrolled_on.toString().replace(' ', 'T');
              this.enrolled = new Date(temp);
            }

            if(this.nodes.last_status==null){
              this.laststatus=''
            }else{
              var lastStatusUtc = moment.utc(this.nodes.last_status).format();
              this.laststatus = moment(lastStatusUtc).fromNow();
            }

            if(this.nodes.last_result==null){
              this.lastresult=''
            }else{
              var lastResultutc = moment.utc(this.nodes.last_result).format();
              this.lastresult = moment(lastResultutc).fromNow();
            }

            if(this.nodes.last_config==null){
              this.lastconfig=''
            }else{
              var lastConfigUtc = moment.utc(this.nodes.last_config).format();
              this.lastconfig = moment(lastConfigUtc).fromNow();
            }


            if(this.nodes.last_query_read==null){
              this.lastqueryread=''
            }else{
              var lastQueryReadUtc = moment.utc(this.nodes.last_query_read).format();
              this.lastqueryread = moment(lastQueryReadUtc).fromNow();
            }
            if(this.nodes.last_query_write==null){
              this.lastquerywrite=''
            }else{
              var lastQueryWriteutc = moment.utc(this.nodes.last_query_write).format();
              this.lastquerywrite = moment(lastQueryWriteutc).fromNow();
            }
        }
        if(this.nodes.platform=='windows'){
          this.script_type_value='2'
          this.script_type_name='PowerShell Script'
        }else{
          this.script_type_value='4'
          this.script_type_name='Shell Script'
        }
      }
      this.cal_resonse_api()
    }
    cal_resonse_api(){
      let responce_action = this.commonapi.response_action(this.id).subscribe(res =>{
        if(res["status"]=="success"){
         this.action_status = res;
         this.endpoint = this.action_status.endpointOnline;
            this.responseenabled = this.action_status.responseEnabled;
            if (typeof this.windows_defender_status !== 'undefined'){
              this.keys = Object.keys(this.windows_defender_status)
              this.windows_defender_list = []
              this.keys.forEach((key, index) => {
                var signature = '';
                var state = '';
                //Disable Security center if windows defender status is null
                if(this.windows_defender_status[key].state == null){
                  this.hideDefender(msg.unableFetchMsg);
                }

                if(this.windows_defender_status[key].type == "Firewall"){
                  signature = 'Not Applicable'
                }
                else if(this.windows_defender_status[key].signatures_up_to_date == 1 && this.windows_defender_status[key].type == 'Antivirus'){
                  signature = 'Up-to-date'
                }
                else{
                  signature = 'Out-of-date'
                }
                //if host off
                if(this.responseenabled  == false){
                   state = 'Off'
                }else{
                  state = this.windows_defender_status[key].state
                }
                this.windows_defender_list.push({
                  "productname":this.windows_defender_status[key].name,
                  "producttype" : this.windows_defender_status[key].type,
                  "productstate" : state,
                  "productsignatures":signature,
                })
                if(this.windows_defender_status[key].type == 'Antivirus'){
                     if(state == 'Off' || state == "Snoozed"){
                       this.defenderstatus = false;
                     }
                }
              });

            }
          }else{
            this.responseenabled='Failed'
          }
        },(error) => {                              //Error callback
          console.error('error caught in component')
          if([500,502].includes(error.status)){
            this.responseenabled='Failed'
          }else if(error.status==401){
            localStorage.removeItem('reset_password');
            localStorage.removeItem('roles');
            localStorage.removeItem('all_roles');
            localStorage.removeItem('token');
            this.router.navigate(['./authentication/login']);
          }
        })
      }

    hideDefender(msg){
      $('.show_Manage_Defender').hide()
      $(".show_NotApplicable_Msg").html(msg);
    }
    setDataHost(value){
      localStorage.setItem('path',value);
    }
    public getPreviousUrl() {
      return this.previousUrl;
    }
    goToRuleAlerts(value) {
      this.router.navigate(['/alerts'],{queryParams: { 'id': this.id, 'from':value }}).then(()=>{
        window.location.reload();
      });
    }
    validDateFormat(value) {
      if (value) {
        let date = value.substring(0, 10);
        let time = value.substring(11, 19);
        let millisecond = value.substring(20)
        let date1 = date.split('-')[0];
        let date2 = date.split('-')[1];
        let date3 = date.split('-')[2];
        let validDate = date1 + '-' + date2 + '-' + date3 + ' ' + time;
        return validDate
      }
  
      return null;
  
    }
    Host_Alerted_rules(){
     let host_id =  this.id;
     let alertedrules=this.commonapi.Host_rules_api(host_id).subscribe(res => {
      this.alertlist = res;
      if(this.alertlist.status == "success"){
        this.alienvault = this.alertlist.data.sources.alienvault;
        this.ibmxforce = this.alertlist.data.sources.ibmxforce;
        this.rule = this.alertlist.data.sources.rule;
        this.ioc = this.alertlist.data.sources.ioc;
        this.virustotal = this.alertlist.data.sources.virustotal;
        var rules = this.alertlist.data.rules;
        var rule_name = []
        var rule_count = [];
        for(const i in rules){
          rule_name.push(rules[i].name)
          rule_count.push(rules[i].count)
        }
        if(rule_name.length==0){
          $('.top_rules').hide();
          $(document.getElementById('no-data-bar-chart-top_5_alerted_rules')).html("No Rule Based Alerts");
       }else{
          this.load_top_rules_graph(rule_name,rule_count)
       }
      }

    });
    }

    load_top_rules_graph(rule_name,rule_count){
      if(this.myRuleChart){
        this.myRuleChart.destroy()
        this.myRuleChart = new Chart('alerted_rules', {
        type: 'bar',
        data: {
            labels:rule_name,
            datasets: [{
                data: rule_count,
                backgroundColor: [
                          "#2A6D7C",
                          "#A2D9C5",
                          "#F79750",
                          "#794F5D",
                          "#6EB8EC"
                      ],
                barPercentage: 0.5,
            }]
        },
        options: {
          tooltips:{
            intersect : false,
            mode:'index'
            },
            responsive: false,
          // maintainAspectRatio: false,
          legend: {
            display: false
          },
          plugins: {
            labels: {
              render: () => {}
            }
          },
          scales: {
            offset:false,
            xAxes: [{
              barThickness: 30,
              gridLines: {
                  offsetGridLines: true,
                  display : false,
              },
              ticks: {
                callback: function(label, index, labels) {
                  var res = label.substring(0,2)+"..";
                  return res;
                },
                minRotation: 45
              }
          }],
          yAxes: [{
            ticks: {
                beginAtZero: true,
                display: false,
            },
            gridLines: {
              drawBorder: false,
          }
        }]
          },
        }
      });
    }
    else{
      this.myRuleChart = new Chart('alerted_rules', {
        type: 'bar',
        data: {
            labels:rule_name,
            datasets: [{
                data: rule_count,
                backgroundColor: [
                          "#2A6D7C",
                          "#A2D9C5",
                          "#F79750",
                          "#794F5D",
                          "#6EB8EC"
                      ],
                barPercentage: 0.5,
            }]
        },
        options: {
          tooltips:{
            intersect : false,
            mode:'index'
            },
            responsive: false,
          // maintainAspectRatio: false,
          legend: {
            display: false
          },
          plugins: {
            labels: {
              render: () => {}
            }
          },
          scales: {
            offset:false,
            xAxes: [{
              barThickness: 30,
              gridLines: {
                  offsetGridLines: true,
                  display : false,
              },
              ticks: {
                callback: function(label, index, labels) {
                  var res = label.substring(0,2)+"..";
                  return res;
                },
                minRotation: 45
              }
          }],
          yAxes: [{
            ticks: {
                beginAtZero: true,
                display: false,
            },
            gridLines: {
              drawBorder: false,
          }
        }]
          },
        }
      });
    }
    }

    onOptionsSelected(event:any){
     if(event.target.value == 1){
      let modal = document.getElementById("myModal");
      modal.style.display = "block";
      this.showdata(undefined);
     }else if(event.target.value == 2){
     this.node_id = this.nodes.id;
     this.cpt_restart(this.node_id);
     }

    }

  onselectoption(value){
    if(value == 1){
     let modal = document.getElementById("myModal");
     modal.style.display = "block";
     this.showdata(undefined);
    }else if(value == 2){
    this.cpt_restart(this.host_identifier);
    }
   }

close() {
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
  this.actionselect = 0;
 }
    showdata(n){

      this.commonapi.view_config_api(this.id).subscribe(res =>{
        this.additional_config_data =res['config'].name;
        this.additional_config_id = res['config'].id ? res['config'].id : 'Any'
      this.toggle=false;
      setTimeout(()=>{
        this.editorOptions = new JsonEditorOptions();
        this.editorOptions.mode = 'view';
        this.alerted_data_json=res['data'];
        this.toggle=true;
      }, 100);
    })
      this.config_list_dropdownList=[]
      this.config_list_dropdownList.push({value: 'Any', description: 'Select Config'})
      this.commonapi.configs_api().subscribe((res: any) => {
        if(!['windows','darwin'].includes(this.nodes['platform'])){
          this.nodes['platform'] = 'linux'
        }
      for (const i in res.data[this.nodes['platform']]){
        this.config_list_dropdownList.push({value: res['data'][this.nodes['platform']][i]['id'], description: i});
      }
      this.configListSelectedItem = this.additional_config_id
      })
    }
    Assign_config(){
      if(this.additional_config_id == this.configListSelectedItem){
        this.get_swal_error_message("Selected Config is already assigned")
      }
      else{
        var payload = {"host_identifiers":this.host_identifier}
        if(this.config_list_selectedItems){
        this.commonapi.asign_config_to_hosts(this.config_list_selectedItems['id'],payload).subscribe(res=>{
          if(res["status"]=="success"){
            this.close()
            Swal.fire({
              icon: 'success',
              text: res["message"]
              })
          }else{
            this.get_swal_error_message(res["message"])
          }
          })
        }else{
          this.close()
          this.get_swal_error_message("Please select config")
        }
      }
    }
    get_swal_error_message(message){
      Swal.fire({
        icon: 'warning',
        text: message
        })
    }


    /*
    This function convert bytes into  system physical_memory format
    */

    physical_memory_formate(bytes){
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0)
        return '0 Byte';
    this.byte_value = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, this.byte_value)) + ' ' + sizes[this.byte_value];
    }

    refreshData(){
        let products=this.commonapi.host_name_api(this.id).subscribe(res => {
          this.data = res;
          if(this.data.data.id == this.id){
              this.nodes = this.data.data;
              this.node_id = this.nodes.id;
              this.network_info = this.nodes.network_info;
              this.node_info = this.nodes.node_info;
              this.currentdate = new Date();
              if(this.nodes.last_checkin==null){
                this.lastcheckin=''
              }else{
                var lastCheckinUtc = moment.utc(this.nodes.last_checkin).format();
                this.lastcheckin = moment(lastCheckinUtc).fromNow();
              }
              if(this.nodes.enrolled_on==null){
                this.enrolled=''
              }else{
                // Formatting to ISO8601 spec for Safari+Chrome support
                const temp = this.nodes.enrolled_on.toString().replace(' ', 'T');
                this.enrolled = new Date(temp);
              }

              if(this.nodes.last_status==null){
                this.laststatus=''
              }else{
                var lastStatusUtc = moment.utc(this.nodes.last_status).format();
                this.laststatus = moment(lastStatusUtc).fromNow();
              }

              if(this.nodes.last_result==null){
                this.lastresult=''
              }else{
                var lastResultUtc = moment.utc(this.nodes.last_result).format();
                this.lastresult = moment(lastResultUtc).fromNow();
              }

              if(this.nodes.last_config==null){
                this.lastconfig=''
              }else{
                var lastConfigUtc = moment.utc(this.nodes.last_config).format();
                this.lastconfig = moment(lastConfigUtc).fromNow();
              }


              if(this.nodes.last_query_read==null){
                this.lastqueryread=''
              }else{
                var lastQueryReadUtc = moment.utc(this.nodes.last_query_read).format();
                this.lastqueryread = moment(lastQueryReadUtc).fromNow();
              }
              if(this.nodes.last_query_write==null){
                this.lastquerywrite=''
              }else{
                var lastQueryWriteUtc = moment.utc(this.nodes.last_query_write).format();
                this.lastquerywrite = moment(lastQueryWriteUtc).fromNow();
              }
          }
        })
        this.responce_action = this.commonapi.response_action(this.id).subscribe(res =>{
          if(res["status"]=="success"){
          this.action_status = res;
          this.endpoint = this.action_status.endpointOnline;
          this.responseenabled = this.action_status.responseEnabled;
          }else{
            this.responseenabled='Failed'
          }
      },(error) => {                              //Error callback
        if([500,502].includes(error.status)){
          this.responseenabled='Failed'
        }else if(error.status==401){
          localStorage.removeItem('reset_password');
          localStorage.removeItem('roles');
          localStorage.removeItem('all_roles');
          localStorage.removeItem('token');
          this.router.navigate(['./authentication/login']);
        }
      })
        // this.getData(false);
        //Passing the false flag would prevent page reset to 1 and hinder user interaction

    }
    ngOnDestroy() {
        clearInterval(this.interval)
        window.clearInterval(this.interval);
        clearInterval(this.defenderTimeout)
        clearTimeout(set_time_out)
   }

    cpt_restart(host_id){
      swal({
        title: "Are you sure?",
        text: "You want to restart the agent!",
        icon: "warning",
        buttons: ["Cancel", 'Yes! Restart it'],
        closeOnClickOutside: false,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          let products=this.commonapi.cpt_restart_api(host_id).subscribe(res => {
            this.data = res;
            if(this.data.status =='success'){
            swal({
              icon: 'success',
              title: 'Restart Initiated!',
              text: 'initiated agent restart command',
              buttons: [false],
             timer: 2000,
             })
            }else{
              swal({
                icon: 'error',
                title: 'Error!',
                text: 'Error initiating agent restart command',
               timer: 2000
                })
            }
          })

        }
      });
    }

  getBy_packId(pack_name) {
    this.selectedItem=pack_name
    for (const i in this.additionaldata.data.packs) {
      if (this.additionaldata.data.packs[i].name == pack_name) {
        this.pack_data = this.additionaldata.data.packs[i]
      }
    }
  }
  getfirstpack_data() {
    this.pack_data = this.additionaldata.data.packs[0];
    this.selectedItem=this.pack_data.name
  }

  ngAfterViewInit(): void {
    this.DefenderdtTrigger.next();
    this.ActivitydtTrigger.next();
  }

  getById(queryId) {
    for (const i in this.additionaldata.data.queries) {
      if (this.additionaldata.data.queries[i].id == queryId) {
        this.querydata = this.additionaldata.data.queries[i]
        this.queryid = queryId
      }
    }
  }

  getfirst_data() {
    this.querydata = this.additionaldata.data.queries[0];
    this.queryid = this.querydata.id
  }

  runAdHoc(queryId) {
    this.router.navigate(['live-query/', queryId]);
  }

  redirect(pack) {
    this.router.navigate(['/tags']);
  }


  hosts_addTag(tags, node_id) {
    this.commonapi.hosts_addtag_api(node_id, tags.toString()).subscribe(res => {
      this.hosts_addtags_val = res;
    });
  }
  hosts_removeTag(event, node_id) {
    this.commonapi.hosts_removetags_api(node_id, event).subscribe(res => {
      this.hosts_removetags_val = res;
    });

  }

  pack_addTag(test, id) {
    this.commonapi.packs_addtag_api(id, test.toString()).subscribe(res => {
      this.pack_addtags_val = res;

    });
  }
  pack_removeTag(pack_id,event) {
    this.commonapi.packs_removetags_api(event, pack_id).subscribe(res => {
      this.pack_removetags_val = res;
    });

  }

  queries_addTag(tags, query_id) {
    this.commonapi.queries_addtag_api(query_id, tags.toString()).subscribe(res => {
      this.queries_addtags_val = res;

    });
  }
  queries_removeTag(event, query_id) {
    this.commonapi.queries_removetags_api(query_id, event).subscribe(res => {
      this.queries_removetags_val = res;
    });

  }

  goBack() {
    this._location.back();
  }
  get_status_log_data(){
    var that=this;
    this.StatusdtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      dom: "<'row'<'col-sm-12'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row node-table-controls'<'col-sm-3'l><'col-sm-3'i><'col-sm-6'p>>",
      buttons: [
        {
          text: 'Export',
          attr:  {id: 'IdExport'},
          action: function ( e, dt, node, config ) {
            that.exportstatuslog();
          },
        },
      ],
      "language": {
        "search": "Search: "
      },
      ajax: (dataTablesParameters: any, callback) => {
        var body = dataTablesParameters;
        body['limit']=body['length'];
        if(body.search.value!= ""){
          body['searchterm']=body.search.value;
        }
        let host_id = this.id;
        var body = dataTablesParameters;
        body['limit'] = body['length'];
        body['node_id'] = host_id;
        this.http.post<DataTablesResponse>(environment.api_url+"/hosts/status_logs", body, { headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token')}}).subscribe(res =>{
          this.log_status = res;
          this.log_data = this.log_status.data.results;
          if(this.log_data.length >0 &&  this.log_data!=undefined)
          {

            // $("#DataTables_Table_0_info").
            $('.dataTables_paginate').show();
            $('.dataTables_info').show();


          }
          else{
            if(body.search.value=="" || body.search.value == undefined)
            {
              this.errorMessageLogs="No Data Found";
              var Export_Element = document.getElementById("IdExport");
              Export_Element.classList.add("disabled");
            }
            else{
              this.errorMessageLogs="No Matching Record Found";
            }

            $('.node-table-controls > * >.dataTables_paginate').hide();
            $('.node-table-controls > * >.dataTables_info').hide();

          }

          callback({
            recordsTotal: this.log_status.data.count,
            recordsFiltered: this.log_status.data.count,
            data: []
          });
        });
      },
      ordering: false,
      columns: [{ data: 'line' }, { data: 'message' }, { data: 'severity' }, { data: 'filename' },{ data: 'created' },{ data: 'version' }]
    }
  }
  ShowProgess:boolean = false;
  exportstatuslog(){
    this.ShowProgess = true;
    let host_id = this.id;
    var payload={
      "node_id":host_id
    }
    this.commonapi.hoststatuslogexport(payload).subscribe(res => {
      if(res['status']){
        var taskid = res['data'].task_id;
        Wssl = new WebSocket(Statuslog_Live_Url);
        this.StatusLogSocketQuery(taskid);
        window.addEventListener('offline', () =>   this.toastr.error('Network disconnected!.\n You may  not receive any pending results. Try sending the query again\ once connected'));
      }
    });

  }
  StatusLogSocketQuery(queryId){
    Wssl.onopen = function () {
      Wssl.send(queryId);
    };
    var that = this;
    Wssl.onmessage = function (event) {
      try {
        var data = event.data;
        if (data instanceof Blob) {
          var reader = new FileReader();
          Wssl.close() /* Closing the socket once we get data from live query */
          reader.addEventListener('loadend', (event: Event) => {
            const text = reader.result as string;
            var response_data = JSON.parse(text);
            if(response_data.download_path){
              that.ShowProgess = false;
              window.location.href = response_data.download_path;
              swal("File Download Completed", {
                icon: "success",
                buttons: [false],
                timer: 2000
              });
            }
          });
          reader.readAsText(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
  }

  status_log_tab(){
    this.status_log_checkbox = false;
  }
  toggleEditable(event) {
    if ( event.target.checked ) {
      this.status_log_checkbox = true;
      this.get_status_log_data();
   }else{
    this.status_log_checkbox = false;
   }
  }

  pagenotfound() {
      this.router.navigate(['/pagenotfound']);
  }
  disableScan:boolean = false;
  ScanNow(){
    this.disableScan = true;
    setTimeout(()=>{ this.disableScan = false }, 10000);
    var type = this.scantype;
    var payload = {
        "host_identifier":this.host_identifier,
	      "scan_type":type,
        "file_path":this.customurl,
        }
    if(type == 3 && this.customurl == ''){
      this.toastr.error(msg.customUrl);
      return;
    }
    this.commonapi.Scan_now(payload).subscribe(res => {
      this.scannowdata = res ;
      if(this.scannowdata.status == msg.success){
        this.scan_openc2_id = this.scannowdata.openc2_id;
        this.infosmsg(msg.scannow);
      }
      if(this.scannowdata.status == msg.failure){
        this.failuremsg(res['message']);
      }
    });
  }

  UpdateSignatures(){
    var payload = {
        "host_identifier":this.host_identifier,
        }
        this.commonapi.Checkupdate(payload).subscribe(res => {
          this.checkupdatedata = res;
          if(this.checkupdatedata.status == msg.success){
            this.infosmsg(msg.signatureupdates);
            this.check_openc2_id = this.checkupdatedata.openc2_id;
          }
          if(this.checkupdatedata.status == msg.failure){
            this.failuremsg(res['message'])
          }
        });
  }

  viewopenc2(id,msg,loader,type){
    var payload = {
      "openc2_id":id,
    }
   this.commonapi.viewopenc2(payload).subscribe(res => {
     this.viewopenc2data = res;
     console.log(this.viewopenc2data);
     console.log(loader);
     if(this.viewopenc2data.status == 'success'){
       var status = this.viewopenc2data.data.results[0].status;
       this.viewopenc2result = this.viewopenc2data.data.results[0].data;
       if(!["success","failure"].includes(status) && loader == true){
         if(this.pendingcount == 0){
           // this.openloader(type);
           this.switchloader(type);
           this.pendingcount = this.pendingcount + 1
         }
         else{
           if(type=='quarantine'){
            this.close_quarantine_loader()
            $("#Quarantine_Threats_no_data").show();
           }else{
            this.closeloader();
           }
           this.failuremsg(msg);
         }
       }
       else if(status == 'success' && loader == true){
         if(type=='quarantine'){
          this.close_quarantine_loader();
         }else{
          this.closeloader();
         }
         if(this.viewopenc2result !='NULL' && this.viewopenc2result !='NA' && this.viewopenc2result !=""){
           //this.successmsg(this.viewopenc2result);
           this.switchsuccessmsg(type,this.viewopenc2result);
         }else{
           this.switchinfomsg(type)
         }
       }
       else{
         this.failuremsg(msg.failuremsg);
       }

     }else{
      this.failuremsg(this.viewopenc2data.message)
     }
   });
  }
close_quarantine_loader(){
  clearTimeout(this.defenderTimeout);
  $('.quarantine_loader').hide()
  $('.Quarantine_Threats').hide()
  this.pendingcount = 0;
}
switchinfomsg(type) {
  switch(type) {
    case 'scan':
      this.infosmsg(msg.scannow);
      break;
    case 'schedule':
      this.infosmsg(msg.schedule);
      break;
    case 'exclusion':
      this.infosmsg(msg.Exclusion);
      break;
    case 'quarantine':
      $('.Quarantine_Threats').hide()
      $("#Quarantine_Threats_no_data").show();
      break;
    default:
  }
}

switchsuccessmsg(type,res) {
  switch(type) {
    case 'updatesignature':
      this.defender_result('Update Signature',res);
      break;
    case 'quarantine':
      this.QuarantineThreats(res);
      break;
    case 'securitystatus':
      this.defender_result('Security Status',res);
      break;
    case 'exclusion':
        this.defender_result('Exclusion Status',res);
      break;
    default:
  }
}

switchloader(type) {
  switch(type) {
    case 'schedule':
      this.openloader('Saving data. Please wait...');
      break;
    case 'exclusion':
      this.openloader('Saving data. Please wait...');
      break;
    case 'quarantine':
      $('.quarantine_loader').show()
      break;
    default:
     this.openloader('Fetching data. Please wait...');
     break;
  }
}

  Schedule_scan(){
    var type = this.schduletype;
    var _quicktimeisvalid = this.isvalidtimepicker(this.Quicktimepicker);
    var _fulltimeisvalid = this.isvalidtimepicker(this.fulltimepicker);
    if(_quicktimeisvalid == false && type == 1){
      this.toastr.error(msg.quicktimemsg);
      return
    }
    if(_fulltimeisvalid == false && type == 2 && this.fullschedulescan !=8){
      this.toastr.error(msg.fulltimemsg);
      return
    }
    var payload ={};
    if(type == 1){
      var qtimer = this.Quicktimepicker+':0'
       payload = {
          "host_identifier":this.host_identifier,
          "time":qtimer,
          "scan_type":type,
          "scan_day":1,
        }
      }
      else{
        var scanday = this.fullschedulescan;
        var ftimer = this.fulltimepicker+':0'
        payload = {
           "host_identifier":this.host_identifier,
           "time":ftimer,
           "scan_type":type,
           "scan_day":scanday,
         }
      }
      this.commonapi.Schedule_scan(payload).subscribe(res => {
        this.schedulescandata = res;
        if(this.schedulescandata.status == msg.success){
          this.schedule_openc2_id = this.schedulescandata.openc2_id;
          this.viewopenc2(this.schedulescandata.openc2_id,msg.Requestpending,true,'schedule');
          this.defenderTimeout = setTimeout(()=>{ this.viewopenc2(this.schedule_openc2_id,msg.Requestpending,true,'schedule') }, 30000);
          this.toastr.success(this.schedulescandata.message);
        }
        if(this.schedulescandata.status == msg.failure){
          this.toastr.error(this.schedulescandata.message);
        }
      });
    }

    isvalidtimepicker(time){
      if(typeof time !== 'undefined'){
        return true;
      }
      else{
        return false;
      }
    }
    action(event): void {
      event.stopPropagation();
    }

  Exclusions(){
    var payload = {
        "host_identifier":this.host_identifier,
	      "file_type":this.FileExtensions,
        "path":this.Filepath,
        "process":this.ProcessName,
        "action":"add"
        }
        this.commonapi.Exclusions(payload).subscribe(res => {
          this.exclusiondata = res;
          if(this.exclusiondata.status == msg.success){
            this.exclude_openc2_id = this.exclusiondata.openc2_id;
            this.viewopenc2(this.exclusiondata.openc2_id,msg.Requestpending,true,'exclusion');
            this.toastr.success(this.exclusiondata.message);
            this.defenderTimeout = setTimeout(()=>{ this.viewopenc2(this.exclude_openc2_id,msg.Requestpending,true,'exclusion') }, 30000);
          }
          if(this.exclusiondata.status == msg.failure){
            this.toastr.error(this.exclusiondata.message);
          }
        });
  }


  Removexclusions(){
    var payload = {
        "host_identifier":this.host_identifier,
	      "file_type":this.FileExtensions,
        "path":this.Filepath,
        "process":this.ProcessName,
        "action":"remove",
        }
        this.commonapi.Exclusions(payload).subscribe(res => {
          this.remove_exclusiondata = res;
          if(this.remove_exclusiondata.status == msg.success){
            this.remove_exclude_openc2_id = this.remove_exclusiondata.openc2_id;
            this.viewopenc2(this.remove_exclusiondata.openc2_id,msg.Requestpending,true,'exclusion');
            this.toastr.success(this.remove_exclusiondata.message);
            this.defenderTimeout = setTimeout(()=>{ this.viewopenc2(this.remove_exclude_openc2_id,msg.Requestpending,true,'exclusion') }, 30000);
          }
          if(this.remove_exclusiondata.status == msg.failure){
            this.toastr.error(this.remove_exclusiondata.message);
          }
        });
  }

  DefenderPreferences(){
       this.openloader(msg.LoadingMsg);
        var payload = {
        "host_identifier":this.host_identifier,
        }

        this.commonapi.Current_Setting(payload).subscribe(res => {
          this.currentsettingdata = res;
          if(this.currentsettingdata.status == msg.success){
            this.setting_openc2_id = this.currentsettingdata.openc2_id;
            this.viewcurrentsetting();
            this.defenderTimeout = setTimeout(()=>{ this.viewcurrentsetting() }, 5000);
            this.toastr.success(this.currentsettingdata.message);
          }
          if(this.currentsettingdata.status == msg.failure){
            this.toastr.error(this.currentsettingdata.message);
          }
        });
  }


  HostSecurityStatus(){
    var payload = {
    "host_identifier":this.host_identifier,
    }

    this.commonapi.Computerstatus(payload).subscribe(res => {
      this.computerstatusdata = res ;
      if(this.computerstatusdata.status == 'success'){
        this.status_openc2_id = this.computerstatusdata.openc2_id;
        this.viewopenc2(this.computerstatusdata.openc2_id,msg.Requestpending,true,'securitystatus');
        this.defenderTimeout = setTimeout(()=>{ this.viewopenc2(this.status_openc2_id,msg.Requestpending,true,'securitystatus') }, 20000);
        this.toastr.success(this.computerstatusdata.message);
      }
      if(this.computerstatusdata.status == 'failure'){
        this.toastr.error(this.computerstatusdata.message);
      }
    });
  }


  Refreshsetting(){
    this.viewcurrentsetting();
    setTimeout(()=>{ this.viewcurrentsetting() }, 20000);
  }

  GetQuarantineDiv:boolean=false;
  Getquarantine(host_identifier){
    this.GetQuarantineDiv = true;
    var payload = {
        "host_identifier":host_identifier,
        }
           $('.Quarantine_Threats').hide()
           $('.quarantine_loader').show()
           $("#Quarantine_Threats_no_data").hide();
           this.empty_data = false;
          this.list_of_QuarantineThreats=[]
        this.commonapi.Getquarantine(payload).subscribe(res => {
          this.quarantinedata = res;
          if(this.quarantinedata.status == msg.success){
            this.viewopenc2(this.quarantinedata.openc2_id,msg.Requestpending,true,'quarantine')
            this.quarantine_openc2_id = this.quarantinedata.openc2_id;
            this.defenderTimeout = setTimeout(()=>{ this.viewopenc2(this.quarantine_openc2_id,msg.Requestpending,true,'quarantine') }, 20000);
          }
          if(this.quarantinedata.status == msg.failure){
            this.failuremsg(res['status'].message);

          }
        });
  }
  Refresh_list(){
    this.Getquarantine(this.host_identifier)
  }

  emptmsg:any="";
  viewcurrentsetting(){
     var payload = {
       "openc2_id":this.setting_openc2_id,
     }
    this.commonapi.viewopenc2(payload).subscribe(res => {
      this.viewcurrentdata = res
      if(this.viewcurrentdata.data.results.length != 0){
        this.viewcurrentdata.data.results.forEach(element => {
          if(element.status == msg.success){
              this.closeloader();
              this.settingstatus = 0 ;
              this.defender_result(msg.def_heading,element.data);
          }
          else{
              if(this.settingstatus == 0){
                this.settingstatus = this.settingstatus + 1;
              }
              else{
                this.closeloader();
                this.settingstatus = 0 ;
                this.failuremsg(msg.Requestpending);
              }
          }
        });
      }

    });
  }
  defender_status_refresh(){
    var payload = {
      "host_identifier":this.host_identifier,
      }
    this.commonapi.defenderStatus_refresh(payload).subscribe(res => {
      if(res['status']='success'){
        swal({
          icon: 'success',
          text: res['message'],
          buttons: [false],
         timer: 2000,
         })
      }else{
        swal({
          icon: 'error',
          text: res['message'],
          })
      }
    })
  }
  Getdefenderlog(){
    this.DefenderdtOptions = {
       pagingType: 'simple',
       pageLength: 10,
       serverSide: true,
       processing: true,
       searching: true,
       "language": {
        "search": "Search: ",
        "paginate": {
          "previous": '<i class="fas fa-angle-double-left"></i> Previous',
          "next": 'Next <i class="fas fa-angle-double-right"></i>',
        },
      },
       ajax: (dataTablesParameters: any, callback) => {
         var payload = dataTablesParameters;
         let host_id = this.id;
         if (payload.search.value != "" && payload.search.value.length >= 1) {
          payload['searchterm'] = payload.search.value;
         }
         PaginationIndex=payload['start']
         if(PaginationIndex>TempIndex)   //checking next page index
         {
          payload['start']=NextDataId
         }
         else if (PaginationIndex<TempIndex)  //checking Previous page index
         {
          payload['start']=this.PreviousDataIds[PaginationIndex]
         }
         TempIndex=PaginationIndex;
         payload['limit'] = payload['length'];
          payload["node_id"]=host_id,
          payload["query_name"]="windows_real_time_events"
          if(this.Malware_Events_selectedItems.length>0){
            payload["column_name"]="defender_event_id",
            payload["column_value"]=this.Malware_Events_selectedItems[0].id
          }else{
            payload["column_name"]="eventid",
            payload["column_value"]='18'
          }
          if (payload['searchterm'] == undefined) {
           payload['searchterm'] = "";
          }
         this.http.post<DataTablesResponse>(environment.api_url + "/hosts/recent_activity", payload, { headers: { 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token') } }).subscribe(res => {
             if(res['status']=='success'){
               this.defenderlogoutput=res.data;
               this.defenderloglist = this.defenderlogoutput.results;
               if(this.defenderloglist.length > 0 && this.defenderloglist != undefined)
               {
                this.PreviousDataIds[PaginationIndex]=(this.defenderloglist[0].id)+1
                NextDataId=(this.defenderloglist[this.defenderloglist.length - 1]).id
                $('.dataTables_paginate').show();
                $('.dataTables_info').show();
                $('.dataTables_filter').show()
               }
               else{
                if(payload.search.value=="" || payload.search.value == undefined)
                {
                  this.errorMessage="No Logs Found";
                }
                else{
                  this.errorMessage="No Matching Record Found";
                  $('.dataTables_paginate').hide();
                  $('.dataTables_info').hide();
                }
               }
             }
           callback({
             recordsTotal: this.defenderlogoutput.categorized_count ,
             recordsFiltered: this.defenderlogoutput.count ,
             data: []
           });
         });
       },
       ordering: false,
       columns: [{ data: 'columns' }],
     }
     $(document).on( 'click', '.paginate_button', function (e) {
      if(!(e.currentTarget.className).includes('disabled')){
          $('.paginate_button.next').addClass('disabled');
          $('.paginate_button.previous').addClass('disabled');
      }})
  }

  cancelsetting(){
    clearTimeout(this.defenderTimeout);
    this.Isloading = false;
    this.settingstatus = 0
  }


  onItemChange(value){
    if(value == 0){
      this.selectdays_shows = false;
      this.fullschedulescan = 0;
      this.Isfulltimeshow = true;
    }
    else if(value == 1){
      this.selectdays_shows = true;
      this.fullschedulescan = 1;
      this.Isfulltimeshow = true;
    }
    else if(value == 8){
      this.selectdays_shows = false;
      this.fullschedulescan = 8;
      this.Isfulltimeshow = false;
    }else{
      this.fullschedulescan = value;
    }
  }


  onScanChange(value){
    if(value == 'Quickscan'){
      this.Isscanshow = false;
      this.scantype = 1;
    }
    else if(value == 'Fullscan'){
      this.Isscanshow = false;
      this.scantype = 2;
    }
    else{
      this.Isscanshow = true;
      this.scantype = 3;
    }
  }

  onSheduleChange(value){
    if(value == 'QuickShedule'){
      this.Isquicksheduleshow = true;
      this.Isfullsheduleshow = false;
      this.schduletype = 1;
    }
    else{
      this.Isquicksheduleshow = false;
      this.Isfullsheduleshow = true;
      this.schduletype = 2;
    }

  }

  Pendingsmsg(msg){
    swal({
      title: msg,
      icon: "success",
      buttons: {
       cancel: true,
       confirm: false,
      },
    })
  }

  successmsg(msg){
    swal({
      // title: "Success",
      text: msg,
      icon: "success",
      buttons: {
       cancel: false,
       confirm: true,
      },
    })
  }


  infosmsg(msg){
    swal({
      title: msg,
      icon: "success",
      buttons: {
       cancel: false,
       confirm: true,
      },
    })
  }


  failuremsg(msg){
    swal({
      icon: "warning",
      title: msg,
      buttons: {
        cancel: {
          text: "Close",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
    })
  }

  openloader(msg){
    let modal = document.getElementById("PendingModal");
    modal.style.display = "block";
    this.loadermsg = msg
  }

  closeloader() {
   clearTimeout(this.defenderTimeout);
   let modal = document.getElementById("PendingModal");
   modal.style.display = "none";
   this.pendingcount = 0;
  }

  closesetting() {
   let modal = document.getElementById("currentsettingModal");
   modal.style.display = "none";
   this.settingstatus = 0;
  }

  defender_result(title,res){
    let modal = document.getElementById("successModal");
    modal.style.display = "block";
    this.modaltitle = title;
    this.successdata = res;
  }

  Carve_QuarantineThreat(path){
    var word = ":_"
    var filepath = path.substr(path.indexOf(word) + word.length);
    var payload = {
      "host_identifier":this.host_identifier,
      "path":filepath
      }
    this.commonapi.carve_Quarantine_Threat(payload).subscribe(res => {
      if(res['status']=="success"){
        this.get_swal_message('success',res['message'])
      }else{
        this.get_swal_message('warning',res['message'])
      }
      })
  }

  closedefender() {
   let modal = document.getElementById("successModal");
   modal.style.display = "none";
  }
  Refresh_datatable(){
    this.DefenderdtTrigger.next();
    this.ActivitydtTrigger.next();
  }

  EmptyPaginationIds(){
    this.PreviousDataIds={}
    NextDataId=0
  }
  onItemSelect(item:any){
    this.EmptyPaginationIds()
    this.Refresh_datatable()
  }
  OnItemDeSelect(item:any){
   this.EmptyPaginationIds()
    this.Refresh_datatable()
  }
 onSelectAll(items: any){
  }
 onDeSelectAll(items: any){
  this.EmptyPaginationIds()
  this.Malware_Events_selectedItems=[]
  this.Refresh_datatable()
}
onscriptSubmit(){
  status=''
  if(ws!=undefined){
    is_manually_closed_websocket_session=true
    ws.close()
  }
  this.Loader_msg_based_on_time="Fetching results..."
  this.msg_executing_or_executed=''
  this.liveterminal_response=''
  Timer_count=0
  timer_is_on = 0
  clearTimeout(set_time_out);
  this.show_live_terminal_results=false
  var uploadData = new FormData();
  var regex = /[^\x00-\x7F]+/
  uploadData.append('host_identifier', this.host_identifier,);
  uploadData.append('file_type', this.scriptform.value.script_type);
  uploadData.append('params', this.scriptform.value.params);
  if((this.file_content==undefined ||this.file_content['length']==0) && this.live_test_code==''){
    this.get_swal_message('warning',"Please provide the script")
  }
  else if((this.file_content!=undefined && this.file_content['length']!=0) && this.live_test_code!=''){
    this.get_swal_message('warning',"Please provide either content or file")
  }
  else if(!this.live_test_code.trim() && (this.file_content==undefined ||this.file_content['length']==0) ){
    this.get_swal_message('warning',"content you have provided is empty")
  }
  else if(this.live_test_code.trim() !=''){
    if(!regex.test(this.live_test_code)){
      uploadData.append('content', this.live_test_code);
      this.get_live_Terminal_response_api(uploadData)
    }else{
      this.get_swal_message('warning',"The content contains unicode characters.Please provide valid string.")
    }
   }
   else{
        const reader = new FileReader();
        reader.onload = (e) => {
           if(!regex.test(reader.result.toString())){
            uploadData.append('file', this.file_content[0], this.file_content[0].name);
            this.get_live_Terminal_response_api(uploadData)
          }  else{
            this.get_swal_message('warning',"The file contains unicode characters.Please provide valid string.")
          }
        }
        reader.readAsText(this.file_content[0])
   }
}
get_swal_message(type,message){
  Swal.fire({
    icon: type,
    text: message,
    })
}
get_live_Terminal_response_api(uploadData){
  this.submit_button_disable_enable = true;
  setTimeout(() => {
   this.submit_button_disable_enable = false;
 }, 5000);
  this.commonapi.live_Terminal_response(uploadData).subscribe(res => {
    if(res['status']=="success"){
      this.Live_terminal_command_id=res['command_id']
      this.openc2_id=res['openc2_id']
      this.web_socket_cnnection(res['command_id'])
      this.spinner=true
      this.show_live_terminal_results=true
    }else{
      this.get_swal_message('warning',res['message'])
    }
    })
}
web_socket_cnnection(command_id){
  ws = new WebSocket(socket_url);
  is_manually_closed_websocket_session=false
  this.connect(command_id, ws);
  window.addEventListener('offline', () =>   this.toastr.error('Network disconnected!.\n You may  not receive any pending results. Try sending the query again\ once connected'));
}
uploadFile(event){
  if (event.target.files.length > 0) {
      this.file_content = event.target.files;
      this.file_name = this.file_content[0].name;
  }
}
resetFile(){
  this.scriptform.controls['file_content'].reset();
  this.file_name = ''
}
connect(commandid, ws) {
    function timedCount() {
      Timer_count = Timer_count + 1;
      set_time_out = setTimeout(timedCount, 1000);
        if(Timer_count==600 && !["success","failure",'cancelled'].includes(status) && that.liveterminal_response!="") {
          that.msg_executing_or_executed="Taking longer time than expected.Please try again"
          ws.close()
          clearTimeout(set_time_out);
        }
        if(Timer_count==300 && !["success","failure",'cancelled'].includes(status) && that.liveterminal_response==""){
          that.Loader_msg_based_on_time="Could not get the result, you may wait for some time..."
        }
    }

  ws.onopen = function () {
    ws.send(commandid);
  };
  this.cancel_live_terminal_request=true
  var that = this;
  var text
      ws.addEventListener("message", event => {
        if(!(event.data instanceof Blob)){
          if (!timer_is_on) {
            timer_is_on = 1;
            timedCount();
          }
        }else{
          if (event.data instanceof Blob) {
              var reader = new FileReader();
              reader.onload = () => {
                text=reader.result
                var Result=JSON.parse(text)
                if(!["success","failure",'cancelled'].includes(Result['status'])){
                  status=Result['status']
                  ws.send('pong');
                  if(Result['status']=="received" && Timer_count>0){}else{Timer_count=0}
                    if (!timer_is_on) {
                      timer_is_on = 1;
                      timedCount();
                  }
                }else if((Result['status']=="success")){
                  status="success"
                  that.msg_executing_or_executed="Executed"
                  if(this.liveterminal_response==""){
                  $('.liveterminal_response_loader').hide();
                  $('.liveterminal_response_data').show();
                  that.liveterminal_response="No Results Found"
                  }
                  ws.close()
                  clearTimeout(set_time_out);
                }else if(Result['status']=='cancelled' || Result['status']=='failure'){
                      status=Result['status']
                      that.msg_executing_or_executed=Result['status'].replace(/^./, Result['status'][0].toUpperCase())
                      if(that.liveterminal_response==''){
                        this.show_live_terminal_results=false
                      }
                      ws.close()
                      clearTimeout(set_time_out);
                      Swal.fire({title:Result['message']})
                 }
                  if(Result['data']!=""){
                  that.msg_executing_or_executed ="Executing..."
                  $('.liveterminal_response_loader').hide();
                  $('.liveterminal_response_data').show();
                  this.liveterminal_response=this.liveterminal_response+Result['data'];
                  }
              };
              reader.readAsText(event.data);
          }
        }
    });
  ws.onclose = function (e) {
    that.cancel_live_terminal_request=false
    console.log('Socket is closed')
    if(status=="Cancelled"){
      console.log('Cancelled the request')
    }
    else if(!["success","failure",'cancelled'].includes(status) && that.liveterminal_response=="") {
      if(!is_manually_closed_websocket_session){
        that.spinner=false
        that.Loader_msg_based_on_time="Taking longer time than expected.Please check the results in "
        clearTimeout(set_time_out)
        console.log('Socket is closed. session timeout')
    }
    }
  };

  ws.onerror = function (err) {
    console.error('Socket encountered error: ', err, 'Closing socket');
    ws.close();
  };
}

onChange(text) {
this.live_test_code=text
}
get_script_type(type){
  this.script_type_name=type
}
Cancel_Live_terminal_Request(id){
  this.cancel_live_terminal_request=false
  if(this.liveterminal_response!=''){
    this.msg_executing_or_executed="Cancelling"
  }else{  this.Loader_msg_based_on_time="Cancelling the request..."
  }
  let obj = {
    "command_id":id
  }
  this.commonapi.Cancel_viewresponse(obj).subscribe(res => {
    if(res['status']=="success"){
      status='Cancelled'
      this.get_swal_message("success",res['message'])
      ws.close()
      clearTimeout(set_time_out);
      if(this.liveterminal_response!=''){
        this.msg_executing_or_executed="Cancelled"
      }else{  this.Loader_msg_based_on_time="Cancelled the request"
            this.spinner=false
      }
    }else{
      this.msg_executing_or_executed=res['message']
      this.get_swal_message("warning",res['message'])
    }
    })
}
QuarantineThreatsList:any
QuarantineThreats(path){
  this.QuarantineThreatsList=path.split("\n")
  var unique = (this.QuarantineThreatsList.filter((v, i, a) => a.indexOf(v) === i));
  this.QuarantineThreatsList=unique.filter(Boolean)
  var word = ":_"
  var temparry=[];
  this.QuarantineThreatsList.forEach(function (value) {
    var filepath = value.substr(value.indexOf(word) + word.length);
    temparry.push(filepath);
  });
  var _quarystring = "'" + temparry.join("','") + "'";
  this.QuarantineQuerySubmit(_quarystring,temparry);
}

QuarantineQueryStatus:any;
QuarantineQuerySubmit(_quarystring,pathlist){
  if (wsq != undefined) {
    wsq.close();
  }
  let queryObj = {
    "nodes":this.host_identifier,
    "tags":"",
    "query":"select * from file where path in ("+_quarystring+")",
  }
  this.commonapi.Queries_add_api(queryObj).subscribe((res: CustomResponse) => {
    var data = res;
    if(data.status == 'success'){
      this.QuarantineQueryStatus={}
      for(const i in data.data.online_nodes_details){
        this.QuarantineQueryStatus[data.data.online_nodes_details[i].hostname]="Pending"
      }
      currentQueryID = data.data.query_id;
    }else{
      //if failure,reponse empty(hide carve button)
      var response = [];
      this.PopulateQuaratineThreatList(pathlist,response);
    }
    this.startedAt=new Date().getTime();
    gotResultsFromSocket=false;
    this.ConnectSocketQuery(data.data.query_id, pathlist);
    window.addEventListener('offline', () =>   this.toastr.error('Network disconnected!.\n You may  not receive any pending results. Try sending the query again\ once connected'));

  });
}

QuarantineThreatResponse = [];
ConnectSocketQuery(queryId, pathlist) {
  var timeNow = new Date().getTime();
  var timeElapsed = (timeNow - this.startedAt)/60000;
  if(queryId==currentQueryID && gotResultsFromSocket!=true && timeElapsed<10){
  wsq = new WebSocket(socket_live_url);
  wsq.onopen = function () {
    wsq.send(queryId);
  };
  var that = this;
  wsq.onmessage = function (e) {
    try {
      var data = e.data;
      if (data instanceof Blob) {
        var reader = new FileReader();
        wsq.close() /* Closing the socket once we get data from live query */
        reader.addEventListener('loadend', (event: Event) => {
          const text = reader.result as string;
          var response_data = JSON.parse(text);
          if(response_data.query_id==currentQueryID){
            gotResultsFromSocket=true;
            if(that.QuarantineQueryStatus.hasOwnProperty(response_data.node.name)){
              if(response_data.status==0){
                that.QuarantineQueryStatus[response_data.node.name]="Success";
              }else{
                that.QuarantineQueryStatus[response_data.node.name]="Failure";
              }
          }
            /* Start - adding hostname into json */
            var data = response_data.data;
            this.QuarantineThreatResponse = data;
            that.PopulateQuaratineThreatList(pathlist,this.QuarantineThreatResponse);

          }

        });
        reader.readAsText(data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  };

  wsq.onclose = function (e) {
      setTimeout(function () {
        that.ConnectSocketQuery(queryId, pathlist);
      }, 2000);
  };

  wsq.onerror = function (err) {
    console.error('Socket encountered error: ', err, 'Closing socket');
    wsq.close();
  };

}
QuarantineThreatList=[];
PopulateQuaratineThreatList(Pathlist,Responselist){
  var Temparray = [];
  var Responsearray = [];
  Pathlist.forEach(function (value,index) {
    Temparray.push({
      path:value,
      disabled:true,
    })
  });
  //validate quartinelist (file path exist or not)
  if(Responselist.length > 0){
    Responselist.forEach(function (value) {
      var Result = Pathlist.filter( element => element == value.path );
      Responsearray.push({path:Result[0],disabled:false});
    });
  }
  //update quartinelist based on query response
  if(Responselist.length > 0){
    Responsearray.forEach(function (value) {
      Temparray.find(item => item.path == value.path).disabled = false;
    });
  }

  this.QuarantineThreatList = Temparray;
  $('.Quarantine_Threats').show()
  $('.quarantine_loader').hide();
  if(this.QuarantineThreatList.length > 0){
    this.empty_data = false;
  }else{this.empty_data = true;}

}
onItemSelect_config(value, description) {

  let item= {
    id: value,
    itemName: description
  }
  this.config_list_selectedItems = item
}
OnItemDeSelect_config(item: any) {
  console.log(item);
}
onDeSelectAll_config(items: any) {
  this.config_list_selectedItems=[]
}
Alertmessage(type,title,message){
  Swal.fire({
    title:title,
    icon: type,
    text: message,
    })
}
closeModal(modalId){
  let modal = document.getElementById(modalId);
  modal.style.display = "none";
  $('.modal-backdrop').remove();
}

//Recent Activity
getFromActivityData() {
  var that=this;
  this.ActivitydtOptions = {
    pagingType: 'simple',
    pageLength: 10,
    scrollX: false,
    scrollY: 480,
    serverSide: true,
    processing: true,
    searching: true,
    dom: '<"pull-right"B><"pull-right"f><"pull-left"l>tip',
    buttons: [
      {
        text: 'CSV',
        attr:  {id: 'IdExport'},
        className: 'btn btn-csv',
        action: function ( e, dt, node, config ) {
          that.get_csv_data();
        },
      },
    ],
    "language": {
      "search": "Search: ",
      "paginate": {
        "previous": '<i class="fas fa-angle-double-left"></i> Previous',
        "next": 'Next <i class="fas fa-angle-double-right"></i>',
      },
    },
    ajax: (dataTablesParameters: any, callback) => {
      $('.recentActivityLoader').show();
      let node_id = this.id;
      var body = dataTablesParameters;
      PaginationIndex=body['start']
      if(PaginationIndex>TempIndex)   //checking next page index
      {
        body['start']=NextDataId
      }
      else if (PaginationIndex<TempIndex)  //checking Previous page index
      {
        body['start']=this.PreviousDataIds[PaginationIndex]
      }
      TempIndex=PaginationIndex;
      body['limit'] = body['length'];
      body['node_id'] = node_id;
      if (!this.query_name && !this.queryname){
        return;
      }
      if (this.defaultData) {
        body['query_name'] = this.query_name;
        this.selectedItem = this.query_name;
        this.queryname = this.query_name;

      } else {
        body['query_name'] = this.queryname;
      }
      if(body.search.value!= ""  &&  body.search.value.length>=1)
      {
        body['searchterm']=body.search.value;
      }
      if(body['searchterm']==undefined){
        body['searchterm']="";
      }
      if(this.Events_selectedItems.length>0){
        var eventids=''
        for(const eventid in this.Events_selectedItems){
          eventids=eventids + ',' + this.Events_selectedItems[eventid].id
        }
        body["column_name"]="eventid",
        body["column_value"]=eventids
      }
      this.http.post<DataTablesResponse>(environment.api_url + "/hosts/recent_activity", body, {headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token')}}).subscribe(res => {
        $('.recentActivityLoader').hide();
        this.recentactivitydata = res;
        this.activitydatanode = this.recentactivitydata.data.results;
        for(const id in this.activitynode){
          if(this.activitynode[id].name==this.queryname){
            this.activitynode[id].count=res.data['total_count']
          }
        }
        for (var v = 0; v < this.activitydatanode.length; v++) {
          if (this.activitydatanode[v].columns != '') {
            this.activitydatanode[v].columns = this.activitydatanode[v].columns;
          }


        }
        if(this.activitydatanode.length >0 &&  this.activitydatanode!=undefined)
          {
            this.PreviousDataIds[PaginationIndex]=(this.activitydatanode[0].id)+1
            NextDataId=(this.activitydatanode[this.activitydatanode.length - 1]).id
            $('.dataTables_paginate').show();
            $('.dataTables_info').show();
          }
          else{
            this.activitydatanode=null;
            if(body.search.value=="" || body.search.value == undefined)
            {
              this.errorMessage="No Data Found";
            }
            else{
              this.errorMessage="No Matching Record Found";
            }

            $('.dataTables_paginate').hide();
            $('.dataTables_info').hide();

          }
        // this.temp_var=true;
        callback({
          recordsTotal: this.recentactivitydata.data.categorized_count,
          recordsFiltered: this.recentactivitydata.data.count,

          data: []
        });
      });
    },
    ordering: false,
    columns: [{ data: 'columns' }],
  };
  $(document).on( 'click', '.paginate_button', function (e) {
    if(!(e.currentTarget.className).includes('disabled')){
        $('.paginate_button.next').addClass('disabled');
        $('.paginate_button.previous').addClass('disabled');
    }})
}
get_csv_data() {
  this.export_csv_data["host_identifier"] = this.host_identifier;
  this.export_csv_data["query_name"] = this.queryname;
  if(this.Events_selectedItems.length>0){
    var eventids=''
    for(const eventid in this.Events_selectedItems){
      eventids=eventids + ',' + this.Events_selectedItems[eventid].id
    }
    this.export_csv_data["column_name"]="eventid",
    this.export_csv_data["column_value"]=eventids
  }
  this.commonapi.recent_activity_search_csv_export(this.export_csv_data).subscribe(blob => {
    saveAs(blob, this.queryname+"_"+this.host_identifier+'.csv');

  })
}
getByActivityId(event, newValue, qryname, node_id): void {
  this.Events_selectedItems=[]
   if(this.click_queryname==qryname){
   }else{
    this.selectedItem = newValue;
    this.queryname = qryname;
    this.defaultData = false;
    this.Refresh_datatable()
    this.click_queryname=qryname;
  }
    this.PreviousDataIds={}
    NextDataId=0
  }
initialise_val(eventdata,data_process_guid) {

  const menuItems = [
    {
      title: 'Show More',
      action: (elm, d, i) => {

        if (d.count >= 20) {
          call_more(d);

        }
        // TODO: add any action you want to perform
      }
    }
  ];
  d3.contextMenu = function (menu, openCallback) {
    // create the div element that will hold the context menu
    d3.selectAll('.d3-context-menu').data([1])
      .enter()
      .append('div')
      .attr('class', 'd3-context-menu');

    // close menu
    d3.select('body').on('click.d3-context-menu', function () {
      d3.select('.d3-context-menu').style('display', 'none');
    });

    // this gets executed when a contextmenu event occurs
    return function (data, index) {
      if (!(data.node_type=='action' && data.count>20)){
        return;
      }
      var elm = this;

      d3.selectAll('.d3-context-menu').html('');
      var list = d3.selectAll('.d3-context-menu').append('ul');
      list.selectAll('li').data(menu).enter()
        .append('li')
        .html(function (d) {
          return (typeof d.title === 'string') ? d.title : d.title(data);
        })
        .on('click', function (d, i) {
          d.action(elm, data, index);
          d3.select('.d3-context-menu').style('display', 'none');
        });

      // the openCallback allows an action to fire before the menu is displayed
      // an example usage would be closing a tooltip
      if (openCallback) {
        if (openCallback(data, index) === false) {
          return;
        }
      }

      // display context menu
      d3.select('.d3-context-menu')
        .style('left', (d3.event.pageX - 2) + 'px')
        .style('top', (d3.event.pageY - 2) + 'px')
        .style('display', 'block');

      d3.event.preventDefault();
      d3.event.stopPropagation();
    };
  };
  var token_value = localStorage.getItem('token');
  var eid = eventdata.columns.eid;

  var jsonObjectOfActions = {
    "FILE_": "target_path",
    "PROC_": "path",
    "HTTP_": "remote_address",
    "SOCKET_": "remote_address",
    "IMAGE_": "image_path",
    "TLS_": "issuer_name",
    "REG_":"target_name",
    "DNS_":"domain_name"
  }

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

  var i = 0,
    duration = 750;

  var tree = d3.layout.tree()
    .size([height, width]);
  var diagonal = function link(d) {
    return "M" + d.source.y + "," + d.source.x
      + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
      + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
      + " " + d.target.y + "," + d.target.x;
  };

  var root;
  var id = this.id;
  var svg = d3.select("#d3-graph-2").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var alert_process_guid;
  if (eventdata.columns.action == 'PROC_TERMINATE') {
    alert_process_guid = data_process_guid;
  } else {
    alert_process_guid = data_process_guid;
  }
  let ajaxAlertData = {
      "process_guid":alert_process_guid,
      "node_id":this.id,

  }
  $.ajax({
    type: "POST", //rest Type
    dataType: 'json', //mispelled
    url: environment.api_url + "/alerts/process",
    async: false,
    headers: {
      "content-type": "application/json",
      "x-access-token": token_value
    },
    data: JSON.stringify(ajaxAlertData),
    success: function (msgdata) {
      var name=data_process_guid;
      var data={};
      var event_data=eventdata.columns;
      if(event_data.hasOwnProperty('parent_process_guid')&&event_data['parent_process_guid']==data_process_guid){
        name=event_data['parent_path'];
        data['process_guid']=data_process_guid;
        data['path']=name;
      }
      else if(event_data.hasOwnProperty('process_guid')&&event_data['process_guid']==data_process_guid){
        if(!event_data.hasOwnProperty('parent_process_guid')){
          name=event_data['process_name'];
          data['process_guid']=data_process_guid;
          data['process_name']=name;

        }else{
          name=event_data['path'];
          data=event_data;
        }
      }
      root = msgdata.data;
      root['data']=data;
      root['name']=name;
      root['path']=name;
      create_graph(root);
    }
  });

  function create_graph(root) {
    root.x0 = height / 2;
    root.y0 = 0;
    root.children = root.all_children;
    root.children.forEach(function (d) {
      if (!d.hasOwnProperty('children')) {
        collapse(d);
      }
      d.hidden = false;
    });
    root.hidden = false;
    update(root);
    blinkNode();
    d3.select(self.frameElement).style("height", "800px");
  }

  function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).filter(function (d) {
        return !d.hidden;
      }).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", function (d) {
        if (d.hasOwnProperty("data") && d.data.eid == eid) {
          return "node ";
        }
        return "node";
      })

      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })


      .on('click', function (d, i) {
        selectedNode(d);

        if ((d.node_type == 'action' || d.data.action == 'PROC_CREATE') && !d.hasOwnProperty("fetched")) {
          callChild(d);

        } else {
          click(d);
        }
      })
      .on('contextmenu', d3.contextMenu(menuItems));


    nodeEnter.append("circle")
      .attr("r", 4.5)
      .style("fill", function (d) {

        if ((d.node_type == 'action' || d.hasOwnProperty("has_child")) && !d.hasOwnProperty("children") && !d.hasOwnProperty("_children") && !d.hasOwnProperty("all_children")) {
          d._children = [];


          return "lightsteelblue";
        } else {
          return d._children ? "lightsteelblue" : "#fff";
        }
      });

    nodeEnter.append("text")
      .attr("x", function (d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return getTitle(d)
      })
      .style("fill-opacity", 1e-6);


    nodeEnter.append("title")
      .text(function (d) {
        getTitle(d);
      });
    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 4.5);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function (d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {

        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      }).attr("stroke", function (d) {
      return linkColor(d.target);
    });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    // node.on('contextmenu', d3.contextMenu(menuItems));
  }

  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
      if (d._children) {
        d._children.forEach(function (n) {
          n.hidden = true;
        });
        if (d.parent) {
          d.parent.children = d.parent.all_children;
          d.parent.children.forEach(function (n) {
            n.hidden = false;
          });
        }
      }
    } else {
      d.children = d._children;
      d._children = null;
      if (d.children) {
        d.children.forEach(function (n) {
          n.hidden = false;
        });

        if (d.parent) {
          d.parent.children = [d,];
          d.parent.children.filter(function (n) {
            return n !== d;
          }).forEach(function (n) {
            n.hidden = true;
          });
        }
      }
    }
    update(d);
  }

  function collapse(d) {
    if (d.children) {
      d.all_children = d.children;
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
      d.hidden = true;
    }
  }

  function blinkNode() {
    setInterval(function () {
      $('.blink-node').fadeTo('slow', 0.1).fadeTo('slow', 5.0);
    }, 1000);


  }

  function linkColor(link) {

    var action_colors = {
      "DNS_RESPONSE": "#fd7e14",
      "DNS_": "#007bff",
      "FILE_": "#dc3545",
      "PROC_": "#ffc107",
      "SOCKET_": "#28a745",
      "HTTP_": "#6c757d",
      "REG_": "#0000FF",
      "TLS_": "#20c997",
      "IMAGE_": "#7F007F",
    }
    for (var jsonObject in jsonObjectOfActions) {
      if (link.data && 'action' in link.data && link.data.action.includes(jsonObject)&& action_colors.hasOwnProperty(jsonObject)) {
        return action_colors[jsonObject];
      } else {
        if (link.node_type == 'action' && 'action' in link && link.action.includes(jsonObject) && action_colors.hasOwnProperty(jsonObject)) {
          return action_colors[jsonObject];
        }
      }
    }
    return "#0000FF";

  }

  function getTitle(d) {
    var name = d.name;
    if (d.node_type != 'action') {
      for (var jsonObject in jsonObjectOfActions) {
        if (d.data && 'action' in d.data && d.data.action.includes(jsonObject)) {
          let tempValue = jsonObjectOfActions[jsonObject];

          name = d.data[tempValue];
          if (d.data.action.includes("SOCKET")) {
            name = name + ":" + d.data.remote_port;
          }
          break;
        }
      }
    } else {
      name = name + "(" + d.count + ")";
    }
    if (name) {
      var lastlength = name.lastIndexOf('\\');
      var filter_process_name = name.substring(lastlength + 1);
      if (filter_process_name==''){
        var url = name.split( '\\' );
        if(url.length>=2){
          filter_process_name = url[ url.length - 2 ] ;
        }
      }
    }
    return filter_process_name;
  }

  function callChild(d) {

    if (d.hasOwnProperty("fetched") || d.hasOwnProperty("fetching")) {
      return
    }
    call_more(d);


  }

  function call_more(d) {
    d.fetching=true;
    if ((d.process_guid) && (d.node_type === 'action')) {

      let token_val = localStorage.getItem('token');
      let url_get_events_by_action_and_pgid = environment.api_url + '/alerts/process/child';
      let child_ajaxData = {
        "process_guid": d.process_guid,
        "action": d.action,
        "last_time": d.last_time,
        "node_id":id,
      }

      get_events_by_action_and_pgid();

      function get_events_by_action_and_pgid() {
        $.ajax({
          url: url_get_events_by_action_and_pgid,
          contentType: "application/json",
          headers: {
            "content-type": "application/json",
            "x-access-token": token_val
          },
          data: JSON.stringify(child_ajaxData),
          dataType: "json",
          type: "POST"
        }).done(function (data, textStatus, jqXHR) {
          delete d.fetching;
          d.fetched = true;
          d.last_time = data.data.last_time;
          if (data && data.data.child_data.length > 0)
            hideParentChild(d, data.data.child_data);
        }) .fail(function (jqXHR, exception) {
          delete d.fetching;
        })
      }
    } else {
      if (d.data.action === 'PROC_CREATE' && d.node_type!='root') {
        var url = window.location.pathname;

        token_value = localStorage.getItem('token');
        let url_get_events_by_pgid = environment.api_url + '/alerts/process';
        let ajaxData = {
          "process_guid": d.data.process_guid,
          "node_id":id
        }

        get_events_by_pgid();

        function get_events_by_pgid() {
          $.ajax({
            url: url_get_events_by_pgid,
            contentType: "application/json",
            headers: {
              "content-type": "application/json",
              "x-access-token": token_value
            },
            data: JSON.stringify(ajaxData),
            dataType: "json",
            type: "POST"
          }).done(function (data, textStatus, jqXHR) {

            d.fetched = true;
            delete d.fetching;
            if (data && data.data.all_children.length > 0)
              hideParentChild(d, data.data.all_children);

          })  .fail(function (jqXHR, exception) {
            delete d.fetching;

          })
        }

      }

    }
  }

  function hideParentChild(d, data) {

    d.children = null;
    if (d.all_children) {
      Array.prototype.push.apply(d.all_children, data)

    } else {
      d.all_children = data;

    }
    d._children = d.all_children;
    click(d);
  }


  var coll2 = document.getElementsByClassName("collapsible2");
  var n;

  for (n = 0; n < coll2.length; n++) {
    coll2[n].addEventListener("click", function () {
      this.classList.toggle("active_1");
    });
  }

  function selectedNode(info) {
    let el = info.data;
    var eventsData_process = document.getElementById('eventsData_process');
    // if (eventsData_process) {
    while (eventsData_process.firstChild) eventsData_process.removeChild(eventsData_process.firstChild);
    // }


    if (el) {

      // delete el.utc_time;
      // delete el.time;
      // delete el.process_guid;

      // for (let i=0; i < el.events.length; i++){

      var TableRow = '';
      var title=el.eid;
      if(title==undefined){
        title=el.process_guid;
      }
      TableRow +=
        '<div class="card" style="margin-bottom: 0.2rem;">' + '<div class="card-header" id="label_2' + title + '">' +
        '<h5 class="mb-0" style="">' + '<button class="btn" data-toggle="collapse"  aria-expanded="false">'
        + title
        + '</button>'
        + '</h5>'
        + '</div>'
        + '<div class="collapse show">'
        + '<div class="card-body">'
        + '<div id ="' + el.action + 'column_data">'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
      TableRow += '';

      $('#eventsData_process').append(TableRow);
      var tbl = document.createElement("table");
      tbl.setAttribute("class", "table table-striped- table-bordered table-hover table-checkable");
      tbl.setAttribute("style", "margin-bottom: 0rem;");
      for (let child in el) {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var firstCellText = document.createTextNode(child);
        var secondCellText = document.createTextNode(el[child]);
        cell1.appendChild(firstCellText);
        cell1.style.fontSize = "11px";
        cell1.style.fontWeight = '600';
        // cell1.style.fontFamily = "Roboto";
        // cell1.style.color = '#212529';
        cell1.style.wordBreak = "break-all";
        cell1.style.minWidth = "75px"
        cell1.appendChild(secondCellText);
        cell2.style.fontSize = "10px";
        cell2.style.fontWeight = '500';
        // cell2.style.fontFamily = "Roboto";
        // cell2.style.color = '#212529';
        cell2.style.wordBreak = "break-all";
        var data = el[child];
        var is_hyperlink = false;
        var domain_md5_link;
        if (child === 'domain_name') {
          domain_md5_link = "https://www.virustotal.com/#/domain/" + data.substring(1, data.length);
          is_hyperlink = true;
        } else if (child == 'md5') {
          domain_md5_link = "https://www.virustotal.com/#/file/" + data + "/detection";
          is_hyperlink = true;


        }
        if (is_hyperlink == true) {
          var atag = document.createElement("a");
          atag.target = "_blank";
          atag.style.color = "blue";
          atag.href = domain_md5_link;
          atag.appendChild(secondCellText);
          cell2.appendChild(atag);

        } else {
          cell2.appendChild(secondCellText);

        }

        // cell2.setAttribute("class", "cellCss");

        row.appendChild(cell1);
        row.appendChild(cell2);
        tbl.appendChild(row);
      }
      var column_data = document.getElementById(el.action + 'column_data');
      if (column_data) {
        column_data.appendChild(tbl);
      }

    } else {
      var TableRow = '';
      TableRow += '<h5 class="mb-0" style="text-align: center;font-size: 12px; color: #788093; margin-right: 65px; margin-top: 35px;">' + 'Click an event node to view information'
        + '</h5>'

      TableRow += '';
      $('#eventsData_process').append(TableRow);
      var tbl = document.createElement("table");
    }
  }

  selectedNode('info');
}
process_guid_graph(eventdata,process_guid){
  var $: any;
  this.initialise_val(eventdata,process_guid);
  $('#processTree').modal('show');

}
close_data(){
  document.getElementById("d3-graph-2").innerHTML = '';
}

//Delete Host
deleteHost(host_name){
  swal({
    title: 'Are you sure?',
    text: "Want to delete the host "+ host_name,
    content: {
      element: "span",
      attributes: {
         innerHTML: "Note :Please make sure that you have uninstalled the agent on the host",
      },
    },
    icon: 'warning',
    buttons: ["Cancel", true],
    closeOnClickOutside: false,
    dangerMode: true,
    }).then((willDelete) => {
    if (willDelete) {
      this.commonapi.delete_host(this.id).subscribe(res =>{
        console.log(res);
        swal({
      icon: 'success',
      title: 'Deleted!',
      text: 'Host has been deleted.',
      buttons: [false],
      timer: 2000
      })
    })
    this.router.navigate(['/hosts']);
  }
})
}
disableHost(){
  swal({
    title: 'Are you sure?',
    text: "You want to Remove Host!",
    icon: 'warning',
    buttons: ["Cancel", "Yes, Remove it!"],
    dangerMode: true,
    closeOnClickOutside: false,
    }).then((willDelete) => {
    if (willDelete) {
      this.commonapi.DisableHost(this.host_identifier).subscribe(res => {
    swal({
    icon: 'success',
    text: 'Successfully Removed the host',
    buttons: [false],
    timer:1500
    })
    })
    this.router.navigate(['/hosts']);
    }
    })
}
ngOnChanges() {
  this.showLoader = true;
  this.log_data = [];
  this.status_log_tab();
  this.sub = this._Activatedroute.paramMap.subscribe(params => {
    this.getFromActivityData();
    if (this.hostData != undefined || this.hostData != null) {
      this.id = this.hostData.id;
    }
    else {
      this.id = params.get('id');
    }
  this.commonapi.host_name_api(this.id).subscribe(res => {
    this.activitydata = res;
    if(this.activitydata.status == "failure"){
      this.pagenotfound();
    }
    else{
    this.host_identifier = this.activitydata.data.host_identifier


    // this.nodekey = this.activitydata.data.node_key;
    if (this.activitydata.data.id == this.id) {
      this.nodes = this.activitydata.data.node_info.computer_name;
    }
  }
  });

  this.fetchData()
  let additional_config =this.commonapi.additional_config_api(this.id).subscribe(res =>{
      this.additionaldata=res;
      if(this.additionaldata != undefined){
        this.packs_count = Object.keys( this.additionaldata.data.packs ).length;
      this.pack_name = this.additionaldata.data.packs;
      this.query_names = this.additionaldata.data.queries;
      this.query_count = Object.keys( this.additionaldata.data.queries ).length;
      this.tags = this.additionaldata.data.tags;
      this.searchText;
      if(this.additionaldata.data.packs.length>0){
        this.getfirstpack_data();
      }

      if (this.additionaldata.data.queries.length>0){
        this.getfirst_data();
      }
      }

  })
  this.Getdefenderlog();




this.commonapi.recent_activity_count_api(this.id).subscribe(res => {
  this.nodesdata = res;
      if(this.nodesdata != undefined){
        this.activitynode = this.nodesdata.data;
        this.click_queryname=this.activitynode[0].name
        this.query_name=this.activitynode[0].name;
        this.query_name = Array(this.query_name)
        this.activitycount = Object.keys(this.activitynode).length;
      
        this.searchText;
      
        this.defaultData=true;
        this.getFromActivityData();
        this.Refresh_datatable()
      
        this.showLoader = false;
      }
    });
    this.Host_Alerted_rules();
  })

}


}
