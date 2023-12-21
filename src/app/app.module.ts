import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModulo } from 'src/material.modulo';
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { ToastrModule } from 'ngx-toastr';
import { MangaComponent } from './mangapage/manga/manga.component';
import { UserComponent } from './userpage/user/user.component';
import { LoginComponent } from './userpage/login/login.component';
import { RegisterComponent } from './userpage/register/register.component';
import { HeaderComponent } from './mainpage/header/header.component';
import { UserinfoComponent } from './userpage/userinfo/userinfo.component';
import { CarouselComponent } from './mainpage/carousel/carousel.component';
import { MangainfoComponent } from './mangapage/mangainfo/mangainfo.component';
import { ListchapterComponent } from './mangapage/listchapter/listchapter.component';
import { ViewchapterComponent } from './mangapage/viewchapter/viewchapter.component';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { SearbarV2Component } from './mainpage/searbar-v2/searbar-v2.component';
import { MessageComponent } from './mainpage/message/message.component';
import { UpdateInfoUserComponent } from './userpage/update-info-user/update-info-user.component';
import { UserfollowingComponent } from './userpage/userfollowing/userfollowing.component';
import { ListmangaComponent } from './mainpage/listmanga/listmanga.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AddeditformComponent } from './mainpage/addeditform/addeditform.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmComponent } from './mainpage/confirm/confirm.component';
import { ChapterformComponent } from './mainpage/chapterform/chapterform.component';
import { CategorysComponent } from './mainpage/categorys/categorys.component';
import { CategoryformComponent } from './mainpage/categoryform/categoryform.component';
import { HomeComponent } from './mainpage/home/home.component';
import { FooterComponent } from './mainpage/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    MangaComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    UserinfoComponent,
    CarouselComponent,
    MangainfoComponent,
    ListchapterComponent,
    ViewchapterComponent,
    SearbarV2Component,
    MessageComponent,
    UpdateInfoUserComponent,
    UserfollowingComponent,
    ListmangaComponent,
    AddeditformComponent,
    ConfirmComponent,
    ChapterformComponent,
    CategorysComponent,
    CategoryformComponent,
    HomeComponent,
    FooterComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModulo,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: 'decreasing',
      timeOut: 3000,
      extendedTimeOut: 1000,
      disableTimeOut: false,
      tapToDismiss: true,
      closeButton: true,
    }),
    NgFor,
    AsyncPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}