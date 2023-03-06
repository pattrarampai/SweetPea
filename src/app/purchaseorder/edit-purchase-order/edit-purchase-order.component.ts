import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MY_FORMATS } from 'src/app/create-salesorder/create-salesorder.component';
import { Florist } from 'src/app/interface/florist';
import { FlowerFormula } from 'src/app/interface/flower-formula';
import { PurchaseOrderDetail } from 'src/app/interface/purchase-order-detail';
import { SalesOrderElement } from 'src/app/interface/sales-order-element';
import { StatusOrder } from 'src/app/interface/status-order';
import { RestApiService } from 'src/app/_shared/rest-api.service';
import Swal from 'sweetalert2';
import { PurchaseorderComponent } from '../purchaseorder.component';

@Component({
  selector: 'edit-purchase-order',
  templateUrl: './edit-purchase-order.component.html',
  styleUrls: ['./edit-purchase-order.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class EditPurchaseOrderComponent implements OnInit {

  arr: any;
  purchaseOrderForm: FormGroup;

  flowerFormulas: FlowerFormula[] = [];
  florists: Florist[] = [];
  numberOfOrder!: number;
  flowerAvailable: number = 0;
  floristSelected: string | undefined;
  flowerSelected: string | undefined;
  flowerQuantitySelected: string | undefined;
  statusSelected: string | undefined;
  salesOrderUpdated: any = {};
  updatePurchaseOrder!: PurchaseOrderDetail;
  oldStatus: string = "";

  constructor(
    public dialogRef: MatDialogRef<PurchaseorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseOrderDetail,
    private restApiService: RestApiService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
  ) {
    this.purchaseOrderForm = this.fb.group({
      quantity: this.data.quantity,
      flowerId: this.data.flower,
      packId: this.data.packId,
      supplierId: this.data.supplier,
      priceId: this.data.priceId,
      floristId: this.data.florist,
      lot: this.data.lot
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.numberOfOrder = this.data.id;
    // this.salesOrderForm.controls['flowerPrice'].disable();
    // this.salesOrderForm.controls['deliveryFee'].disable();
    // this.salesOrderForm.controls['totalPrice'].disable();
    // this.salesOrderForm.controls['florist'].disable();
    // this.salesOrderForm.controls['receiveDateTime'].disable();

 

    //this.arr = this.salesOrderForm.controls.flowerMultipleDtoList.value;
  }

  onUpdate(): void {
    this.updatePurchaseOrder = this.purchaseOrderForm.value;
    
      this.updatePurchaseOrder.quantity = this.purchaseOrderForm.controls["quantity"].value;
      this.updatePurchaseOrder.flower = this.purchaseOrderForm.controls["flower"].value;
      this.updatePurchaseOrder.lot = this.purchaseOrderForm.controls["lot"].value;
      this.updatePurchaseOrder.packId = this.purchaseOrderForm.controls["packId"].value;
      console.log(this.updatePurchaseOrder);
      this.restApiService.updatePurchaseOrder(this.updatePurchaseOrder);
      Swal.fire(
        'Good job!',
        'แก้ไขออเดอร์สำเร็จ!',
        'success'
      ).then((result) => {
        window.location.reload();
      });
    }
}
