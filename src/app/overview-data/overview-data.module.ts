import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewDataRoutingModule } from './overview-data-routing.module';
import { MyTeamComponent } from './Components/my-team/my-team.component';
import { MyWorkComponent } from './Components/my-work/my-work.component';
import { OverviewComponent } from './Components/overview/overview.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    MyTeamComponent,
    MyWorkComponent,
    OverviewComponent
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
