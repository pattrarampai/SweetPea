import { Component, OnInit } from '@angular/core';
import { PromotionDetail } from '../interface/promotion-detail';
import { PromotionDetailLog } from '../interface/promotion-detail-log';
import { RestApiService } from '../_shared/rest-api.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  promotionDetails: PromotionDetail[] = [];
  promotionDetailLogs: PromotionDetailLog[] = [];

  constructor(
    private restApiService: RestApiService
  ) { }

  ngOnInit(): void {
    this.restApiService.getCurrentPromotion().subscribe((data: PromotionDetail[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotionDetails.push(data[i]);
      }
    });

    this.restApiService.getSuggestPromotionDetailLog().subscribe((data: PromotionDetailLog[]) => {
      for (let i = 0; i < 4; i++) {
        this.promotionDetailLogs.push(data[i]);
      }
    });
  }
}
