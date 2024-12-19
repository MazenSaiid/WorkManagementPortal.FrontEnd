import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenshotsRoutingModule } from './screenshots-routing.module';
import { CoreModule } from '../core/core.module';
import { AllScreenshotsComponent } from './Components/all-screenshots/all-screenshots.component';
import { UserScreenshotsComponent } from './Components/user-screenshots/user-screenshots.component';


@NgModule({
  declarations: [
    AllScreenshotsComponent,
    UserScreenshotsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ScreenshotsRoutingModule
  ]
})
export class ScreenshotsModule { }
