import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCustomerComponent } from './summary-customer.component';

describe('SummaryCustomerComponent', () => {
  let component: SummaryCustomerComponent;
  let fixture: ComponentFixture<SummaryCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
