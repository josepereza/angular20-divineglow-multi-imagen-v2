import { Component, Input, Output, EventEmitter, inject, signal, computed, effect, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../interfaces/product';
import { ProductServiceAdmin } from '../../services/product-service-admin';
import { ProductListAdmin } from '../product-list-admin/product-list-admin';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
 <div class="container mt-4">
  <div class="card bg-dark text-white shadow-lg border-secondary">
    <div class="card-body">
     
      <h3 class="card-title mb-3 text-info">
        <br><br>
        <p>hola</p>
          @if(!product.isLoading() && product.hasValue()) {
        @let producto = product.value();
        <h4>{{ producto.price}}</h4>
    }
        {{ editMode() ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}
      </h3>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row g-3">

        <div class="col-md-6">
          <label class="form-label">Nombre</label>
          <input formControlName="name" class="form-control bg-secondary text-white" placeholder="Nombre del producto" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Precio (€)</label>
          <input formControlName="price" type="number" class="form-control bg-secondary text-white" placeholder="00.00" />
        </div>

        <div class="col-12">
          <label class="form-label">Descripción</label>
          <textarea formControlName="description" class="form-control bg-secondary text-white" rows="2"></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label">Stock</label>
          <input formControlName="stock" type="number" class="form-control bg-secondary text-white" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Imagen</label>
          <input type="file" class="form-control bg-secondary text-white" (change)="onFileChange($event)" />
        </div>

        <div class="col-12 mt-3">
          <button type="submit" class="btn btn-info w-100 fw-bold">
            {{ editMode() ? '💾 Guardar Cambios' : '✅ Agregar Producto' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</div>

  `
})
export class ProductFormComponent implements OnInit {
  id = input.required<string>();
  service=inject(ProductServiceAdmin)

  product=this.service.getProductRs(this.id)
  form!: FormGroup; // ✅ Declaramos pero no inicializamos aquí
  
  editMode = computed(() => !!this.product);
  
  constructor(private fb: FormBuilder) {
    
    this.form = this.fb.group({
      id: [null as number | null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.min(0)],
      imageUrl: [''],
      stock: [0],
    });

    effect(() => {
      if (this.product) {
        this.form.patchValue(this.product.value()!);
      } else {
        this.form.reset();
      }
    });
  }
  ngOnInit(): void {
    console.log('numero id', this.id())
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.form.get('imageUrl')?.setValue('/' + file.name);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const product = { ...this.form.value };

    if (!this.editMode()) {
      delete product.id;
    }

   /*  this.service.saveProduct(product as Product);
    this.form.reset(); */
  }
}
