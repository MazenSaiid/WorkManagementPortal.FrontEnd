import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkShiftsManagementRoutingModule } from './work-shifts-management-routing.module';
import { CoreModule } from '../core/core.module';
import { AddWorkShiftComponent } from './Components/add-work-shift/add-work-shift.component';
import { EditWorkShiftComponent } from './Components/edit-work-shift/edit-work-shift.component';
import { ViewWorkShiftComponent } from './Components/view-work-shift/view-work-shift.component';
import { WorkShiftComponent } from './Components/work-shift/work-shift.component';
import { EnumToStringPipe } from './Pipes/EnumToStringPipe';


@NgModule({
  declarations: [
    AddWorkShiftComponent,
    EditWorkShiftComponent,
    ViewWorkShiftComponent,
    WorkShiftComponent,EnumToStringPipe
  ],
  imports: [
    CommonModule,CoreModule,
    WorkShiftsManagementRoutingModule
  ]
})
export class WorkShiftsManagementModule { }
