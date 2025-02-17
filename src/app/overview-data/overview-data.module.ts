import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewDataRoutingModule } from './overview-data-routing.module';
import { MyTeamComponent } from './Components/my-team/my-team.component';
import { MyWorkComponent } from './Components/my-work/my-work.component';
import { OverviewComponent } from './Components/overview/overview.component';
import { CoreModule } from '../core/core.module';
import { FinishedWorklogsComponent } from './Components/finished-worklogs/finished-worklogs.component';
import { ActiveWorklogsComponent } from './Components/active-worklogs/active-worklogs.component';
import { PausedWorklogsComponent } from './Components/paused-worklogs/paused-worklogs.component';
import { LateCheckinWorklogsComponent } from './Components/late-checkin-worklogs/late-checkin-worklogs.component';
import { EarlyCheckoutWorklogsComponent } from './Components/early-checkout-worklogs/early-checkout-worklogs.component';
import { AbsentUsersComponent } from './Components/absent-users/absent-users.component';
import { OutofscheduleWorklogsComponent } from './Components/outofschedule-worklogs/outofschedule-worklogs.component';


@NgModule({
  declarations: [
    MyTeamComponent,
    MyWorkComponent,
    OverviewComponent,
    FinishedWorklogsComponent,
    ActiveWorklogsComponent,
    PausedWorklogsComponent,
    LateCheckinWorklogsComponent,
    EarlyCheckoutWorklogsComponent,
    AbsentUsersComponent,
    OutofscheduleWorklogsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    OverviewDataRoutingModule
  ],
  exports:[
    MyTeamComponent,
    MyWorkComponent,
    OverviewComponent
  ]
})
export class OverviewDataModule { }
