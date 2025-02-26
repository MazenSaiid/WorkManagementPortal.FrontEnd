import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './Components/overview/overview.component';
import { MyWorkComponent } from './Components/my-work/my-work.component';
import { AllTeamComponent } from './Components/all-team/all-team.component';
import { AuthGuard } from '../core/Guards/auth/auth.guard';
import { MyTeamComponent } from './Components/my-team/my-team.component';

const routes: Routes = [
{path:'overview',component:OverviewComponent,canActivate: [AuthGuard], 
    data: { roles: ['Admin','Manager']}},
{path:'my-work',component:MyWorkComponent},
{path:'my-team',component:MyTeamComponent},
{path:'all-team',component:AllTeamComponent,canActivate: [AuthGuard], 
  data: { roles: ['Admin','Manager']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewDataRoutingModule { }
