import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { message } from '../class/message';
import { Observable, Subject, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MangaClass } from '../class/manga';
import { ChapterView } from '../class/ChapterView';
import { Category, CategoryView } from '../class/CategoryView.model';
import { TypeManga } from '../class/TypeMangaView.model';



@Injectable({
  providedIn: 'root'
})
export class MangaService {
  message: message;
  constructor(private http: HttpClient,private CookieService: CookieService, private userUservice: UserService,
    private search: Searchmanga,private sanitizer: DomSanitizer) { 
        this.message=new message();
  }
  apiUrl='https://localhost:7132/Truyen-tranh';


  //Lấy toàn bộ danh sách manga
  GetAllManga(){
    const url= `${this.apiUrl}/GetAllManga`;
    return this.http.get(url);
  }
   //Lấy toàn bộ danh sách manga {40 Manga 1 page}
  GetManga(page: number){
    const url=`${this.apiUrl}/GetAllManga/${page}`;
    return this.http.get(url);
  }
  //Lấy toàn bộ manga theo User
  GetUserManga(){
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    const url= `${this.apiUrl}/GetAllUserManga`;
    return this.http.get(url,httpOptions);
  }
  //Kiểm tra tên trùng
  checkMangaNameExists(mangaName: string): Observable<boolean> {
    return this.http.get<string[]>(`${this.apiUrl}/GetAllNameManga`).pipe(
      map((names) => names.includes(mangaName))
    );
  }
  //Lấy danh sách ảnh của một chương truyện
  getListChapter(idManga: string): Observable<ChapterView[]> {
    const url = `${this.apiUrl}/${idManga}/GetChapter`;
    return this.http.get<ChapterView[]>(url);
  }

  async getDsImage(mangaid: string, chapterid: string){
    var listImage: SafeUrl[]=[];
    const url= `${this.apiUrl}/${mangaid}/${chapterid}/getDsImage`;
    try{
      const data= this.http.get(url);
      const result: any = await lastValueFrom(data);
      result.forEach((item:any )=>{
        this.createBloburl(item).subscribe((res: any)=>{
          let url: any=  URL.createObjectURL(res);
          listImage.push(this.sanitizer.bypassSecurityTrustUrl(url)); 
        })
      })
      return listImage;
    }catch(error: any){
      if(error instanceof HttpErrorResponse && error.error===0){
        this.message.status='Failed';
        this.message.message='Không thể tải nội dung truyện';
        return this.message;
      }
      return error.message;
    }
  }
  //Tạo blob url cho image
  createBloburl(url: string): Observable<Blob>{
    return this.http.get(url, {
      responseType: "blob"
    })
  }
  //Search theo kiểu tài một danh sách truyện đến web client rồi dùng nó đề autocomplete {dữ liệu lớn hàng chục ngàn bộ truyện sẽ nặng}
  async searchmanga(){
    const url= this.apiUrl+'/SearchManga';
    const result= this.http.get(url);
    const data: any=await lastValueFrom(result);
    this.search.senddata(data);
  }
  //Search theo kiểu bắt sự kiện input trong thẻ và gửi request đến api để nhận các giá trị trả về tương ứng
  async searchmangaV2(value: string){
    const url= `https://localhost:7132/Truyen-tranh/SearchMangaV2/${value}`;
    try{
      var result = this.http.get(url);
      var data: any= await lastValueFrom(result);
      return data;
    }catch(error){
    }
  }
  //Lấy thông tin chi tiết của một bộ truyện
  async Getinfomanga(mangaid: string){
    const url= `${this.apiUrl}/Details/${mangaid}`;
    const result= this.http.get(url);
    const data: any= await lastValueFrom(result);
    return data;
  }

  //Lấy danh sách thể loại
  getGenresList(): Observable<CategoryView[]> {
    return this.http.get<CategoryView[]>(`${this.apiUrl}/Category/Getall`);
  }

