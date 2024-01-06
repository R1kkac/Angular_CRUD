import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { TypeformComponent } from '../typeform/typeform.component';

@Component({
  selector: 'app-listtype',
  templateUrl: './listtype.component.html',
  styleUrls: ['./listtype.component.scss']
})
export class ListtypeComponent {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router) {}
  
  ngOnInit(): void {
    this.getTypeList();
  }


  getTypeList(){
    this.mangaService.GetAllType().subscribe({
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

onDelete(type: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: type.name }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mangaService.deleteTypeManga(type.id).subscribe({
          next: (response) => {
            alert('Xóa kiểu truyện thành công');
            this.ngOnInit();
          },
          error: (error) => {
            // Xử lý lỗi tại đây
            if (error.status === 400 && error.error && error.error.message) {
              // Hiển thị thông báo lỗi cụ thể từ phản hồi API
              alert(error.error.message);
            } else {
              // Xử lý lỗi chung
              console.error('Có lỗi xảy ra khi xóa thể loại:', error);
              alert('không thể xóa khi có liên kết bộ truyện!');
            }
          }
        });
      }
    });
  }


  openAddForm(){
    const dialogRef = this.dialog.open(TypeformComponent);
    dialogRef.afterClosed().subscribe(() => {
      // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
      this.ngOnInit();
    });
  }

  openEditForm(type: any): void {
    if (this.dataSource) {
      const dialogRef = this.dialog.open(TypeformComponent, {
        data: { 
          id: type.id,
          name: type.name
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
