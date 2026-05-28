/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    code: "ANG-SH-01",
    name: "Short Angelina Elastic",
    category: "Short",
    size: "M",
    color: "Fúcsia Coral",
    price: 89.90,
    costPrice: 32.00,
    stock: 24,
    minStock: 5,
    description: "Short fitness de alta costura com elástico anatômico na cintura, costura reforçada e toque gelado. Tecnologia zero transparência.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "prod-2",
    code: "ANG-LEG-02",
    name: "Calça Legging Sculpt Seamless",
    category: "Legging",
    size: "G",
    color: "Preto Matte",
    price: 149.90,
    costPrice: 55.00,
    stock: 18,
    minStock: 8,
    description: "Calça legging sem costura de poliamida inteligente com compressão graduada, excelente sustentação e cós duplo super alto que modela o abdômen.",
    imageUrl: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "prod-3",
    code: "ANG-LEG-03",
    name: "Calça Legging Sculpt Seamless",
    category: "Legging",
    size: "P",
    color: "Verde Esmeralda",
    price: 149.90,
    costPrice: 55.00,
    stock: 4,
    minStock: 8, // Low stock warning trigger!
    description: "Calça legging sem costura de poliamida inteligente com compressão graduada, excelente sustentação e cós duplo super alto que modela o abdômen.",
    imageUrl: "https://images.unsplash.com/photo-154df519791-7402c10b1a1c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "prod-4",
    code: "ANG-CAM-04",
    name: "Camisa Dry-Fit Breathe",
    category: "Camisa",
    size: "G",
    color: "Lavanda Soft",
    price: 79.90,
    costPrice: 28.00,
    stock: 35,
    minStock: 10,
    description: "Camiseta para corrida e treino pesado confeccionada em microfibras anti-odor de secagem rápida. Tecido furadinho ultra-respirável.",
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "prod-5",
    code: "ANG-REG-05",
    name: "Regata Ribbed Athletic",
    category: "Regata",
    size: "P",
    color: "Branco Off-White",
    price: 64.90,
    costPrice: 20.00,
    stock: 15,
    minStock: 5,
    description: "Regata canelada confeccionada em modal com elastano premium. Costuras macias que não causam atrito com a pele durante treinos.",
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "prod-6",
    code: "ANG-TOP-06",
    name: "Top Angelina Hyper Compression",
    category: "Top",
    size: "M",
    color: "Rosa Neon",
    price: 89.90,
    costPrice: 24.50,
    stock: 22,
    minStock: 6,
    description: "Top com bojo removível inteligente, alças largas nas costas para perfeita distribuição de peso e elástico confortável. Alto suporte de impacto.",
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
  }
];
