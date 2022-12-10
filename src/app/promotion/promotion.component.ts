import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromotionDetail } from '../interface/promotion-detail';
import { PromotionDetailLog } from '../interface/promotion-detail-log';
import { RestApiService } from '../_shared/rest-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { FlowerFormulaDetail } from '../interface/flower-formula-detail';
import { PromotionDetailDto } from "../interface/promotion-detail-dto";
import { PromotionDetailCurrentDto } from "../interface/promotion-detail-current-dto";
import { Configurations } from '../interface/configurations';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

export interface DialogData {
  images: 'test';
}

@Component({
  selector: 'promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})

export class PromotionComponent implements OnInit {

  promotionDetails: PromotionDetail[] = [];
  promotionDetailLogsNormal: PromotionDetailLog[] = [];
  promotionDetailLogsCurrent: PromotionDetailLog[] = [];
  flowerQuantity: FlowerFormulaDetail[] = [];
  stockQuantity: FlowerFormulaDetail[] = [];
  promotionDetailsDtos: PromotionDetailDto[] = [];
  promotionDetailsCurrentDtos: PromotionDetailCurrentDto[] = [];
  configurations: Configurations[] = [];

  promotionDetailList: PromotionDetail[] = [];

  displayedColumns: string[] = [];
  displayedColumnsNormal: string[] = [];
  displayedColumnsNormalDto: string[] = [];
  displayedColumnsNormalCurrentDto: string[] = [];
  displayedMaxPromotion: string[] = [];

  dataSource: any;
  dataSourceNormal: any;
  dataSourceNormalDto: any;
  dataSourceNormalCurrentDto: any;

  totalProfitNormal: any;
  totalProfitCurrent: any;
  totalprofit: any;
  cntPromotion: any;
  flowerName: any;
  count: any;
  allQuantity: any;
  weeklyPromotion: number = 20;
  datepipe: any;
  stockDate: String | undefined;
  lot: String | undefined;
  maxPromotion: String | undefined;

  //constructor(public dialog: MatDialog) {}
  constructor(
    private restApiService: RestApiService, 
    public dialog: MatDialog,
  ) { 
  }


  ngOnInit(): void {
    this.restApiService.getCurrentPromotion().subscribe((data: PromotionDetail[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotionDetails.push(data[i]);
        this.cntPromotion = data.length;
      }
    });

    this.restApiService.getMaxPromotion().subscribe((maxPromotion: Configurations[]) => {
      for (let i = 0; i < maxPromotion.length; i++) {
        this.displayedMaxPromotion.push(maxPromotion[i].value);
      }
    });
    
    this.restApiService.getPromotionDetailLog().subscribe((data: PromotionDetailLog[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotionDetailLogsNormal.push(data[i]);
      }
      this.displayedColumnsNormal = ['flowername', 'size', 'unit', 'profit', 'totalprofit', 'price', 'lot', 'location', 'imageUrl', 'add'];
      this.dataSourceNormal = new MatTableDataSource<PromotionDetailLog>(this.promotionDetailLogsNormal);
    });

    this.restApiService.getPromotionDetailLogRemainQuantity().subscribe((data: PromotionDetailCurrentDto[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotionDetailsCurrentDtos.push(data[i]);
      }
      this.displayedColumnsNormalCurrentDto = ['flowername', 'size', 'unit', 'profit', 'totalprofit', 'price', 'location', 'quantityFlower', 'stock', 'imageUrl', 'add'];
      this.dataSourceNormalCurrentDto = new MatTableDataSource<PromotionDetailCurrentDto>(this.promotionDetailsCurrentDtos);
    });

  }
  
  IMAGE_PATH = [
    { path: 'flower01.jpg', url: 'https://i.ibb.co/QD3R9Nd/flower01.jpg' },
    { path: 'flower02.jpg', url: 'https://i.ibb.co/5WQ5xzq/flower02.jpg' },
    { path: 'flower03.jpg', url: 'https://i.ibb.co/R0qNvmQ/flower03.jpg' },
    { path: 'flower04.jpg', url: 'https://i.ibb.co/sb0VDhV/flower04.jpg' },
    { path: 'flower05.jpg', url: 'https://i.ibb.co/ZcrNpnn/flower05.jpg' },
    { path: 'flower06.jpg', url: 'https://i.ibb.co/6wYZ2b9/flower06.jpg' },
    { path: 'flower07.jpg', url: 'https://i.ibb.co/vQqdY3v/flower07.jpg' },
    { path: 'flower08.jpg', url: 'https://i.ibb.co/Vt5Lm7t/flower08.jpg' },
    { path: 'flower09.jpg', url: 'https://i.ibb.co/1vKprwS/flower09.jpg' },
    { path: 'flower10.jpg', url: 'https://i.ibb.co/hmmkMdz/flower10.jpg' },
    { path: 'flower11.jpg', url: 'https://i.ibb.co/vqHKSkc/flower11.jpg' },
    { path: 'flower12.jpg', url: 'https://i.ibb.co/Czcp5R4/flower12.jpg' },
    { path: 'flower13.jpg', url: 'https://i.ibb.co/KKQSGsg/flower13.jpg' },
    { path: 'flower14.jpg', url: 'https://i.ibb.co/hDCr2Jw/flower14.jpg' },
    { path: 'flower15.jpg', url: 'https://i.ibb.co/bHfHDrc/flower15.jpg' },
    { path: 'flower16.jpg', url: 'https://i.ibb.co/4FqZkLB/flower16.jpg' },
    { path: 'flower17.jpg', url: 'https://i.ibb.co/tDpLsGP/flower17.jpg' },
    { path: 'flower18.jpg', url: 'https://i.ibb.co/JjR0fqq/flower18.jpg' },
    { path: 'flower19.jpg', url: 'https://i.ibb.co/XVXvh9N/flower19.jpg' },
    { path: 'flower20.jpg', url: 'https://i.ibb.co/Gpy34PF/flower20.jpg' },
    { path: 'flower21.jpg', url: 'https://i.ibb.co/w7hQVSw/flower21.jpg' },
    { path: 'flower22.jpg', url: 'https://i.ibb.co/0hv2M0f/flower22.jpg' },
    { path: 'flower23.jpg', url: 'https://i.ibb.co/VJjt2gb/flower23.jpg' },
    { path: 'flower24.jpg', url: 'https://i.ibb.co/dp3C27h/flower24.jpg' },
    { path: 'flower25.jpg', url: 'https://i.ibb.co/CVdG6Cg/flower25.jpg' },
    { path: 'flower26.jpg', url: 'https://i.ibb.co/74B0WMk/flower26.jpg' },
    { path: 'flower27.jpg', url: 'https://i.ibb.co/BP1fn8t/Processed-with-VSCO-with-al3-preset.jpg' },
    { path: 'flower28.jpg', url: 'https://i.ibb.co/c8RMx3R/flower28.jpg' },
    { path: 'flower29.jpg', url: 'https://i.ibb.co/DppqRzn/flower29.jpg' },
    { path: 'flower30.jpg', url: 'https://i.ibb.co/pdZM2WC/flower30.jpg' },
    { path: 'flower31.jpg', url: 'https://i.ibb.co/mJf5BqD/flower31.jpg' },
    { path: 'flower32.jpg', url: 'https://i.ibb.co/DY9njST/flower32.jpg' },
    { path: 'flower33.jpg', url: 'https://i.ibb.co/tpvj06s/flower33.jpg' },
  ];

  shareAll(promotionDetail: PromotionDetail[]) {
    console.log(promotionDetail);
    Swal.fire({
      title: 'ต้องการแชร์โปรโมชั่นทั้งหมดใช่ไหม?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่'
    }).then((result) => {
      if (result.isConfirmed) {
        this.shareToFacebookAll(promotionDetail).then((response) => {
          if (response === 4) {
            Swal.fire(
              'Good job!',
              'แชร์โปรโมชั่นสำเร็จ',
              'success'
            )
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'เกิดข้อผิดพลาด',
            });
          }
        });
      }
    })
  }

  async shareToFacebookAll(promotionDetail: PromotionDetail[]) {
    let cnt = 0;
    for (let pd of promotionDetail) {
      let splitted = pd.flowerFormula.imagePath.split('/');
      let index = this.IMAGE_PATH.findIndex(i => i.path === splitted[2]);
      let message = pd.flowerFormula.name + '\nราคา ' + pd.price + ' บาท\nสอบถามเพิ่มเติม Line : @sweetpeatimes';

      const params = {
        access_token: 'EAADbQlCqvIEBAIVP6lrxA2F1ANMZCvHcp66yFQPFH8aeuz1UeXG9Udb8zwJsvgOesWfXemt7MdmZA60BVmOadBXUZCUE5wE8aeRXbZCNp2iz2l2RcQm7VJ5D4cL36MSMpYx8YjRHbR03MJi24IsPRhXBsw39ZB3yZA69kpmEfUrhGjIRDbsd1eugcJPuuZAxVJrT8UHvxejQZBnFTUEDfDm6',
        message: message,
        url: this.IMAGE_PATH[index].url
      };

      await new Promise((resolve: any) => {
        FB.api('/110423627789182/photos', 'post', params, (response: any) => {
          if (response.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'เกิดข้อผิดพลาด',
            });

            console.log(response.error.message);
          } else {
            cnt++;
          }
          resolve();
        });
      });
    }
    return cnt;
  }

  shareToFacebook(formulaName: string, price: number, imagePath: string) {
    let splitted = imagePath.split('/');
    let index = this.IMAGE_PATH.findIndex(i => i.path === splitted[2]);

    let message = formulaName + '\nราคา ' + price + ' บาท\nสอบถามเพิ่มเติม Line : @sweetpeatimes';
    Swal.fire({
      title: 'ต้องการแชร์โปรโมชั่นนี้ใช่ไหม?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่'
    }).then((result) => {
      if (result.isConfirmed) {
        const params = {
          access_token: 'EAADbQlCqvIEBAIVP6lrxA2F1ANMZCvHcp66yFQPFH8aeuz1UeXG9Udb8zwJsvgOesWfXemt7MdmZA60BVmOadBXUZCUE5wE8aeRXbZCNp2iz2l2RcQm7VJ5D4cL36MSMpYx8YjRHbR03MJi24IsPRhXBsw39ZB3yZA69kpmEfUrhGjIRDbsd1eugcJPuuZAxVJrT8UHvxejQZBnFTUEDfDm6',
          message: message,
          url: this.IMAGE_PATH[index].url
        };
        
        FB.api('/110423627789182/photos', 'post', params, (response: any) => {
          if (response.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'เกิดข้อผิดพลาด',
            });
            console.log(response.error.message);
          } else {
            Swal.fire(
              'Good job!',
              'แชร์โปรโมชั่นสำเร็จ',
              'success'
            )
          }
        });
      }
    })
  }

  getIdFlowerReplace(id: number) {
    //console.log(id)
    this.restApiService.updatePromotion(id).subscribe(resp => {
      if (resp['status'] === 200) {
        Swal.fire(
          'Good job!',
          'ลบโปรโมชั่นสำเร็จ',
          'success'
        ).then((result) => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'เกิดข้อผิดพลาด',
        });
      }
    });
  }

  calculateTotalProfit(profit: any, unit: any) {
    return this.totalprofit = profit * unit;
  }

  setFormatDateLotStock(lotStock: any) {
    //console.log(lotStock + 1);
    this.stockDate = lotStock.substring(0, 10);
    return this.lot = this.stockDate;
  }

  showQuantity(flowerQuantity: any,unit: any) {
    return this.allQuantity = flowerQuantity * unit;
  }

  openDialog() {
    this.dialog.open(PromotionSuccessDialogComponent, {
      data: {
        animal: 'test'
      }
    });
  }

  openDialogFlower(pathimg: any, size: any, price: any, name: any, unit: any) {
    this.dialog.open(PromotionUnitDialogComponent, {
      data: {
        imagespath: pathimg,
        flowersize: size,
        flowerprice: price,
        flowername: name,
        flowerunit: unit,
        sumprofit: price * unit
      }
    });
  }

  openDialogReplaceFlower(pathimg: any, size: any, price: any, name: any, unit: any, location: any, profit: any, cntPromotion: any, numberPromotion: any) {
    if (cntPromotion == numberPromotion) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'โปรโมชั่นปัจจุบันเต็มแล้ว กรุณาลบโปรโมชั่นปัจจุบันออกก่อนทำรายการ',
      });
    }
    else {
      this.dialog.open(PromotionUnitDialogComponent, {
        data: {
          imagespath: pathimg,
          flowersize: size,
          flowerprice: price,
          flowername: name,
          flowerunit: unit,
          sumprofit: price * unit,
          location: location,
          profit: profit,
        }
      });
    }
  }

}
/*--------- Add flower current flower ---------*/
@Component({
  selector: 'promotiondialog',
  templateUrl: './promotion.dialog.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionDialogComponent {
  //constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  constructor(
    public dialogRef: MatDialogRef<PromotionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  displayedColumns = ['checked', 'position', 'flowername', 'stock', 'unit', 'location'];
  dataSource = ELEMENT_DATA_DIALOG;

  highlight(element: ElementDialog) {
    element.highlighted = !element.highlighted;
  }

}

export interface ElementDialog {
  checked: boolean;
  position: number;
  flowername: string;
  stock: number;
  unit: string;
  location: string;
  highlighted?: boolean;
  hovered?: boolean;
}

const ELEMENT_DATA_DIALOG: ElementDialog[] = [
  { checked: false, position: 1, flowername: 'ยูคาลิปตัส', stock: 5, unit: 'ก้าน', location: 'ซงหนิงหนิง' },
  { checked: false, position: 2, flowername: 'สุ่ย', stock: 250, unit: 'กรัม', location: 'ซงหนิงหนิง' },
  { checked: false, position: 3, flowername: 'แคสเปีนร์', stock: 300, unit: 'กรัม', location: 'ซงหนิงหนิง' },
];

/* Unit Promotion */
@Component({
  selector: 'promotiondialog',
  templateUrl: './promotion.unit.dialog.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionUnitDialogComponent {
  //constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  constructor(
    public dialogRef: MatDialogRef<PromotionUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restApiService: RestApiService,
  ) { }

  quantity = new FormControl('');

  ngOnInit() {
    // will log the entire data object
    // console.log(this.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  replaceFlower() {
    // console.log("flowerunit " + this.data.flowerunit);
    // console.log("quantity " + this.quantity.value);
    if(this.quantity.value > this.data.flowerunit){
      Swal.fire(
          'error',
          'จำนวนช่อที่เลือกไม่ถูกต้อง',
          'error'
        ).then((result) => {
            window.location.reload();
      });
    }else if (this.quantity.value < 1){
      Swal.fire(
          'error',
          'จำนวนช่อที่เลือกไม่ถูกต้อง',
          'error'
        ).then((result) => {
            window.location.reload();
      });
    }
    else{
      this.restApiService.recalculatePromotion(this.data.flowername, this.data.flowerprice, this.data.location, this.data.profit, this.quantity.value)
      .subscribe(resp => {
        if (resp['status'] === 200) {
          text: 'จำนวนช่อที่เลือกไม่ถูกต้อง'
        } 
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'เกิดข้อผิดพลาด',
          });
        }
      });

      this.restApiService.addPromotion(this.data.flowername, this.data.flowerprice, this.data.location, this.data.profit, this.quantity.value)
      .subscribe(resp => {
        if (resp['status'] === 200) {
          this.dialogRef.close();
          Swal.fire(
            'Good job!',
            'เพิ่มโปรโมชั่นสำเร็จ',
            'success'
          ).then((result) => {
              window.location.reload();
        });
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
}

/* Replace Flower */
@Component({
  selector: 'promotiondialog',
  templateUrl: './promotion.replace.dialog.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionReplaceDialogComponent {
  promotionId: any;

  constructor(
    public dialogRef: MatDialogRef<PromotionReplaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restApiService: RestApiService, public dialog: MatDialog
  ) { }

  promotionDetailsReplace: PromotionDetail[] = [];

  ngOnInit() {
    //console.log(this.data)

    this.restApiService.getCurrentPromotion().subscribe((data: PromotionDetail[]) => {
      for (let i = 0; i < data.length; i++) {
        this.promotionDetailsReplace.push(data[i]);
      }
    });

  }

  openDialog() {
    this.dialog.open(PromotionSuccessDialogComponent, {
      data: {
        animal: 'test'
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  getIdFlowerReplace(id: number) {
    //console.log(id)
    this.restApiService.updatePromotion(id).subscribe(resp => {
      if (resp['status'] === 200) {
        this.dialogRef.close();
        Swal.fire(
          'Good job!',
          'ลบโปรโมชั่นสำเร็จ',
          'success'
        ).then((result) => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'เกิดข้อผิดพลาด',
        });
      }
    });;

  }

}

/* Replace Flower */
@Component({
  selector: 'promotiondialog',
  templateUrl: './promotion.success.dialog.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionSuccessDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PromotionSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}