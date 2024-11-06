import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    LoaderComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule,TranslateModule,ToastrModule,FormsModule,
    RouterModule
  ],
  exports:[
    FormsModule,ReactiveFormsModule,LoaderComponent,TranslateModule,ToastrModule,
    RouterModule,CommonModule,HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    LoaderComponent,
    SideBarComponent
  ]
})
export class CoreModule { }
