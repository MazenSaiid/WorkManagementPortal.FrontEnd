import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/Components/home/home.component';
import { OverviewComponent } from './core/Components/overview/overview.component';
import { NotFoundComponent } from './core/Components/not-found/not-found.component';

const routes: Routes = [
  {path:'',component:HomeComponent},//to be login
  {path:'home',component:HomeComponent},
  {path:'overview',component:OverviewComponent},
  {path:'not-found',component:NotFoundComponent},
  {path: 'user',loadChildren: () =>  import('./user-management/user-management.module').then(module => module.UserManagementModule)},
  {path: 'role',loadChildren: () =>  import('./role-management/role-management.module').then(module => module.RoleManagementModule)},
  {path:'**',redirectTo:'not-found',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
