import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Openc2RoutingModule } from './openc2-routing.module';
import { Openc2Component } from './openc2.component';
import { GlobalModule } from '../../global/global.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RouterModule } from '@angular/router';
// import { TableModule } from 'primeng/table';
import { AddOpenc2Component } from './add-openc2/add-openc2.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ViewOpenc2Component } from './view-openc2/view-openc2.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [Openc2Component,AddOpenc2Component, ViewOpenc2Component],
  imports: [
    CommonModule,
    Openc2RoutingModule,
    GlobalModule,
    NgJsonEditorModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    GlobalModule,
    Ng2SearchPipeModule,
    DataTablesModule,
    RouterModule,
    // TableModule,
    NgSelectModule,
    AngularMultiSelectModule,
    SharedModule
  ]
})
export class Openc2Module { }
