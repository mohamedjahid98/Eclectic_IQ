import { Component, OnInit ,ViewChild, Input, AfterViewInit} from '@angular/core';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import {Observable} from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { AuthorizationService } from '../../../dashboard/_services/Authorization.service';
import { flyInOutRTLAnimation } from '../../../../assets/animations/right-left-animation';
import swal from 'sweetalert';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { DataTableState } from './model/data-table';

// NgRx
import { Store } from '@ngrx/store';
import * as dataTableActions from './@ngrx/data-table';
import * as dataTableSelectors from './@ngrx/data-table/data-table.selectors';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  animations: [flyInOutRTLAnimation],
  styleUrls: ['./rule.component.css','./rule.component.scss']
})
export class RuleComponent implements OnInit, AfterViewInit {
  @Input() ruleAlertData : any

  public sortDirection$!: Observable<string>;
  public sortKey$!: Observable<string>;
  public tableData$!: Observable<any>;
  public dataTableParams$!: Observable<any>;
  public isPaneVisible$!: Observable<boolean>;

  public rule: any;
  public ruledata:any;
  public ruleid:any;
  public rule_condition:any;
  public rules:any = [];
  public conditions:any = {};
  searchText:any;
  show=false;
  selectedItem:any;
  public ruleAlert :any = [];
  public ruleAlertVal :any = [];
  public tacticsAlert :any =[];
  public ruleTacticsVal :any =[];
  conditionLenght: any
  checklist:any=[];
  masterSelected:any;
  role={'adminAccess':this.authorizationService.adminLevelAccess,'userAccess':this.authorizationService.userLevelAccess}

  public sort_Key: any;
  public storedDTP: any;
  public activePage: any;
  public pageLength: number = 10;
  public storedPainVisible: any;
  //Detail Pane
  public isVisible: boolean;
  enableChild = false;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  selectedPlatform: string = "true";
  platformOptions = [
    { value: 'true', description: 'Active' },
    { value: 'false', description: 'Inactive' },
  ];
  platformSelectControl = new FormControl('true');
  //Adding New Search Component
  searchTerm: any;

  constructor(
    private commonapi: CommonapiService,
    private router: Router,
    private http: HttpClient,
    private authorizationService: AuthorizationService,
    private store: Store<DataTableState>
  ) { }

getById(event, newValue,rule_id){
  this.selectedItem = newValue;
  this.ruleid = rule_id;
  this.ruleAlertVal = [];
  // this.rule_alert1 = [];
  this.ruleTacticsVal = [];
  this.tacticsAlert = [];
   for(const i in this.rule.data.results){
        if (this.rule.data.results[i].id == this.ruleid){
          this.ruledata =this.rule.data.results[i];
          this.ruleAlertVal = this.getStringConcatinated(this.rule.data.results[i].alerters);
          this.rule_condition = this.ruledata.conditions.condition;
          this.rules = this.ruledata.conditions.rules;
          this.conditions = this.ruledata.conditions;
          this.ruleTacticsVal = this.getStringConcatinated(this.rule.data.results[i].tactics);
  }
  }
  localStorage.setItem('rule_name',this.ruledata.name);
 }

