import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {DatepickerOptions} from 'ng2-datepicker';
import {NgModule} from '@angular/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import {NgbDateStruct,NgbDate, NgbCalendar,NgbInputDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
var PaginationIndex
var TempIndex
var NextDataId
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-hunt',
  templateUrl: './hunt.component.html',
  styleUrls: ['./hunt.component.css']
})

export class HuntComponent implements AfterViewInit,OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  md5form: FormGroup;
  loading = false;
  submitted = false;
  indicatorFile:File;
  indicatorFileSizeError: boolean= false;
  maxFileSize: any;
  dropdownPacknameList = [];
  selectedPacknameItems = [];
  dropdownPacknameSettings = {};
  huntObj = {};
  searchDataOutput:any
  search_data_output:any
  myjson: any = JSON;
  datepickerDate = {};
  selectedDate = {};
  PreviousDataIds={}
  maxDate:any={};
  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private http: HttpClient,
    private calendar: NgbCalendar,
    private config: NgbInputDatepickerConfig,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.dropdownPacknameList = [
      {"id":"md5","itemName":"MD5"},
      {"id":"sha256","itemName":"SHA256"},
      {"id":"domain_name","itemName":"Domain Name"},
      {"id":"ja3_md5","itemName":"Certificates"},
    ];
    this.dropdownPacknameSettings = {
      singleSelection: true,
      text:"Select Hunt Type",
      unSelectAllText:'UnSelect All',
      enableSearchFilter:true,
      lazyLoading: false,
      classes: "angular-multiselect-class",
      searchPlaceholderText: "Search Hunt Type here..",
      enableCheckAll: false,
      searchBy: ["itemName"],
      enableFilterSelectAll: false,
    };

    this.md5form= this.fb.group({
      indicatorFile: ['',Validators.required],
      huntType:['',Validators.required]
    });

    $('.table_data').hide();
    this.getDate()
    this.maxFileSize = (environment.file_max_size / 1000000)
  }
  get f() { return this.md5form.controls; }


  uploadFile(event){
    if (event.target.files.length > 0) {
      if(event.target.files[0].size > this.maxFileSize){
        Swal.fire({
          icon: 'warning',
          text: 'Max file size is ' + this.maxFileSize + 'mb'
          })
          this.indicatorFileSizeError = true
      }
      else{
        this.indicatorFile = event.target.files;
        this.indicatorFileSizeError = false
      }
    }
    else{
      this.indicatorFile =undefined
      this.indicatorFileSizeError = true
    }

  }
onSubmit(){
  this.submitted = true;
  $('.table_data').hide();
  var isvaliddate = this.isDateValid();
  if(!isvaliddate){
    Swal.fire({
      icon: 'warning',
      text: 'Please provide correct date input'
      })
    return;
  }
  if (this.md5form.invalid) {
      return;
  }
  this.PreviousDataIds={}
  NextDataId=0
  this.loading = true;
  this.RerenderDatatable()
  $("#table_noresults").hide()
  $('.table_data').show();
}

