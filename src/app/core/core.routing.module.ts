import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './Components/overview/overview.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
const routes: Routes = [
{path:'overview',component:OverviewComponent},
{path:'not-found',component:NotFoundComponent},
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CoreRoutingModule { }