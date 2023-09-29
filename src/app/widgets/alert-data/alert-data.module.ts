import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDataComponent } from './alert-data.component'; 
import { RouterModule } from '@angular/router';

// import { AlertsRoutingModule } from './alerts-routing.module';
// import { AlertsComponent } from './alerts.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTablesModule } from 'angular-datatables';
import { GlobalModule } from '../../global/global.module';
import {DatepickerModule} from "ng2-datepicker";
import {NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "../../shared/shared.module";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AlertDataComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgJsonEditorModule,
    GlobalModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    Ng2SearchPipeModule,
    DataTablesModule,
    RouterModule,
    DatepickerModule,
    NgbDatepickerModule,
    SharedModule,
    NgbModule,
    AngularMultiSelectModule,
    NgSelectModule,
  ],exports: [
    AlertDataComponent
  ]
})
export class AlertDataModule { }