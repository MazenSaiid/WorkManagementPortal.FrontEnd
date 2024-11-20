import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/Components/home/home.component';
import { OverviewComponent } from './core/Components/overview/overview.component';

const routes: Routes = [
  {path:'',component:HomeComponent},//to be login
  {path:'home',component:HomeComponent},
  {path:'overview',component:OverviewComponent},
  {path: 'user',loadChildren: () =>  import('./user-management/user-management.module').then(module => module.UserManagementModule)},
  {path:'**',redirectTo:'not-found',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
