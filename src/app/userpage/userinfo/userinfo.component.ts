import { Component, OnInit } from '@angular/core';
import { UserService, isUser } from '../../service/user.service';
import { user } from '../../class/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit{

  user: any;
  isUpdate= false;
  avatar: any |'';
  constructor(private authService: AuthService, private route: ActivatedRoute){
    this.user='';
  }
  ngOnInit(): void {
    this.route.params.subscribe((res: any)=>{
        let iduser= res['userid'];
        this.authService.getUserInfo(iduser).subscribe((res: any)=>{
          this.user= res;
          this.avatar=this.user.avatar;
        })
    })
  }
  updateInfo(){
    if(this.isUpdate===false){
      this.isUpdate=true;
    }else{
      this.isUpdate=false
    }
  }
}
