import { Component, OnInit } from '@angular/core';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonVariableService } from '../../../dashboard/_services/commonvariable.service';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

export interface CustomResponse {
  data: any;
  message: any;
  status: any;
}

@Component({
selector: 'app-add-openc2',
templateUrl: './add-openc2.component.html',
styleUrls: ['./add-openc2.component.css']
})

export class AddOpenc2Component implements OnInit {
event: any;
event_id: any;
fileform: FormGroup;
processform: FormGroup;
networkform: FormGroup;
Validatorform: FormGroup;
scriptform: FormGroup;
authform:FormGroup;
uninstallform:FormGroup;
response_data: any;
res_results: any;
network_val = {};
response: any;
submitted: any;
app_show: any;
src_show: any;
dst_show: any;
dst_addr_show: any;
network_show: any;
domain_show: any;
uninstall_domain_show=true;
redirect: boolean;
file_selected: any;
process_selected: any;
network_selected: any;
program_selected: any;
direction_selected: any;
protocol_selected: any;
local_port_selected: any;
remote_port_selected: any;
dest_addr_selected: any;
network_val_del: any;
local_specific_port:any;
remote_specific_port:any;
destinatiion_address:any;
selected_act_name:any;
selected_act_ID:any;
script_type:any;
script_action:any;
auth_type:any;
file_type:any;
save_script:any;
act_results:any=[];
actuatorid_dropdownList = new Array();
actuatorid_dropdownSettings = {};
actuatorid_selectedItems = new Array();
actuator_id_data: any = new Array();
public selected_hosts:any;
public selected_hosts_script:any;
agent_content_file:File;
agent_content_file_name:any;
rest_file =0;
file_content_list:any;
save_script_visible:any;
fieldTextType: boolean;
content=""
content_dropdownList = [];
content_selectedItems = [];
content_dropdownSettings = {};
confirmationform:FormGroup;
project_name=this.commonvariable.APP_NAME;
taggedList = [];
tagSettings = {};
osNameList = [];
osNameListSettings = {};
selectedTag:any;
selectedosName:any;
constructor(
private fb: FormBuilder,
private commonapi: CommonapiService,
private _router: Router,
private _location: Location,
private toaster: ToastrService,
private commonvariable: CommonVariableService,
) {
this.file_selected = 'delete';
this.process_selected = 'stop';
this.network_selected = 'delete';
this.program_selected = 'ANY';
this.direction_selected = '1';
this.protocol_selected = '2';
this.local_port_selected = 'ANY';
this.remote_port_selected = 'ANY';
this.dest_addr_selected = '*';
this.script_type = '1';
this.script_action = 'script_execution';
this.auth_type = 'local';
this.file_type = '1';
this.save_script= '1'
}
agent_content:string = '';
clearInput() {
  this.agent_content = null;
}

ngOnInit() {
this.act_results
this.fileform = this.fb.group({
file_name: ['', Validators.required],
hash: '',
file_action: '',
target: 'file',
});
this.processform = this.fb.group({
process_name: ['', Validators.required],
pid: ['',  [Validators.required, Validators.pattern("^[1-9][0-9]*$")]],
process_action: '',
target: 'process',
});
this.networkform = this.fb.group({
network_action: '',
rule_name: ['', Validators.required],
rule_group: '',
rule_description: '',
application_type: '',
application: '',
direction: '',
layer4_protocol: '',
src_port_type: '',
src_port: ['', [Validators.min(Number.MIN_VALUE)]],
dst_port_type: '',
dst_port: ['', [Validators.min(Number.MIN_VALUE)]],
dst_addr_type: '',
dst_addr: '',
});
this.Validatorform = this.fb.group({
 ActuatorID: [''],
 actuator: [''],
 tags:[''],
 osName:['']
});
this.scriptform = this.fb.group({
 script_type:'',
 save_script:'',
 params:'',
 content: '',
 agent_content_file: [''],
 script_name:['', Validators.required],
 content_library:['']
});

this.commonapi.Hosts_main().subscribe(res => {
this.response_data = res;
this.res_results = this.response_data.data.results
for(const i in this.res_results){
  if(this.res_results[i].os_info.platform!="darwin" &&  this.res_results[i].is_active){
this.actuator_id_data.push({id: this.res_results[i].host_identifier, itemName :this.res_results[i].display_name}) ;
}
}
})
this.actuatorid_dropdownList = this.actuator_id_data;
this.actuatorid_dropdownSettings = {
singleSelection: false,
text:"Select Host(s)",
selectAllText:'Select All',
unSelectAllText:'UnSelect All',
enableSearchFilter:true,
lazyLoading: false,
classes: "angular-multiselect-class",
searchPlaceholderText: "Search Hosts here..",
badgeShowLimit:1
};
this.content_dropdownList = [
  {"id":1,"itemName":"plgx_win7_agent_upgrade_3.0.ps1","value":"plgx_win7_agent_upgrade_3.0.ps1"},
  {"id":2,"itemName":"plgx_win10_agent_upgrade_3.0.ps1","value":"plgx_win10_agent_upgrade_3.0.ps1"},
  {"id":3,"itemName":"plgx_win7-10_agent_restart_3.0.bat","value":"plgx_win7-10_agent_restart_3.0.bat"},
  {"id":4,"itemName":"plgx_win7_agent_cert_update_3.5.0.ps1","value":"plgx_win7_agent_cert_update_3.5.0.ps1"},
  {"id":5,"itemName":"plgx_win10_agent_cert_update_3.5.0.ps1","value":"plgx_win10_agent_cert_update_3.5.0.ps1"},
  {"id":6,"itemName":"plgx_win7-10_agent_upgrade_3.0.bat","value":"plgx_win7-10_agent_upgrade_3.0.bat"},
  {"id":7,"itemName":"plgx_win7-10_agent_uninstall_3.0.bat","value":"plgx_win7-10_agent_uninstall_3.0.bat"},
  {"id":8,"itemName":"plgx_win7-10_agent_cert_update_3.5.0.bat","value":"plgx_win7-10_agent_cert_update_3.5.0.bat"},
  {"id":9,"itemName":"plgx_linux_agent_cert_update_3.5.0.sh","value":"plgx_linux_agent_cert_update_3.5.0.sh"},
  {"id":10,"itemName":"plgx_linux_agent_upgrade_3.5.0.sh","value":"plgx_linux_agent_upgrade_3.5.0.sh"},
  {"id":11,"itemName":"plgx_linux_agent_uninstall_3.0.sh","value":"plgx_linux_agent_uninstall_3.0.sh"},
  {"id":12,"itemName":"plgx_linux_agent_restart_3.0.sh","value":"plgx_linux_agent_restart_3.0.sh"},
  {"id":13,"itemName":"plgx_mac_agent_uninstall_3.5.0.sh","value":"plgx_mac_agent_uninstall_3.5.0.sh"},
  {"id":14,"itemName":"plgx_mac_agent_restart_3.5.0.sh","value":"plgx_mac_agent_restart_3.5.0.sh"},
  {"id":15,"itemName":"plgx_mac_agent_cert_update_3.5.0.sh","value":"plgx_mac_agent_cert_update_3.5.0.sh"}
];
this.content_dropdownSettings = {
singleSelection: true,
text:"Select from library",
selectAllText:'Select All',
unSelectAllText:'UnSelect All',
enableSearchFilter: true,
classes:"myclass"
};
this.tagSelect();
this.osNameSelect()
}
get f() { return this.fileform.controls; }
get g() { return this.processform.controls; }
get h() { return this.networkform.controls; }
get v() { return this.Validatorform.controls; }
get s() { return this.scriptform.controls; }
get p() { return this.confirmationform.controls; }

uploadFile(event){
  if (event.target.files.length > 0) {
      this.agent_content_file = event.target.files;
      this.agent_content_file_name = this.agent_content_file[0].name;
  }
  this.rest_file =1;
}

resetFile(f) {
  this.rest_file =0;
  this.agent_content_file_name = ''
}

onSubmit() {
  this.submitted = true;
  this.fileform.enable();
  if (this.processform.invalid) {
     this.processform.controls.process_name.setErrors(null);
     this.processform.controls.pid.setErrors(null);
  }
  if (this.networkform.invalid) {
     this.networkform.controls.rule_name.setErrors(null);
     this.networkform.controls.application.setErrors(null);
  }
  if (this.scriptform.invalid) {
     this.scriptform.controls.script_name.setErrors(null);
  }
  if (this.fileform.invalid) {
    return;
   }
  if (this.Validatorform.invalid) {
     return;
  }
  if (this.scriptform.invalid) {
    return;
  }
  this.validateSelectedFilter('file');
}

addSelectedFilter(selectedFilter){
  var selectedList='';
  for (const i in selectedFilter) {
    if(selectedList!=''){ selectedList = selectedList + ',' + selectedFilter[i].itemName; }
    else{ selectedList = selectedFilter[i].itemName; }
  }
  return selectedList;
}

tagSelect(){
  this.commonapi.Tags_data().subscribe((res: CustomResponse) => {
    for (const i in res.data.results) {
      this.taggedList.push({id: i, itemName: res.data.results[i].value});
    }
    this.tagSettings = {
      singleSelection: false,
      text: "Select by Tags",
      selectAllText: 'Select All Tags',
      unSelectAllText: 'DeSelect All Tags',
      badgeShowLimit: 1,
      enableSearchFilter: true,
      classes: "tag-class",
      searchPlaceholderText: "Search tag here.."
    };

  });
}

osNameSelect(){
  this.commonapi.Hosts_data().subscribe((res: CustomResponse) => {
    var listOfOs=[]
    for (const i in res.data.results) {
      listOfOs.push(res.data.results[i]['os_info'].name)
    }
    listOfOs =listOfOs.filter((value,index)=>listOfOs.indexOf(value)===index)
    for(const i in listOfOs){
      this.osNameList.push({id:i, itemName:listOfOs[i]});
    }
    this.osNameListSettings = {
       singleSelection: false,
       text: "Select by Operating System",
       selectAllText: 'Select All OS Names',
       unSelectAllText: 'Unselect All',
       badgeShowLimit: 1,
       enableSearchFilter: true,
       classes: "os-class",
       searchPlaceholderText: "Search OS Name here.."
     };

 });

}

requiredMessageAlert(msg){
  swal({
     icon: 'warning',
     text:  msg ,
   })
}
CalSwalLoader(){
  Swal.fire({
    title: 'Please wait...',
    onBeforeOpen: () => {
      Swal.showLoading()
    }
  })
}

submitFile(){
  this.CalSwalLoader()
  this.commonapi.Response_action_add(this.fileform.value.file_action, this.selected_hosts,this.selectedTag,this.selectedosName, this.fileform.value.target, this.fileform.value.file_name, this.fileform.value.hash).subscribe(res => {
  this.RedirectOpenc2(res);
  Swal.close()
  })
}

onProcessSubmit() {
  this.submitted = true;
  this.processform.enable();
  if (this.fileform.invalid) {
    this.fileform.controls.file_name.setErrors(null);
  }
  if (this.networkform.invalid) {
    this.networkform.controls.rule_name.setErrors(null);
    this.networkform.controls.application.setErrors(null);
  }
  if (this.scriptform.invalid) {
    this.scriptform.controls.script_name.setErrors(null);
  }
  if (this.processform.invalid) {
   this.processform.enable();
   return;
  }
  this.validateSelectedFilter('process');
}

submitProcess(){
  this.CalSwalLoader()
  this.commonapi.Response_process_action_add(this.processform.value.process_action, this.selected_hosts,this.selectedTag,this.selectedosName, this.processform.value.target, this.processform.value.process_name, this.processform.value.pid).subscribe(res => {
    Swal.close()
    this.RedirectOpenc2(res);
  })
}

onNetworkSubmit() {
  this.submitted = true;
  if(this.program_selected=="SPECIFIC" && this.networkform.value.application==''){
    this.networkform.controls["application"].setValidators(Validators.required);
  }else{
    this.networkform.controls["application"].setValidators(null)
  }
  this.networkform.enable();

  if (this.fileform.invalid) {
    this.fileform.controls.file_name.setErrors(null);
  }
  if (this.processform.invalid) {
   this.processform.controls.process_name.setErrors(null);
   this.processform.controls.pid.setErrors(null);
  }
  if (this.scriptform.invalid) {
    this.scriptform.controls.script_name.setErrors(null);
  }
  if (this.networkform.invalid) {
    this.networkform.enable();
    return;
  }
  this.validateSelectedFilter('network');
}


submitNetwork(){
  if (this.network_selected == 'delete') {
    this.network_val = {
       "action": this.networkform.value.network_action,
       "actuator_id": this.selected_hosts,
       "tags":this.selectedTag,
       "os_name":this.selectedosName,
       "target": "ip_connection",
       "rule_name": this.networkform.value.rule_name
    }
  }
  else {
    this.network_val = {
       "action": this.networkform.value.network_action,
      "actuator_id": this.selected_hosts,
      "tags":this.selectedTag,
      "os_name":this.selectedosName,
      "target": "ip_connection",
      "rule_name": this.networkform.value.rule_name,
      "rule_group": this.networkform.value.rule_group,
      "rule_description":this.networkform.value.rule_description,
      "src_port": this.networkform.value.src_port,
      "dst_port": this.networkform.value.dst_port,
      "dst_addr": this.networkform.value.dst_addr,
      "application": this.networkform.value.application,
      "direction": this.networkform.value.direction,
      "layer4_protocol": this.networkform.value.layer4_protocol
     }
  }
  this.CalSwalLoader();
  this.commonapi.Response_network_add(this.network_val).subscribe(res => {
    Swal.close()
    this.RedirectOpenc2(res);
  })
}


onScriptSubmit() {
  this.submitted = true;
  this.scriptform.enable();
  if (this.fileform.invalid) {
    this.fileform.controls.file_name.setErrors(null);
  }
  if (this.networkform.invalid) {
    this.networkform.controls.rule_name.setErrors(null);
    this.networkform.controls.application.setErrors(null);
  }
  if (this.processform.invalid) {
    this.processform.controls.process_name.setErrors(null);
    this.processform.controls.pid.setErrors(null);
  }
  if (this.scriptform.invalid) {
    this.scriptform.enable();
    return;
  }
  let actuator_id = this.v.ActuatorID.value;
  if(this.rest_file ==1 && (this.content != '')){
      this.requiredMessageAlert("Please provide either text or file!");
  }
  else if(this.rest_file ==1){
    this.file_content_list = this.agent_content_file;
    if(this.scriptform.value.save_script == '1'){
      this.save_script_visible = "false"
    }else{
      this.save_script_visible = "true"
    }
    this.selected_hosts_script=this.getStringConcatinated(actuator_id);
    this.validateSelectedFilter('Addscript');

  }else{
    this.file_content_list = this.content;
    if(this.scriptform.value.save_script == '1'){
      this.save_script_visible = "false"
    }else{
      this.save_script_visible = "true"
    }
    let tags = this.v.tags.value;
    let osName = this.v.osName.value;
    this.selected_hosts_script=this.getStringConcatinated(actuator_id);
    this.selectedTag = this.addSelectedFilter(tags);
    this.selectedosName = this.addSelectedFilter(osName);
    if(actuator_id.length !== 0 || tags.length !== 0 || osName.length !== 0){
      if((this.rest_file ==0) && (this.file_content_list == '')){
        this.requiredMessageAlert("Please provide the script!");
      }
      else{
          this.Submitscriptcontent();
      }
    }
    else{
      this.requiredMessageAlert("Please Select Hosts/Tags/Operating System");
    }
  }

}

Submitscript(){
  this.CalSwalLoader()
  this.commonapi.Response_script_add(this.selected_hosts_script,this.selectedTag,this.selectedosName,this.scriptform.value.script_type, this.save_script_visible, this.scriptform.value.params, this.agent_content_file, this.scriptform.value.script_name).subscribe(res => {
    Swal.close()
    this.RedirectOpenc2(res);
  })
}

Submitscriptcontent(){
  this.CalSwalLoader()
  this.commonapi.Response_script_add_content(this.selected_hosts_script,this.selectedTag,this.selectedosName,this.scriptform.value.script_type, this.save_script_visible, this.scriptform.value.params, this.file_content_list, this.scriptform.value.script_name).subscribe(res => {
    Swal.close()
    this.RedirectOpenc2(res);
  })
}

validateSelectedFilter(type){
  let actuatorId = this.v.ActuatorID.value;
  let actuator = this.v.actuator.value;
  let tags = this.v.tags.value;
  let osName = this.v.osName.value;
  this.selected_hosts=this.getStringConcatinated(actuatorId);
  this.selectedTag = this.addSelectedFilter(tags);
  this.selectedosName = this.addSelectedFilter(osName);
  if( actuatorId.length !== 0 || tags.length !== 0 || osName.length !== 0){
    switch(type) {
      case 'file':
        this.submitFile();
        break;
      case 'process':
        this.submitProcess();
        break;
      case 'network':
        this.submitNetwork();
        break;
      case 'Addscriptcontent':
        this.Submitscriptcontent();
        break;
      case 'Addscript':
        this.Submitscript();
        break;
      default:
    }
  }
  else{
    this.requiredMessageAlert("Please Select Hosts/Tags/Operating System");
  }
}

RedirectOpenc2(res){
  this.response = res;
  swal({
    icon: this.response.status == 'failure'? 'error': this.response.status,
    text: this.response.message,
    buttons: [false],
    timer: 2000
  }).then(results => {
    this._router.navigate(['./response-action']);
  })
  if (this.redirect) {
    this.redirect = false;
  }
}

setTarget(properties) {
console.log(properties);
}

onChangeActuator(event) {
this.event = event.target.value;
}

onChangeActuatorId(event_id) {
this.event_id =event_id.target.value
}
showHideActionBox(event_val) {
}
/* select box contet start */
onItemSelect(item:any){

}
OnItemDeSelect(item:any){

}
onSelectAll(items: any){

}
onDeSelectAll(items: any){
  this.Validatorform.controls['ActuatorID'].reset()
  this.Validatorform.get('ActuatorID').setValue([]);
}
onDeSelectAllTags(items: any){
  this.Validatorform.controls['tags'].reset()
  this.Validatorform.get('tags').setValue([]);
}
onDeSelectAllOsName(items: any){
  this.Validatorform.controls['osName'].reset()
  this.Validatorform.get('osName').setValue([]);
}
/* select box contet End */
goBack() {
this._location.back();
}
getStringConcatinated(array_object){
  //Join Array elements together to make a string of comma separated list
  let string_object = "";
  try{
    if (array_object.length>0){
      string_object = array_object[0].id;
      for (let index = 1; index < array_object.length; index++) {
        string_object = string_object+','+array_object[index].id;
      }
      return string_object
    }
  }
  catch(Error){
    return ""
  }
}
onItemSelect_library(item:any){
var fileName = item.value
 // this.content=this.content_selectedItems[0].value;
 this.commonapi.customActionContentScript(fileName).subscribe(data => {
     this.content = data;
 })
}
OnItemDeSelect_library(item:any){
  this.content=""
}
onDeSelectAll_library(items: any){
  this.content=""
}

}
