import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllScreenshotsComponent } from './Components/all-screenshots/all-screenshots.component';
import { UserScreenshotsComponent } from './Components/user-screenshots/user-screenshots.component';

const routes: Routes = [
  {path:'all',component:AllScreenshotsComponent},
  {path: 'user',component:UserScreenshotsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreenshotsRoutingModule { }
