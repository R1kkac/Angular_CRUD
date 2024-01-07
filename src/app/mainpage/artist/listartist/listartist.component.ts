import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { AddeditartistComponent } from '../addeditartist/addeditartist.component';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-listartist',
  templateUrl: './listartist.component.html',
  styleUrls: ['./listartist.component.scss']
})
export class ListartistComponent {
  displayedColumns: string[] = ['mangaArtistId', 'name', 'artistImage','alternateName','birthday','action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router) {}
  ngOnInit(): void {
    this.getArtistList();
  }

  getArtistList() {
    this.mangaService.getArtistList().subscribe({
      next: (artists: any[]) => {
        // Lấy URL hình ảnh cho mỗi nghệ sĩ
        const imageRequests = artists.map(artist => {
          if (artist.artistImage) {
            return this.mangaService.getArtistImage(artist.artistImage).pipe(
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
          artists.forEach((artist, index) => {
            artist.artistImage = imageUrls[index]; // Gán URL hình ảnh
          });
  
          this.dataSource = new MatTableDataSource(artists);
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

  onDelete(artist: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: artist.name }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mangaService.deleteArtist(artist.mangaArtistId).subscribe({
          next: (response) => {
            alert('Xóa họa sĩ thành công');
            this.getArtistList();
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
    const dialogRef = this.dialog.open(AddeditartistComponent);
    dialogRef.afterClosed().subscribe(() => {
      // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
      this.getArtistList();
    });
  }

  openEditForm(artist: any): void {
    if (this.dataSource) {
      const dialogRef = this.dialog.open(AddeditartistComponent, {
        data: { 
          mangaArtistId: artist.mangaArtistId,
          name: artist.name,
          artistImage: artist.artistImage,
          alternateName: artist.alternateName,
          birthday: artist.birthday,
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
