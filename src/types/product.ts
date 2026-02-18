export interface Product {
  id: string | number;
  name: string;
  brand: string;
  strength: string;
  strengthMg: number;
  flavor: string;
  price: number;
  image: string;
  description: string;
  popularity: number;
}

export interface CartItem extends Product {
  quantity: number;
  packSize: number;
}

export interface PackOption {
  size: number;
  discount: number;
}