  //Lấy tất cả TypeManga
  GetAllType(): Observable<TypeManga[]> {
    const url = `${this.apiUrl}/GetAllType`;
    return this.http.get<TypeManga[]>(url);
  }

  //Tạo truyện
  async createManga(mangaData: FormData): Promise<any> {
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    try {
      return await this.http.post(`${this.apiUrl}/Create`, mangaData, httpOptions).toPromise();
    } catch (error) {
      // Xử lý lỗi ở đây
      console.error('Error occurred while creating manga', error);
      throw error; // Hoặc xử lý lỗi theo cách khác
    }
  }

   //Xóa truyện
  deleteManga(mangaId: string): Observable<any> {
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.apiUrl}/Delete/${mangaId}`, httpOptions);
  }
  
  //Sửa truyện
    async updateManga(mangaId: string, mangaData: FormData): Promise<any> {
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'text' as 'json'
    };

    try {
      return await this.http.put(`${this.apiUrl}/EditManga/${mangaId}`, mangaData, httpOptions).toPromise();
    } catch (error) {
      console.error('Error occurred while updating manga', error);
      throw error; // Hoặc xử lý lỗi theo cách khác
      }
    }
  //Bỏ truyện vào thùng rác
  async updateMangaStatus(mangaId: string): Promise<any> {
      const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        }),
        responseType: 'text' as 'json'
      };
    
      try {
        return await this.http.put(`${this.apiUrl}/Status/${mangaId}`, null, httpOptions).toPromise();
      } catch (error) {
        // Xử lý lỗi tại đây
        throw error;
      }
  }

  //Thêm Chapter
  createChapter(mangaId: string, chapter: string, mangaImages: File[], mangaUrls: string[]): Observable<any> {
    const formData = new FormData();
    formData.append('Chapter', chapter);

    mangaImages.forEach((file) => {
      formData.append('MangaImage', file, file.name);
    });

    mangaUrls.forEach((url) => {
      formData.append('MangaUrl', url);
    });

    // Lấy token
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));

    // Thêm token vào headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Đảm bảo bạn truyền headers vào call http
    return this.http.post(`${this.apiUrl}/${mangaId}/CreateChapter`, formData, { headers: headers });
  }
  //Xóa Chapter
  deleteChapter(mangaId: string, chapterId: string): Observable<any> {
  const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };
  return this.http.delete(`${this.apiUrl}/${mangaId}/${chapterId}/DeleteChapter`, httpOptions);
}
  //Sửa Chapter
    editChapter(mangaId: string, chapterId: string, chapter: string, mangaImages: File[], mangaUrls: string[]): Observable<any> {
    const formData: FormData = new FormData();
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    formData.append('Chapter', chapter);
    mangaImages.forEach((file) => formData.append('MangaImage', file));
    mangaUrls.forEach((url) => formData.append('MangaUrl', url));

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/${mangaId}/${chapterId}/EditChapter`, formData, { headers });
  }
  //Tạo thể loại
  taoTheLoai(theLoai: any): Observable<any> {
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // Thiết lập responseType là 'text' và ép kiểu như 'json'
    return this.http.post(`${this.apiUrl}/CreateGenre`, theLoai, { 
      headers: headers, 
      responseType: 'text' as 'json' 
    });
  }
  //Xóa thể loại
   xoaTheLoai(genreId: number): Observable<any> {
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.apiUrl}/${genreId}/DeleteGenre`, httpOptions);
  }
  // Sửa thể loại
  suaTheLoai(genreId: number, theLoai: any): Observable<any> {
    const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/${genreId}/UpdateGenre`, theLoai, {
      headers: headers,
      responseType: 'text' as 'json'
    });
  }
  

}



@Injectable({
  providedIn:'root'
})
export class Searchmanga{
  private datasubject= new Subject<any[]>();
  public data$= this.datasubject.asObservable();

  senddata(data: any[]){
    this.datasubject.next(data);
  }
}