import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { catchError, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { MangaService } from 'src/app/service/manga.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels1 = ['Lượt Xem Trong ngày', 'Số Truyện Tranh', 'Số Người Đăng Ký'];
  public barChartLabels2 = ['Trong ngày', 'Trong tháng', 'Trong năm'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;


  public barChartData1: ChartDataset<'bar', number[]>[] = [
    { data: [0, 0, 0], label: 'Số Lượng' }
  ];
  public barChartData2: ChartDataset<'bar', number[]>[] = [
    { data: [0, 0, 0], label: 'Lượt xem' }
  ];
  constructor(private authService: AuthService, private mangaService: MangaService) { }

  ngOnInit() {
    this.loadData1();
    this.loadData2();
  }

  loadData1() {
    forkJoin({
      viewByDay: this.mangaService.getViewByDay(),
      mangaCount: this.mangaService.getNumberAllManga(),
      userCount: this.authService.getNumberAllUser()
    })
    .pipe(
      catchError(error => {
        console.error('There was an error!', error);
        throw error;
      })
    )
    .subscribe(({ viewByDay, mangaCount, userCount }) => {
      this.barChartData1 = [
        { ...this.barChartData1[0], data: [viewByDay, mangaCount, userCount] }
      ];
    });
  }

  loadData2() {
    forkJoin({
      viewByDay: this.mangaService.getViewByDay(),
      viewByMonth: this.mangaService.getViewByMonth(),
      viewByYear: this.mangaService.getViewByYear()
    })
    .pipe(
      catchError(error => {
        console.error('There was an error!', error);
        throw error;
      })
    )
    .subscribe(({ viewByDay, viewByMonth, viewByYear }) => {
      this.barChartData2 = [
        { ...this.barChartData2[0], data: [viewByDay, viewByMonth, viewByYear] }
      ];
    });
  }

 
}
