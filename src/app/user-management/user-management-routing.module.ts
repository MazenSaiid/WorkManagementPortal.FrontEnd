import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './Components/user/user.component';
import { CreateUserComponent } from './Components/create-user/create-user.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { UserDetailsComponent } from './Components/user-details/user-details.component';
import { AddBulkUserComponent } from './Components/add-bulk-user/add-bulk-user.component';

const routes: Routes = [
  { path: '', component: UserComponent },
  { path: 'user-create', component: CreateUserComponent },
  { path: 'user-edit', component: EditUserComponent },
  { path: 'user-details', component: UserDetailsComponent },
  { path: 'user-bulk', component: AddBulkUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
