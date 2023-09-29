import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HuntRoutingModule } from './hunt-routing.module';
import { HuntComponent } from './hunt.component';
import { GlobalModule } from '../../global/global.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DatepickerModule } from 'ng2-datepicker';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [HuntComponent],
  imports: [
    CommonModule,
    HuntRoutingModule,
    GlobalModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AngularMultiSelectModule,
    DatepickerModule,
    NgbDatepickerModule,
    SharedModule
  ]
})
export class HuntModule { }
