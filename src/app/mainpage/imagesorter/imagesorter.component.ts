import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';
import { UploadimagesComponent } from '../uploadimages/uploadimages.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-imagesorter',
  templateUrl: './imagesorter.component.html',
  styleUrls: ['./imagesorter.component.scss']
})
export class ImagesorterComponent implements OnInit{
  mangaId: string | null = null;
  chapterId: string | null = null;
  images: any[] = [];

  constructor(private mangaService: MangaService,private route: ActivatedRoute,private dialog: MatDialog,private router: Router,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.mangaId = params.get('mangaId');
      this.chapterId = params.get('chapterId');
      if (this.mangaId && this.chapterId) {
        this.mangaService.getAllImages(this.mangaId, this.chapterId).subscribe(images => {
          this.images = images;
        });
      } else {
        // Xử lý trường hợp không có mangaId hoặc chapterId
        console.error('MangaId hoặc ChapterId không tồn tại.');
      }
    });
  }



  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }

  deleteImage(index: number): void {
    if (this.mangaId && this.chapterId) {
      const imageId = this.images[index].imageId; // Giả sử mỗi 'image' có 'imageId'
  
      this.mangaService.deleteChapterImage(this.mangaId, this.chapterId, imageId)
        .subscribe({
          next: (response) => {
            this.toastr.success('Xóa ảnh thành công!');
            console.log('Ảnh đã được xóa thành công', response);
            this.images.splice(index, 1); // Cập nhật mảng để loại bỏ ảnh đã xóa
          },
          error: (error) => {
            this.toastr.error('Xóa ảnh thất bại!');
            console.error('Lỗi khi xóa ảnh', error);
          }
        });
    } else {
      console.error('MangaId hoặc ChapterId là null');
    }
  }
  

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      // Thêm logic xử lý tải ảnh mới
      // Ví dụ: Chuyển đổi files thành đối tượng image và thêm vào danh sách
    }
  }

  openUploadForm() {
    const dialogRef = this.dialog.open(UploadimagesComponent, {
      data: { 
        mangaId: this.mangaId, 
        chapterId: this.chapterId
       } // Truyền 'mangaId' và 'chapterId' vào dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Logic xử lý sau khi dialog đóng, ví dụ cập nhật danh sách chương
      if (result === true) {
        this.ngOnInit();
      }
    });
  }

  moveToStart(index: number): void {
    if (index > 0) {
      const imageToMove = this.images[index];
      this.images.splice(index, 1);
      this.images.unshift(imageToMove);
    }
  }

  moveToEnd(index: number): void {
    if (index < this.images.length - 1) {
      const imageToMove = this.images[index];
      this.images.splice(index, 1);
      this.images.push(imageToMove);
    }
  }

  saveOrder(): void {
    const imageUpdates = this.images.map((image, index) => ({
      ImageId: image.imageId, // Thay thế image.imageId với thuộc tính thực của ảnh
      NewPosition: index
    }));
    if (this.mangaId && this.chapterId){
      this.mangaService.updateImagePositions(this.mangaId, this.chapterId, imageUpdates)
      .subscribe({
        next: (response) => {
          console.log('Cập nhật thành công', response);
          this.toastr.success('Cập nhật vị trí ảnh thành công!');
          // Thêm bất kỳ logic xử lý tiếp theo ở đây
        },
        error: (error) => {
          this.toastr.error('Lỗi khi cập nhật vị trí ảnh');
          console.error('Lỗi khi cập nhật vị trí ảnh', error);
        }
      });
    }
  }

  goBackToListChapter(): void {
    if (this.mangaId && this.chapterId) {
      // Điều hướng người dùng trở lại ListChapter với mangaId và chapterId
      this.router.navigate(['/List-chapter',this.mangaId]);
    } else {
      console.error('MangaId là null');
      // Xử lý trường hợp không có mangaId hoặc chapterId
      // Ví dụ: điều hướng về trang chủ hoặc trang lỗi
    }
  }
}