import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-addeditartist',
  templateUrl: './addeditartist.component.html',
  styleUrls: ['./addeditartist.component.scss']
})
export class AddeditartistComponent implements OnInit{
  empForm: FormGroup;
  currentImage: string | ArrayBuffer | null = null;
  Image: File | null = null;
  minDate: string| null = null;
  maxDate: string| null = null;



  constructor(private _fb:FormBuilder, private _mangaService: MangaService,private _dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any){
    this.empForm = this._fb.group({
      name:['', Validators.required],
      birthday:[''],
      alternateName:[''],
      artistImage:[''],
    });
  }
  ngOnInit(): void {
    this.loadArtistsData();
    const today = new Date();
    const elevenYearsAgo = new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());

    this.minDate = this.formatDate(elevenYearsAgo); // Ngày tối thiểu (11 năm trước)
    this.maxDate = this.formatDate(today); // Ngày tối đa (hôm nay)
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async loadArtistsData() {
    try {
     this.empForm.patchValue({
      name:this.data.name,
      alternateName:this.data.alternateName,
      birthday:this.data.birthday,
      artistImage:this.data.artistImage,
     
     });
   
     
    } catch (error) {
      console.error('Không thể tải dữ liệu thể loại:', error);
    }
  }

  onFormSubmit(): void {
    if (this.empForm.valid) {
      const formData = new FormData();
      formData.append('name', this.empForm.value.name);
      const birthday = this.empForm.value.birthday;
      if (birthday) {
      formData.append('birthday', birthday);
      }
      const alternateName = this.empForm.value.alternateName;
    if (alternateName !== null && alternateName !== undefined && alternateName.trim() !== '') {
      formData.append('alternateName', alternateName);
    } else {
      // Thêm chuỗi rỗng nếu không có giá trị hợp lệ
      formData.append('alternateName', '');
    }

      if (this.Image) {
        formData.append('artistImage', this.Image, this.Image.name);
      };
      console.log('FormData before sending:', formData);
      if(this.data && this.data.mangaArtistId){
        console.log('FormData before sending:', formData);
        this._mangaService.updateArtist(this.data.mangaArtistId, formData).then(
          (response: any) => {
            console.log('Artist updated successfully', response);
            this.closeAddEditForm();
          },
          (error: any) => {
            console.error('Error updating artist', error);
            // Có thể hiển thị thông báo lỗi
          }
        )
      } else {
        console.log('FormData before sending:', formData);
        this._mangaService.addArtist(formData).then(
          (response: any) => {
            // Xử lý thành công
            console.log('Artist added successfully', response);
            this.closeAddEditForm();
            // Có thể thêm mã để cập nhật UI hoặc hiển thị thông báo thành công
          },
          (error:any) => {
            // Xử lý lỗi
            console.error('Error adding artist', error);
            // Có thể hiển thị thông báo lỗi
          }
        );
      }
    } else {
      console.log('Form is not valid');
    }
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

  closeAddEditForm(){
    this._dialog.closeAll();
  } 
}
