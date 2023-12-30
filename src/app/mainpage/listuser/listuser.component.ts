import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserformComponent } from '../userform/userform.component';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss']
})
export class ListuserComponent {
  displayedColumns: string[] = [ 'id','name','avatar','userName','email','phoneNumber','role','action'];
  dataSource: any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog, private router: Router,private authService: AuthService) {}
  
  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(){
    this.authService.GetAllUser().subscribe({
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

  openEditForm(user: any): void {
    if (this.dataSource) {
      const dialogRef = this.dialog.open(UserformComponent, {
        data: { 
          id: user.id
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
