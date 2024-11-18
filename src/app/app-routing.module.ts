import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/Components/home/home.component';

const routes: Routes = [
  {path:'',component:HomeComponent},//to be login
  {path:'home',component:HomeComponent},
  {path: 'user',loadChildren: () =>  import('./user-management/user-management.module').then(module => module.UserManagementModule)},
  {path:'**',redirectTo:'not-found',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
