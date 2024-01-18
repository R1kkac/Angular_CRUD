import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeManga } from 'src/app/class/TypeMangaView.model';
import { MangaService } from 'src/app/service/manga.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { AuthService } from 'src/app/service/auth.service';
import { user } from 'src/app/class/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mangadelete',
  templateUrl: './mangadelete.component.html',
  styleUrls: ['./mangadelete.component.scss']
})
export class MangadeleteComponent implements OnInit{
  displayedColumns: string[] = ['mangaId', 'mangaName', 'mangaDetails', 'mangaImage', 'mangaAlternateName', 'mangaAuthor', 'mangaArtist', 'type', 'genres','Status' ,'action'];
  dataSource: any;
  typeMangas: TypeManga[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router,
    private route: ActivatedRoute,private authService: AuthService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.mangaService.GetAllType().subscribe((types: TypeManga[]) => {
      this.typeMangas = types;
      this.route.queryParams.subscribe(params => {
        const isAdmin = params['isAdmin'] === 'true';
        if (isAdmin) {
          this.getAdminMangaList();
        } else {
          this.getUserMangaList();
          // this.getAdminMangaList();
        }
      });
    });
  }

  getUserMangaList(){
    this.mangaService.GetUserManga().subscribe({
      next: (res : any)=>{
        const filteredRes = res.filter((manga: any) => manga.deleteStatus === false);
        this.dataSource = new MatTableDataSource(filteredRes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getAdminMangaList(){
    this.mangaService.GetAllManga().subscribe({
      next: (res : any)=>{
        const filteredRes = res.filter((manga: any) => manga.deleteStatus === false);
        this.dataSource = new MatTableDataSource(filteredRes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }


  getTypeName(id: number): string {
    const type = this.typeMangas.find(t => t.id === id);
    return type ? type.name : 'N/A';
  }

  getGenres(manga: any): string {
    return manga.listcategory?.map((g: any) => g.genresIdName).join(', ') || 'N/A';
  }

  async toggleStatus(manga: any): Promise<void> {
    try {
      const response = await this.mangaService.updateMangaStatus(manga);
      // Xử lý phản hồi
      // alert('Trạng thái cập nhật thành công');
      this.toastr.success('Trạng thái cập nhật thành công!');
    } catch (error) {
      // Xử lý lỗi
      alert('Không thể thay đổi trạng thái');
      console.error('Có lỗi xảy ra khi cập nhật trạng thái:', error);
      this.ngOnInit();
    }
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

  toggleDetails(event: Event, manga: any) {
    event.preventDefault();
    manga.showFullDetails = !manga.showFullDetails;
  }

  async onRecover(manga: any): Promise<void> {
    try {
      await this.mangaService.DeleteStatus(manga.mangaId);
      // alert('Phục hồi truyện thành công');
      this.toastr.success('Phục hồi truyện thành công!');
      this.ngOnInit(); // Hoặc gọi hàm cập nhật danh sách
    } catch (error) {
      // alert('Không thể phục hồi truyện');
      this.toastr.error('Không thể phục hồi truyện', 'Lỗi');
      console.error('Có lỗi xảy ra khi phục hồi truyện:', error);
    }
  }

  onDelete(manga: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: manga.mangaName }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mangaService.deleteManga(manga.mangaId).subscribe({
          next: (response) => {
            // alert('Xóa truyện thành công');
            this.toastr.success('Xóa truyện thành công!');
            // this.getMangaList();
            this.ngOnInit();
          },
          error: (error) => {
            // Xử lý lỗi tại đây
            // Ví dụ: Hiển thị thông báo lỗi
            // alert('Không thể xóa truyện');
            this.toastr.error('Không thể xóa truyện', 'Lỗi');
            console.error('Có lỗi xảy ra khi xóa manga:', error);
          }
        });
      }
    });
  }

}
