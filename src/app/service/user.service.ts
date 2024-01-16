import { EventEmitter, Injectable, Output } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { user } from '../class/user';
import { BehaviorSubject, Observable, Subject, from, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl='https://localhost:7132/Services';
    private ApiComment='https://localhost:7132/Binh_Luan';
    private privateKey='testwebtruyentranhangularvsaspapi';
    public JWTCookie='JwtToken';
    public UserCookie='User';
    public user: user;
    @Output() getLoggedInName: EventEmitter<boolean> = new EventEmitter();
    constructor(private cookie: CookieService, private http: HttpClient, private router: Router){
        this.user=new user();
    }

    encrypt( data: string){
        const Encrypt = CryptoJS.AES.encrypt(data, this.privateKey).toString();
        return Encrypt;
    }
    decrypt( data:string ){
        const Decrypt = CryptoJS.AES.decrypt(data, this.privateKey).toString(CryptoJS.enc.Utf8);
        return Decrypt;
    }
    Getcookie(cookie: string){
        const value=this.decrypt(this.cookie.get(cookie));
        return value;
    }
    async DeleteCookie(){
        await this.cookie.deleteAll(); 
        this.user.updateUserInfo('','','','','');
      return true;
    }
    GetUserCookie(){
        const cookiedata=this.Getcookie(this.UserCookie);
        //Kiểm tra cookie có null không và length của nó
        if(cookiedata !== null && cookiedata.length>0 ){
        const cookievalue= JSON.parse(cookiedata);
            if(cookievalue!=null){
                this.user._Id = cookievalue.id;
                this.user._Avatar = cookievalue.avatar;
                this.user._Name = cookievalue.name;
                this.user._Email = cookievalue.email;
                this.user._PhoneNumber = cookievalue.phoneNumber;
            }
            return this.user;
        }
        return this.user;
    }
    Canactive(){
      if(this.user._Id.length> 0){
        return true;
      }
      return this.router.navigate(['/Login']);
    }
    getNotification(id: string){
      const  url= `${this.apiUrl}/DanhSachThongBaoChuaXem/${id}`;
      return this.http.get(url);
    }
    danhSachTruyenTheoDoi(id: string){
      const url= `${this.apiUrl}/DanhsachTheoDoi/${id}`;
      return this.http.get(url);
    }
    async taoTheoDoiTruyen(IdUser: string, IdManga: string){
      const url= `${this.apiUrl}/TheoDoiTruyen`;
      const fromdata= new FormData();
      fromdata.append('IdUser',IdUser);
      fromdata.append('IdManga',IdManga);
      try{
        const respone= this.http.post(url,fromdata);
        const data: any= await lastValueFrom(respone);
        if(data && data.status==='Success'){
          return true;
        }
        return false;
      }catch(error){
        return false;
      }
    }
    async huyTheoDoitruyen(IdUser: string, IdManga: string){
      const url= `${this.apiUrl}/HuyTheoDoi/${IdUser}/${IdManga}`;
      try{
        const respone= this.http.delete(url);
        const data: any= await lastValueFrom(respone);
        console.log('data');
        console.log(data);
        if(data && data.status==='Success'){
          return true;
        }
        return false;
      }catch(error){
        return false;
      }
    }
    async daXemthongbao(idNotification: string){
      const url= `${this.apiUrl}/SeenNotification`;
      try{
        const fromdata= new FormData();
        fromdata.append('idNotification',idNotification);
        this.http.post(url, fromdata).subscribe((res: any)=>{
          return res;
        })
        return true;
      }catch(error){
        return false;
      }
    }

    getReportedComments(): Observable<any[]> {
      return this.http.get<any[]>(`${this.ApiComment}/GetReportedComments`);
    }

    getReportedRepComments(): Observable<any[]> {
      return this.http.get<any[]>(`${this.ApiComment}/GetReportedRepComments`);
    }

    hideCommentContent(commentId: string): Observable<any> {
      const url = `${this.ApiComment}/HideCommentContent?commentId=${commentId}`;
      return this.http.post(url, null,{ observe: 'response' }); 
    }

    hideRepCommentContent(IdReply: string): Observable<any> {
      const url = `${this.ApiComment}/HideRepCommentContent?commentId=${IdReply}`;
      return this.http.post(url, null,{ observe: 'response' }); 
    }

    deleteReported(commentId: string): Observable<any> {
      const url = `${this.ApiComment}/DeleteReport?commentId=${commentId}`;
      return this.http.post(url, null,{ observe: 'response' }); 
    }

    deleteReportedRep(IdReply: string): Observable<any> {
      const url = `${this.ApiComment}/DeleteReportRep?commentId=${IdReply}`;
      return this.http.post(url, null,{ observe: 'response' }); 
    }

}
@Injectable({
  providedIn: 'root'
})
export class isLogin{
  private datasubject= new BehaviorSubject<boolean>(false);
  public data$= this.datasubject.asObservable();

  constructor(){}

  senddata(data: boolean){
      this.datasubject.next(data);
  }
}
@Injectable({
  providedIn: 'root'
})
export class isUser{
  private datasubject= new Subject<user>();
  public data$= this.datasubject.asObservable();
  constructor(){}

  senddata(data: user){
      this.datasubject.next(data);
  }
}

