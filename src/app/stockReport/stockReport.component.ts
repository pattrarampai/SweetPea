import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from '../_shared/rest-api.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { StockReport } from '../interface/stockReport';
import { Stock } from '../interface/stock';
import { Flower } from '../interface/flower';
import { Florist } from '../interface/florist';
import { PromotionDetail } from '../interface/promotion-detail';
import { PromotionDetailLog } from '../interface/promotion-detail-log';
import { FlowerFormulaDetail } from '../interface/flower-formula-detail';
import { FlowerFormula } from '../interface/flower-formula';
//import * as _moment from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
//import * as moment from 'moment';
//import { Moment } from 'moment';
import * as _moment from 'moment';
import * as moment from 'moment';
import { Moment } from 'moment';
//import {default as _rollupMoment, Moment} from 'moment';

//const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
    selector: 'stockReport',
    templateUrl: './stockReport.component.html',
    styleUrls: ['./stockReport.component.css'],
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
  
export class StockReportComponent implements OnInit {
    selectedValue: string | undefined;
    displayedColumns: string[] = [];
    dataSource: any;
    stockReport: StockReport[] = [];
    stock: Stock[] = [];
    promotionDetails: PromotionDetail[] = [];
    formulaDetails: FlowerFormulaDetail[] = [];
    flower: Flower[] = [];

    flowers = [
        { value: '0', viewValue: '' },
        { value: '1', viewValue: 'กุหลาบขาว' },
        { value: '2', viewValue: 'กุหลาบแดง' },
        { value: '3', viewValue: 'กุหลาบชมพู' },
        { value: '4', viewValue: 'กุหลาบมาแชล' },
        { value: '5', viewValue: 'ทานตะวัน' },
        { value: '6', viewValue: 'ไฮเดนเยีย' }
      ];

