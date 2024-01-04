import { formatDate } from '@angular/common';
import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-chapterform',
  templateUrl: './chapterform.component.html',
  styleUrls: ['./chapterform.component.scss']
})
export class ChapterformComponent implements OnInit{
  currentImage: string | ArrayBuffer | null = null;
  chapterForm: FormGroup;
  files: File[] = [];
  constructor(private _fb:FormBuilder, private _mangaService: MangaService,private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any, public dialogRef: MatDialogRef<ChapterformComponent>)
    {
      // Lấy ngày giờ hiện tại
      const currentDate = new Date();
       // Format ngày giờ theo chuẩn ISO 8601 hoặc theo định dạng mà backend yêu cầu
    const formattedDate = formatDate(currentDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    this.chapterForm = this._fb.group({
      ChapterId:'',
      ChapterName:['', Validators.required],
      ChapterTitle:'',
      ChapterDate:[formattedDate, Validators.required],
      ChapterImages: this._fb.group({
        // Chứa thông tin file nếu bạn tải file
      }),
      imageUrls: [''], // Chứa URLs hình ảnh
      MangaId:'',
    });
  }
  ngOnInit(): void{
      this.loadChapterData();
  }

  async loadChapterData() {
    try {
     this.chapterForm.patchValue({
      ChapterId:this.data.chapterId,
      ChapterName:this.data.chapterName,
      ChapterTitle:this.data.chapterTitle,
     });
     
    } catch (error) {
      console.error('Không thể tải dữ liệu manga:', error);
    }
  }
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = [...this.files, ...Array.from(input.files)];
    }
  }

  onSubmit(): void {
    if (this.chapterForm.valid) {
      if (this.data && this.data.chapterId) {
        this.updateChapter();
      } else {
        this.createNewChapter();
      }
    }
  }

  createNewChapter(): void {
  let chapterName = this.chapterForm.get('ChapterName')?.value.trim().toLowerCase();
  const mangaId = this.data.mangaId;

  // Kiểm tra trùng lập tên chương trước khi tạo mới
  this._mangaService.getAllNameChapter(mangaId).subscribe(chapterNames => {
    let isDuplicate = chapterNames.some(name => name.trim().toLowerCase() === chapterName);

    if (isDuplicate) {
      alert('Tên chương đã tồn tại. Vui lòng chọn tên khác.');
      return;
    }

    // Nếu tên chương không trùng, tiếp tục tạo mới
    this.performCreateChapter();
  });
  }

  performCreateChapter() {
    const chapterData = {
      ChapterId: this.data.ChapterId, // Hoặc logic khác để xác định ChapterId
      ChapterName: this.chapterForm.get('ChapterName')?.value,
      ChapterTitle: this.chapterForm.get('ChapterTitle')?.value,
      ChapterDate: this.chapterForm.get('ChapterDate')?.value,
      MangaId: this.data.mangaId // MangaId được lấy từ dữ liệu truyền vào
    };
    const imageUrls = this.chapterForm.get('imageUrls')?.value.split(',');
    this._mangaService.createChapter(this.data.mangaId, JSON.stringify(chapterData), this.files, imageUrls)
      .subscribe({
        next: (response) => {
          // Xử lý khi tạo chapter thành công
          alert('Chapter đã được tạo thành công!');
          this.closeForm();
          this.dialogRef.close(true); // Đóng dialog và trả về giá trị 'true'
        },
        error: (error) => {
          // Xử lý lỗi
          console.error('Error creating chapter:', error);
          alert('Có lỗi xảy ra khi tạo chapter.');
          this.dialogRef.close(false); // Đóng dialog và trả về giá trị 'false'
        }
      });
  }
  
  updateChapter(): void {
    let currentChapterName = this.data.chapterName?.trim().toLowerCase(); // Tên chương hiện tại
    let newChapterName = this.chapterForm.get('ChapterName')?.value.trim().toLowerCase(); // Tên chương mới
    const mangaId = this.data.mangaId;
  
    this._mangaService.getAllNameChapter(mangaId).subscribe(chapterNames => {
      let isDuplicate = chapterNames.some(name => {
        let existingName = name.trim().toLowerCase();
        return existingName === newChapterName && existingName !== currentChapterName;
      });
  
      if (isDuplicate) {
        alert('Tên chương đã tồn tại. Vui lòng chọn tên khác.');
        return;
      }
  
      this.performUpdateChapter();
    });
  }

  performUpdateChapter() {
    const chapterData = {
      ChapterId: this.chapterForm.get('ChapterId')?.value,
      ChapterName: this.chapterForm.get('ChapterName')?.value,
      ChapterTitle: this.chapterForm.get('ChapterTitle')?.value,
      ChapterDate: this.chapterForm.get('ChapterDate')?.value,
      MangaId: this.data.mangaId
    };

    const imageUrls = this.chapterForm.get('imageUrls')?.value.split(',');

    this._mangaService.editChapter(this.data.mangaId, this.data.chapterId, JSON.stringify(chapterData), this.files, imageUrls)
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
  }
  
  closeForm(): void {
    this.dialogRef.close();
  }
}
