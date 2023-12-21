import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { Register } from 'src/app/class/register';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    userRegister: Register;
    Avatar:any;
    constructor(private builder: FormBuilder, private toastr: ToastrService, private service: AuthService, private router: Router){
      this.userRegister=new Register();
    }
    registerForm= this.builder.group({
      username: this.builder.control('', Validators.required),
      password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('')])),
      // /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
      phonenumber: this.builder.control(''),
      nameview: this.builder.control('', Validators.required),
    })

    async ProcessRegister(){
      if(this.registerForm.valid)
      {
        this.userRegister = new Register(
          this.registerForm.value.username || '',
          this.registerForm.value.password || '',
          this.registerForm.value.email || '',
          this.registerForm.value.phonenumber || '',
          this.registerForm.value.nameview || ''
        );
        const result: any= await this.service.Register(this.userRegister,  this.Avatar);
        if(result.status==='Success'){
          this.toastr.success(result.status+': '+result.message);
          this.router.navigate(['']);
        }
        else if(result.status==='Failed'){
          this.toastr.error(result.status+': '+result.message);
        }
      }else{
        this.toastr.warning('Hãy nhập đầy dủ các thông tin');
      }
    }
    // Xử lý sự kiện thay đổi trường input type="file"
selectFile(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];

      this.Avatar = selectedFile;
    }
  }
}
