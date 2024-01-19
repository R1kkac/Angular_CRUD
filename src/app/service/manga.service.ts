import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { message } from '../class/message';
import { Observable, Subject, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MangaClass } from '../class/manga';
import { ChapterView, chapterView2, chapterView3 } from '../class/ChapterView';
import { Category, CategoryView } from '../class/CategoryView.model';
import { TypeManga } from '../class/TypeMangaView.model';
import { ImagePositionUpdateModel } from '../class/ImageChaper-view.model';
import { ArtistView } from '../class/artist-view.model';
import { AuthorView } from '../class/author-view.model';



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
  // apiUrl='https://yahallo.azurewebsites.net/Truyen-tranh';


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
  
  //Lấy danh sách ảnh của một chương truyện
  getListChapter(idManga: string): Observable<ChapterView[]> {
    const url = `${this.apiUrl}/${idManga}/GetChapter`;
    return this.http.get<ChapterView[]>(url);
  }
  //Lấy thông tin của một chương truyện
  getInfoChapter(idManga: string, idChapter: string): Observable<chapterView3> {
    const url = `${this.apiUrl}/${idManga}/${idChapter}/GetChapterInfo`;
    return this.http.get<chapterView3>(url);
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

  //Cập nhập Status bộ truyện
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
  //Cập nhập trạng thái DeleteStatus
  async DeleteStatus(mangaId: string): Promise<any> {
  const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }),
    responseType: 'text' as 'json'
  };

  try {
    return await this.http.put(`${this.apiUrl}/DeleteStatus/${mangaId}`, null, httpOptions).toPromise();
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
  //Lấy tên chương bộ truyện
  getAllNameChapter(mangaId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/GetAllNameChapter/${mangaId}`);
  }
  
  getAllNameManga(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/GetAllNameManga`);
  }
  //Kiểm tra tên trùng
  checkMangaNameExists(mangaName: string): Observable<boolean> {
    return this.http.get<string[]>(`${this.apiUrl}/GetAllNameManga`).pipe(
      map((names) => names.includes(mangaName))
    );
  }
  //Lấy tất cả thông tin ảnh chương
  getAllImages(idManga: string, idChapter: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idManga}/${idChapter}/getAllImage`);
  }
  //Thay đổi vị trí ảnh
  updateImagePositions(mangaId: string, chapterId: string, imageUpdates: any[]): Observable<any> {
    const url = `${this.apiUrl}/${mangaId}/${chapterId}/UpdateImagePositions`;
    return this.http.post(url, imageUpdates);
  }
  //Thêm ảnh Chapter  
  UploadImageChapter(mangaId: string, chapterId: string, chapter: string, mangaImages: File[], mangaUrls: string[]): Observable<any> {
  const formData: FormData = new FormData();
  const token = this.userUservice.decrypt(this.CookieService.get(this.userUservice.JWTCookie));
  formData.append('Chapter', chapter);
  mangaImages.forEach((file) => formData.append('mangaImages', file));
  mangaUrls.forEach((url) => formData.append('mangaUrls', url));

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.put(`${this.apiUrl}/${mangaId}/${chapterId}/UploadImage`, formData, { headers });
  }
  //Xóa ảnh chapter
  deleteChapterImage(mangaId: string, chapterId: string, imageId: number): Observable<any> {
  const url = `${this.apiUrl}/${mangaId}/${chapterId}/${imageId}/DeleteImage`;
  return this.http.delete(url);
  }
  //Thêm Type Manga
  addTypeManga(typeManga: TypeManga): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddType`, typeManga);
  }
  //Xóa Type Manga
  deleteTypeManga(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteType/${id}`);
  }
  //Sửa Type Manga
  updateTypeManga(typeManga: TypeManga): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditType/${typeManga.id}`, typeManga);
  }

  //Lấy danh sách họa sĩ
  getArtistList(): Observable<ArtistView[]> {
  return this.http.get<ArtistView[]>(`${this.apiUrl}/Artist/Getall`);
  }   
  //Lấy hình họa sĩ
  getArtistImage(artistImage: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/LayHinhArist/${artistImage}`, { responseType: 'blob' });
}
  //Thêm họa sĩ
  async addArtist(artistData: FormData): Promise<any> {
    try {
      return await this.http.post(`${this.apiUrl}/CreateArtist`, artistData).toPromise();
    } catch (error) {
      // Xử lý lỗi ở đây
      console.error('Error occurred while creating manga', error);
      throw error; // Hoặc xử lý lỗi theo cách khác
    }
  }
  //Xóa họa sĩ
  deleteArtist(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/DeleteArtist`);
  }
   //Sửa họa sĩ
    async updateArtist(id: number, mangaData: FormData): Promise<any> {
    try {
      return await this.http.put(`${this.apiUrl}/${id}/UpdateArtist`, mangaData).toPromise();
    } catch (error) {
      console.error('Error occurred while updating manga', error);
      throw error; // Hoặc xử lý lỗi theo cách khác
      }
    }



     //Lấy danh sách tác giả
  getAuthorList(): Observable<AuthorView[]> {
  return this.http.get<AuthorView[]>(`${this.apiUrl}/Author/Getall`);
  }   
  //Lấy hình họa sĩ
  getAuthorImage(authorImage: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/LayHinhAuthor/${authorImage}`, { responseType: 'blob' });
}
  //Thêm họa sĩ
  async addAuthor(authorData: FormData): Promise<any> {
    try {
      return await this.http.post(`${this.apiUrl}/CreateAuthor`, authorData).toPromise();
    } catch (error) {
      // Xử lý lỗi ở đây
      console.error('Error occurred while creating manga', error);
      throw error; // Hoặc xử lý lỗi theo cách khác
    }
  }
  //Xóa họa sĩ
  deleteAuthor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/DeleteAuthor`);
  }
   //Sửa họa sĩ
    async updateAuthor(id: number, mangaData: FormData): Promise<any> {
    try {
      return await this.http.put(`${this.apiUrl}/${id}/UpdateAuthor`, mangaData).toPromise();
    } catch (error) {
      console.error('Error occurred while updating manga', error);
      throw error; // Hoặc xử lý lỗi theo cách khác
      }
    }
    //Số lượng truyện
    getNumberAllManga(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/number_all_manga`);
    }
    //Tổng Lượt xem trong ngày, tháng, năm
    getViewByDay(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/total-views-by-day`);
    }
    getViewByMonth(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/total-views-by-month`);
    }
    getViewByYear(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/total-views-by-year`);
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