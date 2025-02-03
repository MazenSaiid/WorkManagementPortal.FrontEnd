import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkShiftsManagementRoutingModule } from './work-shifts-management-routing.module';
import { CoreModule } from '../core/core.module';
import { EditWorkShiftComponent } from './Components/edit-work-shift/edit-work-shift.component';
import { ViewWorkShiftComponent } from './Components/view-work-shift/view-work-shift.component';
import { WorkShiftComponent } from './Components/work-shift/work-shift.component';
import { EnumToStringPipe } from './Pipes/EnumToStringPipe';
import { AddComplexWorkShiftComponent } from './Components/add-complex-work-shift/add-complex-work-shift.component';


@NgModule({
  declarations: [
    EditWorkShiftComponent,
    ViewWorkShiftComponent,
    AddComplexWorkShiftComponent,
    WorkShiftComponent,EnumToStringPipe, AddComplexWorkShiftComponent
  ],
  imports: [
    CommonModule,CoreModule,
    WorkShiftsManagementRoutingModule
  ]
})
export class WorkShiftsManagementModule { }
