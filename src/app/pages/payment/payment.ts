import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedidoService';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  cardholderName: string = '';

  // Inyección de dependencias
  cartService = inject(CartService);
  pedidoService = inject(PedidoService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  // Referencia al div donde se montará el elemento de Stripe
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  // Variables de estado de Stripe
  private stripe: Stripe | null = null;
  private cardElement: StripeCardElement | null = null;

  // Signals para gestionar el estado de la UI
  isLoading = signal(false);
  cardError = signal<string | null>(null);

  async ngOnInit() {
    // Carga la librería de Stripe.js de forma asíncrona
    this.stripe = await loadStripe(
      'pk_test_51KwttKJhfdXMP2PM1eyZwmyTnW37LyaYzXB4xe0Hn13Y1NHPNUj4FVlVg4NoGLym1SO38P5WJrM0UbgWbMKScooI0000eFuVzO'
    ); // <--- ¡PON TU CLAVE pk_test_... AQUÍ!

    if (this.stripe) {
      this.setupStripeElement();
    }
  }

  private setupStripeElement() {
    const elements = this.stripe!.elements();
    // Estilos para el campo de la tarjeta
    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    // Crea y monta el elemento de tarjeta
    this.cardElement = elements.create('card', {
      style: style,
      hidePostalCode: true, // Esta es la línea mágica
    });
    this.cardElement.mount(this.cardElementRef.nativeElement);

    // Escucha los errores de validación de la tarjeta en tiempo real
    this.cardElement.on('change', (event) => {
      this.cardError.set(event.error ? event.error.message : null);
    });
  }

  async handleSubmit() {
    console.log('handleSubmit SE HA EJECUTADO CORRECTAMENTE!');
    // Añadimos una validación extra para el nombre
    if (this.isLoading() || !this.stripe || !this.cardElement || !this.cardholderName) {
      if (!this.cardholderName) {
        this.cardError.set('Por favor, introduce el nombre que aparece en la tarjeta.');
      }
      return;
    }
    this.isLoading.set(true);

    // 1. Crea un PaymentMethod. Esto envía los datos de la tarjeta de forma segura a Stripe
    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: this.cardholderName, // Pasamos el nombre del titular a Stripe
      },
    });

    if (error) {
      this.cardError.set(error.message || 'Ocurrió un error inesperado.');
      this.isLoading.set(false);
      return;
    }

    // 2. Envía el ID del PaymentMethod y el total a tu backend
    const amount = this.cartService.totalPrice();
    this.paymentService.processPayment(paymentMethod!.id, amount).subscribe({
      next: (response) => {
        console.log('Pago exitoso:', response);
        alert('¡Pago realizado con éxito!');
        this.pedidoService.createPedido(this.pedidoService.orderSignal()).subscribe({
          next: (response) => {
            console.log('Pedido creado con éxito:', response);
            alert('Pedido creado con éxito!');
            //   this.submissionStatus.set('success');
            // this.isSubmitting.set(false);
            this.cartService.clearCart(); // Vaciamos el carrito
            // this.checkoutForm.reset(); // Reseteamos el formulario          this.cartItems = []; // Limpiar carrito
          },
          error: (error) => {
            console.error('Error al crear el pedido:', error);
            alert('Error al crear el pedido: ' + (error.error?.message || error.message));
          },
        });

        this.cartService.clearCart();
        this.router.navigate(['/']); // Redirige al inicio
      },
      error: (err) => {
        console.error('Error en el backend:', err);
        this.cardError.set(err.error?.message || 'El pago no pudo ser procesado por el servidor.');
        this.isLoading.set(false);
      },
    });
  }
}
