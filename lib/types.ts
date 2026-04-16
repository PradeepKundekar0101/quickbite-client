export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  addresses?: Address[];
  createdAt?: string;
}

export interface Address {
  label: string;
  street: string;
  city: string;
  zipCode: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  address: string;
  isOpen: boolean;
  imageUrl: string;
  menuProducts?: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  restaurantId: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  status: "placed" | "preparing" | "delivering" | "delivered" | "cancelled";
  deliveryAddress: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
