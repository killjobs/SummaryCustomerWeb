import { TestBed } from '@angular/core/testing';

import { SummaryCustomerService } from './summary-customer.service';

describe('SummaryCustomerService', () => {
  let service: SummaryCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
