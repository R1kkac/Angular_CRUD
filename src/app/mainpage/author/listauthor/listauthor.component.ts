import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { MangaService } from 'src/app/service/manga.service';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { AddeditauthorComponent } from '../addeditauthor/addeditauthor.component';

@Component({
  selector: 'app-listauthor',
  templateUrl: './listauthor.component.html',
  styleUrls: ['./listauthor.component.scss'] 
})
export class ListauthorComponent {
  displayedColumns: string[] = ['mangaAuthorId', 'name', 'authorImage','alternateName','birthday','action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router) {}
  ngOnInit(): void {
    this.getAuthorList();
  }

  getAuthorList() {
    this.mangaService.getAuthorList().subscribe({
      next: (authors: any[]) => {
        // Lấy URL hình ảnh cho mỗi nghệ sĩ
        const imageRequests = authors.map(author => {
          if (author.authorImage) {
            return this.mangaService.getAuthorImage(author.authorImage).pipe(
              map(blob => URL.createObjectURL(blob)), // Tạo URL từ Blob
              catchError(error => {
                console.error('Error fetching image:', error);
                return of(null); // Trả về null nếu có lỗi
              })
            );
          } else {
            return of(null); // Nếu không có hình ảnh, trả về null
          }
        });
  
        forkJoin(imageRequests).subscribe(imageUrls => {
          // Cập nhật dataSource với URL hình ảnh
          authors.forEach((author, index) => {
            author.authorImage = imageUrls[index]; // Gán URL hình ảnh
          });
  
          this.dataSource = new MatTableDataSource(authors);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      },
      error: console.error
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleDetails(event: Event, cate: any) {
    event.preventDefault();
    cate.showFullDetails = !cate.showFullDetails;
  }

  onDelete(author: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: author.name }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mangaService.deleteAuthor(author.mangaAuthorId).subscribe({
          next: (response) => {
            alert('Xóa họa sĩ thành công');
            this.getAuthorList();
          },
          error: (error) => {
            // Xử lý lỗi tại đây
            if (error.status === 400 && error.error && error.error.message) {
              // Hiển thị thông báo lỗi cụ thể từ phản hồi API
              alert(error.error.message);
            } else {
              // Xử lý lỗi chung
              console.error('Có lỗi xảy ra khi xóa họa sĩ:', error);
              alert('Có lỗi xảy ra khi xóa họa sĩ!');
            }
          }
        });
      }
    });
  }


  openAddForm(){
    const dialogRef = this.dialog.open(AddeditauthorComponent);
    dialogRef.afterClosed().subscribe(() => {
      // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
      this.getAuthorList();
    });
  }

  openEditForm(author: any): void {
    if (this.dataSource) {
      const dialogRef = this.dialog.open(AddeditauthorComponent, {
        data: { 
          mangaAuthorId: author.mangaAuthorId,
          name: author.name,
          authorImage: author.authorImage,
          alternateName: author.alternateName,
          birthday: author.birthday,
        }

      }); 
      dialogRef.afterClosed().subscribe(() => {
        // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
        this.ngOnInit();
      });
    } else {
      console.error('Không thể lấy thông tin họa sĩ');
      // Xử lý lỗi hoặc thông báo cho người dùng
    }

  }

}
