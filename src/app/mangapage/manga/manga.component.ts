import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MangaClass } from 'src/app/class/manga';
import { WebsiteServiceService } from 'src/app/service/website.service.service';
import { ActivatedRoute } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.component.html',
  styleUrls: ['./manga.component.scss']
})
export class MangaComponent implements OnInit{
  data: any;
  manga: MangaClass;
  isShowheader=true;
  listchapter: any;
  constructor(private location: Location,private mangaService: MangaService, private webservice: WebsiteServiceService, private route:ActivatedRoute){
    this.manga=new MangaClass();
    this.isShowheader=true;
    this.webservice.isViewHeader(this.isShowheader);
  }
  ngOnInit(): void { 
    this.route.params.subscribe(async (params: any)=>{
      this.manga= await this.mangaService.Getinfomanga(params['mangaid']);
      // this.listchapter= await this.getlistmanga(this.manga.mangaId);
    })
  }
  // async getlistmanga(id: string){
  //   const result= await this.mangaService.getListChapter(id);
  //   const data= (result===false)? null : result;
  //   return data;
  // }
}
