import { SelectionModel } from '@angular/cdk/collections';
import { Overlay } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Florist } from '../interface/florist';
import { Stock } from '../interface/stock';
import { RestApiService } from '../_shared/rest-api.service';
import { AddStockComponent } from './add-stock/add-stock.component';
import { DeleteStockComponent } from './delete-stock/delete-stock.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements AfterViewInit{

  displayedColumns: string[] = [];
  dataSource: any;
  locations: Florist[] = [];
  stocks: Stock[] = [];
  locationFilter = new FormControl();
  searchFilter = new FormControl();
  selection = new SelectionModel<Stock>(true, []);

  filteredValues = { locationName: '', flowerName: '' };
  constructor(
    private restApiService: RestApiService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.restApiService.getFlorist().subscribe((data: Florist[]) => {
      for (let i = 0; i < data.length; i++) {
        this.locations.push(data[i]);
      }
    });

    this.restApiService.getStock().subscribe((data: Stock[]) => {
      for (let i = 0; i < data.length; i++) {
        this.stocks.push(data[i]);
      }
      // this.displayedColumns = ['select', 'name', 'quantity', 'lot', 'price', 'location'];
      this.displayedColumns = ['select', 'name', 'quantity', 'location'];
      this.dataSource = new MatTableDataSource<Stock>(this.stocks);

      // this.dataSource.filterPredicate = (data: Stock, filter: string) => {
      //   return data.florist.locationName.toLocaleLowerCase().includes(filter) && (data.flower.flowerName.toLocaleLowerCase().includes(filter));
      // }
      // this.dataSource.filterPredicate = ((data: Stock, filter: any) => {
      //   const a = !filter.location || data.florist.locationName.toLowerCase().includes(filter.location);
      //   const b = !filter.search || data.flower.flowerName.toLowerCase().includes(filter.search);
      //   return a && b;
      // });

      this.locationFilter.valueChanges.subscribe((locationFilterValue) => {
        this.filteredValues['locationName'] = locationFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        console.log('location');
      });
  
      this.searchFilter.valueChanges.subscribe((searchFilterValue) => {
        this.filteredValues['flowerName'] = searchFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        console.log('search');
      });

      this.dataSource.filterPredicate = this.customFilterPredicate();
      this.dataSource.paginator = this.paginator;
    });
  }

  customFilterPredicate() {
    const myFilterPredicate = function(data:Stock, filter:string) :boolean {
      let searchString = JSON.parse(filter);
      let nameFound = data.flower.flowerName.toString().trim().toLowerCase().indexOf(searchString.flowerName.toLowerCase()) !== -1
      let locationFound = data.florist.locationName.toString().trim().indexOf(searchString.locationName) !== -1
      return nameFound && locationFound 
    }
    return myFilterPredicate;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row: Stock) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Stock): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  openDialogAdd() {
    const dialogRef = this.dialog.open(AddStockComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogDelete() {
    if (this.selection['_selected'].length >= 1) {
      const dialogRef = this.dialog.open(DeleteStockComponent, {
        // height: '600px',
        width: '700px',
        // minHeight: 'calc(100vh - 90px)',
        // height: 'auto',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        data: this.selection['_selected'],
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'กรุณาเลือกดอกไม้ที่ต้องการตัดสต๊อก',
      })
    }
  }
}