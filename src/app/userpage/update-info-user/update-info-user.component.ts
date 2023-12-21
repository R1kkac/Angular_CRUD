import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import { updateUser } from 'src/app/class/updateuser';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-update-info-user',
  templateUrl: './update-info-user.component.html',
  styleUrls: ['./update-info-user.component.scss']
})
export class UpdateInfoUserComponent {
  
  @Input() user: any;
  Avatar: any;
  constructor(private builder: FormBuilder, private toastr: ToastrService,private authService: AuthService){}
  fromdata= this.builder.group({
    oldpassword: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('')])),
    newpassword: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('')])),
    phonenumber: this.builder.control(''),
    nameview: this.builder.control('', Validators.required),
  })
  async updateInfo(){
    console.log(this.user);
    if(this.fromdata.valid)
    {
      const userUpdate = new updateUser();
      userUpdate.newUpdateUser(
        this.user.email,
        this.fromdata.value.oldpassword || '',
        this.fromdata.value.newpassword || '',
        this.fromdata.value.phonenumber || '',
        '',
        this.fromdata.value.nameview || '',
      );
      //Đã truyền qua nhưng phải sửa hàm update bên api do chưa update avatar
      const result: any= await this.authService.updateUser(userUpdate,  this.Avatar);
      if(result.status==='Success'){
        this.toastr.success(result.status+': '+result.message);
      }
      else if(result.status==='Failed'){
        this.toastr.error(result.status+': '+result.message);
      }
    }else{
      this.toastr.warning('Hãy nhập đầy dủ các thông tin');
    }
  }
  selectFile(event: any){
    const fileinput= event.target;
    if(fileinput.files && fileinput.files.length> 0){
      const selectedFile= fileinput.files[0];
      this.Avatar= selectedFile;
    }
  }

}