  ngOnInit() {
     if(this.ruleAlertData){
       this.toggleShowDiv(this.ruleAlertData)
     }
    //DISPATCH- set data
    this.store.dispatch(dataTableActions.setData({ data: 'rules' }));
    //SELECTORS - retrieve data
    this.tableData$ = this.store.select(dataTableSelectors.selectData);
    this.sortKey$ = this.store.select(dataTableSelectors.selectSortKey);
    this.sortDirection$ = this.store.select(dataTableSelectors.selectSortDirection);
    this.dataTableParams$ = this.store.select(dataTableSelectors.selectdataTableParams);
    this.isPaneVisible$ = this.store.select(dataTableSelectors.selectPainVisible);

    this.store.select(dataTableSelectors.selectSortKey).subscribe(data => {this.sort_Key = data})
    this.store.select(dataTableSelectors.selectPainVisible).subscribe(data => {this.storedPainVisible = data})
    // this.sort_Key = Number(this.sort_Key)
    // this.dataTableParams$.subscribe(elem => this.storedDTP = elem)
    this.store.select(dataTableSelectors.selectdataTableParams).subscribe(elem => this.storedDTP = elem)
    this.searchTerm = this.storedDTP.searchterm? this.storedDTP.searchterm : ''
    if(this.storedDTP.order){
      this.activePage = (this.storedDTP.start / this.storedDTP.length)
      this.pageLength = this.storedDTP['length']
      this.selectedPlatform = this.storedDTP.status? this.storedDTP.status : true;
    }
      this.getRuleList(this.activePage,this.pageLength,this.sort_Key);


  }

  
ruleList:any;
errorMessage:any;
ruleDataList = [];
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();
getRuleList(activePage,pageLength,sortKey){
  let ordertemp
  
  if(sortKey){
    sortKey =  Number(sortKey)
    sortKey += 1
  sortKey = sortKey.toString()
    ordertemp = [[sortKey, this.storedDTP.order_by]]
  }else{
    ordertemp = []
  }
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: pageLength,
    serverSide: true,
    processing: true,
    searching: false,
    order: ordertemp,
    // order: [[sortKey,'desc']],
    // lengthChange: false,
    // info:false,
    dom: "<'row'<'col-sm-12'f>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-2'l><'col-sm-3'i><'col-sm-7'p>>",
    "initComplete": function() {
      activePage +=2
      var table = $('#ruletable').DataTable();
      table.page(activePage)
      // table.page(activePage)
      if(activePage){
      let temp = <HTMLElement>document.getElementsByClassName('paginate_button')[activePage]
      temp.click()
    }
      // let temp2 = temp[activePage].click()
      // if(activePage){
      //   temp[activePage+2].classList.add('active')
      // }
  },
    scrollCollapse: true,
    "language": {
      "search": "Search: ",
      "lengthMenu": "Results per page: _MENU_",
    },
    ajax: (dataTablesParameters: any,callback) => {

        var body= dataTablesParameters;
        if(this.storedDTP.draw> dataTablesParameters.draw){
          body = this.storedDTP
          // body["column"] = this.storedDTP.column;
          // body["order_by"] = this.storedDTP.order_by;
          this.storedDTP.draw = dataTablesParameters.draw
          $('#ruletable').DataTable().page(this.activePage)
        }
        if(this.storedPainVisible.id){
          this.toggleShowDiv(this.storedPainVisible)
        }
        
        body['limit']=body['length'];
        if(this.searchTerm){
          body['searchterm'] = this.searchTerm
        }
        if(this.searchTerm!= ""  &&  this.searchTerm?.length>=1){
          body['searchterm']=this.searchTerm;
        }
        if(body['searchterm']==undefined){
            body['searchterm']="";
        }
        if (body.order != "" && body.order.length >= 1) {
          // const sortKey =  body.columns[body.order[0].column-1].data;
          let sortKey: any = body.order[0].column - 1
          sortKey = sortKey.toString()
          this.store.dispatch(dataTableActions.setSortKey({ sortKey: sortKey }));
          body["column"] = body.columns[body.order[0].column-1].data;
          body["order_by"] = body["order"][0].dir;
        }
      
      body['status']=this.selectedPlatform;
      if(this.storedDTP.draw <= dataTablesParameters.draw || !this.storedDTP.draw){
        this.storedDTP.draw = dataTablesParameters.draw
        this.store.dispatch(dataTableActions.setdataTableParams({ dataTableParams:  dataTablesParameters }));
      }
      // else{
      this.removeSelectedHost();
      this.http.post<DataTablesResponse>(environment.api_url+"/rules", body,{ headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token')}}).subscribe(res =>{
      this.ruleList = res.data['results'];
      this.checklist = [];
      if(this.ruleList.length >0 &&  this.ruleList!=undefined){
        this.ruleList = res.data['results'];
        for (const i in this.ruleList) {
          let checkboxdata = {}
          checkboxdata['id'] = this.ruleList[i].id;
          checkboxdata['isSelected'] = false
          this.checklist.push(checkboxdata);
        }
        this.ruleList.sort((x,y) => y.name - x.name)
        $('.dataTables_paginate').show();
        this.rule = res;
        this.ruleDataList=[];
        $('.rule_body2').hide();
        $('.rule_body').show();
        for (const i in this.rule.data.results){
          var d =  Math.pow(10,10);
          if(this.rule.data.total_alerts>0){
              var num=Number((Math.round((this.rule.data.results[i].alerts_count*100/this.rule.data.total_alerts) * d) / d).toFixed(1))
              this.ruleDataList.push({id:this.rule.data.results[i].id,name:this.rule.data.results[i].name,status:this.rule.data.results[i].status, percentage:num,created:this.rule.data.results[i].created_at, description: this.rule.data.results[i].description,alerters: this.rule.data.results[i].alerters, severity: this.rule.data.results[i].severity, type: this.rule.data.results[i].type, technique_id: this.rule.data.results[i].technique_id, tactics: this.rule.data.results[i].tactics   })
          }else{
              this.ruleDataList.push({id:this.rule.data.results[i].id,name:this.rule.data.results[i].name,status:this.rule.data.results[i].status,percentage:0,created:this.rule.data.results[i].created_at, description: this.rule.data.results[i].description,alerters: this.rule.data.results[i].alerters, severity: this.rule.data.results[i].severity, type: this.rule.data.results[i].type, technique_id: this.rule.data.results[i].technique_id, tactics: this.rule.data.results[i].tactics  })
          }
        }
      }else{
        if(body.search.value=="" || body.search.value == undefined){
          this.errorMessage = "No results found";
          $('.dataTables_paginate').hide();
        }
        else{
          this.errorMessage = "No search results found";
          $('.dataTables_paginate').hide();
        }
      }
        callback({
          recordsTotal: res.data['total_count'],
          recordsFiltered: res.data['count'],
          data: []
        });
      });
    // }
    },
    columnDefs: [ {
        targets: [0,2,5], /* column index */
        orderable: false, /* true or false */
     }],
    columns: [{ data: 'name' },{ data: 'status' },{ data: 'created_at' },{ data: 'alert_count' },{ data: 'action' }]
  }
}

