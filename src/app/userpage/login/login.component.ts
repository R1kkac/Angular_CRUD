import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isLogin } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { loginUser } from 'src/app/class/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userlogin: loginUser;
  userName='';
  
  constructor(private service: AuthService, private builder: FormBuilder, private router: Router, private toastr: ToastrService,
    private route: ActivatedRoute, private isLogin: isLogin){
    this.userlogin= new loginUser();
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
      if(result==true){
        this.toastr.success('Đăng nhập thành công');
        this.isLogin.senddata(true);
        this.router.navigate([''])
      }else{
        this.toastr.error('Đăng nhập thất bại');
      }
    }
    else{
      this.toastr.warning('Chưa điền dủ thông tin');
    }
  }
}
