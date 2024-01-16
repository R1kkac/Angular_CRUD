import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels = ['Truyện Tranh', 'Người Đăng Ký', 'Lượt Xem'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataset<'bar', number[]>[] = [
    { data: [65, 59, 80], label: 'Số Lượng' }
  ];
  constructor() { }

  // Thêm logic để lấy dữ liệu từ API
}
