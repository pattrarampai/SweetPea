/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FlowerFormula } from '../interface/flower-formula';
import { Florist } from '../interface/florist';
import { SearchFlowerFormulaResult } from '../interface/searchFlowerFormulaResult';
import { RestApiService } from '../_shared/rest-api.service';
import { Flower } from '../interface/flower';
import { PriceOfOrders } from '../interface/priceOfOrders';
import { SalesOrderPrice } from '../interface/sales-order-price';
import { FloristDeliveryFee } from '../interface/floristDeliveryFee';
@Component({
  selector: 'searchflower',
  templateUrl: './searchflower.component.html',
  styleUrls: ['./searchflower.component.css']
})

export class SearchflowerComponent implements OnInit {
  [x: string]: any;
  currentDate = new Date();
  receiveDate = new Date();
  flowerFormula: FlowerFormula[] = [];
  flowerFormulaSearch: FlowerFormula[] = [];
  displayedColumns: string[] = ['position', 'name', 'quantityAvailable', 'pattern', 'color', 'size', 'occasion', 'florist', 'price', 'deliveryFee', 'totalPrice'];
  searchFlowerFormulaResult: SearchFlowerFormulaResult[] = [];
  searchFlowerFormulaResultFilter: SearchFlowerFormulaResult[] = [];
  searchFlowerFormulaFlorist: SearchFlowerFormulaResult[] = [];
  deliveryFee: any = 0;
  dataSource = new MatTableDataSource<SearchFlowerFormulaResult>();
  flowerList: string[] = ['WhiteRose', 'Redrose', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  flowerFormulas: FlowerFormula[] = [];
  geocoder = new google.maps.Geocoder();
  florists: Florist[] = [];
  flower: Flower[] =[];
  floristDeliveryFee: FloristDeliveryFee[] = [];
  customerLocation = new google.maps.LatLng(0, 0);
  searchFlowerForm = new FormGroup({
    flowerCat: new FormControl(''),
    name: new FormControl(''),
    occasion: new FormControl(''),
    color: new FormControl(''),
    date: new FormControl(''),
    pattern: new FormControl(''),
    quantity: new FormControl(),
    priceFrom: new FormControl(''),
    priceTo: new FormControl(''),
    address: new FormControl(''),
    size: new FormControl(''),
    florist: new FormControl(''),
    floristId: new FormControl('')
  });
  priceOfFormula: PriceOfOrders[] = [];

  constructor(private restApiService: RestApiService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit(): Promise<void> {
    this.searchFlowerFormulaFlorist = [];
    this.flowerFormula = [];
    this.priceOfFormula = [];
    
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

    this.restApiService.searchAllFlowerFormula().subscribe(async (data: FlowerFormula[]) => {
      for (let i = 0; i < data.length; i++) {
        this.priceOfFormula = [];
        let searchResult: {
          id: number,
          position: number,
          florist: string,
          floristId: number,
          name: string,
          size: string,
          pattern: string,
          color: string,
          price: number,
          occasion: string,
          quantityAvailable: number,
          deliveryFee: number,
          totalPrice: number
        } = {
          id: 0,
          position: 0,
          florist: '',
          floristId: 0,
          name: '',
          size: '',
          pattern: '',
          color: '',
          price: 0,
          occasion: '',
          quantityAvailable: 0,
          deliveryFee: 0,
          totalPrice: 0
        };
        searchResult.id = i;
        searchResult.position = i;
        searchResult.florist = "";
        searchResult.name = data[i].name;
        searchResult.size = data[i].size;
        searchResult.pattern = data[i].pattern;
        searchResult.color = data[i].color;
        //searchResult.price = data[i].price;
        searchResult.occasion = data[i].occasion;
        searchResult.quantityAvailable = Number(data[i].quantityAvailable);
        searchResult.deliveryFee = 0;
        //searchResult.totalPrice = data[i].price;

        if (data[i].pattern == 'เกาหลี') {
          searchResult.florist = 'ซงหนิงหนิง';
          searchResult.floristId = 1;
          //find quantity availbale for nink
     //     searchResult.quantityAvailable =  Number( await this.restApiService.getFlowerAvailableFromCurrentStock(data[i].id, 1, this.currentDate));
          await this.restApiService.getFlowerAvailableFromCurrentStock(data[i].id, 1, this.currentDate).subscribe(async(result) => {
            searchResult.quantityAvailable = result;
          })
        } else {
          searchResult.florist = 'หนึ่ง';
          searchResult.floristId = 2; 
          //find quantity available for neung
          await this.restApiService.getFlowerAvailableFromCurrentStock(data[i].id, 2, this.currentDate).subscribe(async(result) => {
            searchResult.quantityAvailable = result;
          });
          //Add new row for new florist nink
          let resultRow: {
            id: number,
            position: number,
            florist: string,
            floristId: number,
            name: string,
            size: string,
            pattern: string,
            color: string,
            price: number,
            occasion: string,
            quantityAvailable: number,
            deliveryFee: number,
            totalPrice: number
          } = {
            id: 0,
            position: 0,
            florist: '',
            floristId: 0,
            name: '',
            size: '',
            pattern: '',
            color: '',
            price: 0,
            occasion: '',
            quantityAvailable: 0,
            deliveryFee: 0,
            totalPrice: 0
          };
          resultRow.id = data[i].id;
          resultRow.position = i;
          resultRow.florist = "ซงหนิงหนิง";
          resultRow.floristId = 1;
          resultRow.name = data[i].name;
          resultRow.size = data[i].size;
          resultRow.pattern = data[i].pattern;
          resultRow.color = data[i].color;
          //resultRow.price = data[i].price;
          resultRow.occasion = data[i].occasion;
          resultRow.quantityAvailable = Number(data[i].quantityAvailable);
          resultRow.deliveryFee = 0;
          //resultRow.totalPrice = data[i].price;

          //find quantity available for nink
          this.restApiService.getFlowerAvailableFromCurrentStock(data[i].id, 1, this.currentDate).subscribe((result) => {
            resultRow.quantityAvailable = result;
          })
          this.priceOfFormula = [];
          this.priceOfFormula.push({
            formulaId: data[i].id,
            floristId: resultRow.floristId,
            totalOrder: 1,
            receiveDate: this.currentDate
          });
          if (this.priceOfFormula.length != 0) {
            this.restApiService.getSalesOrderPrice(this.priceOfFormula).subscribe((priceResult: SalesOrderPrice) => {
              resultRow.price = priceResult.flowerPrice;
              resultRow.totalPrice = priceResult.flowerPrice;
            });
          }
          this.searchFlowerFormulaFlorist.push(resultRow);
        }
        this.priceOfFormula = [];
        this.priceOfFormula.push({
          formulaId: searchResult.id,
          floristId: searchResult.floristId,
          totalOrder: 1,
          receiveDate: this.currentDate
        });
        if (this.priceOfFormula.length != 0) {
          this.restApiService.getSalesOrderPrice(this.priceOfFormula).subscribe((priceResult: SalesOrderPrice) => {
            searchResult.price = priceResult.flowerPrice;
            searchResult.totalPrice = priceResult.flowerPrice;
          });
        }
        this.searchFlowerFormulaResult.push(searchResult);
        
      }
      this.searchFlowerFormulaResult = this.searchFlowerFormulaResult.concat(this.searchFlowerFormulaFlorist);
      this.searchFlowerFormulaResult.sort((a, b) => a.name.localeCompare(b.name));
      for (let i = 0; i < this.searchFlowerFormulaResult.length; i++) {
        this.searchFlowerFormulaResult[i].position = i + 1;
      }
      // this.calculateDistance('siam paragon');
      this.dataSource = new MatTableDataSource<SearchFlowerFormulaResult>(this.searchFlowerFormulaResult);
      this.dataSource.paginator = this.paginator;
    });
  }

  selectedValue: string | undefined;

  flowerCat = [
    { value: '1', viewValue: '' },
    { value: '2', viewValue: 'ดอกไม้สด' },
    { value: '3', viewValue: 'ดอกไม้แห้ง' }
  ];

  // flower = [
  //   { value: '1', viewValue: 'กุหลาบขาว' },
  //   { value: '2', viewValue: 'กุหลาบแดง' },
  //   { value: '3', viewValue: 'กุหลาบชมพู' },
  //   { value: '4', viewValue: 'กุหลาบมาแชล' },
  //   { value: '5', viewValue: 'ทานตะวัน' },
  //   { value: '6', viewValue: 'ไฮเดนเยีย' }
  // ];

  occasion = [
    { value: '1', viewValue: 'Congratulations' },
    { value: '2', viewValue: 'hospital' },
    { value: '3', viewValue: 'Birthday' },
    { value: '4', viewValue: 'Wedding' },
    { value: '4', viewValue: 'Valentine' }
  ];

  color = [
    { value: '1', viewValue: '' },
    { value: '2', viewValue: 'เหลือง' },
    { value: '2', viewValue: 'ขาว' },
    { value: '2', viewValue: 'ชมพู' },
    { value: '2', viewValue: 'แดง' },
  ];

  pattern = [
    { value: '1', viewValue: '' },
    { value: '2', viewValue: 'เกาหลี' },
    { value: '3', viewValue: 'ทั่วไป' }
  ];

  florist = [
    { value: '1', viewValue: '' },
    { value: '2', viewValue: 'ซงหนิงหนิง' },
    { value: '3', viewValue: 'หนึ่ง' }
  ];

  calculateDistance(address: string) {
    let d = 0;
    this.geocoder.geocode({ 'address': address }, (cusAddress, status) => {
      if (status == "OK") {
        if (cusAddress != null) {
          this.customerLocation = cusAddress[0].geometry.location;
          let R = 6371; // Radius of the earth in km
          let floristLat = 13.7995293;
          let floristLng = 100.550872;

          let dLat = this.deg2rad(this.customerLocation.lat() - floristLat);  // deg2rad below
          let dLng = this.deg2rad(this.customerLocation.lng() - floristLng);
          let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(floristLat)) * Math.cos(this.deg2rad(this.customerLocation.lat())) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)
            ;
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          let d = R * c; // Distance in km
          //use 'd' for distance
          console.log('distance: ', d);
        //  alert('distance: ' + d);
          //  this.floristDeliveryFee[i].distance = Math.round(d);         //floristDeliveryFeeResult.

        }
      }
      else {
        alert("Geocode was not successful for the following reason: " + status);
      }

    });
    //calculatedistance


    return d;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  async searchForm(): Promise<void>  {
    this.searchFlowerFormulaResult = [];
    this.searchFlowerFormulaFlorist = [];
    let distance = 0;
    this.deliveryFee = 0;
    this.priceOfFormula = [];
    let maxQty = 0;
    maxQty = Number(this.searchFlowerForm.value.quantity);
    // this.calculateDistance(this.searchFlowerForm.value.address);
    this.florists = await this.restApiService.getFlorist().toPromise();
    this.floristDeliveryFee = [];
    this.receiveDate = this.searchFlowerForm.value.date;

    if(this.searchFlowerForm.value.florist != '')
    {
      this.searchFlowerForm.value.floristId = Number(this.florists.find(f => f.name == this.searchFlowerForm.value.florist)?.id);
    }

    if(this.searchFlowerForm.value.date != null && this.searchFlowerForm.value.date != '')
    {
      this.receiveDate = this.searchFlowerForm.value.date;
    }
    else
    {
      this.receiveDate = new Date();
    }
    this.restApiService.searchFlowerFormula(this.searchFlowerForm.value).subscribe(async (data: FlowerFormula[]) => {
    //  console.log(this.searchFlowerForm.value);

      this.flowerFormulaSearch = [];
      if (data != null) {
        for (let i = 0; i < data.length; i++) {

          let searchResult: {
            id: number,
            position: number,
            florist: string,
            floristId: number,
            name: string,
            size: string,
            pattern: string,
            color: string,
            price: number,
            occasion: string,
            quantityAvailable: number,
            deliveryFee: number,
            totalPrice: number
          } = {
            id: 0,
            position: 0,
            florist: '',
            floristId: 0,
            name: '',
            size: '',
            pattern: '',
            color: '',
            price: 0,
            occasion: '',
            quantityAvailable: 0,
            deliveryFee: 0,
            totalPrice: 0
          };
          searchResult.id = data[i].id;
          searchResult.position = i;
          if (this.searchFlowerForm.value.florist == '') {
            searchResult.florist = '';
          }
          else {
            searchResult.florist = String(this.florists.find(f => f.id == this.searchFlowerForm.value.floristId)?.name);
            searchResult.floristId = this.searchFlowerForm.value.floristId;
          }


          searchResult.name = data[i].name;
          searchResult.size = data[i].size;
          searchResult.pattern = data[i].pattern;
          searchResult.color = data[i].color;
          //searchResult.price = data[i].price;
          searchResult.occasion = data[i].occasion;
          searchResult.quantityAvailable = 0;
          searchResult.deliveryFee = 0;
          //searchResult.totalPrice = 0;
          this.searchFlowerFormulaResult.push(searchResult);
        }
      }

      // find available quantity
      for (let i = 0; i < this.searchFlowerFormulaResult.length; i++) {
        let price: Array<number> = [];
        let recieveDate: Date;
        recieveDate = this.currentDate;
        if (this.searchFlowerForm.value.date != '' && this.searchFlowerForm.value.date != null) {
          recieveDate = this.searchFlowerForm.value.date;
        }
       
        // check if florist==null
        if (this.searchFlowerFormulaResult[i].florist == '') {
          if (this.searchFlowerFormulaResult[i].pattern == 'เกาหลี') {
            this.searchFlowerFormulaResult[i].florist = 'ซงหนิงหนิง';
            this.searchFlowerFormulaResult[i].floristId = Number(this.florists.find(f => f.name == this.searchFlowerFormulaResult[i].florist)?.id);

            //find quantity availbale for Nink           
            
            // this.restApiService.getFlowerAvailableFromCurrentStock(this.searchFlowerFormulaResult[i].id,  this.searchFlowerFormulaResult[i].floristId, recieveDate).subscribe(async(result) => {
            // this.searchFlowerFormulaResult[i].quantityAvailable = result;})
          } 
          else {//แบบทั่วไป{
            this.searchFlowerFormulaResult[i].florist = 'หนึ่ง';
            this.searchFlowerFormulaResult[i].floristId = Number(this.florists.find(f => f.name == this.searchFlowerFormulaResult[i].florist)?.id);

            //find quantity available for neung
            //  this.restApiService.getFlowerAvailableFromCurrentStock(this.searchFlowerFormulaResult[i].id,  this.searchFlowerFormulaResult[i].floristId, recieveDate).subscribe(async(result) => {
            //   this.searchFlowerFormulaResult[i].quantityAvailable = result;})

            //Add new row for show other florist Nink
            let resultRow: {
              id: number,
              position: number,
              florist: string,
              floristId: number,
              name: string,
              size: string,
              pattern: string,
              color: string,
              price: number,
              occasion: string,
              quantityAvailable: number,
              deliveryFee: number,
              totalPrice: number
            } = {
              id: 0,
              position: 0,
              florist: '',
              floristId: 0,
              name: '',
              size: '',
              pattern: '',
              color: '',
              price: 0,
              occasion: '',
              quantityAvailable: 0,
              deliveryFee: 0,
              totalPrice: 0
            };
            resultRow.id = this.searchFlowerFormulaResult[i].id;
            resultRow.position = i;
            resultRow.florist = "ซงหนิงหนิง";
            resultRow.floristId = Number(this.florists.find(f => f.name == 'ซงหนิงหนิง')?.id);
            resultRow.name = this.searchFlowerFormulaResult[i].name;
            resultRow.size = this.searchFlowerFormulaResult[i].size;
            resultRow.pattern = this.searchFlowerFormulaResult[i].pattern;
            resultRow.color = this.searchFlowerFormulaResult[i].color;
            //resultRow.price = this.searchFlowerFormulaResult[i].price;
            resultRow.occasion = this.searchFlowerFormulaResult[i].occasion;
            resultRow.quantityAvailable = this.searchFlowerFormulaResult[i].quantityAvailable;

            //find quantity availble for nink
            //  this.restApiService.getFlowerAvailableFromCurrentStock(this.searchFlowerFormulaResult[i].id, resultRow.floristId, recieveDate).subscribe(async(result) => {
            //   resultRow.quantityAvailable = result;
            
           // })
            this.priceOfFormula = [];
            this.priceOfFormula.push({
              formulaId: resultRow.id,
              floristId: resultRow.floristId,
              totalOrder: 1,
              receiveDate: this.recieveDate
            });
          //  console.log('price= '+ this.priceOfFormula);
            if (this.priceOfFormula.length != 0) {
              this.restApiService.getSalesOrderPrice(this.priceOfFormula).subscribe((priceResult: SalesOrderPrice) => {
                resultRow.price = priceResult.flowerPrice;
              });
            }
            // if(resultRow.quantityAvailable >= maxQty)
            // {
             this.searchFlowerFormulaFlorist.push(resultRow);
            // }
         
          }
        }//end if florist from screen == null
        else //find florist from screen
        {
          //find available quantity for florist from screen
          let floristId = 0;
          floristId = Number(this.florists.find(f => f.name == this.searchFlowerForm.value.florist)?.id)
          this.searchFlowerFormulaResult[i].floristId = floristId;
          //   this.restApiService.getFlowerAvailableFromCurrentStock(this.searchFlowerFormulaResult[i].id, floristId, recieveDate).subscribe(async(result) => {
          //   this.searchFlowerFormulaResult[i].quantityAvailable = result;
          // })
        }
  
      } // End for this.searchFlowerFormulaResult.length

      //Merge result from all florist
      this.searchFlowerFormulaResult = this.searchFlowerFormulaResult.concat(this.searchFlowerFormulaFlorist);
      //this.searchFlowerFormulaResult.sort((a,b)=> a.size.localeCompare(b.size)).sort((a, b) => b.price - a.price);


      if (this.searchFlowerForm.value.address != '') {
        for (let i = 0; i < this.florists.length; i++) {
          distance = await this.restApiService.calculateDistanceFromFloristId(this.searchFlowerForm.value.address, this.florists[i].id);

        //  alert('distance customer = ' + distance);
          if (distance > 0) {
            let floristDeliveryFeeResult: {
              id: number,
              floristId: number,
              name: string,
              address: string,
              location: google.maps.LatLng,
              distance: number,
              deliveryFee: number,
            } =
            {
              id: 0,
              floristId: 0,
              name: '',
              address: '',
              location: new google.maps.LatLng(0, 0),
              distance: 0,
              deliveryFee: 0,
            };
            floristDeliveryFeeResult.floristId = this.florists[i].id;
            floristDeliveryFeeResult.address = this.florists[i].address;
            floristDeliveryFeeResult.name = this.florists[i].name;
            floristDeliveryFeeResult.distance = distance;
            this.floristDeliveryFee.push(floristDeliveryFeeResult);
          }
          //calculate delivery fee
          if (this.floristDeliveryFee.length > 0) {
            //TO DO for floristDeliveryFee
            this.floristDeliveryFee[i].deliveryFee = await this.restApiService.calculateDeliveryFee(this.floristDeliveryFee[i].distance).toPromise();            
          }
        }
      }

      //calculate price for all result
      for (let i = 0; i < this.searchFlowerFormulaResult.length; i++) {
        let index = 0;
        
        this.deliveryFee = Number(this.floristDeliveryFee.find(f => f.name === this.searchFlowerFormulaResult[i].florist)?.deliveryFee);
       if(isNaN(this.deliveryFee ))
       {
        this.deliveryFee = 0;
       }
       // console.log(this.searchFlowerFormulaResult[i].florist + ' ' + this.deliveryFee);
        this.searchFlowerFormulaResult[i].position = i + 1;
        this.searchFlowerFormulaResult[i].deliveryFee = this.deliveryFee;

        this.priceOfFormula = [];
        this.priceOfFormula.push({
          formulaId: this.searchFlowerFormulaResult[i].id,
          floristId: this.searchFlowerFormulaResult[i].floristId,
          totalOrder: 1,
          receiveDate: this.receiveDate
        });
      //  console.log('price= '+ this.priceOfFormula);
        if (this.priceOfFormula.length != 0) {
          this.restApiService.getSalesOrderPrice(this.priceOfFormula).subscribe(async(priceResult: SalesOrderPrice) => {
            this.searchFlowerFormulaResult[i].price = priceResult.flowerPrice;
            this.searchFlowerFormulaResult[i].totalPrice = this.searchFlowerFormulaResult[i].price + this.deliveryFee;
          });
        }
    //  }
        
      }//End fot calculate price

      //calculate floweravailable
      this.searchFlowerFormulaResultFilter = [];
      let index = 0;
      for (let k =0; k < this.searchFlowerFormulaResult.length; k++)
      {
        if(this.searchFlowerForm.value.date != null && this.searchFlowerForm.value.date != '')
        {
          this.receiveDate = this.searchFlowerForm.value.date;
        }
        else
        {
          this.receiveDate = new Date();
        }
         this.restApiService.getFlowerAvailableFromCurrentStock(this.searchFlowerFormulaResult[k].id, this.searchFlowerFormulaResult[k].floristId, this.receiveDate).subscribe(async(result) => {
         if(result >= maxQty)
         {
          this.searchFlowerFormulaResult[k].quantityAvailable = result;
          let searchResultFilter: {
            id: number,
            position: number,
            florist: string,
            floristId: number,
            name: string,
            size: string,
            pattern: string,
            color: string,
            price: number,
            occasion: string,
            quantityAvailable: number,
            deliveryFee: number,
            totalPrice: number
          } = {
            id: this.searchFlowerFormulaResult[k].id,
            position: index+1,
            florist: this.searchFlowerFormulaResult[k].florist,
            floristId: this.searchFlowerFormulaResult[k].floristId,
            name: this.searchFlowerFormulaResult[k].name,
            size: this.searchFlowerFormulaResult[k].size,
            pattern: this.searchFlowerFormulaResult[k].pattern,
            color: this.searchFlowerFormulaResult[k].color,
            price: this.searchFlowerFormulaResult[k].price,
            occasion: this.searchFlowerFormulaResult[k].occasion,
            quantityAvailable: this.searchFlowerFormulaResult[k].quantityAvailable,
            deliveryFee: this.deliveryFee,
            totalPrice: this.searchFlowerFormulaResult[k].totalPrice
          };
          this.searchFlowerFormulaResultFilter.push(searchResultFilter);
          index++;
          this.searchFlowerFormulaResultFilter = this.searchFlowerFormulaResultFilter.sort((a, b) => b.price - a.price).sort((a,b)=> b.quantityAvailable - a.quantityAvailable);

          for (let j = 0; j < this.searchFlowerFormulaResultFilter.length; j++)
          {
              this.searchFlowerFormulaResultFilter[j].position = j+1;
          }
          this.dataSource = new MatTableDataSource<SearchFlowerFormulaResult>(this.searchFlowerFormulaResultFilter);

         }
         })
      }
      //this.filterQuantity();

      //console.warn(this.searchFlowerForm.value);
      //console.warn(this.dataSource);
     // console.warn(this.searchFlowerFormulaResultFilter);
      if (this.searchFlowerForm.value.quantity != null && this.searchFlowerForm.value.quantity != '') {
        // this.searchFlowerFormulaResultFilter = this.searchFlowerFormulaResult.filter(result => result.quantityAvailable >= maxQty);
         //this.dataSource =this.searchFlowerFormulaResult; 
         this.dataSource = new MatTableDataSource<SearchFlowerFormulaResult>(this.searchFlowerFormulaResultFilter);
         //for
         //this.searchFlowerFormulaResult = [];
         this.dataSource.filteredData = new MatTableDataSource<SearchFlowerFormulaResult>(this.searchFlowerFormulaResultFilter).filteredData;
  
       }
       else
       {
  this.dataSource = new MatTableDataSource<SearchFlowerFormulaResult>(this.searchFlowerFormulaResult);
       }
       this.dataSource.paginator = this.paginator;
    })
  }

  filterQuantity()
  {
    var maxQty = 0;
    if(this.searchFlowerForm.value.date != null && this.searchFlowerForm.value.date != '')
    {
      this.receiveDate = this.searchFlowerForm.value.date;
    }
    else
    {
      this.receiveDate = new Date();
    }
    if(this.searchFlowerForm.value.quantity != null && this.searchFlowerForm.value.quantity != '')
    {
      maxQty = Number(this.searchFlowerForm.value.quantity);

    for(let i = 0; i < this.searchFlowerFormulaResult.length; i++)
    {
      this.restApiService.getFlowerAvailableFromCurrentStock(this.searchFlowerFormulaResult[i].id, this.searchFlowerFormulaResult[i].floristId, this.recieveDate).subscribe(async(result) => {
        this.searchFlowerFormulaResult[i].quantityAvailable = result;
      
      if (result >= maxQty)
      {
      let searchResultFilter: {
        id: number,
        position: number,
        florist: string,
        floristId: number,
        name: string,
        size: string,
        pattern: string,
        color: string,
        price: number,
        occasion: string,
        quantityAvailable: number,
        deliveryFee: number,
        totalPrice: number
      } = {
        id: this.searchFlowerFormulaResult[i].id,
        position: i+1,
        florist: this.searchFlowerFormulaResult[i].florist,
        floristId: this.searchFlowerFormulaResult[i].floristId,
        name: this.searchFlowerFormulaResult[i].name,
        size: this.searchFlowerFormulaResult[i].size,
        pattern: this.searchFlowerFormulaResult[i].pattern,
        color: this.searchFlowerFormulaResult[i].color,
        price: this.searchFlowerFormulaResult[i].price,
        occasion: this.searchFlowerFormulaResult[i].occasion,
        quantityAvailable: this.searchFlowerFormulaResult[i].quantityAvailable,
        deliveryFee: this.deliveryFee,
        totalPrice: this.searchFlowerFormulaResult[i].totalPrice
      };
      this.searchFlowerFormulaResultFilter.push(searchResultFilter);
    }
    })
  }
    this.dataSource = new MatTableDataSource<SearchFlowerFormulaResult>(this.searchFlowerFormulaResultFilter);

    }

  }
}