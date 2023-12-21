import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/class/user';
import { UserService, isLogin, isUser } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent{
  @Input() user!:user;
  constructor(private userService: UserService, private router: Router, private Login: isLogin, private isUser: isUser){}

  
  async Logout(){
    var result=await this.userService.DeleteCookie();
    if(result==true){
      this.Login.senddata(false);
      this.router.navigate([''])
    }
  }
  UserInfo(){
    this.isUser.senddata(this.user);
    this.router.navigate(['/UserInfo',this.user._Id]);
  }
  Following(){
    this.router.navigate(['/truyen-theo-doi']);
  }
}
