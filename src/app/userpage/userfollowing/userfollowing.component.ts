import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-userfollowing',
  templateUrl: './userfollowing.component.html',
  styleUrls: ['./userfollowing.component.scss']
})
export class UserfollowingComponent implements OnInit{

  danhsachtruyen: any;
  iduser: string ='';
  constructor(private userService: UserService, private toastr: ToastrService){
  }
  ngOnInit(): void {
    this.iduser = this.userService.GetUserCookie()._Id;
    this.userService.danhSachTruyenTheoDoi(this.iduser).subscribe((res: any)=>{
      this.danhsachtruyen= res;
      if(this.danhsachtruyen.length<0){
        this.toastr.warning('Bạn không theo dõi truyện nào');
      }
    })
  }
  async huyTheodoi(idmanga: string){
    const result= await this.userService.huyTheoDoitruyen(this.iduser, idmanga);
    if(result){
      this.toastr.success('Đã hủy theo dõi truyện');
      setTimeout(()=>{                           // <<<---using ()=> syntax
        window.location.reload();
      }, 1500);   
    }else{
      this.toastr.error('Đã xảy ra lỗi');
    }
  }
}
