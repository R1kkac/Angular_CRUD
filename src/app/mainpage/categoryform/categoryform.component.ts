import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-categoryform',
  templateUrl: './categoryform.component.html',
  styleUrls: ['./categoryform.component.scss']
})
export class CategoryformComponent implements OnInit{
  empForm: FormGroup;
  constructor(private _fb:FormBuilder, private _mangaService: MangaService,private _dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any){
    this.empForm = this._fb.group({
      genresIdName:['', Validators.required],
      info:['', Validators.required],
    });
  }
    ngOnInit(): void {
      this.loadGenresData();
    }

    async loadGenresData() {
      try {
       this.empForm.patchValue({
        genresIdName:this.data.genresIdName,
        info:this.data.info
       });
       
      } catch (error) {
        console.error('Không thể tải dữ liệu thể loại:', error);
      }
    }

    onFormSubmit(): void {
      if (this.empForm.valid) {
        const categoryData = {
          GenresIdName: this.empForm.value.genresIdName,
          Info: this.empForm.value.info
        };
       if(this.data){
        this._mangaService.suaTheLoai(this.data.genreId,categoryData).subscribe({
          next: (response) => {
            console.log('Thể loại đã được sửa:', response);
            alert('Thể loại đã được sửa');
            this.closeAddEditForm();
          },
          error: (error) => {
            alert('Có lỗi xảy ra khi sửa thể loại');
            console.error('Có lỗi xảy ra khi sửa thể loại:', error);
          }
        });
       } else{
        this._mangaService.taoTheLoai(categoryData).subscribe({
          next: (response) => {
            console.log('Thể loại đã được thêm:', response);
            alert('Thể loại đã được thêm');
            this.closeAddEditForm();
          },
          error: (error) => {
            alert('Có lỗi xảy ra khi thêm thể loại');
            console.error('Có lỗi xảy ra khi thêm thể loại:', error);
          }
        });
       }
      }
    }

    closeAddEditForm(){
      this._dialog.closeAll();
    } 
}
