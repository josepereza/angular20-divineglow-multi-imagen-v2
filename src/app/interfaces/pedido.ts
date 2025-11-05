export interface LineaPedido {
  id?: number;
  pedidoId?: number;
  producto?: Producto;
  productoId: number;
  cantidad: number;
}
export interface Producto {
    id:          number;
    name:        string;
    description: string;
    price:       string;
    imageUrl:    string;
    stock:       number;
}
export interface CreatePedido {
  id?: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  totalAmount?: number;
  gesendet?: boolean;
  lineas: LineaPedido[];
  createdAt?: Date;
}
