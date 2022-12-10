import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { retry } from 'rxjs/operators';
import { Stock } from 'src/app/interface/stock';
import { RestApiService } from 'src/app/_shared/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-stock',
  templateUrl: './delete-stock.component.html',
  styleUrls: ['./delete-stock.component.css']
})
export class DeleteStockComponent implements OnInit {

  formDeleteStock: FormGroup;
  arr: any;

  constructor(
    public dialogRef: MatDialogRef<Stock>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private restApiService: RestApiService,
  ) {
    this.formDeleteStock = this.formBuilder.group({
      stockInfo: this.formBuilder.array([]),
    });
  }


  ngOnInit(): void {
    console.log(this.data);

    const stockInfo = this.formDeleteStock.controls.stockInfo as FormArray;
    for (let i = 0; i < this.data.length; i++) {
      stockInfo.push(this.formBuilder.group({
        flowerId: this.data[i].flower.flowerId,
        flowerName: this.data[i].flower.flowerName,
        deleteQuantity: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), quantityValidator]),
        remainQuantity: this.data[i].quantity,
        floristId: this.data[i].florist.id,
      }, { 
        validator: quantityValidator
      }));
    }

    this.arr = this.formDeleteStock.controls.stockInfo.value;
  }

  removeRow(row: number) {
    console.log('row: ', row);
    const deleteRow = this.formDeleteStock.controls.stockInfo as FormArray;
    deleteRow.removeAt(row);

    this.arr = this.formDeleteStock.controls.stockInfo.value;
    if (this.arr.length === 0) {
      this.dialogRef.close();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.formDeleteStock.controls.stockInfo.value);
    this.restApiService.deleteStock(this.formDeleteStock.controls.stockInfo.value)
      .subscribe(resp => {
        if (resp['status'] === 200) {
          this.dialogRef.close();
          let changeHtml = "";
          let inactiveHtml = "";
          console.log(resp.body.length);
          for (let i=0; i<resp.body.length; i++) {
            if (resp.body[i].status === 'inactive') {
              inactiveHtml += "<div>" + resp.body[i].formulaName + "</div>";
            } else if (resp.body[i].status === 'change') {
              changeHtml += "<div>" + resp.body[i].formulaName + " จาก <b>" + resp.body[i].beforeQuantity + " ช่อ</b> เหลือ <b>" + resp.body[i].remainQuantity + " ช่อ</b>" + "</div>";
            } 
          }
          console.log(changeHtml);
          console.log(inactiveHtml);
          if (inactiveHtml !== "" && changeHtml !== "") {
            Swal.fire({
              title: 'ไม่สามารถทำโปรโมชั่นนี้ได้แล้ว เนื่องจากจำนวนดอกไม้ไม่เพียงพอ',
              html: inactiveHtml,
              icon: 'success'
            }).then((result) => {
              Swal.fire({
                title: 'มีการเปลี่ยนแปลงจำนวนช่อโปรโมชั่น',
                html: changeHtml,
                icon: 'success'
              }).then((result) => {
                window.location.reload();
              });
            });
          } else if (inactiveHtml === "" && changeHtml !== "") {
            Swal.fire({
              title: 'มีการเปลี่ยนแปลงจำนวนช่อโปรโมชั่น',
              html: changeHtml,
              icon: 'success'
            }).then((result) => {
              window.location.reload();
            });
          } else if (inactiveHtml !== "" && changeHtml === "") {
            Swal.fire({
              title: 'ไม่สามารถทำโปรโมชั่นนี้ได้แล้ว เนื่องจากจำนวนดอกไม้ไม่เพียงพอ',
              html: inactiveHtml,
              icon: 'success'
            }).then((result) => {
              window.location.reload();
            });
          } else {
            Swal.fire(
              'Good job!',
              'ตัดสต๊อกสำเร็จ',
              'success'
            ).then((result) => {
              window.location.reload();
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'เกิดข้อผิดพลาด',
          });
        }
      });
  }
}

export const quantityValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const deleteQuantity = control.get('deleteQuantity');
  const remainQuantity = control.get('remainQuantity');

  if (deleteQuantity && remainQuantity && deleteQuantity.value > remainQuantity.value) {
    deleteQuantity.setErrors({ quantityValidator: true });
    return { quantityError: true };
  } else {
    return null;
  }
};