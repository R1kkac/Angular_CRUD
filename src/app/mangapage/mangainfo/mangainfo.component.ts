import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MangaClass } from 'src/app/class/manga';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-mangainfo',
  templateUrl: './mangainfo.component.html',
  styleUrls: ['./mangainfo.component.scss']
})
export class MangainfoComponent implements OnInit{

  @Input() manga!: MangaClass;
  iduser: any;
  imdbRating='8.1';
  icon='https://img.icons8.com/?size=512&id=8ggStxqyboK5&format=png';
  Rated='9';
  Year='11-11-2019';
  Runtime='Ongoing';
  Genre='Mistery,Action,Horror,Comedy,Padory';
  Genre1: string[]=this.Genre.split(",");
  Actors='Chưa có thông tin';
  
  constructor(private userService: UserService, private toastr: ToastrService){  }
  ngOnInit(): void {
    const user: any= this.userService.GetUserCookie();
    this.iduser= user['id'];
  }

  async theoDoiTruyen(mangaid: string){
    const result= await this.userService.taoTheoDoiTruyen(this.iduser, mangaid);
    if(result){
      this.toastr.success('Đã theo dõi truyện');
    }else{
      this.toastr.error('Đã xảy ra lỗi');
    }
  }
}
