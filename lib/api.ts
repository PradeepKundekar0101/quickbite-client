import type {
  AuthResponse,
  Order,
  Product,
  Restaurant,
  User,
} from "./types";

const BASE = "/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("qb_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }) =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  users: {
    me: () => request<User & { phone: string; addresses: Array<{ label: string; street: string; city: string; zipCode: string }> }>("/users/me"),
    update: (data: Record<string, unknown>) =>
      request<User>("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  restaurants: {
    list: () => request<Restaurant[]>("/restaurants"),
    get: (id: string) => request<Restaurant>(`/restaurants/${id}`),
  },

  products: {
    list: () => request<Product[]>("/products"),
    search: (q: string) => request<Product[]>(`/products/search?q=${encodeURIComponent(q)}`),
    get: (id: string) => request<Product>(`/products/${id}`),
  },

  orders: {
    list: () => request<Order[]>("/orders"),
    get: (id: string) => request<Order>(`/orders/${id}`),
    create: (data: {
      restaurantId: string;
      items: { productId: string; quantity: number }[];
      deliveryAddress: string;
    }) =>
      request<Order>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    cancel: (id: string) =>
      request<Order>(`/orders/${id}/cancel`, { method: "PUT" }),
  },
};
