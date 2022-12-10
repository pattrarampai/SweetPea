import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from '../_shared/rest-api.service';
import { SalesOrderDetail } from '../interface/sales-order-detail'
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { SalesOrderElement } from '../interface/sales-order-element';
import { SalesOrderDetailListDto } from '../interface/sales-order-detail-list-dto';
import { ThisReceiver } from '@angular/compiler';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { PromotionDetailDto } from '../interface/promotion-detail-dto';
import { Florist } from '../interface/florist';
import { FlowerFormula } from '../interface/flower-formula';
import { SaleReportSummaryByFlowerformula } from '../interface/saleReportSummarybyFlowerformula';
import { Moment, months } from 'moment';
import { Stock } from '../interface/stock';
import { PromotionDetail } from '../interface/promotion-detail';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
    selector: 'saleSummary',
    templateUrl: './promotionReport.component.html',
    styleUrls: ['./promotionReport.component.css'],
    providers: [
      // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
      // application's root module. We provide it at the component level here, due to limitations of
      // our example generation script.
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },
  
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
  })
  

export class PromotionReportComponent implements OnInit  {
promotonDetailList: PromotionDetail[] = [];
saleOrderDetail: PromotionDetailDto[] = [];
totalPromotionOrderByMonth = new Array();
totalCostByMonth = new Array();
totalProfitByMonth = new Array();
promotionReportSumByformular: SaleReportSummaryByFlowerformula[] = [];
displayedColumns: string[] = [];
dataSource: any;
 fromDate  = new Date();
 toDate = new Date();
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [];
  stockByLot: Stock[]= [];
  // barChartData: ChartDataSets[] = [
  //   { data: [45, 37, 60, 70, 46, 33,0,0,0,0,0,0], label: 'ยอดขาย' },
  //   { data: [45, 37, 60, 70, 46, 33,0,0,0,0,0,0], label: 'กำไร' }
  // ];
  constructor(
    private restApiService: RestApiService,
  ) { }

  ngOnInit(): void {

    var promotionSalePerMonth: PromotionDetail[];
    var costMonth : Stock[];

    this.restApiService.getPromotionByDate('01-01-2021', '12-31-2021').subscribe(async (data: PromotionDetail[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotonDetailList.push(data[i]);
      }
  
      //Calculate Month 1

      for (let j = 0; j< 12 ; j++)
      {

        promotionSalePerMonth = this.promotonDetailList.filter(item => {let date = new Date(item.expiryDate);
        return (date.getMonth()) == j});

        this.totalPromotionOrderByMonth[j] = 0;
        for(let i =0; i < promotionSalePerMonth.length ; i++)
        {
          this.totalPromotionOrderByMonth[j] = this.totalPromotionOrderByMonth[j] + (promotionSalePerMonth[i].price * promotionSalePerMonth[i].quantitySold);
        }
      } 
    })

    this.restApiService.getStockByLot('01-01-2021', '12-31-2021').subscribe(async(stockResult: Stock[]) => {
      //console.log('stock ='+ stockResult);
      for (let i = 0; i < stockResult.length; i++) {
        this.stockByLot.push(stockResult[i]);
      }

      for (let j = 0; j< 12 ; j++)
      {

        costMonth = this.stockByLot.filter(stock => {let lot = new Date(stock.lot);
        return (lot.getMonth()) == j})
          this.totalCostByMonth[j] = 0;
          for(let i =0; i < costMonth.length; i++)
          {
            if( costMonth[i].flowerPrice != null)
            {
            this.totalCostByMonth[j] = this.totalCostByMonth[j] + costMonth[i].flowerPrice.price;
            }
          }

       //   this.totalProfitByMonth[j] = this.totalSaleOrderByMonth[j] - this.totalCostByMonth[j];

        }

    })

    this.barChartData.push({             // <-- push value to `ChartData`
    data: this.totalPromotionOrderByMonth,  
    label: 'ยอดขายจากโปรโมชั่น'        
    })

    // this.barChartData.push({             // <-- push value to `ChartData`
    // data: this.totalProfitByMonth,  
    // label: 'กำไร'        
    // })

  }
  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment,datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();

this.barChartData = [];
    var promotionSalePerMonth: PromotionDetail[];
    var costMonth : Stock[];
    this.totalPromotionOrderByMonth = [];
    this.promotonDetailList = [];
    this.stockByLot = [];
    this.totalCostByMonth = [];

    var y = Number(this.date.value.format('YYYY'));

    this.restApiService.getPromotionByDate('01-01-'+y, '12-31-'+y).subscribe(async (data: PromotionDetail[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotonDetailList.push(data[i]);
      }
  
      //Calculate Month 1

      for (let j = 0; j< 12 ; j++)
      {

        promotionSalePerMonth = this.promotonDetailList.filter(item => {let date = new Date(item.expiryDate);
        return (date.getMonth()) == j});

        this.totalPromotionOrderByMonth[j] = 0;
        for(let i =0; i < promotionSalePerMonth.length ; i++)
        {
          this.totalPromotionOrderByMonth[j] = this.totalPromotionOrderByMonth[j] + (promotionSalePerMonth[i].price * promotionSalePerMonth[i].quantitySold);
        }
      } 
    })

