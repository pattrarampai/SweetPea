import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportSummaryComponent } from './SaleReportSummary.component';

describe('SaleReportSummaryComponent', () => {
  let component: SaleReportSummaryComponent;
  let fixture: ComponentFixture<SaleReportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReportSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
