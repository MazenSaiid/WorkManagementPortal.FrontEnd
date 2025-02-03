import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/Components/home/home.component';
import { LoginComponent } from './core/Components/login/login.component';
import { authGuard } from './core/Guards/auth/auth.guard';

const routes: Routes = [
  {path:'',component: LoginComponent},
  {path:'home',component:HomeComponent},
  {path: 'core',loadChildren: () =>  import('./core/core.module').then(module => module.CoreModule)},
  {path: 'reports',loadChildren: () =>  import('./reports/reports.module').then(module => module.ReportsModule)},
  {path: 'data',loadChildren: () =>  import('./overview-data/overview-data.module').then(module => module.OverviewDataModule)},
  {path: 'screenshots',loadChildren: () =>  import('./screenshots/screenshots.module').then(module => module.ScreenshotsModule)},
  {path: 'profile',loadChildren: () =>  import('./profile/profile.module').then(module => module.ProfileModule)},
  {path: 'users',loadChildren: () =>  import('./user-management/user-management.module').then(module => module.UserManagementModule)},
  {path: 'roles',loadChildren: () =>  import('./role-management/role-management.module').then(module => module.RoleManagementModule)},
  {path: 'workshifts',loadChildren: () =>  import('./work-shifts-management/work-shifts-management.module').then(module => module.WorkShiftsManagementModule)},
  {path:'**',redirectTo:'not-found',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
