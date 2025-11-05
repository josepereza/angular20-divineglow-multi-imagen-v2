export interface Imagen {
  id: number;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number; // <-- Nueva propiedad
  imagenes: Imagen[]; // <-- Cambiado de imageUrl a un array de Imagen
}