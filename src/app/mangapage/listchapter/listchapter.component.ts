import {  Component, Input, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-listchapter',
  templateUrl: './listchapter.component.html',
  styleUrls: ['./listchapter.component.scss']
})
export class ListchapterComponent implements OnInit {

  @Input() listchapter:any;
  constructor(private mangaService: MangaService, private toastr: ToastrService, private router: Router,private route: ActivatedRoute){
  }
  ngOnInit(): void {
    try{
      this.listchapter= this.listchapter.sort((a: any, b: any) => a.chapter_Name.localeCompare(b.chapter_Name));
    }catch(error){}
  }
 
  read(id : string, manga_Id: string, chaptername: string){
    this.router.navigate([manga_Id,id,chaptername.replace(' ','-')]);
  }
}   