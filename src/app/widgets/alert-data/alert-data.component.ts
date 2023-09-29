import {Component, OnInit, OnDestroy,ViewChild,Input,ChangeDetectorRef,} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { CommonapiService } from 'src/app/dashboard/_services/commonapi.service';
import { CommonVariableService } from 'src/app/dashboard/_services/commonvariable.service';
import {JsonEditorOptions} from 'ang-jsoneditor';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import {Location} from '@angular/common';
import {saveAs} from 'file-saver';
import { environment } from '../../../environments/environment'

import {Title} from '@angular/platform-browser';
import {Datatablecolumndefs} from '../../dashboard/_helpers/datatable-columndefs';
import { HttpClient } from '@angular/common/http';
import { DateTimeFormatPipe } from '../../dashboard/pipes/datetimeformat.pipe';
import { SlideInOutAnimation } from '../../../assets/animations/slide-in-out.animation';
import '../../../assets/js/patternfly/patternfly.min.js';
import alasql from "alasql";
import { ValidDateFormat } from '../../dashboard/_helpers/validDateFormat';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import create_timeline from "../../../assets/js/script";
import { msg } from '../../dashboard/_helpers/common.msg';
declare let d3: any;
declare var alerted_entry: any;
declare var $: any;
var PaginationIndex
var TempIndex
var NextDataId
var PreviousDataIds={};
var startIndex;
import 'datatables.net';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-alert-data',
  templateUrl: './alert-data.component.html',
  animations: [SlideInOutAnimation],
  styleUrls: ['./alert-data.component.css']
})
export class AlertDataComponent implements OnInit, OnDestroy {
  public editorOptions: JsonEditorOptions;
  alert: any;
  id: any;
  schedule_query_data: any
  alert_title: any;
  toggle: boolean;
  alert_data_json: any;
  host_state_data:any=[];
  hst_dta: any;
  hst_dta_first: any;
  host_state_data_list_of_queries: any = [];
  selectedItem: any;
  table_progress: any;
  alerted_entry: any;
  hosttable_name: any;
  alert_time: any;
  aggregated_data:any={};
  alert_selectedItem:any;
  aggregate_tab=[];
  aggregateoutput:any;
  aggregatelist:any;
  aggregatedOptions: any = {};
  myjson: any = JSON;
  errorMessage:any;
  dtTrigger: Subject<any> = new Subject();
  Progress_value:number = 0;
  Hoststatetable: any;
  siteException: Array<any> = [];
  noteShow: boolean = true;
  activitydatanode: Array<any>;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  noteValue = '';
  noteValueEdit = '';
  notes_data:Array<any>;
  lastUpdated: any;
  noteException: boolean = false;
  historyNotes : boolean = false;
  loadhistoryNotes : boolean = true;
  contentEditable: Array<any> = [];
  userData: any;
  userId:number;
  scrHeight:any;
    scrWidth:any;
    animationState = 'out';
  public isDetailPaneActive: boolean= false;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private commonapi: CommonapiService,
    private router: Router,
    private _location: Location,
    private titleService: Title,
    private commonvariable: CommonVariableService,
    private columndefs:Datatablecolumndefs,
    private http: HttpClient,
    private convertDateFormat:ValidDateFormat,
    private cd: ChangeDetectorRef
  ) {
    this.getScreenSize();
  }
  @Input() item;
  initialized=false;
  
  ngOnInit() {
    this.commonapi.getUserDetails().subscribe(response=>{
      this.userData = response;
      this.userId = this.userData.data.id;
    })
    $.fn.dataTable.ext.errMode = 'none';
    this.Get_aggregated_data_filter_with_QueryName();
    $('.hostLoader').hide();
    this.titleService.setTitle(this.commonvariable.APP_NAME+" - "+"Alert");
    
    if (this.item != undefined || this.item != null) {
      this.isDetailPaneActive = true
      this.id = this.item;
      let bodyTemp = document.getElementById("kt_wrapper_grid");
    bodyTemp.classList.add("no-pad");
    }
    else {
      this.isDetailPaneActive = false
      let bodyTemp = document.getElementById("kt_wrapper_grid");
      this._Activatedroute.paramMap.subscribe(params => {
        this.id = params.get('id');
      });
    }
    
    if(isNaN(this.id)){
     this.pagenotfound();
    }


    this.commonapi.Alert_data(this.id).subscribe((res: any) => {
      this.alert = res.data;
      if(res.status == "failure"){
        this.pagenotfound();
      }
      else{
      this.alerted_entry = this.alert.message;
        console.log(this.alerted_entry);

        if (this.alert.source == 'rule') {
        this.aggregate_tab = [];
        this.commonapi.get_alerts_aggregated_data(this.id).subscribe((res: any) => {
          console.log(res);
          for (const i in res.data) {
            if (!this.aggregated_data.hasOwnProperty(res.data[i].query_name)) {
              this.aggregated_data[res.data[i].query_name] = []
              this.aggregate_tab.push(res.data[i].query_name)
            }
            this.aggregated_data[res.data[i].query_name].push(res.data[i].columns)
          }
          console.log(this.aggregate_tab);
          $('.aggregation_loader').hide();
          if (res.data.length != 0) {
            
          this.alert_selectedItem = res.data[0].query_name;
          this.Get_aggregated_data_filter_with_QueryName();
          this.dtTrigger.next();
          } else {
            $("#alerts_aggretated_table").html('No results found');
          }
        })
        }
      if (this.alerted_entry.hasOwnProperty('time') && !this.alerted_entry.hasOwnProperty('utc_time')){
        this.alert_time = (new Date((this.alerted_entry.time)*1000).toUTCString()).replace('GMT','UTC');
      }
      else if(this.alerted_entry.hasOwnProperty('time') ) {
        this.alert_time =this.alerted_entry.utc_time;
      }
      console.log(this.alert_time);
      //if(!this.alert.message.process_guid || this.alert.message.action.includes("IMAGE_")) {
      if(!this.alert.message.process_guid) {
        $('#process_analysis').hide();
        $('#process_analysis_hidden_text').show();
        $('.placeholder_event_Process_analysis').hide();
      }
      this.commonapi.Alert_system_events_and_state_data(this.id).subscribe((res: any) => {
        this.schedule_query_data = res.data.schedule_query_data_list_obj;

        if(this.schedule_query_data != null){
          if(this.schedule_query_data.length == 0){
            var alertedEventData = this.alerted_entry;
            var querydata=[alertedEventData];
            //checking eid for windows
            if(querydata[0].hasOwnProperty("eid")){
              var date = alertedEventData.utc_time;
              var utc_date = date.concat(" ").concat("UTC");
              const add = { date:utc_date}
              Object.entries(add).forEach(([key,value]) => { alertedEventData[key] = value })
              var data = [alertedEventData];
              this.schedule_query_data = [{name:"windows_events",data:data}];
            }
        }
        }

        var platform = this.alert.platform;

        var jsonObjectOfEvents;
        if (platform != 'windows' ) {
          jsonObjectOfEvents = {
            "file_events": {
              "color": "#000000",
              "display_name": "FILE",
              "show_by_default": true,
              "actions": []
            },
            "process_events": {
              "color": "#000000",
              "display_name": "PROCESS",
              "show_by_default": true,
              "actions": []
            },
            "socket_events": {
              "color": "#000000",
              "display_name": "SOCKET",
              "show_by_default": true,
              "actions": []
            }, "hardware_events": {
              "color": "#000000",
              "display_name": "HARDWARE",
              "show_by_default": true,
              "actions": []
            }
          }
        } else {
          jsonObjectOfEvents = {
            "win_dns_events": {
              "color": "#000000",
              "display_name": "DNS",
              "eventid": '11',
              "show_by_default": true,
              "actions": []
            },
            "win_file_events": {
              "color": "#000000",
              "display_name": "FILE",
              "eventid": '1',
              "show_by_default": true,
              "actions": []
            },
            "win_process_events": {
              "color": "#000000",
              "display_name": "PROCESS",
              "eventid": '2',
              "show_by_default": true,
              "actions": []
            },
            "win_socket_events": {
              "color": "#000000",
              "display_name": "SOCKET",
              "eventid": '10',
              "show_by_default": true,
              "actions": []
            },
            "win_http_events": {
              "color": "#000000",
              "display_name": "HTTP",
              "eventid": '8',
              "show_by_default": true,
              "actions": []
            },
            "win_registry_events": {
              "color": "#000000",
              "display_name": "REGISTRY",
              "eventid": '13',
              "show_by_default": true,
              "actions": []
            },
            "win_ssl_events": {
              "color": "#000000",
              "display_name": "SSL",
              "eventid": '9',
              "show_by_default": true,
              "actions": []
            },
            "win_dns_response_events": {
              "color": "#000000",
              "display_name": "DNS RESPONSE",
              "eventid": '12',
              "show_by_default": false,
              "actions": []
            },
            "win_pefile_events": {
              "color": "#000000",
              "display_name": "PEFILE",
              "eventid": '17',
              "show_by_default": false,
              "actions": []
            },
            "win_image_load_events": {
              "color": "#000000",
              "display_name": "IMAGE LOAD",
              "eventid": '6',
              "show_by_default": false,
              "actions": []
            },
            "powershell_events": {
              "color": "#000000",
              "display_name": "POWERSHELL",
              "show_by_default": false,
              "actions": []
            },
            "windows_defender_events": {
              "color": "#000000",
              "display_name": "DEFENDER EVENTS",
              "eventid": '18',
              "show_by_default": false,
              "actions": []
            },
            "win_named_pipe_events": {
              "color": "#000000",
              "display_name": "PIPE EVENTS",
              "eventid": '19',
              "show_by_default": false,
              "actions": []
            },
          }
        }
        var event_timeline_data = [];
        if(this.alert.message.time) {
          for (let jsonObject in jsonObjectOfEvents) {
            var found = false;
            for (let i = 0; i < this.schedule_query_data.length; i++) {
              if (this.schedule_query_data[i].name === jsonObject) {
                found = true;
                event_timeline_data.push({
                  "name": jsonObjectOfEvents[jsonObject].display_name,
                  "data": this.schedule_query_data[i].data,
                  "jsonObjectOfEvents": jsonObjectOfEvents[jsonObject]
                });
                break;
              }
            }
            if (!found) {
              event_timeline_data.push({
                "name": jsonObjectOfEvents[jsonObject].display_name,
                "jsonObjectOfEvents": jsonObjectOfEvents[jsonObject]
              });
            }
          }
          for (let i = 0; i < this.schedule_query_data.length; i++){
            if(platform === 'windows' && (this.schedule_query_data[i].name === "windows_events" || this.schedule_query_data[i].name === "windows_real_time_events")){
              var win_events_dict = {};
              for (let event in jsonObjectOfEvents) {
                for (let k = 0; k < this.schedule_query_data[i].data.length; k++){
                  if(this.schedule_query_data[i].data[k].eventid === jsonObjectOfEvents[event].eventid){
                    if(win_events_dict[event]){
                      win_events_dict[event].push(this.schedule_query_data[i].data[k]);
                    }else{
                      win_events_dict[event]=[this.schedule_query_data[i].data[k]];
                    }
                  }
                }
              }
              for (let event_name in win_events_dict) {
                var item_found = false;
                for (let item in event_timeline_data){
                  if(event_timeline_data[item].name == jsonObjectOfEvents[event_name].display_name){
                    item_found = true;
                    event_timeline_data[item].name = jsonObjectOfEvents[event_name].display_name;

                    if(event_timeline_data[item].data){
                      for (let dict_index in win_events_dict[event_name].length){
                        event_timeline_data[item].data.push(win_events_dict[event_name][dict_index]);
                      }
                    }else{
                      event_timeline_data[item].data = win_events_dict[event_name];
                    }
                    event_timeline_data[item].jsonObjectOfEvents = jsonObjectOfEvents[event_name];
                  }
                }
                if(!item_found){
                  event_timeline_data.push({
                    "name": jsonObjectOfEvents[event_name].display_name,
                    "data": win_events_dict[event_name],
                    "jsonObjectOfEvents": jsonObjectOfEvents[event_name]
                  });
                }
              }
              break;
            }
          }

          if(event_timeline_data){
            $('.placeholder_event').hide();
            $('#event_timeline').show();
          }else{
            $('.placeholder_event').show();
            $('#event_timeline').hide();
          }
          create_timeline(event_timeline_data, this.alert.message, alasql);
          var coll2 = document.getElementsByClassName("collapsible2");
          var n;

          for (n = 0; n < coll2.length; n++) {
            coll2[n].addEventListener("click", function () {
              this.classList.toggle("active_1");
            });
          }
          //avoid event info pagination and result showing overlapping
          var tblresult = document.getElementById("pf-timeline-data_info");
          tblresult.parentElement.classList.remove("col-md-5");
          tblresult.setAttribute("style", "float: right;");
          var tblpagination = document.getElementById("pf-timeline-data_paginate");
          tblpagination.parentElement.classList.remove("col-md-7");


        }else{
          $('#event_timeline').hide();
          $('.placeholder_event').hide();
          $('#timeline_hidden_text').show();
        }
        //if(this.alert.message.process_guid && !this.alert.message.action.includes("IMAGE_")) {
        if(this.alert.message.process_guid) {
          this.initialise();
        }else{
          $('#process_analysis').hide();
          $('#process_analysis_hidden_text').show();
        }
      });
        this.getAnalystNotes();
      this.loadhistoryNotes = true;
      this.commonapi.get_host_state_details(this.id).subscribe((res: any) => {
        $('.host_state_loader').hide();
        for(const i in res.data){
          this.host_state_data.push(res.data[i].query_name)
        }
        this.get_host_state_default_data(this.host_state_data);
      })
    }
  },error => {
      console.log(error);
    });
  }
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth - 300;
    console.log(this.scrHeight, this.scrWidth);
}
addNotes() {
  console.log(this.noteValue);
  this.commonapi.addNote(this.noteValue,this.id).subscribe(res => {
    if (res['status'] == "success") {
    this.clearInput();
  }
    setTimeout(() => {
      this.getAnalystNotes();
      //this.dtTrigger[source].next();
    }, 100);
  })
}
Get_aggregated_data_filter_click(queryname_selected){
  this.alert_selectedItem = queryname_selected;
  this.dtTrigger.next();
}
clearInput() {
  this.noteValue = '';
  this.noteException = false;
}
cancelInput(index) {
  this.noteValueEdit = '';
  this.siteException[index] = false;
}
toggleShowDiv() {
  this.noteShow = !this.noteShow;
  console.log(this.animationState);
    this.animationState = this.animationState === 'in' ? 'out' : 'in';
    console.log(this.animationState);
}
onNoteHistory(){
  this.loadhistoryNotes = false;
  this.historyNotes = !this.historyNotes;
  if(this.historyNotes){
    $("#slideHistory").removeClass("create");
  $('#slideHistory').addClass("historyNote");
  }
  else{
    $('#slideHistory').removeClass("historyNote");
    $("#slideHistory").addClass("create");
  }
}
getAnalystNotes(){
  var temp;
  this.commonapi.getNotes_api(this.id).subscribe(res => {
    if (res['status'] == "success"){
      temp = res;
      this.notes_data = temp.data;
      this.notes_data.forEach(element => {
        element['noteUpdate'] = new Date(element.updated_at);
        if(element['user_id'] == this.userId){
          element['isloggedInUser'] = true;
        }
        else{
          element['isloggedInUser'] = false;
        }
      });
      console.log(this.notes_data.length);
    }
    else if(res['status'] == "failure"){
      this.notes_data = [];
    }
  });
  if(this.notes_data == undefined ){
    this.loadhistoryNotes = false;
  }
}

