import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService, isLogin } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { loginUser } from 'src/app/class/login';
import { user } from 'src/app/class/user';
import { UserInfo } from 'src/app/class/userInfo.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userlogin: loginUser;
  userName='';
  user: user;
  
  constructor(private service: AuthService, private builder: FormBuilder, private router: Router, private toastr: ToastrService,
    private route: ActivatedRoute, private isLogin: isLogin,private userService: UserService){
    this.userlogin= new loginUser();
    this.user= new user();
  }
  formLogin= this.builder.group({
    UserName: this.builder.control('', Validators.required),
    Password: this.builder.control('', Validators.required),
  })
  async ProcessLogin(){
    if(this.formLogin.valid){
      this.userlogin= new loginUser(
        this.formLogin.value.UserName || '',
        this.formLogin.value.Password || '',
      );
      const result=await this.service.Login(this.userlogin);
      this.user= this.userService.GetUserCookie();
      this.service.getUserInfo(this.user._Id).subscribe((userInfo: UserInfo) => {
        if (userInfo.role.includes('Admin') || userInfo.role.includes('Upload')) {
          if(result==true){
            this.toastr.success('Đăng nhập thành công');
            this.isLogin.senddata(true);
            this.router.navigate([''])
          }else{
            this.toastr.error('Đăng nhập thất bại');
          }
        } else {
          // alert('Chỉ có Uploader hoặc Admin mới có quyền truy cập trang này.');
          this.toastr.error('Chỉ có Admin hoặc Uploader mới có quyền truy cập trang này', 'Đăng Nhập Thất Bại');
        }
      }, error => {
        this.toastr.error('Đăng nhập thất bại');
        console.error('Lỗi khi lấy thông tin người dùng: ', error);
      });
    }
    else{
      this.toastr.warning('Chưa điền dủ thông tin');
    }
  }
}
