import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsenceReportsComponent } from './Components/absence-reports/absence-reports.component';
import { WorklogReportsComponent } from './Components/worklog-reports/worklog-reports.component';
import { AuthGuard } from '../core/Guards/auth/auth.guard';
import { WorkTimesheetComponent } from './Components/work-timesheet/work-timesheet.component';

const routes: Routes = [
  {path:'absence-reports',component:AbsenceReportsComponent,canActivate: [AuthGuard], 
    data: { roles: ['Admin','Manager']}},
  {path:'worklog-reports',component:WorklogReportsComponent,canActivate: [AuthGuard], 
    data: { roles: ['Admin','Manager']}},
  {path:'work-timesheet',component:WorkTimesheetComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
