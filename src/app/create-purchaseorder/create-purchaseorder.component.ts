import { Component, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FlowerFormula } from '../interface/flower-formula'
import { Florist } from '../interface/florist'
import { RestApiService } from '../_shared/rest-api.service';
import { SalesOrderPrice } from '../interface/sales-order-price';
import { SalesOrderElement } from '../interface/sales-order-element';
import { SalesOrderMultiple } from '../interface/sales-order-multiple';
import { PriceOfOrders } from '../interface/priceOfOrders';
import Swal from 'sweetalert2';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'create-purchaseorder',
  templateUrl: './create-purchaseorder.component.html',
  styleUrls: ['./create-purchaseorder.component.css'],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}, {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],
})
export class CreatePurchaseorderComponent implements OnInit {

  createPurchaseorder = new FormGroup({
    customerName: new FormControl('', Validators.required),
    customerPhone: new FormControl('', [Validators.required, Validators.pattern('(^0)([1-9]){8}([0-9])$')]),
    customerLineFb: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    receiverName: new FormControl('', Validators.required),
    receiverPhone: new FormControl('', [Validators.required, Validators.pattern('(^0)([1-9]){8}([0-9])$')]),
    receiverAddress: new FormControl('', Validators.required),
    receiveDateTime: new FormControl('', Validators.required),
    flowerPrice: new FormControl(),
    deliveryFee: new FormControl(),
    totalPrice: new FormControl(),
    florist: new FormControl('', Validators.required),
    note: new FormControl(),
  });

  dataArray = [];
  salesOrderMultiple: SalesOrderMultiple | undefined;

  flowerMultipleDtoList = new FormArray([]);
  arr: any;
  priceOfOrders: PriceOfOrders[] = [];
  distance: number = 0;
  deliveryFee: number = 0;
  totalPrice: number = 0;

  constructor(
    private restApiService: RestApiService,
    private fb: FormBuilder
  ) {
    this.createPurchaseorder = this.fb.group({
      customerName: new FormControl('', Validators.required),
      customerPhone: new FormControl('', [Validators.required, Validators.pattern('(^0)([1-9]){8}([0-9])$')]),
      customerLineFb: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      receiverName: new FormControl('', Validators.required),
      receiverPhone: new FormControl('', [Validators.required, Validators.pattern('(^0)([1-9]){8}([0-9])$')]),
      receiverAddress: new FormControl('', Validators.required),
      receiveDateTime: new FormControl('', Validators.required),
      flowerPrice: new FormControl(),
      deliveryFee: new FormControl(),
      totalPrice: new FormControl(),
      florist: new FormControl('', Validators.required),
      note: new FormControl(),
      flowerMultipleDtoList: this.fb.array([new FormGroup({
        flowerFormula: new FormControl(null, Validators.required),
        flowerAvailable: new FormControl(null),
        orderTotal: new FormControl(null, Validators.required),
      })
      ])
    });
  }

  addFlowerMultipleForm() {
    const data = this.createPurchaseorder.controls.flowerMultipleDtoList as FormArray;
    data.push(this.fb.group({
      flowerFormula: new FormControl(null, Validators.required),
      flowerAvailable: null,
      orderTotal: new FormControl(null, Validators.required)
    }));
    this.arr = this.createPurchaseorder.controls.flowerMultipleDtoList.value;
  }

