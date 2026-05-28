/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Package, BarChart3, Sparkles, MessageSquare, 
  ShieldAlert, ShieldCheck, HelpCircle, LogOut, CheckCircle2, User, KeyRound,
  Barcode
} from "lucide-react";
import { Product, Sale } from "./types";
import { INITIAL_PRODUCTS } from "./data";
import { TwoFactorAuth } from "./components/TwoFactorAuth";
import { InventoryManager } from "./components/InventoryManager";
import { SalesConsole } from "./components/SalesConsole";
import { CEVSalesPOS } from "./components/CEVSalesPOS";
import { DashboardReports } from "./components/DashboardReports";
import { MarketingPanel } from "./components/MarketingPanel";
import { VanessaChat } from "./components/VanessaChat";

export default function App() {
  // Global products state with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem("angelina_products");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Global sales state with default simulated history to instantly ignite analytics
  const [sales, setSales] = useState<Sale[]>(() => {
    const cached = localStorage.getItem("angelina_sales");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    // Launch with default mock history for the beautiful Recharts equivalent charts
    return [
      {
        id: "sale-8210",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { productId: "prod-1", name: "Short Angelina Elastic", category: "Short", size: "M", color: "Fúcsia Coral", quantity: 2, price: 89.90 },
          { productId: "prod-2", name: "Calça Legging Sculpt Seamless", category: "Legging", size: "G", color: "Preto Matte", quantity: 1, price: 149.90 }
        ],
        total: 329.70,
        paymentMethod: "Pix",
        customerName: "Viviane Silva",
        customerPhone: "(11) 91100-2442",
        shippingCost: 0,
        status: "Completed"
      },
      {
        id: "sale-9121",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { productId: "prod-4", name: "Camisa Dry-Fit Breathe", category: "Camisa", size: "G", color: "Lavanda Soft", quantity: 3, price: 79.90 }
        ],
        total: 239.70,
        paymentMethod: "Crédito",
        customerName: "Renata Godoy",
        customerPhone: "(21) 98020-5511",
        shippingCost: 15.00,
        status: "Completed"
      },
      {
        id: "sale-3304",
        date: new Date().toISOString(),
        items: [
          { productId: "prod-6", name: "Top Angelina Hyper Compression", category: "Top", size: "M", color: "Rosa Neon", quantity: 1, price: 89.90 }
        ],
        total: 89.90,
        paymentMethod: "Boleto",
        customerName: "Paula Guimarães",
        customerPhone: "(31) 97722-1100",
        shippingCost: 0,
        status: "Completed"
      }
    ];
  });

  // Security 2FA states
  const [is2FAEnabled, setIs2FAEnabled] = useState(() => {
    return localStorage.getItem("angelina_2fa_active") === "true";
  });

  // Active Tab/Page: provador, pos_cev, inventory, reports, marketing, chat
  const [activeTab, setActiveTab] = useState<"provador" | "pos_cev" | "inventory" | "reports" | "marketing" | "chat">("provador");

  // Sync to database localStorage
  useEffect(() => {
    localStorage.setItem("angelina_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("angelina_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("angelina_2fa_active", is2FAEnabled.toString());
  }, [is2FAEnabled]);

  // Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleDeleteSale = (saleId: string) => {
    setSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const handleAddSale = (newSale: Sale) => {
    setSales((prev) => [newSale, ...prev]);
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    setSales((prev) => prev.map((s) => (s.id === updatedSale.id ? updatedSale : s)));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans tracking-tight selection:bg-indigo-100 selection:text-indigo-800 animate-fade-in">
      
      {/* Dynamic luxury branded header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-650 rounded-xl flex items-center justify-center font-bold text-white text-lg tracking-widest shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-indigo-900 leading-none flex flex-col sm:flex-row sm:items-center gap-1">
                  Angelina <span className="text-xs font-normal text-slate-400 block sm:inline mt-0.5 sm:mt-0 font-sans">• Fitness Hub Inteligente</span>
                </h1>
              </div>
            </div>

            {/* Quick status meters */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/55">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Status do Sistema: Banco de Dados Ativo
                </span>
              </div>

              {is2FAEnabled ? (
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 py-1 px-2.5 rounded-full text-[10px] font-bold border border-emerald-100">
                  <ShieldCheck size={12} className="shrink-0" />
                  <span className="hidden sm:inline">Autenticação 2FA Ativa</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 py-1 px-2.5 rounded-full text-[10px] font-bold border border-amber-100 animate-pulse">
                  <ShieldAlert size={12} />
                  <span className="hidden sm:inline">Proteção 2FA Recomendada</span>
                </div>
              )}

              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-semibold text-slate-400">Canal Comercial</div>
                <div className="text-[11px] font-bold text-slate-700">dioneyjacque@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Primary responsive panel frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Horizontal Navigation tabs */}
        <nav className="flex flex-wrap gap-1 md:gap-2 mb-6 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("provador")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === "provador" 
                ? "bg-indigo-50 text-indigo-705 border border-indigo-100 shadow-xs" 
                : "text-slate-650 hover:text-indigo-900 hover:bg-slate-100/80"
            }`}
            id="tab-provador"
          >
            <ShoppingBag size={14} />
            Provador Virtual (Catálogo)
          </button>

          <button
            onClick={() => setActiveTab("pos_cev")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
              activeTab === "pos_cev" 
                ? "bg-amber-100/80 text-amber-950 border-amber-300 shadow-sm"
                : "text-slate-650 hover:text-indigo-900 hover:bg-slate-100/80 border-transparent"
            }`}
            id="tab-pos-cev"
          >
            <Barcode size={14} className="text-amber-700 animate-pulse" />
            Caixa CEV (Ponto de Venda) 🖥️
          </button>
          
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === "inventory" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                : "text-slate-650 hover:text-indigo-900 hover:bg-slate-100/80"
            }`}
            id="tab-inventory"
          >
            <Package size={14} />
            Estoque & Grades
          </button>
          
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === "reports" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                : "text-slate-650 hover:text-indigo-900 hover:bg-slate-100/80"
            }`}
            id="tab-reports"
          >
            <BarChart3 size={14} />
            Relatório de Faturamento
          </button>
          
          <button
            onClick={() => setActiveTab("marketing")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === "marketing" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                : "text-slate-650 hover:text-indigo-900 hover:bg-slate-100/80"
            }`}
            id="tab-marketing"
          >
            <Sparkles size={14} />
            Marketing Inteligente IA
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === "chat" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs" 
                : "text-slate-650 hover:text-indigo-900 hover:bg-slate-100/80"
            }`}
            id="tab-chat"
          >
            <MessageSquare size={14} />
            Estilista Virtual IA ( Vanessa )
          </button>
        </nav>

        {/* Tab view routing state machine */}
        <div className="space-y-6">
          {activeTab === "provador" && (
            <SalesConsole 
              products={products} 
              sales={sales}
              onAddSale={handleAddSale}
              onUpdateSale={handleUpdateSale}
              onDeleteSale={handleDeleteSale}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProductStock={handleUpdateProductStock}
            />
          )}

          {activeTab === "pos_cev" && (
            <CEVSalesPOS 
              products={products} 
              sales={sales}
              onAddSale={handleAddSale}
              onUpdateSale={handleUpdateSale}
              onUpdateProductStock={handleUpdateProductStock}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryManager 
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === "reports" && (
            <DashboardReports 
              sales={sales}
              products={products}
            />
          )}

          {activeTab === "marketing" && (
            <MarketingPanel 
              products={products}
            />
          )}

          {activeTab === "chat" && (
            <VanessaChat />
          )}
        </div>

        {/* Global Security panel overlay footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <TwoFactorAuth 
              is2FAEnabled={is2FAEnabled}
              onToggle2FA={setIs2FAEnabled}
            />

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-xs leading-relaxed space-y-2 text-slate-500">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="text-indigo-600" size={15} />
                Selagem de Integridade • Sede Angelina Fashion
              </h4>
              <p>
                Este painel integrado gerencia de forma unificada as filiais físicas e canais e-commerce digitais da Angelina. Seus logs de vendas, fluxo de custos de algodão modal, elastano premium, poliamida polimerizada e relatórios de faturamento seguem as normas contábeis de integridade.
              </p>
              <div className="flex gap-4 pt-1 font-mono text-[10px] text-neutral-400">
                <span>Versão SaaS: 1.4.0</span>
                <span>•</span>
                <span>Portfólio: Fitness & Activewear</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-neutral-400 mt-8 pb-4">
            Angelina Moda Fitness © 2026. Todos os direitos reservados. Projetado para elegância e alto rendimento corporal.
          </div>
        </footer>
      </main>
    </div>
  );
}
