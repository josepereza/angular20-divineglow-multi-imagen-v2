import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  // URL de nuestro backend de ejemplo
  private backendUrl = 'http://localhost:3001'; 

  processPayment(paymentMethodId: string, amount: number): Observable<any> {
    const payload = {
      paymentMethodId,
      amount: Math.round(amount * 100) // Stripe trabaja en céntimos
    };
    return this.http.post(`${this.backendUrl}/create-payment`, payload);
  }
}