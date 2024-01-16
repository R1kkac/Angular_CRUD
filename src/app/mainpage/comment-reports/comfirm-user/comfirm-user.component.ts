import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comfirm-user',
  templateUrl: './comfirm-user.component.html',
  styleUrls: ['./comfirm-user.component.scss']
})
export class ComfirmUserComponent {
  days?: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
