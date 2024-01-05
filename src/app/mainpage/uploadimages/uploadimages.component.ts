import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MangaService } from 'src/app/service/manga.service';
import { ChapterformComponent } from '../chapterform/chapterform.component';

@Component({
  selector: 'app-uploadimages',
  templateUrl: './uploadimages.component.html',
  styleUrls: ['./uploadimages.component.scss']
})
export class UploadimagesComponent{
  files: File[] = [];
  imagesForm: FormGroup;

  constructor(private _fb:FormBuilder, private _mangaService: MangaService,private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any, public dialogRef: MatDialogRef<ChapterformComponent>)
    {
    this.imagesForm = this._fb.group({
      ChapterImages: this._fb.group({
        // Chứa thông tin file nếu bạn tải file
      }),
      imageUrls: [''], // Chứa URLs hình ảnh
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = [...this.files, ...Array.from(input.files)];
    }
  }
  onSubmit(): void {
   this.updateChapter();
  }


  updateChapter(): void {
    this._mangaService.getInfoChapter(this.data.mangaId, this.data.chapterId).subscribe(chapter => {
      const chapterData = {
        ChapterId: chapter.chapterId,
        ChapterName: chapter.chapterName,
        ChapterTitle: chapter.chapterTitle,
        ChapterDate: chapter.chapterDate,
        MangaId: this.data.mangaId
      };
    console.log(chapterData);
    const imageUrls = this.imagesForm.get('imageUrls')?.value.split(',');
    this._mangaService.UploadImageChapter(this.data.mangaId, this.data.chapterId, JSON.stringify(chapterData), this.files, imageUrls)
      .subscribe({
        next: (response) => {
          alert('Chapter đã được cập nhật thành công!');
          this.closeForm();
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating chapter:', error);
          alert('Có lỗi xảy ra khi cập nhật chapter.');
          this.dialogRef.close(false);
        }
      });
    },
    error => {
      console.error('Lỗi khi lấy thông tin chương truyện:', error);
    });
    
  }

  closeForm(): void {
    this.dialogRef.close();
  }
}
