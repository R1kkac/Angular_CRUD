import { Component, OnInit } from '@angular/core';
import { WebsiteServiceService } from 'src/app/service/website.service.service';
import { MangaService } from 'src/app/service/manga.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-viewchapter',
  templateUrl: './viewchapter.component.html',
  styleUrls: ['./viewchapter.component.scss']
})
export class ViewchapterComponent implements OnInit{

  mangaid!: string;
  chapterid!: string;
  listImage: any;
  isShowheader=false;
  constructor(private service: WebsiteServiceService, private route: ActivatedRoute, private mangaService: MangaService){
    this.service.isViewHeader(this.isShowheader);
  }
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params: any)=>{
      this.mangaid= params['mangaid'];
      this.chapterid=params['chapterid'];
    })
    this.listImage= await this.danhSachAnh(this.mangaid, this.chapterid );
  }
   async danhSachAnh(mangaid: string, chapterid: string){
      return await this.mangaService.getDsImage(mangaid,chapterid);
  }
}
