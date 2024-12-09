import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './Components/overview/overview.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { MyWorkComponent } from './Components/my-work/my-work.component';
import { MyTeamComponent } from './Components/my-team/my-team.component';
const routes: Routes = [
{path:'overview',component:OverviewComponent},
{path:'my-work',component:MyWorkComponent},
{path:'my-teams',component:MyTeamComponent},
{path:'not-found',component:NotFoundComponent},
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CoreRoutingModule { }