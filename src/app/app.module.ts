import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesorderComponent } from './salesorder/salesorder.component';
import { PromotionComponent, PromotionDialogComponent, PromotionUnitDialogComponent, PromotionReplaceDialogComponent, PromotionSuccessDialogComponent } from './promotion/promotion.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { AuthService } from './_services/auth.service';
import { CreateSalesorderComponent } from './create-salesorder/create-salesorder.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { SearchflowerComponent } from './searchflower/searchflower.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditSalesOrderComponent } from './salesorder/edit-sales-order/edit-sales-order.component';
import { MatRadioModule } from '@angular/material/radio';
import { DatePipe } from '@angular/common'
import { StockComponent } from './stock/stock.component';
import { DeleteStockComponent } from './stock/delete-stock/delete-stock.component';
import { AddStockComponent } from './stock/add-stock/add-stock.component';
import { SaleReportComponent } from './report/saleReport.component';
import { SaleReportSummaryComponent } from './report/saleReportSummary.component';
import { ChartsModule } from 'ng2-charts';
import { StockReportComponent } from './stockReport/stockReport.component';
import { PromotionReportComponent } from './promotionReport/promotionReport.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    DashboardComponent,
    SalesorderComponent,
    PromotionComponent,
    PromotionDialogComponent,
    LoginComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    CreateSalesorderComponent,
    SearchflowerComponent,
    EditSalesOrderComponent,
    PromotionUnitDialogComponent,
    StockComponent,
    DeleteStockComponent,
    AddStockComponent,
    PromotionReplaceDialogComponent,
    PromotionSuccessDialogComponent,
    SaleReportComponent,
    SaleReportSummaryComponent,
    StockReportComponent,
    PromotionReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule,
    MatGridListModule,
    DragDropModule,
    MatCardModule,
    FlexLayoutModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    HttpClientModule,
    MatPaginatorModule,
    FlexLayoutModule,
    NgbModule,
    MatRadioModule,
    ChartsModule
  ],
  providers: [AuthService, AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }