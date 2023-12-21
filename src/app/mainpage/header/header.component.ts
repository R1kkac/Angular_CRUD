import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { user } from 'src/app/class/user';
import { UserService, isLogin } from 'src/app/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  // Flag để kiểm tra xem ở đúng Component không
  isIconVisible: boolean = false;
  user: user;
  isLogin=false;
  isPersonalManga: boolean = false;

  constructor(private userService: UserService, private router: Router, private login: isLogin, private route: ActivatedRoute){
    this.user= new user();
  }
  ngOnInit(): void {
    //Dùng BehaviorSubject trong hàm isLogin để đồng bộ login giữa component login và header này {default: false}
    this.login.data$.subscribe((res :boolean)=>{
      this.isLogin=res;
      //Lấy user từ cookie user nếu có dữ liệu thì chuyển cờ thành true
      this.user= this.userService.GetUserCookie();
      if( this.user._Id.length>0){
        this.isLogin=true;
        this.isPersonalManga = true;
      } else {
        this.isPersonalManga = false;
      }
    })
    this.route.url.subscribe((segments) => {
      if (segments && segments.length > 0){
        // Kiểm tra xem page hiện tại có phải đang trong Mangas hay không
        if (segments[0].path === 'Mangas') {
          this.isIconVisible = true;
          // Thực hiện các hành động cụ thể khi ở trong component cụ thể
        }
      }
    });
  }
  Login(){
      this.router.navigate(['/Login']);
  }

  
}
