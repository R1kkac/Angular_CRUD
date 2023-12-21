import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/class/user';
import { UserService, isLogin } from 'src/app/service/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit,OnChanges {
  
  datalist: any[]=[];
  message: any='';
  isShowmessage=false;
  data: any;
  @Input() isLogin!: boolean;
  @Input() user!: user;
  constructor(private userService: UserService, private router: Router){}
  ngOnInit(): void {
    // if(this.isLogin){
    //   this.getNotification(this.user._Id);
    // }
  }
  //Onchan là sự kiện dùng để bắt khi có thay đổi đầu ra và đầu vào ở component này dùng để bắt xem đối tượng có login hay không,
  //nếu có {isLogin=true} thì thực hiện gọi thông báo bên api còn {isLogin=false} thì không làm
  ngOnChanges(changes: SimpleChanges) {
    if(changes['user'] !== undefined)
      this.user=changes['user'].currentValue;
    if(changes['isLogin'] !== undefined)
    {
      this.isLogin=changes['isLogin'].currentValue;
      if(this.isLogin){
        this.getNotification(this.user._Id);
      }else if(this.isLogin===false){
        this.message='';
      }
    }
  }
  getNotification(id: string){
    this.userService.getNotification(id).subscribe((res:any)=>{
      this.data=res;
      this.message= this.data.length;
      // console.error('Vào geNotification');
    })
  }
  listMessage(){
    if(this.isShowmessage===false)
    {
      this.datalist= this.data;
      this.isShowmessage=true;
    }
    else if(this.isShowmessage===true){
      this.datalist=[];
      this.isShowmessage=false;
    }
  }
  async showmessage(data: string, idNotification: string){
    await this.userService.daXemthongbao(idNotification);
    this.router.navigate(['/Manga',data]);
  }
   

}
