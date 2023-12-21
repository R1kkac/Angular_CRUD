import {Component, OnInit } from '@angular/core';
import { WebsiteServiceService } from './service/website.service.service';
import { MangaService, Searchmanga } from './service/manga.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'DemoWebTruyen_01_09_2023';
  isViewHeader!: boolean;
  constructor(private webService: WebsiteServiceService, private mangaService: MangaService){

  }
  async ngOnInit(): Promise<void> {
    this.webService.data$.subscribe((res : any)=>{
      this.isViewHeader=res;
    })
    await this.mangaService.searchmanga();
  }
  
}
