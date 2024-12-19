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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DeleteConfirmationModalComponent } from './Components/delete-confirmation-modal/delete-confirmation-modal.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CheckoutConfirmationModalComponent } from './Components/checkout-confirmation-modal/checkout-confirmation-modal.component';
import { CoreRoutingModule } from './core.routing.module';
import { LoginComponent } from './Components/login/login.component';



@NgModule({ 
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    SideBarComponent,
    DeleteConfirmationModalComponent,
    CheckoutConfirmationModalComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    NgxSpinnerModule,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    SideBarComponent,
    DeleteConfirmationModalComponent,
  ],
})
export class CoreModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
