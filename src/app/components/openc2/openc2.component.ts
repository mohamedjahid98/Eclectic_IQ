import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonapiService } from '../../dashboard/_services/commonapi.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthorizationService } from '../../dashboard/_services/Authorization.service'
// import * as $ from 'jquery';
import 'datatables.net';
import swal from 'sweetalert';
import { ValidDateFormat } from '../../dashboard/_helpers/validDateFormat';

class results {
  hostname: string;
  action: string;
  target: string;
  message: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-openc2',
  templateUrl: './openc2.component.html',
  styleUrls: ['./openc2.component.css']
})

export class Openc2Component implements OnInit, OnDestroy {
  searchText: string;
  response_data: any;
  results: any;
  temp_var: any;
  responsealert_data: any;
  alert_results: any;
  checklist:any=[];
  masterSelected:any;
  searchTerm:any;
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

  public data = {};
  results$: any[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  customresults: any[] = [];
  errorMessage:any;
  role={'adminAccess':this.authorizationService.adminLevelAccess,'userAccess':this.authorizationService.userLevelAccess}
  constructor(
    private commonapi: CommonapiService,
    private http: HttpClient,
    private authorizationService: AuthorizationService,
    private convertDateFormat:ValidDateFormat,
  ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: false,
      searching: false,
      dom: "<'row'<'col-sm-12'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row table-controls'<'col-sm-3'l><'col-sm-3'i><'col-sm-6'p>>",
      "language": {
        "search": "Search: "
      },
      ajax: (dataTablesParameters: any, callback) => {
        // console.log('limits', dataTablesParameters);
        var body = dataTablesParameters;
        body['limit'] = body['length'];
        if(this.searchTerm){
          body['searchterm'] = this.searchTerm
        }
        if(this.searchTerm!= ""  &&  this.searchTerm?.length>=1){
           body['searchterm']=this.searchTerm;
        }
        if(body['searchterm']==undefined){
            body['searchterm']="";
        }
        this.removeSelectedResponse();
        this.http.post<DataTablesResponse>(environment.api_url + "/response", body, { headers: { 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token') } }).subscribe(res => {
          this.response_data = res;
          this.checklist = [];
          for (const i in this.response_data.data.results) {
            let checkboxdata = {}
            checkboxdata['id'] = this.response_data.data.results[i].id;
            checkboxdata['isSelected'] = false
            this.checklist.push(checkboxdata);
          }

          this.customresults=new Array();
          this.response_data.data.results.forEach(obj => {

            this.customresults.push(obj);
          });

          this.results = this.customresults

          if(this.results.length >0 &&  this.results!=undefined)
          {

            $('.dataTables_paginate').show();
            $('.dataTables_info').show();


          }
          else{
            this.errorMessage="No Data Found";

            $('.dataTables_paginate').hide();
            $('.dataTables_info').hide();

          }

          callback({
            recordsTotal: this.response_data.data.count,
            recordsFiltered: this.response_data.data.count,
            data: []
          });
        });
      },
      ordering: false,
      columns: [{ data: 'action' }, { data: 'target' }, { data: 'command' },{data:'executed'}, { data: 'created' },{data:'view'},{data:'delete'}],
    }
  }

  toggle: boolean = false;
  response_action(event, id) {
    this.toggle = false;
    setTimeout(() => {
      var return_id = event.target.alt;
      console.log("EventId" + return_id);
      var commentsDatabyid = this.response_data.data.results.find(obj => obj.id == id)
      this.responsealert_data = commentsDatabyid.command;
      this.editorOptions = new JsonEditorOptions();
      this.editorOptions.mode = 'view';
      this.data = this.responsealert_data;
      this.toggle = true;
    }, 100);
  }
  deleteResponse(response_id){
    swal({
      title: 'Are you sure?',
      text: "Want to delete the Response!",
      icon: 'warning',
      buttons: ["Cancel", true],
      closeOnClickOutside: false,
      dangerMode: true,
      }).then((willDelete) => {
      if (willDelete) {
        this.commonapi.deleteApiresponse(response_id).subscribe(res =>{
          console.log(res);
          swal({
        icon: 'success',
        title: 'Deleted!',
        text: 'Response has been deleted.',
        buttons: [false],
        timer: 2000
        })
        setTimeout(() => {
          // this.ngOnInit();
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        },1500);
      })
    }
  })
  }
  validDateFormat(value) {
    return this.convertDateFormat.ValidDateFormat(value);
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  selectList = [];
  filterArr:any;
  selectedCount:any=0;
  selectResponse(id) {
    this.filterArr = this.selectList.filter( h => h==id);
    if(this.filterArr.length == 0){
      this.selectList.push(id);
    }else{
      this.selectList = this.selectList.filter(item => item !== id);
    }
    this.selectedCount = this.selectList.length;
  }
  removeSelectedResponse(){
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
    this.selectResponse(id);
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
  }

  public selectedResponseId:any;
  deleteBulkResponse(){
    let responseId = "";
    responseId = this.getStringConcatinated(this.selectList);
    console.log(responseId);
    this.selectedResponseId = {"openc2_ids":responseId}
    swal({
      title: 'Are you sure?',
      text: "You want to delete Response!",
      icon: 'warning',
      buttons: ["Cancel", "Yes, Delete it!"],
      dangerMode: true,
      closeOnClickOutside: false,
      }).then((willDelete) => {
      if (willDelete) {
        this.commonapi.bulkDeleteResponse(this.selectedResponseId).subscribe(res => {
      swal({
      icon: 'success',
      text: 'Successfully Deleted',
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
  closeModal(modalId){
    let modal = document.getElementById(modalId);
    modal.style.display = "none";
    $('.modal-backdrop').remove();
  }
  tableSearch(){
    this.searchTerm = (<HTMLInputElement>document.getElementById('customsearch')).value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}
