import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef } from '@angular/core';
import { CommonapiService } from '../../dashboard/_services/commonapi.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert';
import { environment } from '../../../environments/environment';
import 'datatables.net';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthorizationService } from '../../dashboard/_services/Authorization.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import Swal from 'sweetalert2';
import { flyInOutRTLAnimation } from '../../../assets/animations/right-left-animation';
  class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;r
    recordsTotal: number;
  }
  @Component({
    selector: 'app-hosts',
    templateUrl: './hosts.component.html',
    animations: [flyInOutRTLAnimation],
    styleUrls: ['./hosts.component.scss']
  })
  export class HostsComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
    windows_online:any;
    windows_offline:any;
    windows_removed:any;
    ubuntu_online:any;
    ubuntu_offline:any;
    ubuntu_removed:any;
    darwins_online:any;
    darwins_offline:any;
    darwins_removed:any;
    count_all:any;
    hosts_status:any;
    host_state: any;
    hosts_platform:any;
    hostmainvalue_data:any;
    token_value:any;
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    errorMessage:any;
    checklist:any=[];
    masterSelected:any;
    hosts_enable:any;
    selectedPlatform: string = "all";
    selectedState: any = 0;
    selectedStatus= undefined;
    selectedStatusFilter : string = "Any";
    public stateFilterValue: any = 'any'
    searchTerm: any;
    selectedTab=1;
    public isVisible: boolean = false;
    public enableChild = false;
    public hostID: any;
    public hostData: any;
    public activeTab: any


    platformOptions = [
      { value: 'all', description: 'Any' },
      { value: 'windows', description: 'Windows' },
      { value: 'linux', description: 'Linux' },
      { value: 'darwin', description: 'Darwin' }
    ];
    stateOptions = [
      { value: 'Any', description: 'Any' },
      { value: 'Online', description: 'Online' },
      { value: 'Offline', description: 'Offline' },
    ];
    platformSelectControl = new FormControl('all');
    stateSelectControl = new FormControl('Any');
    configSelectControl = new FormControl('Any')

    //Node Data
    nodeData: any;
    hostIdentifier: any;
    restartData: any;
    additionalConfigData: any;
    additionalConfigData_id: any;
    toggle:boolean=false;
    editorOptions: JsonEditorOptions;
    alertedData_json: any;
    configListDropdownList = [];
    configListSelectedItems: any;
    configListSelectedItem: any;
    configListDropdownSettings = {}

    //Variable with DT Params to pass when calling export API
    tablebody: any;

    role={'adminAccess':this.authorizationService.adminLevelAccess,'userAccess':this.authorizationService.userLevelAccess}
    constructor(
        private commonapi: CommonapiService,
        private http: HttpClient,
        private authorizationService: AuthorizationService,
        private fb: FormBuilder,
        private _router: Router,
    ) {
    }

    ngOnInit() {
      $.fn.dataTable.ext.errMode = 'none';
      this.activeTab = 'Active';
      this.token_value = localStorage.getItem('token');
      this.get_hosts_count()
      var parentwidth = $("table").width();
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 25,
        serverSide: true,
        processing: true,
        searching: false,
        scrollCollapse: true,
        dom: "<'row'<'col-sm-12'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row table-controls'<'col-sm-3'l><'col-sm-3'i><'col-sm-6'p>>",
        "initComplete": function (settings, json) {
          $("#host_table").wrap("<div style='overflow:auto; width:100%;position:relative;max-height:70vh'></div>");
         },
        "language": {
          "search": "Search: ",
        "lengthMenu": "Results per page: _MENU_",
        },
        ajax: (dataTablesParameters: any,callback) => {
          this.get_hosts_count()
          var body = dataTablesParameters;
          body['limit']=body['length'];
          if(this.searchTerm){
            body['searchterm'] = this.searchTerm
          }
          if(this.hosts_platform!='' && this.hosts_platform!='all'){
          body['state']=this.host_state;
          if(body['state'] == 1){
            body['enabled'] = false;
          }
          else if(body['state'] == 0){
            body['enabled'] = true;
            body['status'] = this.hosts_status;
          }
          else{
            body['status'] = this.hosts_status;
          }
          body['platform']=this.hosts_platform;
        }
          if(body.search.value!= ""  &&  body.search.value.length>=1)
        {
          body['searchterm']=body.search.value;
        }
        if(body['searchterm']==undefined){
              body['searchterm']="";
            }
        if (body.order != "" && body.order.length >= 1) {
            body["column"] = body.columns[body.order[0].column].data;
            body["order_by"] = body["order"][0].dir;
          }


          //Setting TableBody = Body
          this.tablebody = body;
          this.removeSelectedHost();
          this.http.post<DataTablesResponse>(environment.api_url+"/hosts", body,{ headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token')}}).subscribe(res =>{
            localStorage.removeItem('nodeid');
            this.hostmainvalue_data = res.data['results'];
            this.checklist = [];
            for (const i in this.hostmainvalue_data) {
              let checkboxdata = {}
              checkboxdata['id'] = this.hostmainvalue_data[i].id;
              checkboxdata['isSelected'] = false
              this.checklist.push(checkboxdata);
            }

            this.getResponseStatus();
          if(this.hostmainvalue_data.length >0 &&  this.hostmainvalue_data!=undefined){
            this.hostmainvalue_data = res.data['results'];
            this.hostmainvalue_data.sort((x,y) => y.state - x.state)
            $('.dataTables_paginate').show();
            $('.dataTables_info').show();
          }else{
            if(body.search.value=="" || body.search.value == undefined){
              console.log(this.hostmainvalue_data);
              this.errorMessage = "No Host Found";
              console.log(this.errorMessage);
              $('.dataTables_paginate').hide();
              $('.dataTables_info').hide();
            }
            else{
              this.errorMessage = "No Matching Record Found";
              $('.dataTables_paginate').hide();
              $('.dataTables_info').hide();
            }
          }
            callback({
              recordsTotal: res.data['total_count'],
              recordsFiltered: res.data['count'],
              data: []
            })
          });
        },
        order: [],
        columnDefs: [ {
            targets: [0,2,6,7], /* column index */
            orderable: false, /* true or false */
         }],
        // ordering: true,
        columns: [{data: 'delete selected' },{ data: 'host' },{data:'state'},{data:'health'},{ data: 'os' }, { data: 'last_ip' }, { data: 'tags' },{ data: 'delete' }]

      }
      this.getByFilterId(0, undefined,'all')
      this.token_value = localStorage.getItem('token');
      $(document).ready(() => {
          var TableRow = '';
              // TableRow += '<button type="button" value =this.token_value href="javascript:void(0);" id ="export_option" class="btn btn-small" title="Download CSV File" alt="" value="" >' + '<i class="la la-download"></i>' + 'Export'
              //     + '</button>'

              TableRow += '';
              $('#exportData').append(TableRow);
          var token_val = this.token_value;
              $("#export_option").on('click', function(event){
              var currentDate = new Date();

              $.ajax({
                  "url": environment.api_url+"/hosts/export",
                  "type": 'GET',
                  headers: {
                      "content-type":"application/json",
                      "x-access-token": token_val
                    },
                  "success": function(res, status, xhr) {
                      var csvData = new Blob([res], {
                          type: 'text/csv;charset=utf-8;'
                      });
                      var csvURL = window.URL.createObjectURL(csvData);
                      var tempLink = document.createElement('a');
                      tempLink.href = csvURL;
                      tempLink.setAttribute('download', 'nodes' + '_' + currentDate.getTime() + '.csv');
                      document.getElementById('container').appendChild(tempLink);
                      tempLink.click();
                  }
              });
              return false;
              });
      });

      this.configListDropdownSettings = {
        singleSelection: true,
        text: "Select config",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        badgeShowLimit: 1,
        enableSearchFilter: true,
        classes: "config_list_dropdown"
      };
    }
    value : any;

    private startsWithAt(control: FormControl) {
      if (control.value.length > 50 ) {
          return {
              'startsWithAt@': true
          };
      }

      return null;
    }
    public validators = [this.startsWithAt];
    public errorMessages = {
      'startsWithAt@': 'Tag should not be more then 50 characters'
    };
    getResponseStatus(){
      this.commonapi.responseStatus().subscribe((res:any) => {
        this.hostmainvalue_data.forEach(function (data) {
             var filterData = res.data.find(x=>x.hostIdentifier == data.host_identifier);
             if(typeof filterData != 'undefined' && filterData.host_degraded == true){
                 var exclamationDiv = document.getElementById(data.host_identifier);
                 var hostOnlineDiv = document.getElementById(data.host_identifier+"_online");
                 if(exclamationDiv != null || hostOnlineDiv != null){
                   exclamationDiv.classList.remove("hide");
                   hostOnlineDiv.setAttribute('title', 'Status Degraded');
                 }
             }
         });
      });
    }
    deleteHost(host_id, host_name){
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
          this.commonapi.delete_host(host_id).subscribe(res =>{
            console.log(res);
            swal({
          icon: 'success',
          title: 'Deleted!',
          text: 'Host has been deleted.',
          buttons: [false],
          timer: 2000
          })
          setTimeout(() => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          },1500);
        })
      }
    })
     }

    get_hosts_count(){
      this.commonapi.Hosts_count().subscribe((res:any) => {
        this.windows_online = res.data.windows.online;
        this.windows_offline = res.data.windows.offline;
        this.windows_removed = res.data.windows.removed;
        if(this.windows_online !=='' || this.windows_online !=='' || this.windows_removed !==''){
          $('.window_widget_body').show();
        $('.window_widget_body2').hide();
        }
        this.ubuntu_online = res.data.linux.online;
        this.ubuntu_offline = res.data.linux.offline;
        this.ubuntu_removed = res.data.linux.removed;
        if(this.ubuntu_online !=='' || this.ubuntu_offline !=='' || this.ubuntu_removed !==''){
          $('.linux_widget_body').show();
        $('.linux_widget_body2').hide();
        }
        this.darwins_online = res.data.darwin.online;
        this.darwins_offline = res.data.darwin.offline;
        this.darwins_removed = res.data.darwin.removed;
        if(this.darwins_online !=='' || this.darwins_offline !=='' || this.darwins_removed !==''){
          $('.apple_widget_body').show();
        $('.apple_widget_body2').hide();
        }
        this.count_all=this.windows_online+this.windows_offline+this.windows_removed+this.ubuntu_online +this.ubuntu_offline+this.ubuntu_removed+this.darwins_online +this.darwins_offline+this.darwins_removed;
    });
    }

    addNodes(node_id){
      swal({
        title: 'Are you sure?',
        text: "You want to Restore Host!",
        icon: 'warning',
        buttons: ["Cancel", "Yes, Restore it!"],
        dangerMode: true,
        closeOnClickOutside: false,
        }).then((willDelete) => {
        if (willDelete) {
          this.commonapi.hosts_enablenodes_api(node_id).subscribe(res => {
            this.hosts_enable = res ;
            console.log(res,"res")
           if(this.hosts_enable.status=="failure"){
        swal({
        icon: "warning",
        text: this.hosts_enable.message,
        })
      }else{
        swal({
          icon: "success",
          text: "Successfully Restored the Host",
          buttons: [false],
          timer:1500
          })
        setTimeout(() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
          },500);}
        })
        }
        })

    }

    disableHost(host){
      this.selectList = [];
      this.selectOpenedList.push(host.id);
      swal({
        title: 'Are you sure?',
        text: "You want to Remove Host!",
        icon: 'warning',
        buttons: ["Cancel", "Yes, Remove it!"],
        dangerMode: true,
        closeOnClickOutside: false,
        }).then((willDelete) => {
        if (willDelete) {
          this.commonapi.DisableHost(host.host_identifier).subscribe(res => {
        swal({
        icon: 'success',
        text: 'Successfully Removed the host',
        buttons: [false],
        timer:1500
        })
        setTimeout(() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
          },500);
        })

        }
        else{
          this.selectOpenedList = [];
        }
        })
    }

    ngAfterViewInit() {
      this.dtTrigger.next();
    }

    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    getByFilterId(state,status, platform){
    // If only Platform Selected
    if(this.selectedState == 'Any' && platform != 'all'){
      this.hosts_platform=platform;
    }
    // If only State or Only Platform Selected
    else if((this.selectedState != 'Any') && (platform == 'all')){
      this.host_state = state;
      this.hosts_status = status;
      this.hosts_platform = undefined
    }
    else if((this.selectedState == 'Any') && (platform == 'all')){
      this.host_state = undefined;
      this.hosts_status = undefined;
      this.hosts_platform  = undefined;
    }
    // If both filters are selected
    else{
      this.host_state= this.selectedState;
      this.hosts_status= this.selectedStatus;
      this.hosts_platform= this.selectedPlatform;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });

    }

    hosts_addTag(tags,node_id){
      this.commonapi.hosts_addtag_api(node_id,tags.toString()).subscribe(res => {
      });
    }

    hosts_removeTag(event,node_id) {
      this.commonapi.hosts_removetags_api(node_id,event).subscribe(res => {
      });
    }
    selectList = [];
    selectOpenedList = [];
    filterArr:any;
    selectedCount:any=0;
    selectHost(id) {
      this.filterArr = this.selectList.filter( h => h==id);
      if(this.filterArr.length == 0){
        this.selectList.push(id);
      }else{
        this.selectList = this.selectList.filter(item => item !== id);
      }
      this.selectedCount = this.selectList.length;
    }
    removeSelectedHost(){
      this.selectList = [];
      this.selectedCount = this.selectList.length;
      this.masterSelected = false;
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].isSelected = false;
      }
    }
    checkUncheckAll() {
      for (var i = 0; i < this.checklist.length; i++) {
        this.checklist[i].isSelected = this.masterSelected;
        if(this.checklist[i].isSelected == true){
          this.filterArr = this.selectList.filter( h => h==this.checklist[i].id);
          if(this.filterArr.length == 0){
            this.selectList.push(this.checklist[i].id);
          }
        }
        else{
          this.selectList = this.selectList.filter(item => item !== this.checklist[i].id);
        }
      }
      this.selectedCount = this.selectList.length;
    }
    isAllSelected(id) {
      this.selectHost(id);
      this.masterSelected = this.checklist.every(function (item: any) {
        return item.isSelected == true;
      })
    }

    public selectedHostsId:any;
    disableBulkHost(){
      let hostid = "";
      hostid = this.getStringConcatinated(this.selectList);
      this.selectedHostsId = {node_ids:hostid}
      swal({
        title: 'Are you sure?',
        text: "You want to Remove Host!",
        icon: 'warning',
        buttons: ["Cancel", "Yes, Remove it!"],
        dangerMode: true,
        closeOnClickOutside: false,
        }).then((willDelete) => {
        if (willDelete) {
          this.commonapi.bulkDisableHost(this.selectedHostsId).subscribe(res => {
        swal({
        icon: 'success',
        text: 'Successfully Removed the host',
        buttons: [false],
        timer:1500
        })
        setTimeout(() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
          },500);
        })

        }
        })
    }
    deleteBulkHost(){
      let hostid = "";
      hostid = this.getStringConcatinated(this.selectList);
      this.selectedHostsId = {node_ids:hostid}
      swal({
        title: 'Are you sure?',
        text: "You want to Remove Host!",
        icon: 'warning',
        buttons: ["Cancel", "Yes, Remove it!"],
        dangerMode: true,
        closeOnClickOutside: false,
        }).then((willDelete) => {
        if (willDelete) {
          this.commonapi.bulkDeleteHost(this.selectedHostsId).subscribe(res => {
        swal({
        icon: 'success',
        text: 'Successfully Removed the host',
        buttons: [false],
        timer:1500
        })
        setTimeout(() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
          },500);
        })

        }
        })
    }

    getStringConcatinated(array_object){
      //Join Array elements together to make a string of comma separated list
      let string_object = "";
      try{
        if (array_object.length>0){
          string_object = array_object[0];
          for (let index = 1; index < array_object.length; index++) {
            string_object = string_object+','+array_object[index];
          }
          return string_object
        }
      }
      catch(Error){
        return ""
      }
    }

    tableSearch(){
      this.searchTerm = (<HTMLInputElement>document.getElementById('customsearch')).value
        var body = this.dtOptions;
        body['searchterm'] = this.searchTerm
        if(this.hosts_platform!='' && this.hosts_platform!='all'){
          body['state']=this.host_state;
          if(body['state'] == 1){
            body['enabled'] = false;
          }
          else if(body['state'] == 0){
            body['enabled'] = true;
            body['status'] = this.hosts_status;
          }
          else{
            body['status'] = this.hosts_status;
          }
          body['platform']=this.hosts_platform;
        }
        if(body['searchterm']==undefined){
              body['searchterm']="";
        }
        this.tablebody['searchterm']= body['searchterm']
        this.tablebody['state'] = body['state']
        this.tablebody['enabled'] = body['enabled']
        this.tablebody['status'] = body['status']
        this.http.post<DataTablesResponse>(environment.api_url+"/hosts", body,{ headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token')}}).subscribe(res =>{
          localStorage.removeItem('nodeid');
          this.hostmainvalue_data = res.data['results'];
          this.checklist = [];
          for (const i in this.hostmainvalue_data) {
            let checkboxdata = {}
            checkboxdata['id'] = this.hostmainvalue_data[i].host_identifier;
            checkboxdata['isSelected'] = false
            this.checklist.push(checkboxdata);
          }

          this.getResponseStatus();
        if(this.hostmainvalue_data.length >0 &&  this.hostmainvalue_data!=undefined){
          this.hostmainvalue_data = res.data['results'];
          this.hostmainvalue_data.sort((x,y) => y.state - x.state)
          $('.dataTables_paginate').show();
          $('.dataTables_info').show();
        }else{
          if(this.searchTerm=="" || this.searchTerm == undefined){
            this.errorMessage = "No Host Found";
            $('.dataTables_paginate').hide();
            $('.dataTables_info').hide();
          }
          else{
            this.errorMessage = "No Matching Record Found";
            $('.dataTables_paginate').hide();
            $('.dataTables_info').hide();
          }
        }
        });

    }


    setStateFilter(value){
      this.stateFilterValue = value;
      this.selectedTab= 1;
      if(value == 'Online'){
        this.selectedStatus = true;
        this.selectedState= 0;
        this.getByFilterId(0,true,this.selectedPlatform)
      }
      else if(value == 'Offline'){
        this.selectedStatus = false;
        this.selectedState= 0;
        this.getByFilterId(0,false,this.selectedPlatform)
      }
      else if(value == 'Removed Hosts'){
        this.selectedStatus = false;
        this.selectedState= 1;
        this.selectedTab= 2;
        this.selectedPlatform = 'all'
        this.getByFilterId(1,this.selectedStatus,this.selectedPlatform)
      }
      else if(value == 'Any'){
        this.selectedStatus = undefined;
        this.selectedState= 0;
        this.getByFilterId(0,this.selectedStatus,this.selectedPlatform)
      }
      else if(value == 'Active'){
        if(this.selectedStatusFilter == 'Online'){
          this.selectedStatus = true;
        }
        if(this.selectedStatusFilter == 'Offline'){
          this.selectedStatus = false;
        }
        else
        this.selectedStatus = undefined;
        this.selectedStatusFilter = 'Any';
        this.selectedState= 0;
        this.selectedPlatform = 'all'
        this.getByFilterId(0,this.selectedStatus,this.selectedPlatform)
      }
    }

    setActiveTab(value){
      this.activeTab = value
    }

    download(){
      var currentDate = new Date();
      // var token_val = this.token_value;

      let data: any;
      this.http.post(environment.api_url+"/hosts/export", this.tablebody,{ headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token'),},responseType:'text'}).subscribe(res =>{
        data = res;
        var csvData2 = new Blob([data], {
          type: 'text/csv;charset=utf-8;'
        });
        var csvURL = window.URL.createObjectURL(csvData2);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'nodes' + '_' + currentDate.getTime() + '.csv');
        document.getElementById('container').appendChild(tempLink);
        tempLink.click();
      });

      return false;
    }

    //Adding Functions to new table design and actions
    async fetchData(nodeID){
      const data = await this.commonapi.host_name_api(nodeID).toPromise();
      this.nodeData = data;
      if(this.nodeData.status == "failure"){
        this.pagenotfound();
        console.log('error')
      }
      else{
        if(this.nodeData.data.id == nodeID){
          this.hostIdentifier = this.nodeData.data.host_identifier
        }
      }
    }

    cpt_restart(){
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
          let products=this.commonapi.cpt_restart_api(this.nodeData.data.host_identifier).subscribe(res => {
            this.restartData = res;
            if(this.restartData.status =='success'){
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

    pagenotfound() {
      this._router.navigate(['/pagenotfound']);
    }

    openModal(){
      let modal = document.getElementById("myModal");
     modal.style.display = 'block';

      this.showdata(undefined)
    }

    showdata(n){

      this.commonapi.view_config_api(this.nodeData.data.id).subscribe(res =>{
        this.additionalConfigData =res['config'].name;
        this.additionalConfigData_id = res['config'].id ? res['config'].id : 'Any';
        this.toggle=false;
        setTimeout(()=>{
            this.editorOptions = new JsonEditorOptions();
            this.editorOptions.mode = 'view';
            this.alertedData_json=res['data'];
            this.toggle=true;
        }, 100);
      })
      this.configListDropdownList=[]
      this.configListDropdownList.push({value: 'Any', description: 'Select Config'})
      this.commonapi.configs_api().subscribe((res: any) => {
        if(!['windows','darwin'].includes(this.nodeData.data['platform'])){
          this.nodeData.data['platform'] = 'linux'
        }
        for (const i in res.data[this.nodeData.data['platform']]){
          // this.configListDropdownList.push({id: res['data'][this.nodeData.data['platform']][i]['id'], itemName: i});
          this.configListDropdownList.push({value:  res['data'][this.nodeData.data['platform']][i]['id'], description: i});
        }
        this.configListSelectedItem = this.additionalConfigData_id
      })
    }

    Assign_config(){
      var payload = {"host_identifiers":this.hostIdentifier}
      if(this.configListSelectedItems){
      this.commonapi.asign_config_to_hosts(this.configListSelectedItems['id'],payload).subscribe(res=>{
        if(res["status"]=="success"){
          this.closeModal('myModal')
          Swal.fire({
            icon: 'success',
            text: res["message"]
            })
        }else{
          this.get_swal_error_message(res["message"])
        }
        })
      }else{
        this.closeModal('myModal')
        this.get_swal_error_message("Please select config")
      }
    }

    get_swal_error_message(message){
      Swal.fire({
        icon: 'warning',
        text: message
        })
    }

    onItemSelect_config(value, description) {
      let item= {
        id: value,
        itemName: description
      }
      this.configListSelectedItems = item
    }
    OnItemDeSelect_config(item: any) {
      console.log(item);
    }

    onDeSelectAll_config(items: any) {
      this.configListSelectedItems=[]
    }

    closeModal(modalId){
      let modal = document.getElementById(modalId);
      modal.style.display = "none";
      $('.modal-backdrop').remove();
    }

    openDropdown(){
      let dropdown = document.getElementById('dropdown');
      dropdown.style.position= "absolute";
      dropdown.style.transform= "translate3d(-135px, -144px, 0px)";
      dropdown.style.top= "0px";
      dropdown.style.left= "0px";
      dropdown.style.willChange= "transform";
    }
    setState(value){
      localStorage.setItem('hoststate',value);
    }
    async toggleShowDiv(hostData) {
      this.hostData = hostData
      this.hostID = hostData.id;
      // this.eventStatus = alrowData.status;
      // this.alerted_data_json = alrowData.alerted_entry;
      this.enableChild = true;
      this.isVisible = true;
    }
    toggleHideDiv(){
      this.enableChild = false;
      this.isVisible = false;
    }
    reloadCurrentPage() {
      window.location.reload();
     }

  }
