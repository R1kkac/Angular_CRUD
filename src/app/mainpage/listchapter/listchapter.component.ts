import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterView } from 'src/app/class/ChapterView';
import { MangaService } from 'src/app/service/manga.service';
import { ChapterformComponent } from '../chapterform/chapterform.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@Component({
  selector: 'app-listchapter',
  templateUrl: './listchapter.component.html',
  styleUrls: ['./listchapter.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatIconModule,MatButtonModule, MatDialogModule,CommonModule,MatTooltipModule,MatSlideToggleModule],
})
export class ListchapterComponent implements OnInit{
  displayedColumns: string[] = ['chapterId', 'chapterName', 'chapterTitle', 'chapterDate','action'];
  mangaId!: string;
  dataSource: MatTableDataSource<ChapterView> = new MatTableDataSource(); // Khởi tạo ở đây


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('mangaId');
      if (id) {
        this.mangaId = id;
        this.layDanhSachChuong(this.mangaId);
      } else {
        alert('Không lấy được dữ liệu');
        // Tùy chọn, điều hướng trở lại hoặc đến trang lỗi
      }
    });
  }

  layDanhSachChuong(id: string) {
    this.mangaService.getListChapter(id).subscribe(
      (chuong) => {
        this.dataSource.data = chuong; // Gán dữ liệu cho dataSource
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (loi) => {
        console.error('Lỗi khi lấy danh sách chương:', loi);
        // Xử lý lỗi ở đây
      }
    );
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //Mở Form thêm Chapter
  openAddForm() {
    // Sử dụng property 'data' để truyền 'mangaId' vào 'ChapterformComponent'
    const dialogRef = this.dialog.open(ChapterformComponent, {
      data: { mangaId: this.mangaId } // Truyền 'mangaId' hiện tại vào dialog
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Kiểm tra nếu có kết quả trả về là 'true', có nghĩa là thêm chương thành công
      if (result === true) {
        // Cập nhật dữ liệu bảng sau khi dialog đóng mà không cần reload trang
        this.layDanhSachChuong(this.mangaId);
      }
    });
  }

  openEditForm(row: any) {
    const dialogRef = this.dialog.open(ChapterformComponent, {
      data: { 
        mangaId: this.mangaId, 
        chapterId: row.chapterId,
        chapterName: row.chapterName,
        chapterTitle: row.chapterTitle

       } // Truyền 'mangaId' và 'chapterId' vào dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Logic xử lý sau khi dialog đóng, ví dụ cập nhật danh sách chương
      if (result === true) {
        this.layDanhSachChuong(this.mangaId);
      }
    });
  }

  onDelete(chapter: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: chapter.chapterName }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mangaService.deleteChapter(this.mangaId, chapter.chapterId).subscribe({
          next: () => {
            alert('Xóa chương thành công');
            this.layDanhSachChuong(this.mangaId);
          },
          error: (error) => {
            // Xử lý lỗi tại đây
            // Ví dụ: Hiển thị thông báo lỗi
            console.error('Có lỗi xảy ra khi xóa chương:', error);
          }
        });
      }
    });
  }

  goBackToMangas() {
    this.route.queryParams.subscribe(params => {
      const isPersonal  = params['isPersonal'] === 'true';
      if (isPersonal) {
        this.router.navigate(['/Mangas'], { queryParams: { isPersonal: isPersonal } });
      } else {
        this.router.navigate(['/Mangas']);
      }
    });
  }
    // this.router.navigate(['/Mangas']);   
}
