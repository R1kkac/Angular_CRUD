import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { user } from 'src/app/class/user';
import { UserInfo } from 'src/app/class/userInfo.model';
import { AuthService } from 'src/app/service/auth.service';
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
  hasNewReports: boolean = false;
  isAdmin: boolean = false;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService,
    private login: isLogin, private route: ActivatedRoute,private authService: AuthService){
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
        this.authService.getUserInfo(this.user._Id).subscribe((userInfo: UserInfo) => {
          this.isAdmin = userInfo.role.includes('Admin');
        });
      } else {
        this.isPersonalManga = false;
      }
      
    });
    
    

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

  navigateIfAdmin(path: string, adminPath?: string) {
    if (this.isAdmin) {
        this.router.navigate([adminPath || path]);
    } else {
        this.toastr.error('Chỉ có Admin mới có quyền truy cập trang này', 'Lỗi');
    }
}


  checkAndNavigateUser() {
    this.navigateIfAdmin('/Users');
}

checkAndNavigateUser2() {
  this.authService.getUserInfo(this.user._Id).subscribe((userInfo: UserInfo) => {
    if (userInfo.role.includes('Admin')) {
      this.router.navigate(['/Trash'], { queryParams: { isAdmin: true } });
    } else {
      this.router.navigate(['/Trash']);
    }
  }, error => {
    console.error('Lỗi khi lấy thông tin người dùng: ', error);
  });
}

checkAndNavigateUser3() {
  this.navigateIfAdmin('/Mangas');
}
  
checkAndNavigateUser4() {
  this.navigateIfAdmin('/Comment');
}

checkAndNavigateUser5() {
  this.navigateIfAdmin('/Categorys');
}

checkAndNavigateUser6() {
  this.navigateIfAdmin('/Types');
}

checkAndNavigateUser7() {
  this.navigateIfAdmin('/Author');
}

checkAndNavigateUser8() {
  this.navigateIfAdmin('/Artist');
}

}
