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
import { Florist } from '../interface/florist';
import { Router } from '@angular/router';
import { Stock } from '../interface/stock';
import { FloristFee } from '../interface/floristFee';
@Component({
    selector: 'report',
    templateUrl: './saleReport.component.html',
    styleUrls: ['./saleReport.component.css']
  })
  
  export class SaleReportComponent implements OnInit {
   
  salesOrders: SalesOrderDetailListDto[] = [];
  stockByLot: Stock[]= [];
  numberOfOrder: number = 0;
  totalAmount: number = 0;
  totalCost: number = 0;
  totalProfit: number = 0;
  totalFloristFee: number = 0;
  displayedColumns: string[] = [];
  dataSource: any;
  floristFee: FloristFee | undefined ;
  searchFilter = new FormControl();
  currentDate = new Date();
  endDate = new Date();
  firstDate = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(), 1);
  startDate = new FormControl(this.firstDate);
  florists: Florist[] = [];
  saleReportForm = new FormGroup({
    startDate: new FormControl(this.firstDate),
    endDate: new FormControl(new Date()),
    totalAmount: new FormControl(),
    totalCost: new FormControl(),
    totalProfit: new FormControl(),
    totalFloristFee: new FormControl(),
    florist: new FormControl('')
  });
  

  constructor(
    private restApiService: RestApiService,
    public dialog: MatDialog,
    public router: Router,
  ) { }
  // florist = [
  //   { value: '1', viewValue: '' },
  //   { value: '2', viewValue: 'ซงหนิงหนิง' },
  //   { value: '3', viewValue: 'หนึ่ง' }
  // ];

    ngOnInit(): void {
      this.salesOrders = [];
      this.totalAmount = 0;
      this.totalCost = 0;
      this.totalFloristFee = 0;
      this.totalProfit = 0;
      
      var firstDate = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(), 1);
      this.saleReportForm.value.startDate = firstDate;
      this.saleReportForm.value.startDate = this.endDate;

      this.restApiService.getFlorist().subscribe((data: Florist[]) => {
        for (let i = 0; i < data.length; i++) {
          this.florists.push(data[i]);
        }
      });
        this.restApiService.searchListSalesOrder(firstDate,this.endDate, null).subscribe(async (data: SalesOrderDetailListDto[]) => {
          for (let i = 0; i < data.length; i++) {
            this.salesOrders.push(data[i]);
            this.salesOrders[i].id = i+1;
            this.totalAmount = this.totalAmount + data[i].flowerPrice;
            this.floristFee = await this.restApiService.getfloristFeeBySize(data[i].salesOrderDetails[0].florist.id, data[i].salesOrderDetails[0].flowerFormula.size).toPromise();
           // this.floristFee = floristFeeResult;
            if(this.floristFee != null)
            {
            this.totalFloristFee = this.totalFloristFee + this.floristFee.fee;
            }
           // this.totalFloristFee = this.salesOrders[i].id
          }
           //select stock lot and price forcalculate cost
           this.restApiService.getStockByLot(firstDate,this.endDate).subscribe(async(stockResult: Stock[]) => {
            //console.log('stock ='+ stockResult);
            for (let i = 0; i < stockResult.length; i++) {
              this.stockByLot.push(stockResult[i]);
              if (stockResult[i].flowerPrice == null)
              {
                this.totalCost = this.totalCost ;
              }
              else
              {
              this.totalCost = this.totalCost + stockResult[i].flowerPrice.price;
              }
            }
          console.log('order='+this.salesOrders);
          this.saleReportForm.value.totalCost = this.totalCost;
          this.saleReportForm.value.totalProfit = this.totalProfit;
          this.saleReportForm.value.totalFloristFee = this.totalFloristFee;
          this.numberOfOrder = data.length;
         this.displayedColumns = ['id', 'date', 'status', 'customerName', 'customerLineFb', 'receiverName', 'flowerFormula' ,'totalPrice', 'florist'];
          
        // this.salesOrders = this.salesOrders.filter(s => s.salesOrderDetails.find(f => f.florist.id == this.saleReportForm.value.id))
         

         this.dataSource = new MatTableDataSource<SalesOrderDetailListDto>(this.salesOrders);
         // this.searchFilter.valueChanges.subscribe((searchFilterValue) => {
          //  this.dataSource.filter = searchFilterValue;
          //});
          this.totalProfit = this.totalAmount - this.totalCost;
          this.saleReportForm.value.totalProfit = this.totalAmount;
          this.saleReportForm.value.totalCost = this.totalCost;
          this.saleReportForm.value.totalProfit = this.totalProfit;
          this.saleReportForm.value.totalFloristFee = this.totalFloristFee;
          console.log('order='+this.salesOrders);
          console.log('totalAmount='+this.totalAmount);
           })
       //   this.dataSource.filterPredicate = this.customFilterPredicate();
        });
      }

      searchSaleReport() {
        this.salesOrders = [];
        this.dataSource = [];
        this.totalAmount = 0;
        this.totalCost = 0;
        this.totalFloristFee = 0;
        this.totalProfit = 0;
        if(this.saleReportForm.value.startDate == null)
        {
          this.saleReportForm.value.startDate = "";
        }
        if(this.saleReportForm.value.endDate == null)
        {
          this.saleReportForm.value.endDate = ""; 
        }

       

        this.restApiService.searchListSalesOrder(this.saleReportForm.value.startDate,this.saleReportForm.value.endDate, this.saleReportForm.value.florist).subscribe(async (data: SalesOrderDetailListDto[]) => {
          for (let i = 0; i < data.length; i++) {
            this.salesOrders.push(data[i]);
            this.salesOrders[i].id = i+1;
            this.totalAmount = this.totalAmount + data[i].flowerPrice;
            this.floristFee = await this.restApiService.getfloristFeeBySize(data[i].salesOrderDetails[0].florist.id, data[i].salesOrderDetails[0].flowerFormula.size).toPromise();
           // this.floristFee = floristFeeResult;
            if(this.floristFee != null)
            {
            this.totalFloristFee = this.totalFloristFee + this.floristFee.fee;
            }
          }
          //console.log('order='+this.salesOrders);
       
          //select stock lot and price forcalculate cost
          if ( this.salesOrders.length > 0)
          {
          this.restApiService.getStockByLot(this.saleReportForm.value.startDate,this.saleReportForm.value.endDate).subscribe(async(stockResult: Stock[]) => {
            //console.log('stock ='+ stockResult);
            for (let i = 0; i < stockResult.length; i++) {
              this.stockByLot.push(stockResult[i]);
              if (stockResult[i].flowerPrice == null)
              {
                this.totalCost = this.totalCost ;
              }
              else
              {
              this.totalCost = this.totalCost + stockResult[i].flowerPrice.price;
              }
            }
          
        this.totalProfit = this.totalAmount - this.totalCost;
            console.log('Totalcost ='+ this.totalCost);
            console.log('order='+this.salesOrders);
            this.saleReportForm.value.totalAmount = 111;
            this.saleReportForm.value.totalCost = this.totalCost;
            this.saleReportForm.value.totalProfit = this.totalProfit;
            this.saleReportForm.value.totalFloristFee = this.totalFloristFee;
            console.log('order='+this.salesOrders.length);
            console.log('totalAmount='+this.totalAmount);
            console.log('Totalcost ='+ this.totalCost);
            console.log('TotalProfit ='+ this.totalProfit);
            console.log('TotalFlorist ='+ this.totalFloristFee);

         this.displayedColumns = ['id', 'date', 'status', 'customerName', 'customerLineFb', 'receiverName', 'flowerFormula' ,'totalPrice', 'florist'];
          this.dataSource = new MatTableDataSource<SalesOrderDetailListDto>(this.salesOrders);
         // this.searchFilter.valueChanges.subscribe((searchFilterValue) => {
          //  this.dataSource.filter = searchFilterValue;
          //});
     
        })
      }
        })
       //   this.dataSource.filterPredicate = this.customFilterPredicate();
      
      }
      getTotalAmount() {
        return this.totalAmount;
      }

      btnClick () {
        console.log('test');
        this.router.navigateByUrl('saleSummary');
      }

      customFilterPredicate() {
        const myFilterPredicate = function (data: SalesOrderDetailListDto, filter: string): boolean {
          let statusFound = data.status.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          let customerNameFound = data.customerName.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          let customerLineFbFound = data.customerLineFb.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          let receiverNameFound = data.receiverName.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    
          let flowerFormulaFound = false;
          for (let i=0; i<data.salesOrderDetails.length; i++) {
            flowerFormulaFound = data.salesOrderDetails[i].flowerFormula.name.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            if (flowerFormulaFound)
              break;
          }
          return statusFound || customerNameFound || customerLineFbFound || receiverNameFound || flowerFormulaFound;
        }
        return myFilterPredicate;
      }
  }  