editNote(note_id,sample,index){
  this.commonapi.editNote_api(this.noteValueEdit,note_id,this.id).subscribe(res => {
    if (res['status'] == "success") {
    this.clearInput();
    this.siteException[index] = false;
  }
  this.getAnalystNotes();
  })
}
editNote_Dummy(event,index,data){
  this.siteException[index] = true;
  this.noteValueEdit = data;
}

deleteNote(note_id){
  this.commonapi.deleteNote_api(note_id, this.id).subscribe(res=>{
    this.getAnalystNotes()
})
}
  initialise() {
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


    var alert = this.alerted_entry;

    var token_value = localStorage.getItem('token');
    var eid = alert.eid;

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
      width = 4000 - margin.right - margin.left,
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
    var node_id=this.alert.node_id;
    var svg = d3.select("#d3-graph-2").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var alert_process_guid;
    if (alert.action == 'PROC_CREATE') {
      alert_process_guid = alert.parent_process_guid;
    } else {
      alert_process_guid = alert.process_guid;
    }
    let ajaxAlertData = {
      "process_guid": alert_process_guid,
      "alert_id": this.id,
      "node_id":node_id

    }
    $.ajax({
      type: "POST", //rest Type
      dataType: 'json', //mispelled
      url: environment.api_url + "/alerts/process",
      async: true,
      headers: {
        "content-type": "application/json",
        "x-access-token": token_value
      },
      data: JSON.stringify(ajaxAlertData),
      success: function (msgdata) {
        root = msgdata.data;
        create_graph(msgdata.data);
          $('.placeholder_event_Process_analysis').hide();
          $('#process_analysis').show();

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
            return "node blink-node";
          }
          return "node";
        })

        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })


        .on('click', function (d, i) {
          if(typeof d.data === "undefined" && d.node_type != 'action'){//It can be undefined when there is no process create. In that case, we can take the values from the alerted event
            var alertedEventData = JSON.parse(localStorage.getItem('alertedEntryData'));
            var alertedEventkeys =  Object.keys(alertedEventData);
            alertedEventkeys.forEach(function (key) {
              if(key == 'process_guid' && alertedEventData[key] == d.name) {//mapping the process guid with alerted event
                 selectedNode(alertedEventData,true);
                 callChild(alertedEventData);
               }
            });
          }else{
            selectedNode(d,true);
            if ((d.node_type == 'action' || d.data.action == 'PROC_CREATE') && !d.hasOwnProperty("fetched")) {
              callChild(d);

            } else {
              click(d);
            }
          }
        })
        .on('contextmenu', d3.contextMenu(menuItems,));


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

      if (d.hasOwnProperty("fetched") || d.hasOwnProperty('fetching')) {
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
          "node_id":node_id,
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
            async: true,
            data: JSON.stringify(child_ajaxData),
            dataType: "json",
            type: "POST"
          }).done(function (data, textStatus, jqXHR) {
            console.log(textStatus);
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
        if (typeof d.data != "undefined" && d.data.action === 'PROC_CREATE' && d.node_type!='root') {
          var url = window.location.pathname;

          token_value = localStorage.getItem('token');
          let url_get_events_by_pgid = environment.api_url + '/alerts/process';
          let ajaxData = {
            "process_guid": d.data.process_guid,
            "node_id":node_id
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
              async: true,
              dataType: "json",
              type: "POST"
            }).done(function (data, textStatus, jqXHR) {
              console.log(textStatus);

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




    function selectedNode(info,isclicked) {
      let el = info.data;
      if(typeof el === "undefined" && info.node_type !='action' && isclicked == true){
        el = info;
      }
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
        if (document.getElementById("label_2" + alert.eid)) {
          document.getElementById("label_2" + alert.eid).style.background = "#f86c6b";
        }
      }
      else {
        var TableRow = '';
        TableRow += '<h5 class="mb-0" style="text-align: center;font-size: 12px; color: #788093; margin-right: 65px; margin-top: 35px;">' + 'Click an event node to view information'
          + '</h5>'

        TableRow += '';
        $('#eventsData_process').append(TableRow);
        var tbl = document.createElement("table");
      }
    }

    selectedNode('info',false);
  }

  get_host_state_default_data(default_data) {
    this.selectedItem = this.host_state_data[0];
    this.host_state_change(this.selectedItem);
    // this.hst_dta_first = this.host_state_data[query_name][0];
  }

  HostStateChange(){
    this.host_state_change(this.selectedItem);
  }

  host_state_change(query_name) {
    $('#results_md5').empty();
    this.selectedItem = query_name;
    PreviousDataIds={}
    NextDataId=0
    if(this.host_state_data[0]!=undefined){
      this.populateData(this.alert.node_id, this.selectedItem);
    }else{
      $('#results_md5').html("");
    }
    if (typeof this.Hoststatetable != 'undefined'){
      this.Hoststatetable.columns.adjust().draw(true);
    }
  }


  populateData(node_id, query_name) {
    $('.hostLoader').show();
    var id="results_md5";
    var div_table = $("<table></table>")
        .attr("id", node_id + query_name + "_table")
        .attr("style", "margin-left:auto;width:100%;overflow-x: scroll")
        .attr("width", "100%;")
        .addClass("table table-striped- table-hover table-checkable display dt-body-left");

    $("#"+id).append(div_table);
    var uploadData1 = new FormData();
    uploadData1.append('node_id', node_id);
    uploadData1.append('query_name', query_name);
    var self = this;
    $(document).ready(function() {
      $.ajax({
            type: "POST",
            url: environment.api_url+'/hosts/recent_activity',
            data: uploadData1,
            contentType: false,
            processData: false,
            cache: false,
            headers: {
              "x-access-token": localStorage.getItem('token')
            },
            success: function (res) {
              $('.hostLoader').hide();
              var columns = [];
              var keys =  Object.keys(res.data.results[0].columns);

              var columnPosition;
              var counter = 0;

              keys.forEach(function (key) {
                counter++;
                columns.push({
                  data: key,
                  title: key
                });
              });

            var table_id = node_id + query_name.replace(/ /g, '\\ ') + "_table";
            table_id = table_id.replace(/\//g, '\\/');
            var table = $('#' + table_id).addClass("display nowrap");
            var data_row = [];
            res.data.results.forEach(element => {
              data_row.push(element.columns);
            });

            var varTable = table.DataTable({
              "aoData": data_row,
              "aoColumns": columns,
              // "sScrollY": 300,
              "sScrollX": true,
              "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
              "sPaginationType": "simple",
              "bProcessing": true,
              "bServerSide": true,
              "searching": true,
              "bDestroy": true,
              "language": {
                "search": "Search: ",
                "paginate": {
                  "previous": '<i class="fas fa-angle-double-left"></i> Previous',
                  "next": 'Next <i class="fas fa-angle-double-right"></i>',
                },
              },
              "sort":false,
              "sAjaxSource": environment.api_url+'/hosts/recent_activity',

              fnServerData: function(sSource, aoData, fnCallback,oSettings) {
                console.log("osettings", oSettings);
                startIndex=0;
                aoData.push({ "name": "node_id", "value": node_id });
                aoData.push({ "name": "query_name", "value": query_name });
                aoData.push({ "name": "limit", "value": oSettings._iDisplayLength });
                aoData.push({ "name": "start", "value": oSettings._iDisplayStart });
                PaginationIndex = oSettings._iDisplayStart;
              if (PaginationIndex > TempIndex)   //checking next page index
              {
                startIndex = NextDataId
              }
              else if (PaginationIndex < TempIndex)  //checking Previous page index
              {
                startIndex = PreviousDataIds[PaginationIndex]
              }
              TempIndex = PaginationIndex;

                var uploadData2 = new FormData();
                uploadData2.append('node_id', node_id);
                uploadData2.append('query_name', query_name);
                uploadData2.append('limit', oSettings._iDisplayLength);
                uploadData2.append('start', startIndex);
                uploadData2.append('searchterm', oSettings.oPreviousSearch.sSearch);
                uploadData1 = uploadData2;

                oSettings.jqXHR = $.ajax( {
                   "dataType": 'json',
                   "type": "POST",
                   processData: false,
                   contentType: false,
                   headers: {
                      "x-access-token": localStorage.getItem('token'),
                    },
                   url: sSource,
                   data: uploadData1,
                   success: function(data){
                    data.iTotalRecords = data.data.count
                    data.iTotalDisplayRecords = data.data.count
                    var rowData = [];
                    this.activitydatanode = data.data.results;
                    if (this.activitydatanode.length > 0 && this.activitydatanode != undefined) {
                      PreviousDataIds[PaginationIndex] = (this.activitydatanode[0].id) + 1
                      NextDataId = (this.activitydatanode[this.activitydatanode.length - 1]).id
                    }
                    data.data.results.forEach(element => {
                      rowData.push(element.columns);
                    });
                    data.data = rowData
                    fnCallback(data)
                   }
                } );
             },
              "bJQueryUI": true,
              dom: 'Bfrtip',
              "buttons": [],
              columnDefs: [
                  {
                      render: function (data, type, full, meta) {

                      },
                      targets: columnPosition
                  }
              ],
              rowCallback: function(row, data, index){
                $('td', row).css('background-color', 'white');
                $('td', row).css('padding-left', '18px');
              }

          });
          this.Hoststatetable=table;
          varTable.columns.adjust().draw(true);
      },
      error: function (result) {
        $('.hostLoader').hide();
        console.log(result.responseText);
      }
    });
  });

}


showdata(any, title) {
  this.alert_title = title;
  console.log(any)
  this.toggle = false;
  setTimeout(() => {
    // $("#myModal").modal("show");
    this.alert_data_json = any;
    this.toggle = true;
    $("#myModal").appendTo("body");
  }, 100);
}

download_csv_file(){
  var csv_data = {};
  csv_data["node_id"]=this.alert.node_id;
  csv_data["query_name"]= this.selectedItem;
  this.commonapi.search_csv_export(csv_data).subscribe(blob => {
    saveAs(blob,  this.selectedItem +"_host_"+this.alert.node_id+ '.csv');
  })
}

goBack() {
  this._location.back();
}

ngOnDestroy() {
  let bodyTemplast = document.getElementsByTagName("BODY")[0];
  bodyTemplast.classList.remove("kt-aside--minimize");
  bodyTemplast.classList.remove("kt-aside--minimize-hover");
}


// alerts_aggregated_data(key){
//   this.alert_selectedItem =key
//   $('#alerts_aggretated_table').empty();
//   var id="alerts_aggretated_table";
//   var div_table = $("<table></table>")
//       .attr("id", key + "_table")
//       .attr("style", "margin-left:auto;width:100%;overflow-x: scroll")
//       .attr("width", "100%;")
//       .addClass("table table-striped- table-bordered  table-checkable");
//         $("#"+id).append(div_table);
//       let values=this.aggregated_data[key]
//       var columns = [];
//             var keys =  Object.keys(values[0]);
//             // var counter = 0;
//             // keys.forEach(function (key) {
//             //   counter++;
//             //   columns.push({
//             //     data: key,
//             //     title: key
//             //   });
//             // });
//             var _result = this.columndefs.columnDefs(keys);
//             var column_defs = _result.column_defs;
//             columns = _result.column;
//
//             $(document).ready(function() {
//               div_table.DataTable({
//               dom: "Bfrtip",
//               bLengthChange:true,
//               data: values,
//               sPaginationType:"full_numbers",
//               "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
//               columns: columns,
//               paging:true,
//               buttons: [ {extend: 'csv',filename: function () { return key;}}],
//             "language": {
//               "search": "Search: "
//             },
//             "initComplete": function (settings, json) {
//               div_table.wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
//             },
//             "columnDefs":column_defs,
//             rowCallback: function(row, data, index){
//               $('td', row).css('background-color', 'white');
//             }
//             });
//           })
//
// }


Get_aggregated_data_filter_with_QueryName(){
  var that=this;
  this.aggregatedOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    serverSide: true,
    processing: true,
    searching: true,
    dom: '<"pull-right"B><"pull-right"f><"pull-left"l>tip',
    buttons: [
      {
        text: 'Export',
        attr:  {id: 'IdExport'},
        action: function ( e, dt, node, config ) {
          that.exportAggregatedData();
        },
      },
    ],
    "language": {
      "search": "Search: "
    },
    ajax: (dataTablesParameters: any, callback) => {
      var body = dataTablesParameters;
      var searchitem = '';
      if(body.search.value!= ""  &&  body.search.value.length>=3){
        searchitem=body.search.value;
      }
      if(body.search.value!="" && body.search.value.length<3){
       return;
      }
      var payload = {
	          "query_name":this.alert_selectedItem,
	          "start":body['start'],
            "limit":body['length'],
            "searchterm":searchitem,
      }
      this.http.post<DataTablesResponse>(environment.api_url+"/alerts/"+this.id+"/alerted_events", payload, { headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('token')}}).subscribe(res =>{
        this.aggregateoutput = res;
        this.aggregatelist = this.aggregateoutput.data.results;
        if(this.aggregatelist.length >0 &&  this.aggregatelist!=undefined)
        {
          $('.dataTables_paginate').show();
          $('.dataTables_info').show();
        }
        else{
          if(body.search.value=="" || body.search.value == undefined){
            this.errorMessage="No Data Found";
          }
          else{
            this.errorMessage="No Matching Record Found";
          }
          $('.dataTables_paginate').hide();
          $('.dataTables_info').hide();
        }
        callback({
          recordsTotal: this.aggregateoutput.data.count,
          recordsFiltered: this.aggregateoutput.data.count,
          data: []
        });
      });
    },

    ordering: false,
    columns: [{ data: 'line' }, { data: 'message' }, { data: 'severity' }, { data: 'filename' },{ data: 'created' },{ data: 'version' }]
  }
}
  exportAggregatedData(){
    var queryName = this.alert_selectedItem;
    var alertId = this.id;
    var today = new Date();
    var currentDate = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
    this.commonapi.alertedEventsExport(alertId,queryName).subscribe((res: any) => {
      saveAs(res,  'alert'+'_'+this.alert_selectedItem+ '_' + currentDate + '.csv');
    })
  }
  validDateFormat(value) {
    return this.convertDateFormat.ValidDateFormat(value);
  }
  pagenotfound() {
      this.router.navigate(['/pagenotfound']);
  }
  action(event): void {
    event.stopPropagation();
  }
}
