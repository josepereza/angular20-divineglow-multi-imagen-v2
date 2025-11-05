import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
   private http = inject(HttpClient);
  private productsUrl = 'http://localhost:3000/productos';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }
  getProductsRs(){
    return httpResource<Product[]>(()=>(this.productsUrl))
  }  
  }


