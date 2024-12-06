import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { TimeTrackerComponent } from './Components/time-tracker/time-tracker.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DeleteConfirmationModalComponent } from './Components/delete-confirmation-modal/delete-confirmation-modal.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OverviewComponent } from './Components/overview/overview.component';
import { CheckoutConfirmationModalComponent } from './Components/checkout-confirmation-modal/checkout-confirmation-modal.component';
import { CoreRoutingModule } from './core.routing.module';
import { LoginComponent } from './Components/login/login.component';
import { MyTeamComponent } from './Components/my-team/my-team.component';
import { MyWorkComponent } from './Components/my-work/my-work.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    SideBarComponent,
    TimeTrackerComponent,
    DeleteConfirmationModalComponent,
    OverviewComponent,
    CheckoutConfirmationModalComponent,
    LoginComponent,
    MyTeamComponent,
    MyWorkComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true, // Temporarily remove preventDuplicates
      closeButton: true,
      tapToDismiss: true,
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    RouterModule,
    NgxSpinnerModule,
    CoreRoutingModule
  
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastrModule,
    RouterModule,
    NgxSpinnerModule,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    SideBarComponent,
    TimeTrackerComponent,
    DeleteConfirmationModalComponent,
  ],
})
export class CoreModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
