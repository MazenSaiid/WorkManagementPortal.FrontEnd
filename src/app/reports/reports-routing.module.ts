import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsenceReportsComponent } from './Components/absence-reports/absence-reports.component';
import { WorklogReportsComponent } from './Components/worklog-reports/worklog-reports.component';

const routes: Routes = [
  {path:'absence-reports',component:AbsenceReportsComponent},
  {path:'worklog-reports',component:WorklogReportsComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
