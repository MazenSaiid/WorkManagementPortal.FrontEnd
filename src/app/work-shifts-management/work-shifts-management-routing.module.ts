import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkShiftComponent } from './Components/work-shift/work-shift.component';
import { EditWorkShiftComponent } from './Components/edit-work-shift/edit-work-shift.component';
import { ViewWorkShiftComponent } from './Components/view-work-shift/view-work-shift.component';
import { AddComplexWorkShiftComponent } from './Components/add-complex-work-shift/add-complex-work-shift.component';

const routes: Routes = [
  { path: '', component: WorkShiftComponent },
  { path: 'work-shift-create', component: AddComplexWorkShiftComponent },
  { path: 'work-shift-edit', component: EditWorkShiftComponent },
  { path: 'work-shift-details', component: ViewWorkShiftComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkShiftsManagementRoutingModule { }
