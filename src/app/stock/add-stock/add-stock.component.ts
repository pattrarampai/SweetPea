import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Florist } from 'src/app/interface/florist';
import { Flower } from 'src/app/interface/flower';
import { Stock } from 'src/app/interface/stock';
import { RestApiService } from 'src/app/_shared/rest-api.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import Swal from 'sweetalert2';

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
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css'],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}, {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],
})
export class AddStockComponent implements OnInit {

  flowers: Flower[] = [];
  florists: Florist[] = [];
  formAddStock: FormGroup;
  arr: any;

  constructor(
    private restApiService: RestApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<Stock>,
  ) { 
    this.formAddStock = this.formBuilder.group({
      stockInfo: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.restApiService.getFlower().subscribe((data: Flower[]) => {
      for (let i = 0; i < data.length; i++) {
        this.flowers.push(data[i]);
      }
    });

    this.restApiService.getFlorist().subscribe((data: Florist[]) => {
      for (let i = 0; i < data.length; i++) {
        this.florists.push(data[i]);
      }
    });

    const stockInfo = this.formAddStock.controls.stockInfo as FormArray;
    stockInfo.push(this.formBuilder.group({
      flower: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      unit: new FormControl(''),
      lot: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      florist: new FormControl('', Validators.required),
    }));

    this.arr = this.formAddStock.controls.stockInfo.value;
  }

  removeRow(row: number) {
    console.log('row: ', row);
    const deleteRow = this.formAddStock.controls.stockInfo as FormArray;

    if (deleteRow.length > 1) {
      deleteRow.removeAt(row);
      this.arr = this.formAddStock.controls.stockInfo.value;
    } else {
      deleteRow.reset();
    }
  }

  addRow() {
    const stockInfo = this.formAddStock.controls.stockInfo as FormArray;
    stockInfo.push(this.formBuilder.group({
      flower: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      unit: new FormControl(''),
      lot: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      florist: new FormControl('', Validators.required),
    }));

    this.arr = this.formAddStock.controls.stockInfo.value;
  }
  
  onSubmit() {
    for (let i = 0; i < this.formAddStock.controls.stockInfo.value.length; i++) {
      this.formAddStock.controls.stockInfo.value[i].lot = this.formAddStock.controls.stockInfo.value[i].lot.format('YYYY-MM-DD');
    }
    console.log(this.formAddStock.controls.stockInfo.value);
    this.restApiService.addStock(this.formAddStock.controls.stockInfo.value)
      .subscribe(resp => {
        if (resp['status'] === 200) {
          this.dialogRef.close();
          Swal.fire(
            'Good job!',
            'รับดอกไม้เข้าสต๊อกสำเร็จ',
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  flowerChange(row: number) {
    ((this.formAddStock.get('stockInfo') as FormArray).at(row) as FormGroup).get('unit')?.patchValue(this.formAddStock.controls.stockInfo.value[row].flower.unit)
  }
}