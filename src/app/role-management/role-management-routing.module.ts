import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './Components/roles/roles.component';
import { AddRolesComponent } from './Components/add-roles/add-roles.component';
import { EditRolesComponent } from './Components/edit-roles/edit-roles.component';
import { ViewRolesComponent } from './Components/view-roles/view-roles.component';

const routes: Routes = [
  { path: '', component: RolesComponent },
  { path: 'role-create', component: AddRolesComponent },
  { path: 'role-edit', component: EditRolesComponent },
  { path: 'role-details', component: ViewRolesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }
