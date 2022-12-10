import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSalesorderComponent } from './create-salesorder.component';

describe('CreateSalesorderComponent', () => {
  let component: CreateSalesorderComponent;
  let fixture: ComponentFixture<CreateSalesorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSalesorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSalesorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
