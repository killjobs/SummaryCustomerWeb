import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCustomerDetailComponent } from './summary-customer-detail.component';

describe('SummaryCustomerDetailComponent', () => {
  let component: SummaryCustomerDetailComponent;
  let fixture: ComponentFixture<SummaryCustomerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCustomerDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryCustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
