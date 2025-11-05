import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form';
import { ProductServiceAdmin } from '../../services/product-service-admin';
import { HttpClient, httpResource } from '@angular/common/http';
import { Product } from '../../../interfaces/product';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'product-list-admin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-list-admin.html',
  styleUrl: './product-list-admin.css',
})
export class ProductListAdmin {
  private service = inject(ProductServiceAdmin);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  products = this.service.products;
  showModal = signal(false);
  selectedProduct = signal<Product | null>(null);
  http = inject(HttpClient);
  imagenesPreview = signal<string[]>([]);

  productoForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(1)]],
  });

  selectedFiles: File[] = [];

  constructor() {
    this.service.loadProducts();

    effect(() => {
      const product = this.selectedProduct();
      if (product) {
        this.productoForm.patchValue(product);
      } else {
        this.productoForm.reset();
      }
    });
  }

  editMode = computed(() => !!this.selectedProduct());

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);

    const previews: string[] = [];
    this.selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        previews.push(e.target.result);
        this.imagenesPreview.set([...previews]);
      };
      reader.readAsDataURL(file);
    });
  }

  submitForm() {
    if (this.productoForm.invalid) return;

    const formData = new FormData();
    const productoDto = this.productoForm.value;

    formData.append('name', productoDto.name);
    formData.append('description', productoDto.description);
    formData.append('price', productoDto.price);
    formData.append('stock', productoDto.stock);

    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
      const id = this.productoForm.get('id')?.value;
    this.service.saveProduct(id, formData,this.productoForm.value);
    this.closeModal();  

     /*   this.http.post('http://localhost:3000/productos/upload', formData)
      .subscribe({
        next: resp => {
          console.log('Producto creado:', resp);
          this.productoForm.reset();
          this.selectedFiles = [];
          this.imagenesPreview.set([]);
        },
        error: err => console.error(err)
      });   */
  }
  openAddModal() {
    this.selectedProduct.set(null);
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.selectedProduct.set(product);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  deleteProduct(id: number) {
    this.service.deleteProduct(id);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); // vuelve a la página de login
  }
}
