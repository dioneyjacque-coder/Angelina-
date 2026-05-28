/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Barcode, User, Printer, Trash2, Plus, CornerDownLeft, 
  Calendar, QrCode, CreditCard, Check, HelpCircle, ShieldCheck, 
  Percent, FileText, ShoppingCart, Search
} from "lucide-react";
import { Product, Sale, CartItem } from "../types";

interface CEVSalesPOSProps {
  products: Product[];
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
  onUpdateSale?: (sale: Sale) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
}

export function CEVSalesPOS({ products, sales, onAddSale, onUpdateSale, onUpdateProductStock }: CEVSalesPOSProps) {
  // POS Header Info States
  const [sellerName, setSellerName] = useState("Elias B de Souza");
  const [customerCode, setCustomerCode] = useState("1");
  const [customerName, setCustomerName] = useState("Cliente - Varejo");
  const [customerPhone, setCustomerPhone] = useState("");

  // Barcode / Product selection state
  const [searchBarcode, setSearchBarcode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityInput, setQuantityInput] = useState(1);
  const [discountPercentInput, setDiscountPercentInput] = useState(0);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Active terminal basket items
  const [basket, setBasket] = useState<{
    product: Product;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    subTotal: number;
  }[]>([]);

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState<"Pix" | "Crédito" | "Boleto" | "Parcelamento">("Pix");
  const [installmentsCount, setInstallmentsCount] = useState(3);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [dueDateDay, setDueDateDay] = useState(10);

  // Receipt modal states
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [directBudgetPreview, setDirectBudgetPreview] = useState<boolean>(false);

  // Autocomplete ref and input element reference for focus
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sound feedback simulation
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // high pitched beep
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio context might be blocked or unsupported; fail silently
    }
  };

  // Setup global hotkeys F10, F11, F12 to simulate real POS keystrokes from image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser shortcuts for F10 (browser menu) and F11 (fullscreen) if possible, to act like a real app
      if (e.key === "F10") {
        e.preventDefault();
        playBeep();
        setPaymentMethod("Parcelamento"); // FIADO / Crediário
        alert("Predefinição de pagamento alterada para: CREDILÁRIO (FIADO) 🗓️");
      } else if (e.key === "F11") {
        e.preventDefault();
        playBeep();
        if (basket.length === 0) {
          alert("Adicione itens ao carrinho antes de simular o Orçamento!");
          return;
        }
        setDirectBudgetPreview(true);
        setShowReceiptModal(true);
      } else if (e.key === "F12") {
        e.preventDefault();
        playBeep();
        setPaymentMethod("Pix"); // A VISTA / Pix
        alert("Predefinição de pagamento alterada para: A VISTA (Pix) ⚡");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [basket]);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set initial product if not selected
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // Calculate prices
  const basketTotalSemDesconto = basket.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const basketTotalDesconto = basket.reduce((acc, item) => {
    const original = item.unitPrice * item.quantity;
    const discount = original * (item.discountPercent / 100);
    return acc + discount;
  }, 0);
  const basketTotalAReceber = basketTotalSemDesconto - basketTotalDesconto;

  // Add Item handler
  const handleAddItemToTerminal = () => {
    if (!selectedProduct) {
      alert("Por favor, selecione um produto primeiro.");
      return;
    }

    if (quantityInput <= 0) {
      alert("A quantidade deve ser de no mínimo 1.");
      return;
    }

    if (selectedProduct.stock < quantityInput) {
      alert(`Quantidade desejada excede o estoque disponível (${selectedProduct.stock} peças disponíveis).`);
      return;
    }

    playBeep();

    const itemSub = (selectedProduct.price * quantityInput) * (1 - (discountPercentInput / 100));

    // Check if product is already in the basket
    const existingIndex = basket.findIndex(item => item.product.id === selectedProduct.id && item.discountPercent === discountPercentInput);

    if (existingIndex !== -1) {
      const updatedBasket = [...basket];
      const newQty = updatedBasket[existingIndex].quantity + quantityInput;
      if (selectedProduct.stock < newQty) {
        alert(`Não é possível incrementar. Quantidade combinada excede o estoque disponível de ${selectedProduct.stock} unidades.`);
        return;
      }
      updatedBasket[existingIndex].quantity = newQty;
      updatedBasket[existingIndex].subTotal = (updatedBasket[existingIndex].unitPrice * newQty) * (1 - (updatedBasket[existingIndex].discountPercent / 100));
      setBasket(updatedBasket);
    } else {
      setBasket([
        ...basket,
        {
          product: selectedProduct,
          quantity: quantityInput,
          unitPrice: selectedProduct.price,
          discountPercent: discountPercentInput,
          subTotal: itemSub
        }
      ]);
    }

    // Reset inputs
    setSearchBarcode("");
    setQuantityInput(1);
    setDiscountPercentInput(0);
    if (barcodeInputRef.current) barcodeInputRef.current.focus();
  };

  // Remove basket row
  const handleRemoveRow = (idx: number) => {
    const updated = [...basket];
    updated.splice(idx, 1);
    setBasket(updated);
  };

  // Calculate parcel preview
  const calculateParcels = () => {
    const total = basketTotalAReceber;
    const financed = total - downPayment;
    if (financed <= 0) return [];

    const totalWithInterest = financed * (1 + (interestRate / 100));
    const parcelVal = totalWithInterest / installmentsCount;

    const parcels = [];
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    for (let i = 1; i <= installmentsCount; i++) {
      const targetMonth = (month + i) % 12;
      const targetYear = year + Math.floor((month + i) / 12);
      const targetDay = Math.min(dueDateDay, 28); // Cap at 28 for safe leap compatibility

      const date = new Date(targetYear, targetMonth, targetDay);
      const formattedDate = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      parcels.push({
        number: i,
        dueDate: formattedDate,
        value: parcelVal,
        status: "Pendente" as const
      });
    }

    return parcels;
  };

  // Action: Complete order from terminal
  const handlePlaceOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (basket.length === 0) {
      alert("Não há itens no cupom do caixa para faturamento.");
      return;
    }

    // Deduct stock levels on the main App
    basket.forEach((item) => {
      onUpdateProductStock(item.product.id, Math.max(0, item.product.stock - item.quantity));
    });

    let planData = undefined;
    if (paymentMethod === "Parcelamento") {
      planData = {
        totalValue: basketTotalAReceber,
        installmentsCount: installmentsCount,
        downPayment: downPayment,
        interestRate: interestRate,
        dueDateDay: dueDateDay,
        parcels: calculateParcels()
      };
    }

    const newSale: Sale = {
      id: `CEV-${Math.floor(1000 + Math.random() * 9000).toString()}`,
      date: new Date().toISOString(),
      items: basket.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        category: item.product.category,
        size: item.product.size,
        color: item.product.color,
        quantity: item.quantity,
        price: item.unitPrice * (1 - (item.discountPercent / 100))
      })),
      total: basketTotalAReceber,
      paymentMethod,
      customerName: customerName || "Cliente Varejo",
      customerPhone: customerPhone,
      shippingCost: 0,
      status: "Completed",
      installmentPlan: planData
    };

    onAddSale(newSale);
    setCompletedSale(newSale);
    setDirectBudgetPreview(false);
    setShowReceiptModal(true);

    // Clear active checkout variables
    setBasket([]);
    setCustomerCode("1");
    setCustomerName("Cliente - Varejo");
    setCustomerPhone("");
    setDownPayment(0);
    setInstallmentsCount(3);
    setInterestRate(0);
  };

  // Searching matching products
  const matchingProducts = products.filter(p => {
    const term = searchBarcode.toLowerCase();
    if (!term) return false;
    return (
      p.code.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.color.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Outer CEV Window Case - Vintage Blue Bevel frame mimicking windows standard software */}
      <div className="bg-[#B0C4DE] p-4 rounded-3xl border-4 border-slate-700 shadow-2xl relative">
        
        {/* Soft reflective lighting accent */}
        <div className="absolute top-1 left-4 right-4 h-1.5 bg-white/40 rounded-full blur-xs pointer-events-none" />

        {/* TOP STATUS BAR CONTAINER */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-3 py-1.5 rounded-lg flex justify-between items-center text-[11px] font-bold text-white shadow-inner mb-4">
          <div className="flex items-center gap-1.5 font-mono">
            <Barcode size={14} className="animate-pulse" />
            <span>Ponto de Venda *** CEV-Controle de Estoque e Vendas ***</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="bg-blue-950 text-cyan-300 px-2 py-0.5 rounded border border-blue-900">
              TERMINAL 01
            </span>
            <span className="hidden sm:inline bg-blue-950 text-emerald-400 px-2 py-0.5 rounded border border-blue-900">
              SESSÃO: OPERADOR ATIVO
            </span>
            <span className="text-zinc-200">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        {/* MIDDLE LOGO HEADER AND SELLER FORM BAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          
          {/* Main Title Wooden Banner Scroll style */}
          <div className="md:col-span-8 bg-gradient-to-r from-amber-50 via-[#FAF0D7] to-amber-100 border-2 border-amber-805/70 rounded-xl p-3 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-900/10 rounded-xl flex items-center justify-center border border-amber-800/20 text-amber-900">
                <FileText size={22} />
              </div>
              <div>
                {/* Vintage stylized ribbon design banner title */}
                <h2 className="text-xl uppercase tracking-tighter text-amber-950 font-serif font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] flex items-center gap-1">
                  🛡️ Controle de Estoque e Vendas
                </h2>
                <p className="text-[10px] text-amber-900/80 font-mono font-medium leading-none mt-1">
                  CEV Terminal Integrado • Angelina Moda Fitness S/A
                </p>
              </div>
            </div>
            
            <div className="hidden lg:block bg-amber-950/5 border border-amber-950/15 py-1 px-3 rounded-lg text-right font-mono">
              <span className="text-[8px] text-amber-900/70 block uppercase">Código Unidade</span>
              <span className="text-xs font-bold text-amber-950">CEV-SP-MAIN</span>
            </div>
          </div>

          {/* Vendedor input block */}
          <div className="md:col-span-4 bg-[#233E82] text-white border-2 border-blue-950 rounded-xl p-2.5 shadow-md flex flex-col justify-between">
            <span className="block text-[10px] uppercase font-bold text-blue-200 tracking-wider font-mono">
              👤 Operador do Caixa / Vendedor
            </span>
            <input 
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full mt-1 bg-white text-blue-900 text-xs font-extrabold py-1 px-2.5 rounded border-2 border-blue-950 focus:outline-none focus:ring-1 focus:ring-indigo-400 capitalize"
              placeholder="Digite o nome do vendedor"
            />
          </div>
        </div>

        {/* CORE POS MACHINE COMPONENT BODY */}
        <div className="bg-white border-4 border-slate-700 rounded-2xl p-4 shadow-inner">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT AREA: TERMINAL CONTROLS FORM */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* ROW 1: CLIENT IDENTIFICATION */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-3 border-b border-dashed border-slate-300">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                    Cod Cliente
                  </label>
                  <input
                    type="text"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    className="w-full text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded-lg p-2 text-center text-slate-700"
                    placeholder="1"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                    Nome do Cliente Comprador
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs font-bold text-blue-900 uppercase bg-slate-50/70 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    placeholder="Nome do Cliente"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                    Num Celular / CEP
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-slate-700 bg-slate-50/70 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* ROW 2: BARCODE OR KEY SEARCH FIELD WITH LIVE RECOMMENDATIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-9 relative" ref={dropdownRef}>
                  <label className="block text-[10px] font-extrabold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Search size={12} className="text-blue-700" />
                    Código de Barras / Nome do Produto (Pesquisa Ativa)
                  </label>
                  <div className="relative">
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      value={searchBarcode}
                      onChange={(e) => {
                        setSearchBarcode(e.target.value);
                        setShowProductDropdown(true);
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      className="w-full text-sm font-black bg-[#FFDF75] text-[#7A5B00] border-2 border-slate-800 rounded-xl p-3 focus:outline-none font-mono tracking-widest"
                      placeholder="DIgite o código ex: ANG-SH-01 ou nome do produto para bipar..."
                    />
                    <div className="absolute right-3 top-3.5 text-[#7A5B00]">
                      <Barcode size={18} />
                    </div>
                  </div>

                  {/* Autocomplete active suggestion results dropdown */}
                  {showProductDropdown && searchBarcode.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-slate-800 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto">
                      {matchingProducts.length > 0 ? (
                        matchingProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedProduct(p);
                              setSearchBarcode(p.code);
                              setShowProductDropdown(false);
                              playBeep();
                            }}
                            className="p-2.5 font-sans border-b last:border-0 hover:bg-slate-100 cursor-pointer flex justify-between items-center text-xs text-slate-800"
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{p.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Código: {p.code} • Cor: {p.color} • Tam: {p.size}
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="font-bold text-neutral-900">R$ {p.price.toFixed(2)}</span>
                              <span className="block text-[9px] text-indigo-600 font-bold">Estoque: {p.stock} un</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-slate-505 italic">
                          Nenhum produto fitness correspondente encontrado.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Qtd Solicitada
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="1"
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(Math.max(1, Number(e.target.value)))}
                      className="w-full text-sm font-black bg-slate-50 border-2 border-slate-800 rounded-xl p-2 text-center text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 3: LIVE SPECIFICATION READ-ONLY LABELS & OFF/DISCOUNTS */}
              <div className="bg-slate-100 border-2 border-slate-250 p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="col-span-2 sm:col-span-2">
                  <label className="block text-[9px] font-extrabold text-slate-500 uppercase">
                    Descrição da Peça Selecionada
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedProduct ? `${selectedProduct.name} - ${selectedProduct.color}` : "NENHUM SELECIONADO"}
                    className="w-full mt-1 bg-white text-xs font-bold text-red-700 p-2 border border-slate-300 rounded-lg uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-slate-500 uppercase">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedProduct ? `R$ ${selectedProduct.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ 0,00"}
                    className="w-full mt-1 bg-white font-mono text-center text-xs font-extrabold text-[#233E82] p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-slate-500 uppercase">
                    Unidades em Estoque
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedProduct ? `${selectedProduct.stock} peças` : "0 peças"}
                    className="w-full mt-1 bg-white font-mono text-center text-xs font-black text-blue-900 p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-slate-500 uppercase">
                    Desconto de Varejo (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentInput || ""}
                    placeholder="0"
                    onChange={(e) => setDiscountPercentInput(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full mt-1 bg-white font-mono text-center text-xs font-bold text-slate-800 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="col-span-2 sm:col-span-3 flex items-center">
                  {selectedProduct && selectedProduct.stock < 5 && selectedProduct.stock > 0 && (
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      ⚠️ ATENÇÃO: Estoque Crítico desta peça Angelina ({selectedProduct.stock} un). Adicione com prudência.
                    </span>
                  )}
                  {selectedProduct && selectedProduct.stock === 0 && (
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                      🚫 PRODUTO ESGOTADO. Não pode ser adicionado.
                    </span>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleAddItemToTerminal}
                    disabled={!selectedProduct || selectedProduct.stock <= 0}
                    className="w-full h-9 bg-[#233E82] hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-all tracking-wider shadow-md uppercase active:translate-y-0.5 flex items-center justify-center gap-1 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                    id="btn-add-item-to-cev"
                  >
                    <Plus size={14} /> Inserir Item
                  </button>
                </div>
              </div>

              {/* CENTRAL CUPOM FISCAL / RETRO TERMINAL ITEMS TABLE */}
              <div className="bg-[#FAF8E5] border-2 border-slate-800 rounded-2xl p-4 shadow-inner space-y-3">
                <span className="block text-[9px] font-black text-indigo-950 uppercase tracking-widest font-mono">
                  🧾 Cupom de Itens Lançados CEV:
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs text-indigo-950 border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-850 text-[10px] uppercase text-indigo-900 tracking-wide">
                        <th className="py-2 px-1 text-[10px]">Cód</th>
                        <th className="py-2 px-1 text-[10px]">Descrição da Peça</th>
                        <th className="py-2 px-1 text-center text-[10px]">Qtd</th>
                        <th className="py-2 px-1 text-right text-[10px]">Valor Unitário</th>
                        <th className="py-2 px-1 text-center text-[10px]">Desc. %</th>
                        <th className="py-2 px-1 text-right text-[10px]">Subtotal</th>
                        <th className="py-2 px-1 text-center text-[10px]">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-400/20">
                      {basket.length > 0 ? (
                        basket.map((item, index) => {
                          const originalTotal = item.unitPrice * item.quantity;
                          const calculatedDiscPercent = item.discountPercent;
                          return (
                            <tr key={index} className="hover:bg-amber-100/50 transition-colors text-xs font-semibold">
                              <td className="py-2 px-1 text-blue-900 text-[10.5px]">{item.product.code}</td>
                              <td className="py-2 px-1 uppercase text-[10.5px]">
                                {item.product.name} ({item.product.size} / {item.product.color})
                              </td>
                              <td className="py-2 px-1 text-center font-bold text-slate-900">{item.quantity}</td>
                              <td className="py-2 px-1 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                              <td className="py-2 px-1 text-center text-amber-700 font-bold">
                                {calculatedDiscPercent > 0 ? `${calculatedDiscPercent}%` : "-"}
                              </td>
                              <td className="py-2 px-1 text-right font-bold text-indigo-900">
                                R$ {item.subTotal.toFixed(2)}
                              </td>
                              <td className="py-2 px-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRow(index)}
                                  className="text-red-650 hover:text-red-900 hover:scale-115 transition bg-transparent"
                                  title="Remover Item"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-[11px] text-amber-800/60 italic">
                            NENHUM ITEM ADICIONADO AO CAIXA. BIP OU PESQUISE PRODUTOS NO CAMPO SUPERIOR AMARELO.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT AREA: MINI STATUS LOGO OR PICTURE AND DIRECT KEYS & TOTAL DISPLAYS */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* BRAND IMAGE LOGO PREVIEW (Red Orb like vintage Xerox or selected clothing item) */}
              <div className="bg-white border-2 border-slate-800 rounded-2xl p-3.5 shadow-md flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                {selectedProduct ? (
                  <div className="w-full flex flex-col items-center animate-fade-in">
                    <div className="aspect-square w-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-2.5">
                      <img 
                        src={selectedProduct.imageUrl} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight text-center">
                      Peça Pronta: {selectedProduct.name}
                    </span>
                    <span className="text-[9px] font-semibold text-indigo-700 mt-0.5">
                      {selectedProduct.size} • {selectedProduct.color}
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    {/* Retro orb representation placeholder matching user image */}
                    <div className="w-16 h-16 bg-gradient-to-tr from-red-700 to-rose-400 rounded-full flex items-center justify-center font-bold text-white text-lg tracking-widest border-2 border-red-900 shadow-inner leading-none hover:rotate-45 transition-transform duration-500">
                      CEV
                    </div>
                    <h4 className="text-sm font-black text-rose-950 font-serif lowercase block">
                      angelina
                    </h4>
                  </div>
                )}

                {/* Legend notes of keys (Styled red like the image) */}
                <div className="w-full mt-3 pt-2.5 border-t border-slate-200/60 text-center text-[9.5px] font-extrabold text-red-700 font-mono leading-tight bg-red-100/30 p-1 rounded-lg border border-red-50">
                  <span className="block mb-0.5">🎮 ATALHOS RÁPIDOS DE TECLADO:</span>
                  <div className="grid grid-cols-1 gap-0.5 mt-1 font-semibold text-slate-700">
                    <div>F10 = FIADO (Crediário)</div>
                    <div>F11 = ORÇAMENTO (Recibo)</div>
                    <div>F12 = A VISTA (Pix)</div>
                  </div>
                </div>
              </div>

              {/* REAL-TIME DYNAMIC PAYMENT SELECTION */}
              <div className="bg-slate-50 border-2 border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
                <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest font-sans flex items-center gap-1">
                  💳 Forma de Liquidar Cobrança:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { playBeep(); setPaymentMethod("Pix"); }}
                    className={`py-2 px-2.5 border-2 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1 ${
                      paymentMethod === "Pix" 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm font-black" 
                        : "bg-white border-slate-350 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <QrCode size={16} />
                    PIX (À Vista)
                  </button>

                  <button
                    type="button"
                    onClick={() => { playBeep(); setPaymentMethod("Crédito"); }}
                    className={`py-2 px-2.5 border-2 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1 ${
                      paymentMethod === "Crédito" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-sm font-black" 
                        : "bg-white border-slate-350 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <CreditCard size={16} />
                    Cartão Crédito
                  </button>

                  <button
                    type="button"
                    onClick={() => { playBeep(); setPaymentMethod("Boleto"); }}
                    className={`py-2 px-2.5 border-2 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1 relative ${
                      paymentMethod === "Boleto" 
                        ? "bg-amber-50 border-amber-500 text-amber-800 shadow-sm font-black" 
                        : "bg-white border-slate-350 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Barcode size={16} />
                    Boleto Bancário
                  </button>

                  <button
                    type="button"
                    onClick={() => { playBeep(); setPaymentMethod("Parcelamento"); }}
                    className={`py-2 px-2.5 border-2 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1 ${
                      paymentMethod === "Parcelamento" 
                        ? "bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-sm font-black" 
                        : "bg-white border-slate-350 text-slate-600 hover:bg-slate-105"
                    }`}
                  >
                    <Calendar size={16} />
                    Crediário (Fiado)
                  </button>
                </div>

                {/* DETAILED INSTALLMENT ARRANGEMENT (Fiado) SIMULATOR FOR CREDIÁRIO */}
                {paymentMethod === "Parcelamento" && (
                  <div className="bg-white rounded-xl border border-fuchsia-100 p-3 space-y-2 animate-fade-in text-[11px] text-slate-650">
                    <span className="block text-[8px] font-extrabold text-fuchsia-800 uppercase tracking-widest pb-1 border-b border-fuchsia-100">
                      🛠️ Configuração da Cobrança Parcelada:
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-medium text-slate-500 block">Entrada à Vista:</span>
                        <input
                          type="number"
                          min="0"
                          max={basketTotalAReceber}
                          value={downPayment || ""}
                          placeholder="R$ 0,00"
                          onChange={(e) => setDownPayment(Math.min(basketTotalAReceber, Math.max(0, Number(e.target.value))))}
                          className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded p-1"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-medium text-slate-500 block">Nº de Parcelas:</span>
                        <select
                          value={installmentsCount}
                          onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono font-bold"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                            <option key={n} value={n}>{n}x</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="text-[9px] font-medium text-slate-500 block">Vencimento (Dia):</span>
                        <select
                          value={dueDateDay}
                          onChange={(e) => setDueDateDay(Number(e.target.value))}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1 font-mono"
                        >
                          {[5, 10, 15, 20, 25, 28].map(d => (
                            <option key={d} value={d}>Dia {d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="text-[9px] font-medium text-slate-500 block">Juros Próprio (%):</span>
                        <input
                          type="number"
                          min="0"
                          value={interestRate || ""}
                          placeholder="0.0"
                          onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                          className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded p-1"
                        />
                      </div>
                    </div>

                    {/* Carnê installment listings preview list */}
                    <div className="bg-fuchsia-50/50 p-2.5 rounded-lg border border-dashed border-fuchsia-100 max-h-32 overflow-y-auto space-y-1">
                      {calculateParcels().length === 0 ? (
                        <p className="text-[9.5px] text-zinc-400 italic text-center">Sem saldo financiado.</p>
                      ) : (
                        calculateParcels().map(p => (
                          <div key={p.number} className="flex justify-between items-center text-[10px] text-slate-700 py-0.5 border-b border-fuchsia-100 last:border-0 font-mono">
                            <span>Parc {p.number}/{installmentsCount}</span>
                            <span className="text-zinc-400 text-[9px]">{p.dueDate}</span>
                            <span className="font-bold text-fuchsia-800">R$ {p.value.toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* THREE DYNAMIC FOOTER DISPLAY BOXES FILL WITH BRIGHT NEON YELLOW (EXACTLY MATCHING IMAGE) */}
              <div className="space-y-3.5 pt-2">
                
                {/* 1. TOTAL SEM DESCONTO */}
                <div className="bg-[#FFFF00] border-4 border-slate-800 rounded-xl p-2 px-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-tight font-sans">
                      Total Sem Desconto
                    </span>
                    <span className="text-xs font-mono text-red-700 font-bold">
                      TABELA BRUTA
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono text-right mt-1.5 antialiased">
                    R$ {basketTotalSemDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* 2. TOTAL DE DESCONTO */}
                <div className="bg-[#FFFF00] border-4 border-slate-800 rounded-xl p-2 px-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-tight font-sans">
                      Total de Desconto
                    </span>
                    <span className="text-xs font-mono text-red-700 font-bold">
                      POLÍTICA DE OFF
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#FF0000] font-mono text-right mt-1.5 antialiased">
                    R$ {basketTotalDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* 3. TOTAL À RECEBER */}
                <div className="bg-[#FFFF00] border-4 border-slate-800 rounded-xl p-2.5 px-3.5 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider font-sans">
                      Total à Receber
                    </span>
                    <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-mono">
                      LIQUIDA
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-[#008000] font-mono text-right mt-1 antialiased tracking-tighter">
                    R$ {basketTotalAReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

              </div>

              {/* BIG RED/GREEN REGISTER DISCHARGE BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (basket.length === 0) {
                      alert("O caixa está vazio!");
                      return;
                    }
                    setDirectBudgetPreview(true);
                    setShowReceiptModal(true);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-slate-800 rounded-xl py-2.5 text-xs font-extrabold uppercase tracking-widest font-sans flex items-center justify-center gap-1 transition"
                >
                  <FileText size={14} /> F11 Orcamento
                </button>

                <button
                  type="button"
                  onClick={() => handlePlaceOrder()}
                  disabled={basket.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white border-2 border-slate-850 rounded-xl py-2.5 text-xs font-black uppercase tracking-widest font-sans flex items-center justify-center gap-1 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CornerDownLeft size={14} /> F12 Emitir Venda
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* COMPLETED RECEIPT / STATEMENT MODAL VIEW "Orçamento / PDF" */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-205 max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8 animate-scale-up">
            
            <button
              onClick={() => {
                setShowReceiptModal(false);
                setCompletedSale(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <span className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-100">
                📄
              </span>
              <h4 className="text-base font-black text-slate-900">
                {directBudgetPreview ? "Impressão de Orçamento de Caixa" : "Venda Registrada com Sucesso!"}
              </h4>
              <p className="text-xs text-slate-500">
                CEV - Controle de Estoque e Vendas • Impressora de Terminal Térmico
              </p>
            </div>

            {/* Printable Receipt area */}
            <div id="cev-receipt-printable" className="p-4 bg-amber-50/50 border-2 border-dashed border-slate-350 rounded-2xl space-y-4 max-h-[380px] overflow-y-auto font-mono text-[10px] text-slate-750">
              
              <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-1">
                <span className="block font-black text-xs uppercase text-slate-900">ANGELINA ACTIVEWEAR MODA FITNESS</span>
                <span className="block text-[8px] text-slate-500">ANGELINA MODA FITNESS LTDA • CNPJ: 22.380.119/0001-44</span>
                <span className="block text-[8px] text-slate-500">SEDE CENTRAL: AV PAULISTA, 1000 - SÃO PAULO/SP</span>
                <span className="block text-[8px] text-slate-400">TELEFONE: (11) 91100-2442</span>
              </div>

              <div className="space-y-1 font-mono text-[9px]">
                <div className="flex justify-between">
                  <span>ORDEM Nº:</span>
                  <span className="font-bold text-slate-900">
                    {directBudgetPreview ? "ORC-9901-PROV" : completedSale?.id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DATA EMISSÃO:</span>
                  <span>{new Date().toLocaleDateString("pt-BR")} {new Date().toLocaleTimeString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>ATENDENTE/VENDEDOR:</span>
                  <span className="font-bold uppercase">{sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLIENTE:</span>
                  <span className="font-bold uppercase">({customerCode}) {customerName}</span>
                </div>
                {customerPhone && (
                  <div className="flex justify-between">
                    <span>TEL CONTATO:</span>
                    <span>{customerPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>MEIO RECEBIMENTO:</span>
                  <span className="font-bold uppercase tracking-wide bg-slate-100 px-1 rounded">
                    {directBudgetPreview ? "ANTECIPAÇÃO ORÇAMENTO" : completedSale?.paymentMethod || "N/A"}
                  </span>
                </div>
              </div>

              {/* Items listing */}
              <div className="border-t border-b border-dashed border-slate-300 py-2.5 space-y-2">
                <div className="grid grid-cols-12 font-bold text-slate-800 text-[9px]">
                  <span className="col-span-6">DESCRIÇÃO DA ROUPA</span>
                  <span className="col-span-2 text-center">QTD</span>
                  <span className="col-span-4 text-right">VALOR UNIT.</span>
                </div>
                
                <div className="space-y-1">
                  {directBudgetPreview ? (
                    basket.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 text-slate-650 text-[9px]">
                        <span className="col-span-6 truncate uppercase">{item.product.name} ({item.product.size})</span>
                        <span className="col-span-2 text-center font-bold text-slate-900">{item.quantity}</span>
                        <span className="col-span-4 text-right">R$ {item.subTotal.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    completedSale?.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 text-slate-650 text-[9px]">
                        <span className="col-span-6 truncate uppercase">{item.name} ({item.size})</span>
                        <span className="col-span-2 text-center font-bold text-slate-900">{item.quantity}</span>
                        <span className="col-span-4 text-right">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Totals displays */}
              <div className="space-y-1.5 text-right font-mono font-bold text-[9px] text-slate-800">
                <div className="flex justify-between">
                  <span>SUBTOTAL BRUTO:</span>
                  <span>R$ {(directBudgetPreview ? basketTotalSemDesconto : (completedSale ? completedSale.total : 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) DESCONTO TOTAL APLICADO:</span>
                  <span>R$ {(directBudgetPreview ? basketTotalDesconto : 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 text-xs font-black">
                  <span>TOTAL LIQUIDADO:</span>
                  <span>R$ {(directBudgetPreview ? basketTotalAReceber : (completedSale ? completedSale.total : 0)).toFixed(2)}</span>
                </div>
              </div>

              {/* Custom Carnê details display if crediário */}
              {((directBudgetPreview && paymentMethod === "Parcelamento") || (!directBudgetPreview && completedSale?.paymentMethod === "Parcelamento" && completedSale?.installmentPlan)) && (
                <div className="space-y-1.5 border border-dashed border-slate-300 p-2 bg-white rounded-lg mt-2">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100 text-[8.5px] font-black text-slate-900">
                    <span>🗓️ CARNÊ DE PAGAMENTO FORMAL (FIADO)</span>
                    <span>PLANO: {directBudgetPreview ? installmentsCount : completedSale?.installmentPlan?.installmentsCount}X</span>
                  </div>

                  {((directBudgetPreview && downPayment > 0) || (!directBudgetPreview && (completedSale?.installmentPlan?.downPayment ?? 0) > 0)) && (
                    <div className="flex justify-between text-[8px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                      <span>ENTRADA À VISTA:</span>
                      <span className="font-bold">R$ {(directBudgetPreview ? downPayment : (completedSale?.installmentPlan?.downPayment ?? 0)).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    {(directBudgetPreview ? calculateParcels() : (completedSale?.installmentPlan?.parcels ?? [])).map((p) => (
                      <div key={p.number} className="flex justify-between text-[8px] text-slate-600 border-b border-slate-100 pb-0.5 last:border-0 last:pb-0">
                        <span>PARCELA {p.number}/{directBudgetPreview ? installmentsCount : completedSale?.installmentPlan?.installmentsCount}</span>
                        <span>VENCIMENTO: {p.dueDate}</span>
                        <span className="font-bold text-slate-900">R$ {p.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fine Pix QR key representation */}
              {((directBudgetPreview && paymentMethod === "Pix") || (!directBudgetPreview && completedSale?.paymentMethod === "Pix")) && (
                <div className="border border-dashed border-slate-300 p-2 rounded-xl bg-white text-center space-y-1.5">
                  <span className="block text-[8px] text-slate-500 font-extrabold flex justify-center items-center gap-0.5"><QrCode size={11} className="text-[#00CCCC]" /> PIX COPIA E COLA RÁPIDO</span>
                  <p className="text-[7.5px] italic text-[#555555] break-all leading-tight">
                    00020126580014br.gov.bcb.pix0136976fa8ba-1bfa-4a25-83c9-026605051401365204000053039865802BR5916ANGELINAFITNESS6014SAOPAUTOCEV
                  </p>
                </div>
              )}

              {/* Footer fineprint terms */}
              <div className="text-[7px] text-slate-400 text-center leading-normal pt-2 border-t border-dashed border-slate-300">
                Obrigado pela preferência e confiança! <br />
                As roupas Angelina moldam seu corpo e garantem alta performance.<br />
                Termos: Trocas em até 30 dias mediante selo de violação intacto na etiqueta.
              </div>

            </div>

            {/* Print Action button options */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const printContent = document.getElementById("cev-receipt-printable")?.innerHTML;
                  const printWindow = window.open("", "_blank");
                  if (printWindow && printContent) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>CEV Terminal Impressão</title>
                          <style>
                            body { font-family: monospace; padding: 20px; max-width: 350px; margin: auto; }
                            table { width: 100%; border-collapse: collapse; }
                            .grid { display: flex; justify-content: space-between; }
                          </style>
                        </head>
                        <body onload="window.print(); window.close();">
                          <div>${printContent}</div>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1.5 transition"
              >
                <Printer size={13} /> Imprimir Ordem (Térmico)
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (directBudgetPreview) {
                    setShowReceiptModal(false);
                  } else {
                    setShowReceiptModal(false);
                    setCompletedSale(null);
                  }
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Fechar Painel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