  removeFlowerMultiple(row: number) {
    const data = this.createPurchaseorder.controls.flowerMultipleDtoList as FormArray;

    if (data.length > 1) {
      data.removeAt(row);
      this.arr = this.createPurchaseorder.controls.flowerMultipleDtoList.value;
      this.getPrice();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'เกิดข้อผิดพลาด',
      });
    }
  }

  flowerFormulas: FlowerFormula[] = [];
  florists: Florist[] = [];
  flowerAvailable: number = 0;
  floristSelected: string | undefined;
  flowerSelected: string | undefined;
  flowerQuantitySelected: string | undefined;
  createSalesOrder!: SalesOrderElement;


  ngOnInit(): void {

    this.arr = this.createPurchaseorder.controls.flowerMultipleDtoList.value;
    this.createPurchaseorder.controls['flowerPrice'].disable();
    this.createPurchaseorder.controls['deliveryFee'].disable();
    this.createPurchaseorder.controls['totalPrice'].disable();

    // this.restApiService.getFlowerFormula().subscribe((data: FlowerFormula[]) => {
    //   for (let i = 0; i < data.length; i++) {
    //     this.flowerFormulas.push(data[i]);
    //   }
    // });

    this.restApiService.getFlorist().subscribe((data: Florist[]) => {
      for (let i = 0; i < data.length; i++) {
        this.florists.push(data[i]);
      }
    });

  }

  onSubmit(): void {
    this.createSalesOrder = this.createPurchaseorder.value;
    this.createSalesOrder.flowerPrice = this.createPurchaseorder.controls["flowerPrice"].value;
    this.createSalesOrder.deliveryFee = this.createPurchaseorder.controls["deliveryFee"].value;
    this.createSalesOrder.totalPrice = this.createPurchaseorder.controls["totalPrice"].value;

    console.warn(this.createSalesOrder);
    console.log(this.flowerMultipleDtoList.value);
    this.restApiService.createSalesOrder(this.createSalesOrder)
    .subscribe(resp => {
      if (resp['status'] === 200) {
        Swal.fire(
          'Good job!',
          'บันทึกออเดอร์สำเร็จ!',
          'success'
        ).then((result) => {
          window.location.reload();
        });
      } else if (resp['status'] === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'เกิดข้อผิดพลาด',
        });
      }
    });
  }

  formulaChange(row: number): void {
    let floristId = 0;
    let formulaId = 0;
    let receiveDateTime = new Date();

    if (this.createPurchaseorder.controls.flowerMultipleDtoList.value[row].flowerFormula != null
      && this.createPurchaseorder.controls["florist"].value != null
      && this.createPurchaseorder.controls["receiveDateTime"].value != null) {

      floristId = this.createPurchaseorder.controls["florist"].value;
      receiveDateTime = this.createPurchaseorder.controls["receiveDateTime"].value;
      formulaId = this.createPurchaseorder.controls.flowerMultipleDtoList.value[row].flowerFormula;

      this.restApiService.getFlowerAvailable(formulaId, floristId, receiveDateTime).subscribe((data: number) => {
        console.log(data);
        ((this.createPurchaseorder.get('flowerMultipleDtoList') as FormArray).at(row) as FormGroup).get('flowerAvailable')?.patchValue(data);
      });
    }

    this.getPrice();
  }

  receiveDateChange(): void {
    let floristId = 0;
    let formulaId = 0;
    let receiveDateTime = new Date();

    for (let i = 0; i < this.createPurchaseorder.controls.flowerMultipleDtoList.value.length; i++) {
      if (this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula != null
        && this.createPurchaseorder.controls["florist"].value != null
        && this.createPurchaseorder.controls["receiveDateTime"].value != null) {
  
        floristId = this.createPurchaseorder.controls["florist"].value;
        receiveDateTime = this.createPurchaseorder.controls["receiveDateTime"].value;
        formulaId = this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula;
  
        this.restApiService.getFlowerAvailable(formulaId, floristId, receiveDateTime).subscribe((data: number) => {
          console.log(data);
          ((this.createPurchaseorder.get('flowerMultipleDtoList') as FormArray).at(i) as FormGroup).get('flowerAvailable')?.patchValue(data);
        });
      }
  
      this.getPrice();
    }

    
  }

  async getPrice() {
    this.priceOfOrders = [];

    for (let i = 0; i < this.createPurchaseorder.controls.flowerMultipleDtoList.value.length; i++) {
      if (this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].orderTotal != null
        && this.createPurchaseorder.controls["florist"].value != null
        && this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula != null
        && this.createPurchaseorder.controls["receiveDateTime"].value != null) {
        
        this.priceOfOrders.push({
          formulaId: this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula,
          floristId: this.createPurchaseorder.controls["florist"].value,
          totalOrder: this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].orderTotal,
          receiveDate: this.createPurchaseorder.controls["receiveDateTime"].value
        });
      }
    }

    console.log(this.priceOfOrders);
    if (this.priceOfOrders.length != 0) {
      this.restApiService.getSalesOrderPrice(this.priceOfOrders).subscribe((data: SalesOrderPrice) => {
        this.createPurchaseorder.controls["flowerPrice"].setValue(data.flowerPrice);
        // this.createPurchaseorder.controls["deliveryFee"].setValue(data.feePrice);
        // this.createPurchaseorder.controls["totalPrice"].setValue(data.totalPrice);
      });
    }
    
    if(this.createPurchaseorder.controls["receiverAddress"].value !== '' && this.createPurchaseorder.controls["florist"].value !== '') {
      this.distance = await this.restApiService.calculateDistanceFromFloristId(this.createPurchaseorder.controls["receiverAddress"].value, this.createPurchaseorder.controls["florist"].value);
      this.deliveryFee = await this.restApiService.calculateDeliveryFee(this.distance).toPromise(); 
      this.createPurchaseorder.controls["deliveryFee"].setValue(this.deliveryFee);
      this.totalPrice = this.createPurchaseorder.controls["flowerPrice"].value + this.deliveryFee;
      this.createPurchaseorder.controls["totalPrice"].setValue(this.totalPrice);
    }
  }

  async orderTotalChange(row: number) {
    let floristId = 0;
    let totalOrder = 0;
    let formulaId = 0;
    let flowerPrice = 0;
    let receiveDateTime = new Date();
    this.priceOfOrders = [];

    for (let i = 0; i < this.createPurchaseorder.controls.flowerMultipleDtoList.value.length; i++) {
      if (this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].orderTotal != null
        && this.createPurchaseorder.controls["florist"].value != null
        && this.createPurchaseorder.controls.flowerMultipleDtoList.value[row].flowerFormula != null
        && this.createPurchaseorder.controls["receiveDateTime"].value != null) {

        floristId = this.createPurchaseorder.controls["florist"].value;
        formulaId = this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula;
        totalOrder = this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].orderTotal;

        receiveDateTime = this.createPurchaseorder.controls["receiveDateTime"].value;
        if (this.createPurchaseorder.controls["flowerPrice"].value != null) {
          flowerPrice = this.createPurchaseorder.controls["flowerPrice"].value;
        }

        this.priceOfOrders.push({
          formulaId: formulaId,
          floristId: floristId,
          totalOrder: totalOrder,
          receiveDate: receiveDateTime
        });
      }
    }

    console.log(this.priceOfOrders);
    if (this.priceOfOrders.length != 0) {
      this.restApiService.getSalesOrderPrice(this.priceOfOrders).subscribe((data: SalesOrderPrice) => {
        this.createPurchaseorder.controls["flowerPrice"].setValue(data.flowerPrice);
        // this.createPurchaseorder.controls["deliveryFee"].setValue(data.feePrice);
        // this.createPurchaseorder.controls["totalPrice"].setValue(data.totalPrice);
      });
    }

    if(this.createPurchaseorder.controls["receiverAddress"].value !== '' && this.createPurchaseorder.controls["florist"].value !== '') {
      this.distance = await this.restApiService.calculateDistanceFromFloristId(this.createPurchaseorder.controls["receiverAddress"].value, this.createPurchaseorder.controls["florist"].value);
      this.deliveryFee = await this.restApiService.calculateDeliveryFee(this.distance).toPromise(); 
      this.createPurchaseorder.controls["deliveryFee"].setValue(this.deliveryFee);
      this.totalPrice = this.createPurchaseorder.controls["flowerPrice"].value + this.deliveryFee;
      this.createPurchaseorder.controls["totalPrice"].setValue(this.totalPrice);
    }
  }

  async floristChange() {
    let floristId = this.createPurchaseorder.controls["florist"].value;
    this.restApiService.getFlowerFormula(floristId).subscribe((data: FlowerFormula[]) => {
      this.flowerFormulas = [];
      for (let i = 0; i < data.length; i++) {
        this.flowerFormulas.push(data[i]);
      }
    });

    const data = this.createPurchaseorder.controls.flowerMultipleDtoList as FormArray;
    
    if (this.createPurchaseorder.controls.flowerMultipleDtoList.value.length > 1) {
      for (let i = this.createPurchaseorder.controls.flowerMultipleDtoList.value.length-1; i > 0; i--){
        data.removeAt(i);
        this.arr = this.createPurchaseorder.controls.flowerMultipleDtoList.value;
        console.log(i);
      }
    } else {
      this.createPurchaseorder.get("flowerFormula")?.reset();
      this.createPurchaseorder.get("flowerPrice")?.reset();
      this.createPurchaseorder.get("deliveryFee")?.reset();
      this.createPurchaseorder.get("totalPrice")?.reset();
      this.createPurchaseorder.controls.flowerMultipleDtoList.reset();
    }

    // let floristId = 0;
    // let formulaId = 0;
    // let totalOrder = 0;
    // let receiveDateTime = new Date();
    // this.priceOfOrders = [];

    // for (let i = 0; i < this.createPurchaseorder.controls.flowerMultipleDtoList.value.length; i++) {
    //   if (this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula != null
    //     && this.createPurchaseorder.controls["florist"].value != null
    //     && this.createPurchaseorder.controls["receiveDateTime"].value != null
    //     && this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].orderTotal != null) {

    //     floristId = this.createPurchaseorder.controls["florist"].value;
    //     receiveDateTime = this.createPurchaseorder.controls["receiveDateTime"].value;
    //     formulaId = this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].flowerFormula;
    //     totalOrder = this.createPurchaseorder.controls.flowerMultipleDtoList.value[i].orderTotal;

    //     this.restApiService.getFlowerAvailable(formulaId, floristId, receiveDateTime).subscribe((data: number) => {
    //       console.log(data);
    //       ((this.createPurchaseorder.get('flowerMultipleDtoList') as FormArray).at(i) as FormGroup).get('flowerAvailable')?.patchValue(data);
    //     });

    //     this.priceOfOrders.push({
    //       formulaId: formulaId,
    //       floristId: floristId,
    //       totalOrder: totalOrder,
    //       receiveDate: receiveDateTime
    //     });
    //   }
    // }
    // console.log(this.priceOfOrders);
    // if (this.priceOfOrders.length != 0) {
    //   this.restApiService.getSalesOrderPrice(this.priceOfOrders).subscribe((data: SalesOrderPrice) => {
    //     this.createPurchaseorder.controls["flowerPrice"].setValue(data.flowerPrice);
    //     // this.createPurchaseorder.controls["deliveryFee"].setValue(data.feePrice);
    //     // this.createPurchaseorder.controls["totalPrice"].setValue(data.totalPrice);
    //   });
    // }

    // if(this.createPurchaseorder.controls["receiverAddress"].value !== '' && this.createPurchaseorder.controls["florist"].value !== '') {
    //   this.distance = await this.restApiService.calculateDistanceFromFloristId(this.createPurchaseorder.controls["receiverAddress"].value, this.createPurchaseorder.controls["florist"].value);
    //   this.deliveryFee = await this.restApiService.calculateDeliveryFee(this.distance).toPromise(); 
    //   this.createPurchaseorder.controls["deliveryFee"].setValue(this.deliveryFee);
    //   this.totalPrice = this.createPurchaseorder.controls["flowerPrice"].value + this.deliveryFee;
    //   this.createPurchaseorder.controls["totalPrice"].setValue(this.totalPrice);
    // }
  }

}