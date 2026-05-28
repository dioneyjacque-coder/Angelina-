/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  size: "P" | "M" | "G" | "GG" | "U";
  color: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  description: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: "P" | "M" | "G" | "GG" | "U";
  selectedColor: string;
}

export interface Sale {
  id: string;
  date: string; // ISO format
  items: {
    productId: string;
    name: string;
    category: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: "Pix" | "Crédito" | "Boleto" | "Parcelamento";
  customerName: string;
  customerPhone?: string;
  shippingCost: number;
  status: "Completed" | "Pending" | "Refunded";
  installmentPlan?: {
    totalValue: number;
    installmentsCount: number;
    downPayment: number;
    interestRate: number; // percentage
    dueDateDay: number;
    parcels: {
      number: number;
      dueDate: string;
      value: number;
      status: "Pendente" | "Pago" | "Atrasado";
      paymentDate?: string;
    }[];
  };
}

export interface LogisticalSimulation {
  cep: string;
  deliveryMethod: "PAC" | "Sedex" | "Retirada";
  cost: number;
  days: number;
  status: string;
}

export interface MarketingIdeas {
  slogans: string[];
  stories: string[];
  feed: string;
  videoIdea: string;
}

export interface SupportMessage {
  id: string;
  sender: "user" | "model";
  text: string;
  timestamp: string;
}

export interface AbandonedCartNotification {
  id: string;
  customerName: string;
  phone: string;
  abandonedAt: string;
  itemsCount: number;
  totalValue: number;
  status: "Pendente" | "Enviado_WhatsApp" | "Enviado_E-mail" | "Recuperado";
}
