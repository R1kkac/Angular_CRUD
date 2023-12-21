import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/service/manga.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit{
  listManga: any;
  @ViewChild('next') nextButton!: ElementRef;
  @ViewChild('prev') prevButton!: ElementRef;
  @ViewChild('slide') slide!: ElementRef;

  constructor(private mangaSerVice: MangaService,  private el: ElementRef, private router: Router){
  }

  ngOnInit(): void {
    this.mangaSerVice.GetManga(1).subscribe((res: any)=>{
      if(res!=null){}
      //Slice cắt 6 phẩn tử tử từ 0-6 và truyền vào list
      this.listManga=res.slice(0,6);
    })
  }
  onNextClick() {
    const lists = document.querySelectorAll('.item');
    this.slide.nativeElement.appendChild(lists[0]);
  }

  onPrevClick() {
    const lists = document.querySelectorAll('.item');
    this.slide.nativeElement.prepend(lists[lists.length - 1]);
  }
  Info(data: any){
    //  this.router.navigate(['/Manga',data.mangaId], { state: { manga: data } }); //có thể truyền nhiều tham số trong state{manga: data, user:dada}
     this.router.navigate(['/Manga',data.mangaId]);

  }
}
