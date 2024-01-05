import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';
import { CategoryformComponent } from '../categoryform/categoryform.component';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.scss'],
})


export class CategorysComponent implements OnInit{
  displayedColumns: string[] = ['genreId', 'genresIdName', 'info','action'];
  dataSource: any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router) {}
  
  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList(){
    this.mangaService.getGenresList().subscribe({
      next: (res : any)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
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

  onDelete(genre: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: genre.genresIdName }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mangaService.xoaTheLoai(genre.genreId).subscribe({
          next: (response) => {
            alert('Xóa thể loại thành công');
            this.getCategoryList();
          },
          error: (error) => {
            // Xử lý lỗi tại đây
            if (error.status === 400 && error.error && error.error.message) {
              // Hiển thị thông báo lỗi cụ thể từ phản hồi API
              alert(error.error.message);
            } else {
              // Xử lý lỗi chung
              console.error('Có lỗi xảy ra khi xóa thể loại:', error);
              alert('Bạn không có quyền quản lý thể loại!');
            }
          }
        });
      }
    });
  }


  openAddForm(){
    const dialogRef = this.dialog.open(CategoryformComponent);
    dialogRef.afterClosed().subscribe(() => {
      // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
      this.getCategoryList();
    });
  }

  openEditForm(genre: any): void {
    if (this.dataSource) {
      const dialogRef = this.dialog.open(CategoryformComponent, {
        data: { 
          genreId: genre.genreId,
          genresIdName: genre.genresIdName,
          info: genre.info
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
        this.ngOnInit();
      });
    } else {
      console.error('Không thể lấy thông tin manga');
      // Xử lý lỗi hoặc thông báo cho người dùng
    }

  }

}
