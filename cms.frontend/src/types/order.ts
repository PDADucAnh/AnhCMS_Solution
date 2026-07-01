export type OrderStatus = 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';

export interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  productName?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  customerName?: string;
}

export interface Order {
  id: number;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  orderDate: string;
  status: OrderStatus;
  notes?: string;
  orderDetails?: OrderDetail[];
}

export interface OrderInput {
  customerId: number;
  notes?: string;
  items: { productId: number; quantity: number; unitPrice: number }[];
}