ngAfterViewInit(): void {
  this.dtTrigger.next();
  
  // $('#ruletable').DataTable().page(this.activePage)
}

showShortDesciption = true

alterDescriptionText() {
   this.showShortDesciption = !this.showShortDesciption
}

getStringConcatinated(array_object){
  //Join Array elements together to make a string of comma separated list
  let string_object = "";
  try{
    if (array_object.length>0){
      string_object = array_object[0];
      for (let index = 1; index < array_object.length; index++) {
        string_object = string_object+', '+array_object[index];
      }
      return string_object
    }
  }
  catch(Error){
    return ""
  }
}
IntArrayConversion(arrayobject){
  let intArray = [];
  if (arrayobject.length > 0){
    arrayobject.forEach(function (value) {
     intArray.push(value);
    });
  }
  return intArray
}



getRulesArray(ListObject, MainArray){
    for(const i in ListObject){
      if('condition' in ListObject[i]){
        MainArray.push({'condition':ListObject[i]['condition'], 'rules':this.getRulesArray(ListObject[i].rules, [])});
      }else
      {
        var dict = {};
        for (let key in ListObject[i]) {
          let value = ListObject[i][key];
          dict[key] = value;
        }
        MainArray.push(dict);
      }
    }
    return MainArray
}

isString(argument){
  if(typeof(argument)==typeof('')){
    return true
  }else{
    return false
  }
}

toggle: boolean = false;
toggleShowDiv(rule) {
  this.store.dispatch(dataTableActions.setPainVisible({ isPaneVisible: rule }));
  this.storedDTP.order++;
  this.ruledata = rule;
  this.enableChild = true;
  this.isVisible = true;
  localStorage.setItem('rule_name',this.ruledata.name);
}
toggleHideDiv(){
  this.store.dispatch(dataTableActions.setPainVisible({ isPaneVisible: [] }));
  this.enableChild = false;
  this.isVisible = false;
}
setRuleName(rule){
  this.router.navigate(['/alerts'],{queryParams: { 'id': rule.id, 'from':'er-rule' }})
}
getRuleAlerts(){
  this.router.navigate(['/alerts'],{queryParams: { 'id': this.ruledata.id, 'from':'er-rule' }})
}
selectList = [];
selectOpenedList = [];
filterArr:any;
selectedCount:any=0;
selectRules(id) {
  this.filterArr = this.selectList.filter( h => h==id);
  if(this.filterArr.length == 0){
    this.selectList.push(id);
  }else{
    this.selectList = this.selectList.filter(item => item !== id);
  }
  this.selectedCount = this.selectList.length;
}
removeSelectedRules(){
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
  this.selectRules(id);
  this.masterSelected = this.checklist.every(function (item: any) {
    return item.isSelected == true;
  })
}

