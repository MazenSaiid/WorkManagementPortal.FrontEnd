import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { WorklogReportsComponent } from './Components/worklog-reports/worklog-reports.component';
import { AbsenceReportsComponent } from './Components/absence-reports/absence-reports.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    WorklogReportsComponent,
    AbsenceReportsComponent
  ],
  imports: [
    CommonModule,CoreModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
