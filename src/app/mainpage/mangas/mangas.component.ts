import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MangaService } from 'src/app/service/manga.service';
import { MatIconModule } from '@angular/material/icon';
import { AddeditformComponent } from '../addeditform/addeditform.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TypeManga } from 'src/app/class/TypeMangaView.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-mangas',
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatIconModule,MatButtonModule, MatDialogModule,CommonModule,MatTooltipModule,MatSlideToggleModule],
})


export class MangasComponent implements OnInit {
  
  displayedColumns: string[] = ['mangaId', 'mangaName', 'mangaDetails', 'mangaImage', 'mangaAlternateName', 'authors', 'artists', 'type', 'genres', 'Status','action'];
  dataSource: any;
  typeMangas: TypeManga[] = [];
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private mangaService: MangaService, private dialog: MatDialog, private router: Router,private route: ActivatedRoute,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.mangaService.GetAllType().subscribe((types: TypeManga[]) => {
      this.typeMangas = types;
      this.route.queryParams.subscribe(params => {
        const isPersonal  = params['isPersonal'] === 'true';
        if (isPersonal) {
          this.getUserMangaList();
        } else {
          this.getMangaList();
        }
      });
    });
    
  }

  getTypeName(id: number): string {
    const type = this.typeMangas.find(t => t.id === id);
    return type ? type.name : 'N/A';
  }

  getGenres(manga: any): string {
    return manga.listcategory?.map((g: any) => g.genresIdName).join(', ') || 'N/A';
  }

  getArtists(manga: any): string {
    return manga.listartist?.map((g: any) => g.name).join(', ') || 'N/A';
  }

  getAuthors(manga: any): string {
    return manga.listauthor?.map((g: any) => g.name).join(', ') || 'N/A';
  }

  getMangaList(){
    this.mangaService.GetAllManga().subscribe({
      next: (res : any)=>{
        const filteredRes = res.filter((manga: any) => manga.deleteStatus === true);
        this.dataSource = new MatTableDataSource(filteredRes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }


  getUserMangaList(){
    this.mangaService.GetUserManga().subscribe({
      next: (res : any)=>{
        const filteredRes = res.filter((manga: any) => manga.deleteStatus === true);
        this.dataSource = new MatTableDataSource(filteredRes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
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
  

  onDelete(manga: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { Name: manga.mangaName }
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.mangaService.DeleteStatus(manga.mangaId);
          alert('Truyện đã được chuyển vào mục "Truyện đã xóa"');
          // this.getMangaList();
          this.ngOnInit();
        } catch (error) {
          // Xử lý lỗi tại đây
          alert('Không thể xóa truyện');
          console.error('Có lỗi xảy ra khi xóa manga:', error);
        }
      }
    });
}

  openAddForm() {
  this.router.navigate(['/Add-manga']); 
  }

  openEditForm(mangaId: string) {
    // this.router.navigate(['/Edit-manga', mangaId] ); 

    this.route.queryParams.subscribe(params => {
      const isPersonal  = params['isPersonal'] === 'true';
      if (isPersonal) {
        this.router.navigate(['Edit-manga',mangaId], { queryParams: { isPersonal: isPersonal } });
      } else {
        this.router.navigate(['Edit-manga',mangaId,]);
      }
    });
  }
 
  
  openListChapter(mangaId: string): void {
    this.route.queryParams.subscribe(params => {
      const isPersonal  = params['isPersonal'] === 'true';
      if (isPersonal) {
        this.router.navigate(['List-chapter',mangaId], { queryParams: { isPersonal: isPersonal } });
      } else {
        this.router.navigate(['List-chapter',mangaId,]);
      }
    });
  }
}

