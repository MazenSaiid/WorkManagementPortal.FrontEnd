import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileInfoComponent } from './Components/profile-info/profile-info.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    ProfileInfoComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
