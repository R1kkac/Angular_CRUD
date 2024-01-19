import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../class/register';
import { loginUser } from '../class/login';
import { CookieService } from 'ngx-cookie-service'
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { message } from '../class/message';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { UserInfo } from '../class/userInfo.model';
import { RoleView } from '../class/Role-View.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  message: message;
  isLogin= false;
  constructor(private http: HttpClient,private CookieService: CookieService, private userUservice: UserService) {
    this.message=new message();
   }


  apiUrl='https://localhost:7132/Authentication';
  // apiUrl='https://yahallo.azurewebsites.net/Authentication';
  
  // apiUrl='http://haileds119067-001-site1.etempurl.com';
  

   // Trạng thái đăng nhập của người dùng
  isLoggedIn = false;
    //Lấy danh sách User
    GetAllUser(){
      const url= `${this.apiUrl}/GetAllUser`;
      return this.http.get(url);
    }
  // GetAllUser(){
  //   const url= `${this.apiUrl}/ListUser`;
  //   return this.http.get(url);
  // }
  //Đăng ký
  async Register( UserData: Register, avatar: File){
    const url= `${this.apiUrl}/Register`;
    const formData = new FormData();
    const userDataString = JSON.stringify(UserData);
    formData.append('User', userDataString);
    formData.append('Avatar', avatar);
     try{
      const post = this.http.post(url , formData);
      const result:any = await lastValueFrom(post);
      //Khi thành công thì chỉ trả về result{ status, message}
      if (result != null) {
        if(result && result.status==='Success'){
          this.message= result;
          return this.message;
        }
      }  
    }catch(error:any){
      //Bắt lỗi đăng ký thất bại {status=0 không kết nối được máy chủ, status=400 do máy chủ trả về khi đăng ký thất bại}
      if (error instanceof HttpErrorResponse) {
        if(error.status===0){
          this.message._status= 'Failed';
          this.message._message='Lỗi khi không kết nối được đến máy chủ';
          return this.message;
        }
        this.message= error.error;
        return this.message;
      }
    }
    return this.message;
  }
  //Đăng nhập
  async Login(User : loginUser){
    const url= `${this.apiUrl}/Login`;
    try {
      //dùng lastvalueForm thay cho promise để đảm bảo có trả về dữ liệu không phải undefined.
      const post = this.http.post(url, User);
      const result:any = await lastValueFrom(post);
      if (result != null) {
        this.CookieService.set(this.userUservice.JWTCookie, this.userUservice.encrypt(result.token), 7); // Tạo cookie với dữ liệu mã hóa
        this.CookieService.set(this.userUservice.UserCookie, this.userUservice.encrypt(JSON.stringify(result.userdata)), 7); // Tạo cookie với dữ liệu mã hóa
        this.isLoggedIn = true;
        return true;
         
      }
    }catch(error) {
      return false;
    }
    return false;
  }


  getUserInfo(iduser: string): Observable<UserInfo> {
    const url = `${this.apiUrl}/Infouser/${iduser}`;
    return this.http.get<UserInfo>(url);
  }
  // getUserInfo(iduser: string){
  //   const url= `${this.apiUrl}/Infouser/${iduser}`;
  //   return this.http.get(url);
  // }
  
  async updateUser(user: any, image: File){
    const url= `${this.apiUrl}/EditUser`;
    try{
      const fromdata= new FormData();
      const userDataString = JSON.stringify(user);
      fromdata.append('User',userDataString);
      fromdata.append('Avatar',image);
      const request= this.http.put(url,fromdata);
      const result: any= await lastValueFrom(request);
      if (result != null) {
        if(result && result.status==='Success'){
        }
      }  
    }catch(error: any){
      if (error instanceof HttpErrorResponse) {
        if(error.status===0){
          this.message._status= 'Failed';
          this.message._message='Lỗi khi không kết nối được đến máy chủ';
          return this.message;
        }
        this.message= error.error;
        return this.message;
      }
    }
    return this.message;
  }
  //Lấy danh sách role
  getRolesList(): Observable<RoleView[]> {
    return this.http.get<RoleView[]>(`${this.apiUrl}/ListRole`);
  }
  //Lấy Role user
  getUserRoles(userId: string): Observable<RoleView[]> {
    const url = `${this.apiUrl}/userroles/${userId}`;
    return this.http.get<RoleView[]>(url);
  }
  //thêm role cho user
  addRoleToUser(idUser: string, role: string): Observable<any> {
    const url = `${this.apiUrl}/AddRoleUser`;
    const formData: FormData = new FormData();
    formData.append('idUser', idUser);
    formData.append('role', role);
    return this.http.post(url, formData);
  }
  //xóa role user
  deleteRoleFromUser(idUser: string, role: string): Observable<any> {
    const url = `${this.apiUrl}/DeleteRole?idUser=${encodeURIComponent(idUser)}&role=${encodeURIComponent(role)}`;
    return this.http.delete(url);
  }
  //Khóa tài khoản
  lockUserAccount(userId: string, daysToLock: number): Observable<any> {
    const url = `${this.apiUrl}/LockUserAccount`;
    const data = { userId, daysToLock };
    return this.http.post(url, data);
  }
  //Số lượng người dùng
  getNumberAllUser(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/number_all_user`);
  }


}