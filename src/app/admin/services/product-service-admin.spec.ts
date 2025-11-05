import { TestBed } from '@angular/core/testing';

import { ProductServiceAdmin } from './product-service-admin';

describe('ProductServiceAdmin', () => {
  let service: ProductServiceAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductServiceAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
