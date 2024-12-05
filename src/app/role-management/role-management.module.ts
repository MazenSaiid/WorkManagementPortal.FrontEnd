import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { CoreModule } from '../core/core.module';
import { RolesComponent } from './Components/roles/roles.component';
import { AddRolesComponent } from './Components/add-roles/add-roles.component';
import { EditRolesComponent } from './Components/edit-roles/edit-roles.component';
import { ViewRolesComponent } from './Components/view-roles/view-roles.component';


@NgModule({
  declarations: [
    RolesComponent,
    AddRolesComponent,
    EditRolesComponent,
    ViewRolesComponent
  ],
  imports: [
    CommonModule,CoreModule,
    RoleManagementRoutingModule
  ]
})
export class RoleManagementModule { }
