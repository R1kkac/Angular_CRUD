import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Category, CategoryView } from 'src/app/class/CategoryView.model';
import { TypeManga } from 'src/app/class/TypeMangaView.model';
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
  
  constructor(private _fb:FormBuilder, private _mangaService: MangaService,private _dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any){
    this.empForm = this._fb.group({
      mangaId:null,
      mangaName:['', Validators.required],
      mangaDetails:'',
      mangaImage:'',
      mangaAlternateName:'',
      mangaAuthor:['', Validators.required],
      mangaArtist:'',
      type:'',
      genres: [[]]
    });
  }


ngOnInit(): void {
  this.loadGenresList();
  this.loadTypeList();
    if (this.data.mangaId) {
      this.loadMangaData(this.data.mangaId);
    }
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
        mangaAuthor: mangaData.mangaAuthor,
        mangaArtist: mangaData.mangaArtist,
        type: mangaData.type,
        genres: mangaData.listcategory.map((category: Category) => category.genreId.toString()),
      });
      this.currentImage = mangaData.mangaImage; // Lưu URL hình ảnh để hiển thị
    }
  } catch (error) {
    console.error('Không thể tải dữ liệu manga:', error);
  }
}

onGenreChange(event: MatSelectChange) {
  this.empForm.get('genres')?.setValue(event.value);
}

private prepareFormData(): FormData {
  const formData = new FormData();
  Object.keys(this.empForm.value).forEach(key => {
    if (key !== 'mangaImage') {
      if (key === 'genres') {
        // Đảm bảo genres không phải là null hoặc undefined trước khi thực hiện forEach
        (this.empForm.get(key) as FormArray).value.forEach((genreId: number) => {
          // Chỉ định rõ ràng genreId là kiểu number
          formData.append('GenreIds', genreId.toString());
        });
      } else {
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
  let mangaName = this.empForm.get('mangaName')?.value.trim().toUpperCase();
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
  const formData = this.prepareFormData();
  this._mangaService.createManga(formData)
    .then(response => {
      console.log(response); // Sử dụng response ở đây
      alert('Thêm truyện thành công');
      this.closeAddEditForm();
    })
    .catch(error => {
      alert('Lỗi khi thêm truyện');
    });
  
}



private updateManga(): void {
    const newMangaName = this.empForm.get('mangaName')?.value.trim().toUpperCase();
  this.empForm.get('mangaName')?.setValue(newMangaName);

  // Kiểm tra nếu tên truyện mới nhập vào khác với tên truyện ban đầu
  if (newMangaName !== this.data.mangaName) {
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
  const formData = this.prepareFormData();
  this._mangaService.updateManga(this.data.mangaId, formData)
    .then(response => {
      // Xử lý khi cập nhật thành công
      console.log('Cập nhật truyện thành công:', response);
      alert('Cập nhật truyện thành công');
      this.closeAddEditForm();
    })
    .catch(error => {
      // Xử lý khi có lỗi xảy ra
      console.error('Lỗi khi cập nhật truyện:', error);
      alert('Lỗi khi cập nhật truyện');
    });
}

onFormSubmit(): void {
    if (this.empForm.valid ) {
      let mangaName = this.empForm.get('mangaName')?.value.trim().toUpperCase();
      this.empForm.get('mangaName')?.setValue(mangaName);
      // Kiểm tra xem form này là để cập nhật hay tạo mới
      if (this.data && this.data.mangaId) {
        // Gọi hàm updateManga
        this.updateManga();
      } else {
        // Gọi hàm createManga
        this.createManga();
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin truyện'); 
  }
}
  closeAddEditForm(){
    this._dialog.closeAll();
  } 
}
