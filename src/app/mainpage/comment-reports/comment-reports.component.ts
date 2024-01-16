import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { ComfirmUserComponent } from './comfirm-user/comfirm-user.component';
import { AuthService } from 'src/app/service/auth.service';
import { user } from 'src/app/class/user';
import { ReportService } from 'src/app/service/report.service';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-comment-reports',
  templateUrl: './comment-reports.component.html',
  styleUrls: ['./comment-reports.component.scss']
})
export class CommentReportsComponent implements OnInit{
  displayedColumns: string[] = [ 'idComment','userName', 'idUser' ,'mangaName','commentData','dateComment','action'];
  dataSource: any;
  reportedComments: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService,private toastr: ToastrService, public dialog: MatDialog,
    private authService:AuthService,private reportService: ReportService) { }

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


  ngOnInit(): void {
    forkJoin([
      this.userService.getReportedComments(),
      this.userService.getReportedRepComments()
    ]).subscribe({
      next: ([reportedComments, reportedRepComments]) => {
        // Gộp dữ liệu từ cả hai nguồn
        const combinedData = [...reportedComments, ...reportedRepComments];
        this.dataSource = new MatTableDataSource(combinedData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        // Xử lý lỗi
      }
    });
  }

  getReportedCommentsList(){
    this.userService.getReportedComments().subscribe({
      next: (res : any)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getReportedRepCommentsList(){
    this.userService.getReportedRepComments().subscribe({
      next: (res : any)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }



  deleteReport(commentId: string) {
    const confirmation = confirm('Bạn có muốn xóa báo cáo này không?');
  
    if (confirmation) {
      forkJoin([
        this.userService.deleteReported(commentId).pipe(
          catchError((error) => {
            console.error('Lỗi khi xóa báo cáo:', error);
            return of(error.status);
          }),
          map(response => response.status === 200)
        ),
        this.userService.deleteReportedRep(commentId).pipe(
          catchError((error) => {
            console.error('Lỗi khi xóa báo cáo:', error);
            return of(error.status);
          }),
          map(response => response.status === 200)
        )
      ]).subscribe({
        next: ([result1, result2]) => {
          if (result1 === true || result2 === true) {
            this.toastr.success('Đã xóa báo cáo', 'Báo cáo');
          } else {
            this.toastr.error('Không thể xóa báo cáo', 'Lỗi');
          }
          this.ngOnInit();
        }
      });
    } else {
      console.log('Hành động xóa báo cáo đã bị hủy bỏ');
    }
  }
  


  hideContent(commentId: string) {
    forkJoin([
      this.userService.hideCommentContent(commentId).pipe(
        catchError((error) => {
          console.error('Lỗi khi cảnh cáo:', error);
          return of(error.status);
        }),
        map(response => response.status === 200)
      ),
      this.userService.hideRepCommentContent(commentId).pipe(
        catchError((error) => {
          console.error('Lỗi khi cảnh cáo:', error);
          return of(error.status);
        }),
        map(response => response.status === 200)
      )
    ]).subscribe({
      next: ([result1, result2]) => {
        if (result1 === true || result2 === true) {
          this.toastr.success('Đã cảnh cáo bình luận này', 'Báo cáo');
        } else {
          this.toastr.error('Có lỗi khi cảnh cáo bình luận', 'Lỗi');
        }
        this.ngOnInit();
      }
    });

  }

  lockAccount(userId: string) {
    const dialogRef = this.dialog.open(ComfirmUserComponent, {
      width: '250px',
      data: { userId: this.dataSource.idUser }
    });
    dialogRef.afterClosed().subscribe(daysToLock => {
      if (daysToLock) {
        this.authService.lockUserAccount(userId,daysToLock).subscribe(
          response => {
            console.log(response.message);
            this.toastr.success('Đã khóa tài khoản!');
            this.ngOnInit();
          },
          error => {
            console.error('Có lỗi khi khóa tài khoản', error);
            this.toastr.error('Có lỗi khi khóa tài khoản', 'Lỗi');
          }
        )
      }
    });
  }

}