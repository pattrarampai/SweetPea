import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchflowerComponent } from './searchflower.component';

describe('SearchflowerComponent', () => {
  let component: SearchflowerComponent;
  let fixture: ComponentFixture<SearchflowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchflowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchflowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
