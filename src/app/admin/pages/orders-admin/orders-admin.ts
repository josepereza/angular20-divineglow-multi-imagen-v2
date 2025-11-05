import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreatePedido } from '../../../interfaces/pedido';
import { OrdersService } from '../../services/order-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-admin',
  templateUrl: 'orders-admin.html',
  styleUrl: 'orders-admin.css',

  imports: [RouterLink],
})
export default class OrdersAdminComponent implements OnInit {
  ordersService = inject(OrdersService);
  orders = this.ordersService.orders;

  filtro = signal<'alle' | 'offen' | 'gesendet'>('alle');
  // ✅ Computed: recalcula automáticamente cuando cambian orders o filtro
  ordersFiltrados = computed(() => {
    const estado = this.filtro();
    const lista = this.orders();
    if (estado === 'offen') return lista.filter((o) => !o.gesendet);
    if (estado === 'gesendet') return lista.filter((o) => o.gesendet);
    return lista; // alle ✅
  });

  constructor() {}
  ngOnInit(): void {
    this.ordersService.loadOrders(); // ✅ Recarga automática al entrar
  }

  selectedOrder = signal<CreatePedido | null>(null);
  showLinesModal = signal(false);

  viewLines(order: CreatePedido) {
    this.selectedOrder.set(order);
    this.showLinesModal.set(true);
  }

  toggleGesendet(order: CreatePedido) {
    const nuevoEstado = !order.gesendet;
    this.ordersService.updateGesendet(order.id!, nuevoEstado).subscribe({
      next: () => {
        order.gesendet = nuevoEstado; // Actualiza vista rápidamente ✅
      },
      error: (err) => console.error('Error al actualizar pedido', err),
    });
  }

  setFiltro(estado: 'alle' | 'offen' | 'gesendet') {
    this.filtro.set(estado);
  }
}
