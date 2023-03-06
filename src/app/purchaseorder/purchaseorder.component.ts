import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from '../_shared/rest-api.service';
import { MatDialog } from '@angular/material/dialog';
import { EditPurchaseOrderComponent } from './edit-purchase-order/edit-purchase-order.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { SalesOrderDetailListDto } from '../interface/sales-order-detail-list-dto';
import { PurchaseOrderDetailListDto } from '../interface/purchase-order-detail-list';

@Component({
  selector: 'purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css']
})

export class PurchaseorderComponent implements OnInit {

  purchaseOrders: PurchaseOrderDetailListDto[] = [];
  numberOfOrder: number = 0;
  displayedColumns: string[] = [];
  dataSource: any;
  searchFilter = new FormControl();
  POForm = new FormGroup({
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date())
  });

  constructor(
    private restApiService: RestApiService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.restApiService.getListPurchaseOrder('2022-12-01', '2022-12-20').subscribe((data: PurchaseOrderDetailListDto[]) => {
      for (let i = 0; i < data.length; i++) {
        this.purchaseOrders.push(data[i]);
      }
      console.log(this.purchaseOrders);
      this.numberOfOrder = data.length;
      this.displayedColumns = ['id', 'status', 'deliveryDateTime', 'selectEdit', 'selectDel'];
      this.dataSource = new MatTableDataSource<PurchaseOrderDetailListDto>(this.purchaseOrders);
      // this.searchFilter.valueChanges.subscribe((searchFilterValue) => {
      //   this.dataSource.filter = searchFilterValue;
      // });

     // this.dataSource.filterPredicate = this.applyDateFilter();
      
    });
  }

  search()
  {
    if(this.POForm.value.startDate == null)
    {
      this.POForm.value.startDate = "";
    }
    if(this.POForm.value.endDate == null)
    {
      this.POForm.value.endDate = ""; 
    }

  this.restApiService.getListPurchaseOrder(this.POForm.value.startDate,this.POForm.value.endDate).subscribe((data: PurchaseOrderDetailListDto[]) => {
    for (let i = 0; i < data.length; i++) {
      this.purchaseOrders.push(data[i]);
    }
    console.log(this.purchaseOrders);
    this.numberOfOrder = data.length;
    this.displayedColumns = ['id', 'status', 'deliveryDateTime', 'selectEdit', 'selectDel'];
    this.dataSource = new MatTableDataSource<PurchaseOrderDetailListDto>(this.purchaseOrders);
    this.searchFilter.valueChanges.subscribe((searchFilterValue) => {
      this.dataSource.filter = searchFilterValue;
    });

    this.dataSource.filterPredicate = this.applyDateFilter();
    
  });
}

  openDialog(row: PurchaseOrderDetailListDto): void {
    const dialogRef = this.dialog.open(EditPurchaseOrderComponent, {
      data: row
    });

  }

  deleteSalesorder(row: PurchaseOrderDetailListDto): void {
    console.log(row.status);
    if (row.status == "ส่งแล้ว") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ไม่สามารถยกเลิกออเดอร์นี้ได้ เนื่องจากสถานะ: ส่งแล้ว'
      })
    } else if (row.status == "ยกเลิกออเดอร์") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ไม่สามารถยกเลิกออเดอร์นี้ได้ เนื่องจากสถานะ: ยกเลิกออเดอร์'
      })
    } else {
      Swal.fire({
        title: 'จะยกเลิกออเดอร์นี้ใช่ไหม?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ใช่, ยกเลิก!'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(row.id);
          this.restApiService.cancelSalesOrder(row.id);
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success',
          ).then((result) => {
            window.location.reload();
          });
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }
  }

  customFilterPredicate() {
  //   const myFilterPredicate = function (data: PurchaseOrderDetailListDto, filter: Date): boolean {
//       let statusFound = data.status.toString().trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;

  //     let flowerFormulaFound = false;
  //     for (let i=0; i<data.purchaseOrderDetails.length; i++) {
  //       flowerFormulaFound = data[i].date
  //       if (flowerFormulaFound)
  //         break;
  //     }
  //     return statusFound ;
  //   }
  //   return myFilterPredicate;
  }

  applyDateFilter() {
    console.log(this.purchaseOrders);
    //this.dataSource.data = this.tableService.getCompanies();
   // this.dataSource = this.dataSource.filter.
  }
}