goBack(){
  this._location.back();
}
onItemSelect(item:any){
  console.log(this.selectedPacknameItems);
}
OnItemDeSelect(item:any){
  console.log(this.selectedPacknameItems);
}
onSelectAll(items: any){
  console.log(items);
}
onDeSelectAll(items: any){
  this.md5form.controls['huntType'].reset()
}
getHuntList( ){
  this.dtOptions = {
    pagingType: 'simple',
    pageLength: 10,
    serverSide: true,
    processing: true,
    searching: false,
    "language": {
      "search": "Search: ",
      "paginate": {
        "first":'first',
        "last":'last',
        "previous": '<i class="fas fa-angle-double-left"></i> Previous',
        "next": 'Next <i class="fas fa-angle-double-right"></i>',
      },
    },
    dom: "<'row'<'col-sm-12'f>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-2'l><'col-sm-3'i><'col-sm-7'p>>",
    ajax: (dataTablesParameters: any,callback) => {
      var body = dataTablesParameters;
      var uploadData = new FormData();
      PaginationIndex=body['start']
      if(PaginationIndex>TempIndex)   //checking next page index
        {
          uploadData.append('start', NextDataId);
        }
      else if (PaginationIndex<TempIndex)  //checking Previous page index
        {
          uploadData.append('start', this.PreviousDataIds[PaginationIndex] );
        }
      TempIndex=PaginationIndex;
      if(this.indicatorFile !=undefined ){
          var selectedDate = this.selectedDate['date'];
          var date = selectedDate.year + '-' + selectedDate.month + '-' + selectedDate.day;
          uploadData.append('indicator_type', this.f.huntType.value[0].id);
          uploadData.append('file', this.indicatorFile[0], this.indicatorFile[0].name);
          uploadData.append('start', dataTablesParameters.start);
          uploadData.append('limit', body['length']);
          uploadData.append('date', date);
          uploadData.append('duration', this.selectedDate['duration']);
      }else{
        this.loading = false
        return
      }
      this.http.post<DataTablesResponse>(environment.api_url + "/indicators/upload", uploadData, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'x-access-token': localStorage.getItem('token')
        }
      }).subscribe(res => {
        this.loading = false
        if(res['status']=='success'){
          this.search_data_output=res.data['results']
          this.search_data_output.forEach((element,index) => {
            let add1 = JSON.stringify(this.search_data_output[index].columns, Object.keys(this.search_data_output[index].columns).sort())

            element["parsedColumns"] = add1;
          });
          this.searchDataOutput=res.data['results']
          $('.table_data').show();
          if(res.data['count'] > 0 && res.data['results'] != undefined)
          {
            this.PreviousDataIds[PaginationIndex]=(this.searchDataOutput[0].id)+1
            NextDataId=(this.searchDataOutput[this.searchDataOutput.length - 1]).id
            $('.dataTables_paginate').show();
            $('.dataTables_info').show();
            $('.dataTables_filter').show()
            $("#table_noresults").hide()
          }
          else{
            $('.dataTables_paginate').hide();
            $('.dataTables_info').hide();
            $("#table_noresults").show()

          }
          callback({
            recordsTotal: res.data['count'],
            recordsFiltered: res.data['count'],
            data: []
          });
        }if(res['status']=='failure'){
          $('.table_data').hide();
          Swal.fire({
            icon: 'warning',
            text:res['message']
            })
        }
      });
    },
    ordering: false,
    columns: [{data: 'hostname'}]
  };
  $(document).on( 'click', '.paginate_button', function (e) {
    if(!(e.currentTarget.className).includes('disabled')){
        $('.paginate_button.next').addClass('disabled');
        $('.paginate_button.previous').addClass('disabled');
    }})
}
ngAfterViewInit(): void {
  this.dtTrigger.next();
}
ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
}
RerenderDatatable(){
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}
getDate() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  this.maxDate = {year:today.getFullYear(),month:today.getMonth()+ 1,day:today.getDate()+1};
  this.selectedDate['date'] = this.calendar.getToday();
  this.selectedDate['duration']=3;
  this.getHuntList()

}
getconvertedDate() {
  var date =  this.datepickerDate['date'];
  if(date instanceof Date){
    date=this.convertDate(date);
    this.datepickerDate['date']=date
  }
}
myHandler(){
  var isvaliddate = this.isDateValid();
  if(isvaliddate){
    return;
  }
  // this.getconvertedDate()
  this.RerenderDatatable()
}
convertDate(date) {
  var  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}
getDuration(duration_period){
  // this.datepickerDate['duration']=duration_period;
  this.selectedDate['duration']=duration_period;
  this.RerenderDatatable()
}
action(event): void {
  event.stopPropagation();
}
isDateValid(){
  const tempDateSelected = new Date(this.selectedDate['date'].year, this.selectedDate['date'].month, this.selectedDate['date'].day);
  const tempDateMax = new Date(this.maxDate.year, this.maxDate.month, this.maxDate.day);
  if(tempDateSelected > tempDateMax ||  tempDateSelected.toDateString() == 'Invalid Date' || this.selectedDate['date'] == null){
    return false;
  }
  else{ return true; }
}
}
