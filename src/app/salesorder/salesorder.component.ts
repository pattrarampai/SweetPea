import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from '../_shared/rest-api.service';
import { MatDialog } from '@angular/material/dialog';
import { EditSalesOrderComponent } from './edit-sales-order/edit-sales-order.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { SalesOrderDetailListDto } from '../interface/sales-order-detail-list-dto';

@Component({
  selector: 'salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})

export class SalesorderComponent implements OnInit {

  salesOrders: SalesOrderDetailListDto[] = [];
  numberOfOrder: number = 0;
  displayedColumns: string[] = [];
  dataSource: any;
  searchFilter = new FormControl();
  flowerMultipleForms = new FormArray([new FormGroup({
    flowerFormula: new FormControl(),
    orderTotal: new FormControl(),
  })
  ]);

  constructor(
    private restApiService: RestApiService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.restApiService.getListSalesOrder().subscribe((data: SalesOrderDetailListDto[]) => {
      for (let i = 0; i < data.length; i++) {
        this.salesOrders.push(data[i]);
      }
      console.log(this.salesOrders);
      this.numberOfOrder = data.length;
      this.displayedColumns = ['id', 'status', 'deliveryDateTime', 'customerName', 'customerLineFb', 'receiverName', 'flowerFormula', 'selectEdit', 'selectDel'];
      this.dataSource = new MatTableDataSource<SalesOrderDetailListDto>(this.salesOrders);
      this.searchFilter.valueChanges.subscribe((searchFilterValue) => {
        this.dataSource.filter = searchFilterValue;
      });

      this.dataSource.filterPredicate = this.customFilterPredicate();
    });
  }

  openDialog(row: SalesOrderDetailListDto): void {
    const dialogRef = this.dialog.open(EditSalesOrderComponent, {
      data: row
    });

  }

  deleteSalesorder(row: SalesOrderDetailListDto): void {
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