public selectedRuleId:any;
disableRules(id?){
  // In active bulk rules
  if(id == "" || id == undefined){
    let ruleid;
    ruleid = this.IntArrayConversion(this.selectList);
    this.selectedRuleId = {rule_ids:ruleid}
  }
  //In active single rules
  else{
    this.selectedRuleId = {rule_ids:id}
  }
  swal({
    title: 'Are you sure?',
    text: "You want to Inactive Rule!",
    icon: 'warning',
    buttons: ["Cancel", "Yes, Inactive it!"],
    dangerMode: true,
    closeOnClickOutside: false,
  }).then((willDisable) => {
    if (willDisable) {
    this.commonapi.bulkDisableRules(this.selectedRuleId).subscribe(res => {
    swal({
    icon: 'success',
    text: 'Successfully Inactivated the Rule',
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

public selectedDeleteRuleId:any;
deleteRules(id?){
  // In delete bulk rules
  if(id == "" || id == undefined){
    let ruleid;
    ruleid = this.IntArrayConversion(this.selectList);
    this.selectedDeleteRuleId = {rule_ids:ruleid}
  }
  //In delete single rules
  else{
    this.selectedDeleteRuleId = {rule_ids:id}
  }
  swal({
    title: 'Are you sure?',
    text: "You want to Delete Rule!",
    icon: 'warning',
    buttons: ["Cancel", "Yes, Delete it!"],
    dangerMode: true,
    closeOnClickOutside: false,
  }).then((willDisable) => {
    if (willDisable) {
    this.commonapi.bulkDeleteRules(this.selectedDeleteRuleId).subscribe(res => {
    swal({
    icon: 'success',
    text: 'Successfully Deleted the Rule',
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

public selectedId:any;
enableRules(id?){
  // In active bulk rules
  if(id == "" || id == undefined){
    let ruleid;
    ruleid = this.IntArrayConversion(this.selectList);
    this.selectedId = {rule_ids:ruleid}
  }
  //In active single rules
  else{
    this.selectedId = {rule_ids:id}
  }
  swal({
    title: 'Are you sure?',
    text: "You want to active Rule!",
    icon: 'warning',
    buttons: ["Cancel", "Yes, Active it!"],
    dangerMode: true,
    closeOnClickOutside: false,
  }).then((willDisable) => {
    if (willDisable) {
    this.commonapi.enableRules(this.selectedId).subscribe(res => {
    swal({
    icon: 'success',
    text: 'Successfully activated the Rule',
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
removeSelectedHost(){
  this.selectList = [];
  this.selectedCount = this.selectList.length;
  this.masterSelected = false;
  for (var i = 0; i < this.checklist.length; i++) {
    this.checklist[i].isSelected = false;
  }
}
validDateFormat(value) {
  if(value) {
    let date = value.substring(0, 10);
    let time = value.substring(11, 19);
    let millisecond = value.substring(20)
    let date1 = date.split('-')[0];
    let date2 = date.split('-')[1];
    let date3 = date.split('-')[2];
    let validDate = date3+'-'+date2+'-'+date1 + ' ' + time;
    return validDate
  }

  return null;

}
getByFilterId(platform){
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.dtTrigger.next();
  });
}
tableSearch(){
  this.searchTerm = (<HTMLInputElement>document.getElementById('customsearch')).value;
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.dtTrigger.next();
  });
}
public onSort(sortColumn): void {

  const sortKey = sortColumn;
  this.store.dispatch(dataTableActions.setSortKey({ sortKey: sortKey }));
}

}
