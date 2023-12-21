import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MangaService } from 'src/app/service/manga.service';

@Component({
  selector: 'app-searbar-v2',
  templateUrl: './searbar-v2.component.html',
  styleUrls: ['./searbar-v2.component.scss']
})
export class SearbarV2Component implements AfterViewInit{
  
  data: string='';
  suggestions: any;
  myControl = new FormControl('');
  @ViewChild('inputElement') search!: ElementRef;
  constructor(private  mangaService: MangaService, private router: Router, private toastr: ToastrService ){}

  async timkiem(value: string){
    try{
      this.router.navigate(['/Manga', value]);
    }catch(error){
      this.toastr.error('Không tìm thấy truyện');
    }
  }
  ngAfterViewInit(): void {
    this.search.nativeElement.addEventListener('input',async (event: InputEvent)=>{
      if(this.data!=='')
      {
        var result= await this.mangaService.searchmangaV2(this.data);
        this.suggestions=result;
      }
    })
  }
  async onOptionSelected(event: any){
    const selectedOption = event.option.value;
    await this.timkiem(selectedOption.mangaId);
    this.data='';
  }
}

