import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-typeform',
  templateUrl: './typeform.component.html',
  styleUrls: ['./typeform.component.scss']
})
export class TypeformComponent implements OnInit{
  empForm: FormGroup;
  isEdit: boolean = false;
  
  constructor(private _fb:FormBuilder, private _mangaService: MangaService,private _dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any){
    this.empForm = this._fb.group({
      id:['', Validators.required],
      name:['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.isEdit = true; // Đặt isEdit thành true nếu đang cập nhật
      this.loadTypesData();
    }
  }
  async loadTypesData() {
    try {
     this.empForm.patchValue({
      id:this.data.id,
      name:this.data.name
     });
     
    } catch (error) {
      console.error('Không thể tải dữ liệu kiểu truyện:', error);
    }
  }
  onFormSubmit(): void {
    if (this.empForm.valid) {
      const TypeManga = {
        id: this.empForm.get('id')?.value,
        name: this.empForm.value.name
      };
     if(this.data){
      this._mangaService.updateTypeManga(TypeManga).subscribe({
        next: (response) => {
          console.log('Kiểu truyện đã được sửa:', response);
          alert('Kiểu truyện đã được sửa');
          this.closeAddEditForm();
        },
        error: (error) => {
          alert('Bạn không có quyền quản lý kiểu truyện!');
          console.error('Có lỗi xảy ra khi sửa kiểu truyện:', error);
        }
      });
     } else{
      this._mangaService.addTypeManga(TypeManga).subscribe({
        next: (response) => {
          console.log('Kiểu truyện đã được thêm:', response);
          alert('Kiểu truyện đã được thêm');
          this.closeAddEditForm();
        },
        error: (error) => {
          alert('Bạn không có quyền quản lý kiểu truyện!');
          console.error('Có lỗi xảy ra khi thêm kiểu truyện:', error);
        }
      });
     }
    }
  }

  closeAddEditForm(){
    this._dialog.closeAll();
  } 
}
