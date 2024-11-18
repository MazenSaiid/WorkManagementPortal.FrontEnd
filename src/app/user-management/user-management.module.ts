import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserComponent } from './Components/user/user.component';
import { UserDetailsComponent } from './Components/user-details/user-details.component';
import { CreateUserComponent } from './Components/create-user/create-user.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { AddBulkUserComponent } from './Components/add-bulk-user/add-bulk-user.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    UserComponent,
    UserDetailsComponent,
    CreateUserComponent,
    EditUserComponent,
    AddBulkUserComponent
  ],
  imports: [
    CommonModule,CoreModule,
    UserManagementRoutingModule,
  ]
})
export class UserManagementModule { }
