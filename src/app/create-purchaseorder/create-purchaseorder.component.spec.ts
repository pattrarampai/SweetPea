import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseorderComponent } from './create-purchaseorder.component';

describe('CreateSalesorderComponent', () => {
  let component: CreatePurchaseorderComponent;
  let fixture: ComponentFixture<CreatePurchaseorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseorderComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePurchaseorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
