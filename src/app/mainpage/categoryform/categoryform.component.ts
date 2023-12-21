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
      mangaName:['', Validators.required],
      mangaDetails:['', Validators.required],
    });
  }
    ngOnInit(): void {

    }

    onFormSubmit(): void {
      if (this.empForm.valid) {
        const categoryData = {
          GenresIdName: this.empForm.value.mangaName,
          Info: this.empForm.value.mangaDetails
        };
  
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

    closeAddEditForm(){
      this._dialog.closeAll();
    } 
}
