import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, CategoryView } from 'src/app/class/CategoryView.model';
import { TypeManga } from 'src/app/class/TypeMangaView.model';
import { Artist, ArtistView } from 'src/app/class/artist-view.model';
import { Author, AuthorView } from 'src/app/class/author-view.model';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-addeditform',
  templateUrl: './addeditform.component.html',
  styleUrls: ['./addeditform.component.scss']
})
export class AddeditformComponent implements OnInit{
  currentImage: string | ArrayBuffer | null = null;
  empForm: FormGroup;
  Image: File | null = null;
  genresList: CategoryView[] = [];
  typeMangas: TypeManga[] = [];
  mangaId: string | null = null; // Biến để lưu trữ ID của manga
  originalMangaName: string | null = null;// Biến để lưu trữ manganame của manga
  isPersonalManga: boolean = true;
  artistList: ArtistView[] = [];
  authorList: AuthorView[] = [];

  constructor(
    private _fb:FormBuilder,
    private _mangaService: MangaService,
    private route: ActivatedRoute,
    private router: Router){
    this.empForm = this._fb.group({
      mangaId:null,
      mangaName:['', Validators.required],
      mangaDetails:'',
      mangaImage:'',
      mangaAlternateName:'',
      artists: [[]],
      authors:[[]],
      type:'',
      genres: [[], Validators.required],
      
    });
  }


ngOnInit(): void {
  this.loadGenresList();
  this.loadTypeList();
  this.loadArtistList();
  this.loadAuthorList();
  this.route.paramMap.subscribe(params => {
    this.mangaId = params.get('mangaId');
    
    if (this.mangaId) {
      this.loadMangaData(this.mangaId);
    }
  });
    
}

loadTypeList() {
  this._mangaService.GetAllType().subscribe({
    next: (data) => {
      this.typeMangas = data;
    },
    error: (err) => {
      console.error('Lỗi khi tải danh sách types:', err);
    }
  });
}

loadGenresList() {
  this._mangaService.getGenresList().subscribe({
    next: (data) => {
      this.genresList = data;
    },
    error: (err) => {
      console.error('Lỗi khi tải danh sách genres:', err);
    }
  });
}

loadArtistList() {
  this._mangaService.getArtistList().subscribe({
    next: (data) => {
      this.artistList = data;
    },
    error: (err) => {
      console.error('Lỗi khi tải danh sách artist:', err);
    }
  });
}

loadAuthorList() {
  this._mangaService.getAuthorList().subscribe({
    next: (data) => {
      this.authorList = data;
    },
    error: (err) => {
      console.error('Lỗi khi tải danh sách author:', err);
    }
  });
}

async loadMangaData(mangaId: string) {
  try {
    const mangaData = await this._mangaService.Getinfomanga(mangaId);
    if (mangaData) {
      this.empForm.patchValue({
        // Đặt các giá trị trừ 'mangaImage'
        mangaId: mangaData.mangaId,
        mangaName: mangaData.mangaName,
        mangaDetails: mangaData.mangaDetails,
        mangaAlternateName: mangaData.mangaAlternateName,
        type: mangaData.type,
        genres: mangaData.listcategory.map((category: Category) => category.genreId.toString()),
        artists: mangaData.listartist.map((artists: Artist) => artists.mangaArtistId),
        authors: mangaData.listauthor.map((author: Author) => author.mangaAuthorId),
      });

      this.currentImage = mangaData.mangaImage; // Lưu URL hình ảnh để hiển thị
      this.originalMangaName = mangaData.mangaName;
    }
  } catch (error) {
    console.error('Không thể tải dữ liệu manga:', error);
  }
}

onGenreChange(event: MatSelectChange) {
  this.empForm.get('genres')?.setValue(event.value);
}

onArtistChange(event: MatSelectChange) {
  this.empForm.get('artists')?.setValue(event.value);
}

onAuthorChange(event: MatSelectChange) {
  this.empForm.get('authors')?.setValue(event.value);
}

private prepareCreateData(): FormData {
  const formData = new FormData();
  Object.keys(this.empForm.value).forEach(key => {
    if (key !== 'mangaImage') {
      if (key === 'genres') {
        // Đảm bảo genres không phải là null hoặc undefined trước khi thực hiện forEach
        (this.empForm.get(key) as FormArray).value.forEach((genreId: number) => {
          formData.append('GenreIds', genreId.toString());
        });
      } else if (key === 'artists') {
        (this.empForm.get(key) as FormArray).value.forEach((artistId: number) => {
          formData.append('ArtistIds', artistId.toString());
        });
      }else if (key === 'authors') {
        (this.empForm.get(key) as FormArray).value.forEach((authorId: number) => {
          formData.append('AuthorIds', authorId.toString());
        });
      }else {
        // Sử dụng non-null assertion operator vì các trường khác đã được kiểm tra và có Validators
        formData.append(key, this.empForm.get(key)!.value);
      }
    }
  });
  if (this.Image) {
    formData.append('mangaImage', this.Image, this.Image.name);
  }
  return formData; 
}

private prepareFormData(): FormData {
  const formData = new FormData();
  Object.keys(this.empForm.value).forEach(key => {
    const value = this.empForm.get(key)?.value;
    if (key !== 'mangaImage' && value != null && value !== '') {
      // Đối với trường 'genres', xử lý riêng
      if (key === 'genres') {
        (this.empForm.get(key) as FormArray).value.forEach((genreId: number) => {
          formData.append('GenreIds', genreId.toString());
        });
      }else if (key === 'artists') {
        (this.empForm.get(key) as FormArray).value.forEach((artistId: number) => {
          formData.append('ArtistIds', artistId.toString());
        });
      } else if (key === 'authors') {
        (this.empForm.get(key) as FormArray).value.forEach((authorId: number) => {
          formData.append('AuthorIds', authorId.toString());
        });
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  if (this.Image) {
    formData.append('mangaImage', this.Image, this.Image.name);
  }

  return formData;
}




selectFile(event: any): void {
  const fileInput = event.target;
  if (fileInput.files && fileInput.files.length > 0) {
    const selectedFile = fileInput.files[0];
    this.Image = selectedFile; // Lưu file được chọn để sử dụng sau này
    // Sử dụng FileReader để đọc nội dung file
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // Đây là URL dữ liệu của hình ảnh, có thể được gán trực tiếp vào src của thẻ img
      this.currentImage = reader.result;
    };
    reader.readAsDataURL(selectedFile); // Đọc file dưới dạng data URL
  }
}

//Tạo Truyện
private createManga(): void {
  let mangaName = this.empForm.get('mangaName')?.value.trim().toLowerCase();
  this.empForm.get('mangaName')?.setValue(mangaName);
  this._mangaService.checkMangaNameExists(mangaName).subscribe(exists => {
    if (exists) {
      alert('Tên truyện đã tồn tại, vui lòng chọn tên khác.');
      return;
    }
    this.performCreate();
  });
}

private performCreate(): void {
  const formData = this.prepareCreateData();
  this._mangaService.createManga(formData)
    .then(response => {
      console.log(response); // Sử dụng response ở đây
      alert('Thêm truyện thành công');
      // this.closeAddEditForm();
      this.router.navigate(['/Mangas']);
    })
    .catch(error => {
      alert('Lỗi khi thêm truyện');
    });
  
}



private updateManga(): void {
    const newMangaName = this.empForm.get('mangaName')?.value.trim().toLowerCase();
  this.empForm.get('mangaName')?.setValue(newMangaName);
  // Kiểm tra nếu tên truyện mới nhập vào khác với tên truyện ban đầu
  if (newMangaName !== this.originalMangaName) {
    this._mangaService.checkMangaNameExists(newMangaName).subscribe(exists => {
      if (exists) {
        alert('Tên truyện đã tồn tại, vui lòng chọn tên khác.');
        return;
      }
      this.performUpdate();
    });
  } else {
    // Nếu tên truyện mới trùng với tên truyện ban đầu, tiến hành cập nhật mà không cần kiểm tra trùng tên
    this.performUpdate();
  }
}

private performUpdate(): void {
  this.route.paramMap.subscribe(params => {
    this.mangaId = params.get('mangaId');
    
    if (this.mangaId) {
      const formData = this.prepareFormData();
  this._mangaService.updateManga(this.mangaId , formData)
    .then(response => {
      // Xử lý khi cập nhật thành công
      console.log('Cập nhật truyện thành công:', response);
      alert('Cập nhật truyện thành công');
      // this.closeAddEditForm();
      this.router.navigate(['/Mangas']);
    })
    .catch(error => {
      // Xử lý khi có lỗi xảy ra
      console.error('Lỗi khi cập nhật truyện:', error);
      alert('Lỗi khi cập nhật truyện');
    });
    }
  });

  
}

onFormSubmit(): void {
    if (this.empForm.valid ) {
      let mangaName = this.empForm.get('mangaName')?.value.trim().toUpperCase();
      this.empForm.get('mangaName')?.setValue(mangaName);
      // Kiểm tra xem form này là để cập nhật hay tạo mới
      this.route.paramMap.subscribe(params => {
        this.mangaId = params.get('mangaId');
        if (this.mangaId) {
          this.updateManga();
        }
        else {
          // Gọi hàm createManga
          this.createManga();
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin truyện'); 
  }
}
navigateBack(): void {
  this.router.navigate(['/Mangas']); // Sử dụng đường dẫn đúng tới component 'Mangas'
}
  // closeAddEditForm(){
  //   this._dialog.closeAll();
  // } 
}