      month = [
        {value: '0', viewValue: '' },
          {value: '1', viewValue: 'มกราคม' },
          {value: '2', viewValue: 'กุมภาพันธ์' },
          {value: '3', viewValue: 'มีนาคม' },
          {value: '4', viewValue: 'เมษายน' },
          {value: '5', viewValue: 'พฤษภาคม' },
          {value: '6', viewValue: 'มิถุนายน' },
          {value: '7', viewValue: 'กรกฏาคม' },
          {value: '8', viewValue: 'สิงหาคม' },
          {value: '9', viewValue: 'กันยายน' },
          {value: '10', viewValue: 'ตุลาคม' },
          {value: '11', viewValue: 'พฤศจิกายน' },
          {value: '12', viewValue: 'ธันวาคม' }
      ];
      endDate = new Date();
      currentDate = new Date();
      firstDate = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(), 1);
      startDate = new FormControl(this.firstDate);
    stockReportForm = new FormGroup({
        flower: new FormControl(),
        month: new FormControl(),
        date: new FormControl(moment())
      });

      constructor(
        private restApiService: RestApiService,
      ) { }

    async ngOnInit(): Promise<void> {
      this.stockReport = [];
        this.displayedColumns = ['id', 'flower', 'florist','inPromotionQty', 'inPromotionSoldQty' ,'waste','unit'];
       
        this.flower =  await this.restApiService.getFlower().toPromise();
        //filter distince
        this.flower  = this.flower.filter((thing, i, arr) => arr.findIndex(t => t.flowerCategory === thing.flowerCategory) === i);
        let flowerItem: {
          id: number;
          flowerName: string;
          mainCategory: string;
          isStock: boolean;
          lifeTime: number;
          unit: string;
          isFreeze: boolean;
          flowerCategory: string;
          flowerType: string;
          capacity: number;
        }=
        {
          id : -1,
          flowerName: '',
          mainCategory: '',
          isStock: false,
          lifeTime: 0,
          unit: '',
          isFreeze: false,
          flowerCategory: '',
          flowerType: '',
          capacity: 0
          };
       
          this.flower.splice(0,0,flowerItem);
          this.flower = this.flower.sort((a, b) => a.id - b.id);;



        this.promotionDetails = await this.restApiService.getCurrentPromotion().toPromise();

        // this.restApiService.getCurrentPromotion().subscribe(async (data: PromotionDetail[]) => {
        //   for (let i = 0; i < data.length; i++) {
        //     this.promotionDetails.push(data[i]);
        //   }
        // });
        console.log( 'Promotion Detail' +this.formulaDetails);

        //TODO find flower in flower formula detail  get formuladetial from formulaId in promotion
        for (let i = 0; i < this.promotionDetails.length; i++)
        {
          this.restApiService.getFormulaDetailsFromFormulaId(this.promotionDetails[i].flowerFormula.id).subscribe(async (data: FlowerFormulaDetail[]) => {
            for (let j = 0; j < data.length; j++) {
              this.formulaDetails.push(data[j]);
            }
          });
        }

        console.log( 'formola Detail' +this.formulaDetails);
        this.restApiService.getStockByDate('01-01-2021','12-31-2021').subscribe(async(stockResult: Stock[]) => {
            for (let i = 0; i < stockResult.length; i++) {
                this.stock.push(stockResult[i]);
              //  this.stock = this.totalAmount + data[i].flowerPrice;
                var expireDate = new Date(stockResult[i].lot);
               expireDate.setDate(expireDate.getDate() + stockResult[i].flower.lifeTime);
              /// expireDate.setDate(result);
              //  console.log('expire = ' + expireDate);
               // expireDate.
               // expireDate.setDate( stockResult[i].lot.getDate() + 1);
//this.addDays(new Date(this.gDetailDS.activeFrom),this.gDetailDS.activeNoDays)
//console.log('expire'+ expireDate.getDate())
var lot = new Date(stockResult[i].lot);
var expireDays = Number(expireDate.getDay());
var currentDate =  new Date();
var currentDays = Number(currentDate.getDay());
var lifeTime = 0;
var promotionQty = 0;
var promotionSoldQty = 0;
var formulaDetailsFilter: FlowerFormulaDetail[] = [];
var promotionDetailsFilter: PromotionDetail[] = [];


if (expireDays - currentDays < 0 )
{
  lifeTime = 0;
} 
else
{
  lifeTime = expireDays - currentDays;
}
//TODO formulaDetailFilter =  filter by flower 
//console.log('flower name = ' + stockResult[i].flower.flowerName);
 formulaDetailsFilter = this.formulaDetails.filter(p=>p.flower.flowerName == stockResult[i].flower.flowerName);

//  for(let j= 0; j < formulaDetailsFilter.length ; j++)
//  {
//     promotionQty = promotionQty +  formulaDetailsFilter[j].quantity;
//     promotionDetailsFilter = this.promotionDetails.filter(f=>f.flowerFormula.id==formulaDetailsFilter[j].flowerFormula.id)
//     if (promotionDetailsFilter != null)
//     {
//     promotionSoldQty = promotionDetailsFilter[0].quantitySold * formulaDetailsFilter[j].quantity;
//     }
//  }

////console.log('promoQty = '+ promotionQty + 'SoldQty = ' + promotionSoldQty)

//console.log('expire = ' + expireDays + 'today = ' + currentDays)
              let stockItem: {
                id: number;
                flower: Flower;
                quantity: number;
                unit: string;
                lot: Date;
                florist: Florist;
                expireDate : number;
                inPromotionQty : number;
                inPromotionSoldQty : number;
                waste : number;
              } = {
                id: i+1,
                flower: stockResult[i].flower,
                quantity: stockResult[i].quantity,
                unit: stockResult[i].unit,
                lot: stockResult[i].lot,
                florist: stockResult[i].florist,
                expireDate : lifeTime,
                inPromotionQty : promotionQty,
                inPromotionSoldQty : promotionSoldQty,
                waste : stockResult[i].deleteQty
              };
              this.stockReport.push(stockItem);
              promotionSoldQty = 0;
              promotionQty = 0;
              promotionDetailsFilter = [];
              formulaDetailsFilter = [];
              }
             // console.log(this.promotionDetails);

             //Combine flowername
             var flowerUnique = this.stockReport.filter((thing, i, arr) => arr.findIndex(t => t.flower.flowerName === thing.flower.flowerName) === i);
             
             //this.flower  = this.flower.filter((thing, i, arr) => arr.findIndex(t => t.flowerCategory === thing.flowerCategory) === i);
             for (let i = 0; i < flowerUnique.length; i++) 
             {
                flowerUnique[i].waste = 0;
                var flowerNameItem = this.stockReport.filter( j=>j.flower.flowerName== flowerUnique[i].flower.flowerName)

                for(let k = 0; k < flowerNameItem.length; k++)
                {
                  flowerUnique[i].waste = flowerUnique[i].waste + flowerNameItem[k].waste;
                  flowerUnique[i].inPromotionQty = flowerUnique[i].inPromotionQty + flowerNameItem[k].inPromotionQty;
                  flowerUnique[i].inPromotionSoldQty = flowerUnique[i].inPromotionSoldQty + flowerNameItem[k].inPromotionSoldQty;
                }
             }
              
             flowerUnique = flowerUnique.sort((a,b)=> b.waste - a.waste);
             this.stockReport = this.stockReport.sort((a, b) => b.waste - a.waste);
             for (let i = 0; i < this.stockReport.length; i++) 
             {
                 this.stockReport[i].id = i+1;
             } 
             this.dataSource = new MatTableDataSource<StockReport>(flowerUnique);
      //  this.dataSource = new MatTableDataSource<StockReport>(this.stockReport);
        })

    }
    date = new FormControl(moment());

    chosenYearHandler(normalizedYear: Moment) {
      const ctrlValue = this.date.value;
      ctrlValue.year(normalizedYear.year());
      this.date.setValue(ctrlValue);
    }
  
    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.date.value;
      ctrlValue.month(normalizedMonth.month());
      this.date.setValue(ctrlValue);
      this.stockReportForm.value.date = this.date.value; 
      datepicker.close();
    }

    searchStockReport()
    {
  //  var dateString = (this.stockReportForm.value.month).toString() + '-01-2021'; 
    this.stockReport = [];
    var fromDate = new Date();
    var toDate = new Date();
    var dateFromScreen = new Date();

    if(this.stockReportForm.value.date != null)
    {
    dateFromScreen = this.stockReportForm.value.date;
    var m = Number(this.stockReportForm.value.date.format('M'));

  //  m =  m.format('M').toString();
     // var m = this.stockReportForm.value.date.getMonth(); //current month
      //var y = this.stockReportForm.value.date.getFullYear(); //current year
     // var m = dateFromScreen.getMonth();
      var y = Number(this.stockReportForm.value.date.format('YYYY'));
      
      if(this.stockReportForm.value.date == null || this.stockReportForm.value.date == '')
      {
        fromDate = new Date(y,0,1);
        toDate = new Date(y,12,0);

      }
      else
      {
      fromDate = new Date(y,m-1,1);
      toDate = new Date(y,m,0);
      }
      this.restApiService.getStockByDate(fromDate,toDate).subscribe(async(stockResult: Stock[]) => {
        for (let i = 0; i < stockResult.length; i++) {
            this.stock.push(stockResult[i]);
          //  this.stock = this.totalAmount + data[i].flowerPrice;
            var expireDate = new Date(stockResult[i].lot);
           expireDate.setDate(expireDate.getDate() + stockResult[i].flower.lifeTime);

var lot = new Date(stockResult[i].lot);
var expireDays = Number(expireDate.getDay());
var currentDate =  new Date();
var currentDays = Number(currentDate.getDay());
var lifeTime = 0;
var promotionQty = 0;
var promotionSoldQty = 0;
var formulaDetailsFilter: FlowerFormulaDetail[] = [];
var promotionDetailsFilter: PromotionDetail[] = [];


if (expireDays - currentDays < 0 )
{
lifeTime = 0;
} 
else
{
lifeTime = expireDays - currentDays;
}



//TODO formulaDetailFilter =  filter by flower 
//console.log('flower name = ' + stockResult[i].flower.flowerName);
formulaDetailsFilter = this.formulaDetails.filter(p=>p.flower.flowerName == stockResult[i].flower.flowerName);

for(let j= 0; j < formulaDetailsFilter.length ; j++)
{
promotionQty = promotionQty +  formulaDetailsFilter[j].quantity;
promotionDetailsFilter = this.promotionDetails.filter(f=>f.flowerFormula.id==formulaDetailsFilter[j].flowerFormula.id)
if (promotionDetailsFilter != null)
{
promotionSoldQty = promotionDetailsFilter[0].quantitySold * formulaDetailsFilter[j].quantity;
}

}
//console.log('promoQty = '+ promotionQty + 'SoldQty = ' + promotionSoldQty)

          let stockItem: {
            id: number;
            flower: Flower;
            quantity: number;
            unit: string;
            lot: Date;
            florist: Florist;
            expireDate : number;
            inPromotionQty : number;
            inPromotionSoldQty : number;
            waste : number;
          } = {
            id: stockResult[i].id,
            flower: stockResult[i].flower,
            quantity: stockResult[i].quantity,
            unit: stockResult[i].unit,
            lot: stockResult[i].lot,
            florist: stockResult[i].florist,
            expireDate : lifeTime,
            inPromotionQty : promotionQty,
            inPromotionSoldQty : promotionSoldQty,
            waste : stockResult[i].deleteQty
          };
          this.stockReport.push(stockItem);
          promotionSoldQty = 0;
          promotionQty = 0;
          promotionDetailsFilter = [];
          formulaDetailsFilter = [];
          }

          if (this.stockReportForm.value.flower != null && this.stockReportForm.value.flower != '')
          {
            if(this.stockReport.length > 0)
            {
              this.stockReport = this.stockReport.filter(d=>d.flower.flowerName.includes(this.stockReportForm.value.flower));    
              for (let i = 0; i < this.stockReport.length; i++) 
              {
                  this.stockReport[i].id = i+1;
              }    
            }
            else
            {
              this.dataSource = new MatTableDataSource<StockReport>(this.stockReport);
            }

          }
          else
          {
            for (let i = 0; i < this.stockReport.length; i++) 
            {
                this.stockReport[i].id = i+1;
            } 
          this.dataSource = new MatTableDataSource<StockReport>(this.stockReport);
          }
          this.stockReport = this.stockReport.sort((a, b) => b.waste - a.waste);
          for (let i = 0; i < this.stockReport.length; i++) 
          {
              this.stockReport[i].id = i+1;
          } 
          this.dataSource = new MatTableDataSource<StockReport>(this.stockReport);

    })
    }
    else
  {
    this.restApiService.getStockByDate('01-01-2021','12-31-2021').subscribe(async(stockResult: Stock[]) => {
      for (let i = 0; i < stockResult.length; i++) {
          this.stock.push(stockResult[i]);
        //  this.stock = this.totalAmount + data[i].flowerPrice;
          var expireDate = new Date(stockResult[i].lot);
         expireDate.setDate(expireDate.getDate() + stockResult[i].flower.lifeTime);
        /// expireDate.setDate(result);
        //  console.log('expire = ' + expireDate);
         // expireDate.
         // expireDate.setDate( stockResult[i].lot.getDate() + 1);
//this.addDays(new Date(this.gDetailDS.activeFrom),this.gDetailDS.activeNoDays)
//console.log('expire'+ expireDate.getDate())
var lot = new Date(stockResult[i].lot);
var expireDays = Number(expireDate.getDay());
var currentDate =  new Date();
var currentDays = Number(currentDate.getDay());
var lifeTime = 0;
var promotionQty = 0;
var promotionSoldQty = 0;
var formulaDetailsFilter: FlowerFormulaDetail[] = [];
var promotionDetailsFilter: PromotionDetail[] = [];


if (expireDays - currentDays < 0 )
{
lifeTime = 0;
} 
else
{
lifeTime = expireDays - currentDays;
}
//TODO formulaDetailFilter =  filter by flower 
//console.log('flower name = ' + stockResult[i].flower.flowerName);
formulaDetailsFilter = this.formulaDetails.filter(p=>p.flower.flowerName == stockResult[i].flower.flowerName);
        let stockItem: {
          id: number;
          flower: Flower;
          quantity: number;
          unit: string;
          lot: Date;
          florist: Florist;
          expireDate : number;
          inPromotionQty : number;
          inPromotionSoldQty : number;
          waste : number;
        } = {
          id: i+1,
          flower: stockResult[i].flower,
          quantity: stockResult[i].quantity,
          unit: stockResult[i].unit,
          lot: stockResult[i].lot,
          florist: stockResult[i].florist,
          expireDate : lifeTime,
          inPromotionQty : promotionQty,
          inPromotionSoldQty : promotionSoldQty,
          waste : stockResult[i].deleteQty
        };
        this.stockReport.push(stockItem);
        promotionSoldQty = 0;
        promotionQty = 0;
        promotionDetailsFilter = [];
        formulaDetailsFilter = [];
        }
       // console.log(this.promotionDetails);

       //Combine flowername
       var flowerUnique = this.stockReport.filter((thing, i, arr) => arr.findIndex(t => t.flower.flowerName === thing.flower.flowerName) === i);
       
       //this.flower  = this.flower.filter((thing, i, arr) => arr.findIndex(t => t.flowerCategory === thing.flowerCategory) === i);
       for (let i = 0; i < flowerUnique.length; i++) 
       {
          flowerUnique[i].waste = 0;
          var flowerNameItem = this.stockReport.filter( j=>j.flower.flowerName== flowerUnique[i].flower.flowerName)

          for(let k = 0; k < flowerNameItem.length; k++)
          {
            flowerUnique[i].waste = flowerUnique[i].waste + flowerNameItem[k].waste;
            flowerUnique[i].inPromotionQty = flowerUnique[i].inPromotionQty + flowerNameItem[k].inPromotionQty;
            flowerUnique[i].inPromotionSoldQty = flowerUnique[i].inPromotionSoldQty + flowerNameItem[k].inPromotionSoldQty;
          }
       }
        
       flowerUnique = flowerUnique.sort((a,b)=> b.waste - a.waste);
       this.stockReport = this.stockReport.sort((a, b) => b.waste - a.waste);
       for (let i = 0; i < this.stockReport.length; i++) 
       {
           this.stockReport[i].id = i+1;
       } 
       this.dataSource = new MatTableDataSource<StockReport>(flowerUnique);
//  this.dataSource = new MatTableDataSource<StockReport>(this.stockReport);
  })
    
  }
  }
  
  
}

function getDifferenceInDays(lot: Date, expireDate: Date): number {
    throw new Error('Function not implemented.');
}
