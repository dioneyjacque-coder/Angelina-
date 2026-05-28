/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Plus, Search, Trash2, Edit, AlertTriangle, Filter, Save, ShoppingBag, DollarSign, Layers, Upload, Camera, Link, Image as ImageIcon, X, Check } from "lucide-react";
import { Product } from "../types";

const PRESETS_BY_CATEGORY: Record<string, { url: string; label: string }[]> = {
  Short: [
    { url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400", label: "Short Runner Angelina" },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400", label: "Short Training Violet" },
    { url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400", label: "Retro Gym Runner" }
  ],
  Camisa: [
    { url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400", label: "Camisa Dry Fit Lavanda" },
    { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400", label: "Tshirt Academia Premium" }
  ],
  Legging: [
    { url: "https://images.unsplash.com/photo-1483721074796-3771960dcdb1?auto=format&fit=crop&q=80&w=400", label: "Legging Sculpt Coral" },
    { url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400", label: "Legging Navy Seamless" },
    { url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=400", label: "Calça Legging Vinho" }
  ],
  Regata: [
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400", label: "Regata Cavada Premium" }
  ],
  Top: [
    { url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=400", label: "Top Angelina Rosê" },
    { url: "https://images.unsplash.com/photo-1618220027553-6251b6ad7062?auto=format&fit=crop&q=80&w=400", label: "Top Esporte Neon" }
  ],
  Acessórios: [
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400", label: "Garrafa Térmica Hydra" },
    { url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=400", label: "Par Luvas Ciclismo" }
  ]
};

interface InventoryManagerProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export function InventoryManager({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: InventoryManagerProps) {
  const defaultCategories = ["Short", "Camisa", "Legging", "Regata", "Top", "Acessórios"];
  const allCategories = Array.from(new Set([
    ...defaultCategories,
    ...products.map((p) => p.category).filter(Boolean)
  ]));

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"list" | "register">("list");
  
  // Full Editing product modal states for InventoryManager
  const [editingProductModal, setEditingProductModal] = useState<Product | null>(null);
  const [editInvName, setEditInvName] = useState("");
  const [editInvCode, setEditInvCode] = useState("");
  const [editInvCategory, setEditInvCategory] = useState<string>("Short");
  const [editInvCategoryInputMethod, setEditInvCategoryInputMethod] = useState<"select" | "custom">("select");
  const [editInvSize, setEditInvSize] = useState<Product["size"]>("M");
  const [editInvColor, setEditInvColor] = useState("");
  const [editInvPrice, setEditInvPrice] = useState("");
  const [editInvCostPrice, setEditInvCostPrice] = useState("");
  const [editInvStock, setEditInvStock] = useState("");
  const [editInvMinStock, setEditInvMinStock] = useState("");
  const [editInvDescription, setEditInvDescription] = useState("");
  const [editInvImageUrl, setEditInvImageUrl] = useState("");
  const [editInvImageInputMethod, setEditInvImageInputMethod] = useState<"preset" | "upload" | "url">("preset");
  const editInvFileInputRef = useRef<HTMLInputElement>(null);

  const startEditingInvProduct = (p: Product) => {
    setEditingProductModal(p);
    setEditInvName(p.name);
    setEditInvCode(p.code);
    setEditInvCategory(p.category);
    
    // Check if category is standard or custom
    const standardCategories = ["Short", "Camisa", "Legging", "Regata", "Top", "Acessórios"];
    const isStandard = standardCategories.includes(p.category);
    setEditInvCategoryInputMethod(isStandard ? "select" : "custom");

    setEditInvSize(p.size);
    setEditInvColor(p.color);
    setEditInvPrice(p.price.toString());
    setEditInvCostPrice(p.costPrice.toString());
    setEditInvStock(p.stock.toString());
    setEditInvMinStock(p.minStock.toString());
    setEditInvDescription(p.description);
    setEditInvImageUrl(p.imageUrl || "");
    setEditInvImageInputMethod(p.imageUrl && p.imageUrl.startsWith("data:") ? "upload" : "preset");
  };

  const handleEditInvImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A foto excedeu o limite máximo de 2MB. Por favor envie uma menor.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditInvImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInvProduct = () => {
    if (!editingProductModal) return;
    const updated: Product = {
      ...editingProductModal,
      name: editInvName,
      code: editInvCode,
      category: editInvCategory,
      size: editInvSize,
      color: editInvColor,
      price: parseFloat(editInvPrice) || 0,
      costPrice: parseFloat(editInvCostPrice) || 0,
      stock: parseInt(editInvStock) || 0,
      minStock: parseInt(editInvMinStock) || 0,
      description: editInvDescription,
      imageUrl: editInvImageUrl,
    };
    onUpdateProduct(updated);
    setEditingProductModal(null);
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");
  const [stockStatusFilter, setStockStatusFilter] = useState("TODOS"); // TODOS, BAIXO, NORMAL
  
  // Register Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Short");
  const [categoryInputMode, setCategoryInputMode] = useState<"select" | "custom">("select");
  const [size, setSize] = useState<Product["size"]>("M");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageInputMethod, setImageInputMethod] = useState<"preset" | "upload" | "url">("preset");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [useVariations, setUseVariations] = useState(false);
  const [variations, setVariations] = useState<{ size: Product["size"]; color: string; stock: string; minStock: string }[]>([
    { size: "M", color: "", stock: "", minStock: "5" }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A foto excedeu o limite máximo de 2MB. Por favor envie uma menor.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit inline states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState("");

  // Submit new product
  const handleRegisterProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isSingle = !useVariations;
    if (!name || !price || !costPrice || (isSingle && (!color || !stock))) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    const priceNum = parseFloat(price);
    const costNum = parseFloat(costPrice);

    if (isNaN(priceNum) || isNaN(costNum)) {
      alert("Os preços devem ser valores numéricos válidos.");
      return;
    }

    if (isSingle) {
      const stockNum = parseInt(stock);
      const minStockNum = parseInt(minStock) || 5;

      if (isNaN(stockNum)) {
        alert("O estoque deve ser um número inteiro válido.");
        return;
      }

      const codeNum = Math.floor(100 + Math.random() * 900);
      const generatedCode = `ANG-${category.substring(0,3).toUpperCase()}-${codeNum}`;

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        code: generatedCode,
        name,
        category,
        size,
        color,
        price: priceNum,
        costPrice: costNum,
        stock: stockNum,
        minStock: minStockNum,
        description,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
      };

      onAddProduct(newProduct);
    } else {
      // Validate variations
      if (variations.length === 0) {
        alert("Adicione pelo menos uma variação de cor e tamanho.");
        return;
      }

      for (let i = 0; i < variations.length; i++) {
        const v = variations[i];
        if (!v.color.trim()) {
          alert(`Preencha a cor da variação #${i + 1}.`);
          return;
        }
        const st = parseInt(v.stock);
        const mst = parseInt(v.minStock) || 5;
        if (isNaN(st) || st < 0) {
          alert(`O estoque da variação #${i + 1} deve ser um número maior ou igual a zero.`);
          return;
        }
      }

      // Loop and insert all
      variations.forEach((v, index) => {
        const codeNum = Math.floor(100 + Math.random() * 900);
        const generatedCode = `ANG-${category.substring(0,3).toUpperCase()}-${codeNum}`;
        const uniqueId = `prod-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;

        const newProduct: Product = {
          id: uniqueId,
          code: generatedCode,
          name,
          category,
          size: v.size,
          color: v.color.trim(),
          price: priceNum,
          costPrice: costNum,
          stock: parseInt(v.stock),
          minStock: parseInt(v.minStock) || 5,
          description,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
        };

        onAddProduct(newProduct);
      });
    }

    // Reset Form
    setName("");
    setColor("");
    setPrice("");
    setCostPrice("");
    setStock("");
    setMinStock("5");
    setDescription("");
    setImageUrl("");
    setCategory("Short");
    setCategoryInputMode("select");
    
    // Reset variations
    setUseVariations(false);
    setVariations([{ size: "M", color: "", stock: "", minStock: "5" }]);
    
    setActiveTab("list");
  };

  const handleQuickStockUpdate = (p: Product, newQuantity: number) => {
    if (newQuantity < 0) return;
    onUpdateProduct({
      ...p,
      stock: newQuantity
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.color.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "TODOS" || p.category === categoryFilter;
    
    const isLowStock = p.stock <= p.minStock;
    const matchesStock = stockStatusFilter === "TODOS" || 
                         (stockStatusFilter === "BAIXO" && isLowStock) || 
                         (stockStatusFilter === "NORMAL" && !isLowStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-indigo-600" size={20} />
            Módulo de Inventário & Cadastro
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie a grade do portfólio físico, custos e margem de lucro por peça de roupa</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === "list" 
                ? "bg-indigo-600 text-white shadow-xs" 
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Lista de Controle
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === "register" 
                ? "bg-indigo-600 text-white shadow-xs" 
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Plus size={14} />
            Cadastrar Peça
          </button>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="text-amber-600 shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold text-amber-950">Aviso crítico de ruptura de estoque!</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Existem <strong>{lowStockCount}</strong> modelos abaixo da quantidade mínima recomendada. Aprovisione novas peças de fitness para manter as entregas em dia.
            </p>
          </div>
        </div>
      )}

      {/* RENDER LIST TAB */}
      {activeTab === "list" && (
        <div>
          {/* Filters & search line */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <input
                type="text"
                placeholder="Pesquisar por nome, código ou cor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-700 focus:outline-none"
              >
                <option value="TODOS">Todas Categorias</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-700 focus:outline-none"
              >
                <option value="TODOS">Todos os Estoques</option>
                <option value="BAIXO">Apenas Baixo Estoque</option>
                <option value="NORMAL">Estoque Normal</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200/50 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-200/50 text-slate-500 font-bold tracking-wide uppercase text-[10px]">
                  <th className="p-3.5 pl-5">Código / Peça</th>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5">Tam / Cor</th>
                  <th className="p-3.5">Estoque Real</th>
                  <th className="p-3.5">Preço Venda</th>
                  <th className="p-3.5">Preço Custo</th>
                  <th className="p-3.5">Margem Lucro</th>
                  <th className="p-3.5 pr-5 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const isLow = p.stock <= p.minStock;
                    const marginValue = p.price - p.costPrice;
                    const marginPercent = ((marginValue / p.price) * 100).toFixed(0);

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/40 transition">
                        <td className="p-3.5 pl-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50 flex items-center justify-center">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover object-top"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Camera size={14} className="text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900">{p.name}</div>
                              <div className="text-[10px] text-neutral-400 font-mono tracking-wider mt-0.5">{p.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="py-0.5 px-2 rounded-md bg-neutral-100 text-neutral-600 font-medium font-sans">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-neutral-800">{p.size}</span>
                          <span className="text-neutral-400 mx-1.5">•</span>
                          <span className="text-neutral-500">{p.color}</span>
                        </td>
                        <td className="p-3.5 font-mono">
                          {editingId === p.id ? (
                            <div className="flex gap-1 items-center max-w-[100px]">
                              <input
                                type="number"
                                value={editStockValue}
                                onChange={(e) => setEditStockValue(e.target.value)}
                                className="w-12 border border-neutral-300 rounded p-1 text-center"
                              />
                              <button
                                onClick={() => {
                                  const parsedVal = parseInt(editStockValue);
                                  if (!isNaN(parsedVal)) {
                                    onUpdateProduct({ ...p, stock: parsedVal });
                                  }
                                  setEditingId(null);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded"
                                title="Salvar"
                              >
                                <Save size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-neutral-800'}`}>
                                {p.stock}
                              </span>
                              <span className="text-neutral-300 text-[10px]">/ min {p.minStock}</span>
                              {isLow && <AlertTriangle size={12} className="text-amber-500" title="Abaixo do Mínimo" />}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-neutral-900 font-bold font-mono">
                          R$ {p.price.toFixed(2)}
                        </td>
                        <td className="p-3.5 text-neutral-500 font-mono">
                          R$ {p.costPrice.toFixed(2)}
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className="text-emerald-600 font-semibold">R$ {marginValue.toFixed(2)}</span>
                          <span className="text-slate-400 text-[10px] ml-1">({marginPercent}%)</span>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => {
                                handleQuickStockUpdate(p, p.stock + 1);
                              }}
                              className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-600 font-bold"
                              title="Adicionar 1 un"
                            >
                              +
                            </button>
                            <button
                              onClick={() => {
                                handleQuickStockUpdate(p, p.stock - 1);
                              }}
                              className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-600 font-bold mr-2"
                              title="Subtrair 1 un"
                              disabled={p.stock <= 0}
                            >
                              -
                            </button>
                            <button
                              onClick={() => {
                                startEditingInvProduct(p);
                              }}
                              className="px-2.5 py-1 bg-neutral-105 border border-neutral-200 rounded-lg text-neutral-650 hover:bg-neutral-100 font-semibold cursor-pointer"
                              title="Editar todas as opções da peça de roupa"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Confirma excluir a peça de roupa "${p.name}"?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-150 flex items-center gap-1 font-bold cursor-pointer"
                              title="Apagar peça de roupa permanentemente"
                            >
                              <Trash2 size={11} />
                              Apagar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-400">
                      Nenhum produto atende aos filtros pesquisados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER REGISTER FORM */}
      {activeTab === "register" && (
        <form onSubmit={handleRegisterProduct} className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Nome da Vestimenta *</label>
              <input
                type="text"
                required
                placeholder="Ex: Calça Legging Soft Touch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">Categoria Fitness *</label>
              {categoryInputMode === "select" ? (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "CUSTOM") {
                      setCategoryInputMode("custom");
                      setCategory("");
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full text-xs p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="CUSTOM">➕ Criar Nova Categoria (Digitar)...</option>
                </select>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="Digite a nova categoria fitness"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-indigo-50/20 border border-indigo-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-indigo-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryInputMode("select");
                      setCategory("Short");
                    }}
                    className="px-3 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-300 transition"
                    title="Voltar para a seleção"
                  >
                    Voltar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
                <span>Preço Venda (R$) *</span>
                <DollarSign size={10} className="text-neutral-400" />
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 119.90"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
                <span>Custo de Fabricação (R$) *</span>
                <DollarSign size={10} className="text-neutral-400" />
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 35.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* TIPO DE CADASTRO: ÚNICO OU EM GRADE/VARIAÇÕES */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-4 shadow-xxs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <Layers size={13} className="text-[#233E82]" />
                  Variabilidade (Tamanhos e Cores)
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Escolha se deseja cadastrar uma única peça específica ou múltiplos tamanhos e cores de uma só vez.
                </p>
              </div>
              <div className="flex bg-neutral-105 p-1 rounded-xl text-[10px] font-bold w-full sm:w-auto border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setUseVariations(false)}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !useVariations
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Peça Única
                </button>
                <button
                  type="button"
                  onClick={() => setUseVariations(true)}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    useVariations
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Múltiplas Variações
                </button>
              </div>
            </div>

            {!useVariations ? (
              /* CADASTRO SIMPLES - PEÇA ÚNICA */
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50/40 p-3 rounded-xl border border-neutral-150">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Grade (Tamanho) *</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as Product["size"])}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none font-bold text-neutral-800"
                  >
                    <option value="P">P - Pequeno</option>
                    <option value="M">M - Médio</option>
                    <option value="G">G - Grande</option>
                    <option value="GG">GG - Extra Grande</option>
                    <option value="U">U - Tamanho Único</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Cor da Peça *</label>
                  <input
                    type="text"
                    required={!useVariations}
                    placeholder="Ex: Violeta Neon"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Estoque Inicial *</label>
                  <input
                    type="number"
                    required={!useVariations}
                    placeholder="Ex: 50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none font-bold text-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Mínimo Alerta *</label>
                  <input
                    type="number"
                    required={!useVariations}
                    placeholder="Ex: 5"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              /* CADASTRO AVANÇADO - MÚLTIPLAS CORES E TAMANHOS */
              <div className="space-y-3 bg-indigo-50/10 border border-indigo-100 p-4 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                    <Check size={12} className="text-[#233E82]" />
                    Lote de Vestimentas (Variações)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const chosenColor = variations[0]?.color || "";
                        const defaultSizes: Product["size"][] = ["P", "M", "G", "GG"];
                        const currentColorsSet = new Set(variations.map(vr => `${vr.color}-${vr.size}`));
                        
                        const toAdd: typeof variations = [];
                        defaultSizes.forEach(sz => {
                          const key = `${chosenColor}-${sz}`;
                          if (!currentColorsSet.has(key)) {
                            toAdd.push({ size: sz, color: chosenColor || "Vinho", stock: "10", minStock: "5" });
                          }
                        });
                        if (toAdd.length > 0) {
                          setVariations([...variations, ...toAdd]);
                        } else {
                          alert("Todos os tamanhos já foram adicionados para essa cor.");
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] text-indigo-700 hover:text-indigo-900 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      ⚡ Gerar P, M, G, GG
                    </button>
                    <button
                      type="button"
                      onClick={() => setVariations([...variations, { size: "M", color: "", stock: "", minStock: "5" }])}
                      className="px-3 py-1.5 bg-[#233E82] hover:bg-neutral-805 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                    >
                      <Plus size={12} />
                      Nova Linha
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-indigo-100 text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest pb-1">
                        <th className="py-1 pl-1 pr-2 w-1/4">Tamanho *</th>
                        <th className="py-1 px-2 w-1/3">Cor *</th>
                        <th className="py-1 px-2 w-1/5">Estoque *</th>
                        <th className="py-1 px-2 w-1/5">Mín. Alerta *</th>
                        <th className="py-1 pl-2 text-center w-12">Remover</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-150">
                      {variations.map((v, index) => (
                        <tr key={index} className="group hover:bg-neutral-50/10">
                          <td className="py-2 pr-2">
                            <select
                              value={v.size}
                              onChange={(e) => {
                                const copy = [...variations];
                                copy[index].size = e.target.value as Product["size"];
                                setVariations(copy);
                              }}
                              className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none font-bold text-neutral-800"
                            >
                              <option value="P">P</option>
                              <option value="M">M</option>
                              <option value="G">G</option>
                              <option value="GG">GG</option>
                              <option value="U">U</option>
                            </select>
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              required
                              placeholder="Ex: Marsala, Preto..."
                              value={v.color}
                              onChange={(e) => {
                                const copy = [...variations];
                                copy[index].color = e.target.value;
                                setVariations(copy);
                              }}
                              className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              required
                              placeholder="10"
                              value={v.stock}
                              onChange={(e) => {
                                const copy = [...variations];
                                copy[index].stock = e.target.value;
                                setVariations(copy);
                              }}
                              className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none font-bold text-neutral-800"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              required
                              placeholder="5"
                              value={v.minStock}
                              onChange={(e) => {
                                const copy = [...variations];
                                copy[index].minStock = e.target.value;
                                setVariations(copy);
                              }}
                              className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none"
                            />
                          </td>
                          <td className="py-2 pl-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (variations.length === 1) {
                                  alert("Sua grade deve conter no mínimo uma variação.");
                                  return;
                                }
                                setVariations(variations.filter((_, i) => i !== index));
                              }}
                              disabled={variations.length === 1}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer disabled:opacity-30"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-indigo-100/50 mt-1">
                  <span className="text-[10px] text-neutral-500 italic">
                    Serão inseridas {variations.length} {variations.length === 1 ? 'peça individual' : 'peças individuais'} com códigos gerados automaticamente.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* INTERACTIVE AND MULTI-OPTION CLOTHING IMAGE SELECTOR */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200/60">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <ImageIcon size={14} className="text-[#233E82]" />
                Foto da Peça de Roupa
              </label>
              <div className="flex bg-slate-200/60 p-1 rounded-lg gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageInputMethod("preset")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    imageInputMethod === "preset"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Modelos Prontos
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMethod("upload")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    imageInputMethod === "upload"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Enviar Foto (PC/Celular)
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMethod("url")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    imageInputMethod === "url"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Link Externo (URL)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Image Input Options Side */}
              <div className="md:col-span-8 flex flex-col justify-center">
                {imageInputMethod === "preset" && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Escolha uma foto de modelo profissional com um clique baseada na categoria <span className="font-bold text-[#233E82] uppercase">{category}</span>:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {((PRESETS_BY_CATEGORY[category] || PRESETS_BY_CATEGORY["Short"]).map((preset, idx) => {
                        const isSelected = imageUrl === preset.url;
                        return (
                          <div
                            key={idx}
                            onClick={() => setImageUrl(preset.url)}
                            className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-102 ${
                              isSelected
                                ? "border-[#233E82] ring-2 ring-indigo-500/20 shadow-md"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/65 py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[8px] text-white font-bold leading-none block truncate px-1">
                                {preset.label}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white rounded-full p-1 shadow">
                                <Check size={8} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                        );
                      }))}
                    </div>
                  </div>
                )}

                {imageInputMethod === "upload" && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-500">
                      Tire uma foto ou envie do seu celular/computador. O arquivo será otimizado e gravado em cache instantaneamente.
                    </p>
                    
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all space-y-1.5 group shadow-xs"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="mx-auto w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload size={14} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-indigo-600 hover:underline">Clique para enviar</span> ou arraste a imagem aqui
                      </div>
                      <p className="text-[9px] text-slate-405">Suporta PNG, JPG ou WEBP de até 2MB</p>
                    </div>
                  </div>
                )}

                {imageInputMethod === "url" && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500">
                      Cole o link correspondente a uma imagem hospedada na web ou redes sociais:
                    </p>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-slate-400">
                        <Link size={13} />
                      </div>
                      <input
                        type="url"
                        placeholder="Ex: https://endereço-de-imagem.com/foto.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full text-xs pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Side */}
              <div className="md:col-span-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-3 md:pt-0 md:pl-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Live Preview Provador</span>
                <div className="relative aspect-square w-24 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center text-slate-350">
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-top animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full shadow-md transition"
                        title="Remover foto"
                      >
                        <X size={10} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2 space-y-1 text-slate-400">
                      <Camera size={18} className="mx-auto" />
                      <span className="text-[8px] block">Sem Foto Selecionada</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Descrição Técnica do Tecido e Tecnologia</label>
            <textarea
              rows={3}
              placeholder="Ex: Fabricado em Poliamida de alta elasticidade com controle bactericida. Toque leve de secagem rápida com bloqueio de raios solares UV 50+."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-3 text-xs font-bold shadow-md shadow-indigo-600/10 transition flex items-center gap-2"
          >
            <ShoppingBag size={14} />
            Cadastrar peça em Estoque
          </button>
        </form>
      )}

      {/* Dynamic Product Editing Dialog Modal */}
      {editingProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto animate-fade-in animate-duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 relative border border-slate-100 text-slate-800 font-sans mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setEditingProductModal(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-2 rounded-full transition font-bold text-lg leading-none cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-sm font-bold text-slate-805 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Edit className="text-indigo-600" size={16} />
              Editar Todas as Opções da Peça de Roupa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-605 font-bold mb-1">Nome da Vestimenta *</label>
                <input 
                  type="text"
                  required
                  value={editInvName}
                  onChange={(e) => setEditInvName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-605 font-bold mb-1">Código de Referência *</label>
                <input 
                  type="text"
                  required
                  value={editInvCode}
                  onChange={(e) => setEditInvCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-605 font-bold mb-1 font-sans">Categoria Fitness</label>
                {editInvCategoryInputMethod === "select" ? (
                  <select 
                    value={editInvCategory}
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM") {
                        setEditInvCategoryInputMethod("custom");
                        setEditInvCategory("");
                      } else {
                        setEditInvCategory(e.target.value);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="CUSTOM">➕ Criar Nova Categoria (Digitar)...</option>
                  </select>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Nova categoria"
                      value={editInvCategory}
                      onChange={(e) => setEditInvCategory(e.target.value)}
                      className="w-full p-2.5 bg-indigo-50/20 border border-indigo-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-indigo-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditInvCategoryInputMethod("select");
                        setEditInvCategory("Short");
                      }}
                      className="px-3 bg-slate-150 text-slate-705 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                      title="Voltar para a seleção"
                    >
                      Voltar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-605 font-bold mb-1 font-sans">Tamanho Principal</label>
                <select 
                  value={editInvSize}
                  onChange={(e) => setEditInvSize(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-bold"
                >
                  <option value="P">P - Pequeno</option>
                  <option value="M">M - Médio</option>
                  <option value="G">G - Grande</option>
                  <option value="GG">GG - Extra Grande</option>
                  <option value="U">U - Tamanho Único</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-605 font-bold mb-1">Variação de Cor *</label>
                <input 
                  type="text"
                  required
                  value={editInvColor}
                  onChange={(e) => setEditInvColor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-605 font-bold mb-1">Preço Venda (R$) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={editInvPrice}
                    onChange={(e) => setEditInvPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-605 font-bold mb-1">Preço Custo (R$) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={editInvCostPrice}
                    onChange={(e) => setEditInvCostPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-605 font-bold mb-1">Qtd Estoque</label>
                  <input 
                    type="number"
                    required
                    value={editInvStock}
                    onChange={(e) => setEditInvStock(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-605 font-bold mb-1">Mínimo Estoque</label>
                  <input 
                    type="number"
                    required
                    value={editInvMinStock}
                    onChange={(e) => setEditInvMinStock(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {/* INTERACTIVE CLOTHING IMAGE SELECTOR FOR EDIT DIALOG */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200/60">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <ImageIcon size={14} className="text-[#233E82]" />
                    Mudar Foto da Peça de Roupa
                  </label>
                  <div className="flex bg-slate-200/60 p-1 rounded-lg gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setEditInvImageInputMethod("preset")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        editInvImageInputMethod === "preset"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Modelos Prontos
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditInvImageInputMethod("upload")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        editInvImageInputMethod === "upload"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Enviar Foto (PC/Celular)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditInvImageInputMethod("url")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        editInvImageInputMethod === "url"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Link Externo (URL)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 flex flex-col justify-center">
                    {editInvImageInputMethod === "preset" && (
                      <div className="space-y-3">
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Selecione um modelo com base na categoria <span className="font-bold text-[#233E82] uppercase">{editInvCategory}</span>:
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {((PRESETS_BY_CATEGORY[editInvCategory] || PRESETS_BY_CATEGORY["Short"]).map((preset, idx) => {
                            const isSelected = editInvImageUrl === preset.url;
                            return (
                              <div
                                key={idx}
                                onClick={() => setEditInvImageUrl(preset.url)}
                                className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-102 ${
                                  isSelected
                                    ? "border-[#233E82] ring-2 ring-indigo-500/20 shadow-xs"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow">
                                    <Check size={8} strokeWidth={4} />
                                  </div>
                                )}
                              </div>
                            );
                          }))}
                        </div>
                      </div>
                    )}

                    {editInvImageInputMethod === "upload" && (
                      <div className="space-y-3">
                        <p className="text-[11px] text-slate-500">
                          Tire ou envie uma foto do celular/computador para atualizar a imagem desta peça de roupa:
                        </p>
                        <div
                          onClick={() => editInvFileInputRef.current?.click()}
                          className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all space-y-1 group shadow-xs"
                        >
                          <input
                            ref={editInvFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleEditInvImageUpload}
                            className="hidden"
                          />
                          <div className="mx-auto w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Upload size={14} />
                          </div>
                          <div className="text-xs">
                            <span className="font-bold text-indigo-600 hover:underline">Clique para enviar</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {editInvImageInputMethod === "url" && (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-500">
                          Cole o endereço (URL) da nova foto do modelo:
                        </p>
                        <input
                          type="url"
                          placeholder="Ex: https://endereço-de-imagem.com/foto.jpg"
                          value={editInvImageUrl}
                          onChange={(e) => setEditInvImageUrl(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-3 md:pt-0 md:pl-4">
                    <span className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Preview Atualizado</span>
                    <div className="relative aspect-square w-20 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center text-slate-350">
                      {editInvImageUrl ? (
                        <>
                          <img
                            src={editInvImageUrl}
                            alt="Preview Nova"
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setEditInvImageUrl("")}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-0.5 rounded-full shadow-md transition"
                            title="Remover foto"
                          >
                            <X size={10} />
                          </button>
                        </>
                      ) : (
                        <ImageIcon size={20} className="stroke-1 text-slate-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-605 font-bold mb-1">Descrição Técnica e Tecnologia</label>
                <textarea 
                  required
                  value={editInvDescription}
                  onChange={(e) => setEditInvDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-between pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Confirma excluir a peça de roupa "${editingProductModal.name}" permanentemente do estoque?`)) {
                    onDeleteProduct(editingProductModal.id);
                    setEditingProductModal(null);
                  }
                }}
                className="px-4 py-2 border border-rose-250 text-rose-650 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer mr-auto"
              >
                <Trash2 size={12} />
                Excluir Peça
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProductModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveInvProduct}
                  className="px-5 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
