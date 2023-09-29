import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimeFormatPipe } from '../dashboard/pipes/datetimeformat.pipe';
import { ButtonComponent } from '../widgets/button/button.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridComponent } from '../widgets/ag-grid/ag-grid.component';
import { DataTablesModule } from 'angular-datatables';
import { CustomSelectComponent } from '../widgets/CustomSelectComponent';
import { CustomSearchComponent } from '../widgets/custom-search/custom-search.component';
import { DatepickerCalendarComponent } from '../widgets/datepicker-calendar/datepicker-calendar.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [DateTimeFormatPipe,ButtonComponent, AgGridComponent,CustomSelectComponent,CustomSearchComponent,DatepickerCalendarComponent],
  imports: [
    CommonModule,RouterModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],exports: [
    DateTimeFormatPipe, ButtonComponent, AgGridComponent,CustomSelectComponent,CustomSearchComponent,DatepickerCalendarComponent
  ]
})
export class SharedModule { }
