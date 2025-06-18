import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSummaryCustomerComponent } from './management-summary-customer.component';

describe('ManagementSummaryCustomerComponent', () => {
  let component: ManagementSummaryCustomerComponent;
  let fixture: ComponentFixture<ManagementSummaryCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSummaryCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagementSummaryCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
