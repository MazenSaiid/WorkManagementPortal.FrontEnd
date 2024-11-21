import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS,  } from '@angular/common/http';
import { ErrorInterceptor } from './core/Interceptors/error-interceptor';
import { LoadingInterceptor } from './core/Interceptors/loader-interceptor';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/Interceptors/auth-interceptor';
import { UserManagementModule } from './user-management/user-management.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleManagementModule } from './role-management/role-management.module';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,HttpClientModule,BrowserAnimationsModule,UserManagementModule, AppRoutingModule, CoreModule,RoleManagementModule],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
