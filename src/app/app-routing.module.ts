import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserinfoComponent } from './userpage/userinfo/userinfo.component';
import { LoginComponent } from './userpage/login/login.component';
import { MangaComponent } from './mangapage/manga/manga.component';
import { RegisterComponent } from './userpage/register/register.component';
import { UserComponent } from './userpage/user/user.component';
import { ViewchapterComponent } from './mangapage/viewchapter/viewchapter.component';
import { authGuard } from './guard/auth.guard';
import { UserfollowingComponent } from './userpage/userfollowing/userfollowing.component';
import { MangasComponent } from './mainpage/mangas/mangas.component';
import { ListchapterComponent } from './mainpage/listchapter/listchapter.component';
import { CategorysComponent } from './mainpage/categorys/categorys.component';
import { HomeComponent } from './mainpage/home/home.component';
import { ListuserComponent } from './mainpage/listuser/listuser.component';
import { MangadeleteComponent } from './mainpage/mangadelete/mangadelete.component';

const routes: Routes = [
  { path: '' , component : HomeComponent, canActivate:[authGuard]},
  { path: 'Home' , component : HomeComponent, canActivate:[authGuard]},
  { path: 'Login' , component : LoginComponent},
  { path: 'Register' , component : RegisterComponent},
  { path: 'Manga' , component : MangaComponent},
  { path: 'User' , component : UserComponent},
  { path: 'UserInfo/:userid' , component : UserinfoComponent},
  { path: 'Manga/:mangaid' , component : MangaComponent},
  { path: ':mangaid/:chapterid/:chaptername' , component : ViewchapterComponent},
  { path: 'truyen-theo-doi' , component : UserfollowingComponent, canActivate:[authGuard]},
  { path: 'Mangas' , component : MangasComponent, canActivate:[authGuard]},
  { path: 'chapters/:mangaId' , component : ListchapterComponent},
  { path: 'Categorys' , component : CategorysComponent, canActivate:[authGuard]},
  { path: 'Users' , component : ListuserComponent, canActivate:[authGuard]},
  { path: 'Trash' , component : MangadeleteComponent, canActivate:[authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
