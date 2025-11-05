import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListAdmin } from './product-list-admin';

describe('ProductListAdmin', () => {
  let component: ProductListAdmin;
  let fixture: ComponentFixture<ProductListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
