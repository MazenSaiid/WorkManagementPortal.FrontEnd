import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { TimeTrackerComponent } from './Components/time-tracker/time-tracker.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DeleteConfirmationModalComponent } from './Components/delete-confirmation-modal/delete-confirmation-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OverviewComponent } from './Components/overview/overview.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    LoaderComponent,
    SideBarComponent,
    TimeTrackerComponent,
    DeleteConfirmationModalComponent,
    OverviewComponent,
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
    CanvasJSAngularChartsModule,
    NgxSpinnerModule,
  
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastrModule,
    RouterModule,
    CanvasJSAngularChartsModule,
    NgxSpinnerModule,

    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    LoaderComponent,
    SideBarComponent,
    TimeTrackerComponent,
    DeleteConfirmationModalComponent,
  ],
})
export class CoreModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
