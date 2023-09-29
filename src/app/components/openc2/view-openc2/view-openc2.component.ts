import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import 'datatables.net';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import { CommonVariableService } from '../../../dashboard/_services/commonvariable.service';
import { Location } from '@angular/common';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { AuthorizationService } from '../../../dashboard/_services/Authorization.service';
import { ValidDateFormat } from '../../../dashboard/_helpers/validDateFormat';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-view-openc2',
  templateUrl: './view-openc2.component.html',
  styleUrls: ['./view-openc2.component.css']
})
export class ViewOpenc2Component implements OnInit {
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  id:any;
  sub:any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  response_data: any;
  customresults: any[] = [];
  results: any;
  errorMessage:any;
  temp_var: any;
  res_total_data:any;
  successdata:any;
  public data = {};
  ViewData={}
  role={'adminAccess':this.authorizationService.adminLevelAccess,'userAccess':this.authorizationService.userLevelAccess}
  constructor(
    private _Activatedroute:ActivatedRoute,
    private titleService: Title,
    private commonapi: CommonapiService,
    private commonvariable: CommonVariableService,
    private http: HttpClient,
    private _location: Location,
    private router: Router,
    private authorizationService: AuthorizationService,
    private convertDateFormat:ValidDateFormat,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.commonvariable.APP_NAME+" - "+"View response action");

  // LivequeryFunction();
this.sub = this._Activatedroute.paramMap.subscribe(params => {
this.id = params.get('id');
if(isNaN(this.id)){
 this.pagenotfound();
}
});
this.dtOptions = {
  pagingType: 'full_numbers',
  pageLength: 10,
  serverSide: true,
  processing: false,
  searching: false,
  dom: "<'row'<'col-sm-12'f>>" +
  "<'row'<'col-sm-12'tr>>" +
  "<'row'<'col-sm-2'l><'col-sm-3'i><'col-sm-7'p>>",
  ajax: (dataTablesParameters: any, callback) => {
    var body = dataTablesParameters;
    body['openc2_id'] = this.id;
    body['limit'] = body['length'];

    if(body.search.value!= ""  &&  body.search.value.length>=3)
    {

      body['searchterm']=body.search.value;

    }
    if(body.search.value!="" && body.search.value.length<3)
    {
       return;
    }
    this.http.post<DataTablesResponse>(environment.api_url + "/response/view", body, { headers: { 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token') } }).subscribe(res => {
      this.response_data = res;
      if(this.response_data.status == "failure"){
        this.pagenotfound();
      }
      else{
      this.res_total_data = this.response_data.data.results[0];
      console.log(this.res_total_data)
      this.customresults=new Array();
      this.response_data.data.results.forEach(obj => {
        this.customresults.push(obj);
      });

      this.results = this.customresults
      console.log(body.search.value);
      if(this.results.length >0 &&  this.results!=undefined)
      {
      //this.results = this.hostmainvalue.data['results'];
        // $("#DataTables_Table_0_info").
        $('.dataTables_paginate').show();
        $('.dataTables_info').show();


      }
      else{
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


      // this.results = this.response_data.data.results
    //  this.dtTrigger.next();

      callback({
        recordsTotal: this.response_data.data.count,
        recordsFiltered: this.response_data.data.count,
        data: []
      });
    }
    });

  },
  ordering: false,
  columns: [{ data: 'hostname' }, { data: 'message' }, { data: 'status' }, { data: 'created_date' }, { data: 'update_id' }],
}
  }
  goBack(){
    this._location.back();
  }
  toggle: boolean = false;
  response_action(event, command) {
    this.toggle = false;
    setTimeout(() => {
      console.log("EventId" + command);
      // var commentsDatabyid = this.response_data.data.results.find(obj => obj.id == id)
      // this.responsealert_data = commentsDatabyid.command;
      this.editorOptions = new JsonEditorOptions();
      this.editorOptions.mode = 'view';
      this.data = command;
      this.toggle = true;
    }, 100);
  }
  pagenotfound() {
      this.router.navigate(['/pagenotfound']);
  }

  openPopup(data: any,Status,HostName,CreatedAt,UpdatedAt) {
    this.ViewData={"HostName":HostName,"CreatedAt":CreatedAt,"UpdatedAt":UpdatedAt,"Status":Status}
    let modal = document.getElementById("successModal");
    modal.style.display = "block";
    if(Status =="failure"){
      this.successdata ='NA',
      this.ViewData['UpdatedAt']='NA'
    }
     else if(Status !="success"){
      this.ViewData['UpdatedAt']=''
      this.successdata = data;
    }
    else if(Status =="success"){
      if(data == null || data == ''){
        this.ViewData['UpdatedAt']=''
         this.successdata = "Script execution has not generated any output"
      }else{
         this.successdata = data;
      }
    }
  }

  cancelRequest(id,status){
    let obj = {
      "command_id":id
    }
    if(status == 'cancel_initiated'){
      this.message('warning','Cancel is already inprogress');
      return;
    }
    this.commonapi.Cancel_viewresponse(obj).subscribe(res => {
      if(res['status']=="success"){
        this.message('success',res['message']);
        var cancelReqId = document.getElementById(id);
        cancelReqId.setAttribute('disabled', 'true');
        setTimeout(() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        },2000);
      }else{
        this.message('warning',res['message'])
      }
      })
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  message(type,message){
    Swal.fire({
      icon: type,
      text: message,
      })
  }
  validDateFormat(value) {
    return this.convertDateFormat.ValidDateFormat(value);
  }
  closemodal() {
   let modal = document.getElementById("successModal");
   modal.style.display = "none";
  }
  closeModal(modalId){
    let modal = document.getElementById(modalId);
    modal.style.display = "none";
    $('.modal-backdrop').remove();
  }
}
