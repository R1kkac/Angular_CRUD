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
import { AddeditformComponent } from './mainpage/addeditform/addeditform.component';
import { ChapterformComponent } from './mainpage/chapterform/chapterform.component';
import { ImagesorterComponent } from './mainpage/imagesorter/imagesorter.component';
import { ListtypeComponent } from './mainpage/listtype/listtype.component';
import { ListartistComponent } from './mainpage/artist/listartist/listartist.component';
import { ListauthorComponent } from './mainpage/author/listauthor/listauthor.component';
import { CommentReportsComponent } from './mainpage/comment-reports/comment-reports.component';

const routes: Routes = [
  { path: '' , component : HomeComponent, canActivate:[authGuard]},
  { path: 'Home' , component : HomeComponent, canActivate:[authGuard]},
  { path: 'Login' , component : LoginComponent},
  { path: 'Register' , component : RegisterComponent},
  { path: 'Manga' , component : MangaComponent},
  { path: 'User' , component : UserComponent},
  { path: 'UserInfo/:userid' , component : UserinfoComponent},
  { path: 'Manga/:mangaid' , component : MangaComponent},
  { path: 'truyen-theo-doi' , component : UserfollowingComponent, canActivate:[authGuard]},
  { path: 'Mangas' , component : MangasComponent, canActivate:[authGuard]},
  { path: 'chapters/:mangaId' , component : ListchapterComponent},
  { path: 'Categorys' , component : CategorysComponent, canActivate:[authGuard]},
  { path: 'Artist' , component : ListartistComponent, canActivate:[authGuard]},
  { path: 'Author' , component : ListauthorComponent, canActivate:[authGuard]},
  { path: 'Types' , component : ListtypeComponent, canActivate:[authGuard]},
  { path: 'Users' , component : ListuserComponent, canActivate:[authGuard]},
  { path: 'Comment' , component : CommentReportsComponent, canActivate:[authGuard]},
  { path: 'Trash' , component : MangadeleteComponent, canActivate:[authGuard]},
  { path: 'Add-manga' , component : AddeditformComponent, canActivate:[authGuard]},
  { path: 'Edit-manga/:mangaId' , component : AddeditformComponent, canActivate:[authGuard]},
  { path: 'List-chapter/:mangaId' , component : ListchapterComponent, canActivate:[authGuard]},
  { path: 'Add-chapter' , component : ChapterformComponent, canActivate:[authGuard]},
  { path: 'Edit-chapter' , component : ChapterformComponent, canActivate:[authGuard]},
  { path: 'image-sorter/:mangaId/:chapterId' , component : ImagesorterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