    this.restApiService.getStockByLot('01-01-'+y,'12-31-'+y).subscribe(async(stockResult: Stock[]) => {
      //console.log('stock ='+ stockResult);
      for (let i = 0; i < stockResult.length; i++) {
        this.stockByLot.push(stockResult[i]);
      }

      for (let j = 0; j< 12 ; j++)
      {

        costMonth = this.stockByLot.filter(stock => {let lot = new Date(stock.lot);
        return (lot.getMonth()) == j})
          this.totalCostByMonth[j] = 0;
          for(let i =0; i < costMonth.length; i++)
          {
            if( costMonth[i].flowerPrice != null)
            {
            this.totalCostByMonth[j] = this.totalCostByMonth[j] + costMonth[i].flowerPrice.price;
            }
          }

       //   this.totalProfitByMonth[j] = this.totalSaleOrderByMonth[j] - this.totalCostByMonth[j];

        }

    })

    this.barChartData.push({             // <-- push value to `ChartData`
    data: this.totalPromotionOrderByMonth,  
    label: 'ยอดขายจากโปรโมชั่น'        
    })

    // this.barChartData.push({             // <-- push value to `ChartData`
    // data: this.totalProfitByMonth,  
    // label: 'กำไร'        
    // })


  }
  selectDatabyMonth(e: any)
  {
    this.promotionReportSumByformular = [];
    this.promotonDetailList = [];
    this.saleOrderDetail = [];
    this.dataSource = [];
      console.log("month");
      //  console.log(e._view.Label);

   // this.restApiService.searchListSalesOrder(fromDate, toDate).subscribe((data: SalesOrderDetailListDto[]) => {})
   if (e.active.length > 0) {
    const chart = e.active[0]._chart;
    var label: any;
    var dateString: string;

    const activePoints = chart.getElementAtEvent(e.event);

      if ( activePoints.length > 0) 
      {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value)
        console.log('label index = '+ clickedElementIndex); 
        dateString = (clickedElementIndex +1).toString() + '-01-2021'; 
        this.fromDate = new Date(dateString);
        var m = this.fromDate.getMonth(); //current month
        var y = this.fromDate.getFullYear(); //current year
        
        this.toDate = new Date(y,m+1,0);
      }
       var totalPrice = 0;
  //     console.log('from : ' +this.fromDate + 'to : ' + this.toDate);
       this.restApiService.getPromotionByDate(this.fromDate, this.toDate).subscribe(async (data: PromotionDetail[]) => {
    for (let i = 0; i < data.length; i++) {
      this.promotonDetailList.push(data[i]);
    
           totalPrice = data[i].price;
    }
             for (let j = 0; j < this.promotonDetailList.length; j++)
             {
              let promotionDetailResult: {
                id: number;
                formulaName: String;
                size: String;
                quantity: number;
                profit: number;
                totalProfit: number;
                price: number;
                locationName: string;
                image: string;
              } = {
                id : this.promotonDetailList[j].flowerFormula.id,
                formulaName: this.promotonDetailList[j].flowerFormula.name,
                size: this.promotonDetailList[j].flowerFormula.size,
                quantity: this.promotonDetailList[j].quantitySold,
                profit: 0,
                totalProfit: 0,
                price: this.promotonDetailList[j].price,
                locationName: '',
                image: ""
              };
              this.saleOrderDetail.push(promotionDetailResult);
            }
            totalPrice =0;
        

   
        //find uniq 
        var arr = this.saleOrderDetail;
        var unique = [...new Set(this.saleOrderDetail.map(item => item.id))]; // [ 'A', 'B']
        console.log('unique = ' + unique)
        for (let j = 0; j < unique.length; j++)
        {

          let sumflowerFormulaItem: {
            id: number;
            formulaId: number;
            formulaName: String;
            quantity: number;
            totalPrice: number;
            locationName: string;
            image: string;
            } = {
            id: j,
            formulaId: unique[j],
            formulaName: String(this.saleOrderDetail.find(n=>n.id == unique[j])?.formulaName),
            quantity: 0,
            totalPrice: 0,
            locationName: "",
            image: ""
            }

          var uniqueFormular = this.saleOrderDetail.filter(s=>s.id == unique[j]);
          console.log('unique = ' + unique[j].toString() + uniqueFormular)
        for (let i = 0; i < uniqueFormular.length; i++) {

          sumflowerFormulaItem.quantity = sumflowerFormulaItem.quantity + uniqueFormular[i].quantity;
          sumflowerFormulaItem.totalPrice = sumflowerFormulaItem.totalPrice + uniqueFormular[i].price;
          this.promotionReportSumByformular.push(sumflowerFormulaItem);
          }
        }
                  
        console.log(this.saleOrderDetail);
        console.log(this.promotionReportSumByformular);
        this.promotionReportSumByformular.sort((a, b) => b.totalPrice - a.totalPrice);
        this.promotionReportSumByformular = Array.from(this.promotionReportSumByformular.reduce((m, t) => m.set(t.formulaName, t), new Map()).values()); // [ 'A', 'B']

        for( let i=0; i < this.promotionReportSumByformular.length; i++)
        {
          this.promotionReportSumByformular[i].id = i+1;
        }

        this.dataSource = new MatTableDataSource<SaleReportSummaryByFlowerformula>(this.promotionReportSumByformular);

       })
      }

      this.displayedColumns = ['id', 'formulaName', 'quantity', 'totalPrice'];
  }

}