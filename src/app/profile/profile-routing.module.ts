import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileInfoComponent } from './Components/profile-info/profile-info.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';

const routes: Routes = [
  {path:'info',component:ProfileInfoComponent},
  {path: 'change-password',component:ChangePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
