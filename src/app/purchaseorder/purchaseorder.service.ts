import { Injectable, EventEmitter } from '@angular/core';
import { SalesOrderElement } from '../interface/sales-order-element';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {

  $isUpdateSalesOrder = new EventEmitter();

  salesOrder!: SalesOrderElement;

  constructor(private router: Router) { }

  updateSalesOrder(salesOrderSelected: SalesOrderElement) {
    this.salesOrder = salesOrderSelected;
    // console.log(this.salesOrder);
    this.$isUpdateSalesOrder.emit(this.salesOrder);
    this.router.navigateByUrl('/editSalesorder');
  }
}
