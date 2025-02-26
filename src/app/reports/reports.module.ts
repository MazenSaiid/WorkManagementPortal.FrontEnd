import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { WorklogReportsComponent } from './Components/worklog-reports/worklog-reports.component';
import { AbsenceReportsComponent } from './Components/absence-reports/absence-reports.component';
import { CoreModule } from '../core/core.module';
import { WorkTimesheetComponent } from './Components/work-timesheet/work-timesheet.component';


@NgModule({
  declarations: [
    WorklogReportsComponent,
    AbsenceReportsComponent,
    WorkTimesheetComponent
  ],
  imports: [
    CommonModule,CoreModule,
    ReportsRoutingModule
  ],exports:[
    WorklogReportsComponent,
    AbsenceReportsComponent,
    WorkTimesheetComponent
  ]
})
export class ReportsModule { }
