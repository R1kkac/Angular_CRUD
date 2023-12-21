import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-listmanga',
  templateUrl: './listmanga.component.html',
  styleUrls: ['./listmanga.component.scss']
})
export class ListmangaComponent implements OnInit{

  danhsachtruyen: any;
  constructor(private mangaService: MangaService, private router: Router){}
  ngOnInit(): void {
    this.mangaService.GetManga(1).subscribe((res: any)=>{
      this.danhsachtruyen=res;
      //console.log(this.danhsachtruyen);
    })
    
  }
  infomanga(id: any){
    this.router.navigate(['/Manga',id]);
  }

  
}

