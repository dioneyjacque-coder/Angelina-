/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShoppingBag, Trash2, CheckCircle2, Heart, FileText, QrCode, CreditCard, 
  Barcode, Truck, PhoneCall, AlertCircle, ShoppingCart, User, Plus, Minus, Printer, Share2,
  Star, Sparkles, Check, Info, ShieldCheck, Calendar, Edit, Upload, X, Link, Image as ImageIcon
} from "lucide-react";
import { Product, CartItem, Sale, AbandonedCartNotification } from "../types";

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

// Helper function to supply rich marketing, material, and user feedback data to activewear items
const getProductExtraDetails = (product: { name: string; category: string }) => {
  const reviews: Record<string, { author: string; rating: number; date: string; comment: string; sizeBought: string }[]> = {
    "Legging": [
      { author: "Mariana Leme", rating: 5, date: "15/05/2026", comment: "Simplesmente fantástica! É totalmente agachamento-proof (zero transparência). O cós duplo realmente segura sem apertar demais.", sizeBought: "M" },
      { author: "Juliana Frota", rating: 5, date: "02/05/2026", comment: "Fios frios deliciosos na pele, as costuras lisas dão um conforto absurdo. Com certeza comprarei mais cores.", sizeBought: "G" },
      { author: "Fernanda Sales", rating: 4, date: "22/04/2026", comment: "Excelente sustentação e o tecido tem compressão na medida certa. Comprei G e vestiu perfeitamente.", sizeBought: "G" }
    ],
    "Short": [
      { author: "Bia Vasconcellos", rating: 5, date: "18/05/2026", comment: "Comprimento perfeito! Não é daqueles shorts que ficam subindo durante a corrida. O elástico anatômico é firme e confortável.", sizeBought: "M" },
      { author: "Carolina Dias", rating: 5, date: "10/05/2026", comment: "A cor Fúcsia Coral é maravilhosa pessoalmente! Chama muito a atenção pela qualidade do tingimento e elasticidade.", sizeBought: "P" }
    ],
    "Top": [
      { author: "Viviane Silva", rating: 5, date: "24/05/2026", comment: "Segura tudo de verdade! Tenho bastante busto e sinto total segurança nos saltos e corrida de alta intensidade. Bojo excelente.", sizeBought: "M" },
      { author: "Gabriela Rios", rating: 5, date: "11/05/2026", comment: "Adorei as alças cruzadas nas costas, tiram a pressão do pescoço. Seca super rápido pós-treino.", sizeBought: "P" }
    ],
    "Camisa": [
      { author: "Patricia Souza", rating: 5, date: "20/05/2026", comment: "Extremamente leve! O suor evapora rápido e a blusa não fica pesada ou colando no corpo. Super recomendo.", sizeBought: "G" },
      { author: "Tatiana Abreu", rating: 4, date: "08/05/2026", comment: "Toque muito suave e caimento soltinho ideal. Tecido anti-odor realmente funciona.", sizeBought: "M" }
    ],
    "Regata": [
      { author: "Amanda Castro", rating: 5, date: "26/05/2026", comment: "Algodão canelado super macio e fresco. Combina com tudo, tanto pro treino quanto pra sair depois.", sizeBought: "P" }
    ],
    "Acessórios": [
      { author: "Renata Godoy", rating: 5, date: "24/05/2026", comment: "Qualidade Angelina incomparável. Costura super caprichada.", sizeBought: "Único" }
    ]
  };

  const fabricTechnology: Record<string, { fabric: string; protection: string; features: string[] }> = {
    "Legging": {
      fabric: "Emana® Poliamida 6.6 Biodegradável + 16% Elastano LYCRA Black",
      protection: "Proteção Solar Permanente UV50+ certificada pela ARPANSA",
      features: ["Alta compressão muscular regulada", "Visual matte elegante anti-reflexo", "Absorção imediata do calor e infravermelho", "Efeito Sculpt empina-bumbum anatômico"]
    },
    "Short": {
      fabric: "Poliamida Soft-Touch texturizada a ar + Elastano High Clo anticlone",
      protection: "Proteção Solar Ativa contra UVA/UVB 50+",
      features: ["Elasticidade multidirecional de 360°", "Proteção térmica contra o calor das pistas", "Elástico duplo jacquard anatômico", "Bolsos laterais invisíveis para chaves"]
    },
    "Top": {
      fabric: "Power Poliamida de alta tenacidade + Tecido Mesh de alta ventilação",
      protection: "Proteção Solar UPF 50+ de fábrica",
      features: ["Bojo inteligente ultra-soft respirável e removível", "Costuras planas invisíveis antifricção Flatlock", "Alta sustentação sob impacto moderado a alto", "Estilo decotado estético estruturador"]
    },
    "Camisa": {
      fabric: "Microfibra Dry-Fit Breathe super premium de 90g/m²",
      protection: "Fator de proteção celular contra radiação UV50+",
      features: ["Tecnologia hidrofílica inteligente de drenagem", "Fios texturizados anti-desbotamento", "Ação bacteriostática anti-odor permanente", "Toque gelado refrescante"]
    },
    "Regata": {
      fabric: "Ribbed Modal ecológico com elastano importado Creora®",
      protection: "Proteção contra radiação UV standard de poliéster free",
      features: ["Canelado ultra-estético e super macio", "Fibras de madeira de reflorestamento", "Altamente respirável com caimento leve", "Anti-pilling (não faz bolinhas) garantido"]
    },
    "Acessórios": {
      fabric: "Fios técnicos de poliamida texturizada de tripla torção",
      protection: "Fator de barreira de radiação padrão",
      features: ["Durabilidade industrial testada sob tração", "Resistente à lavagem e fricção constante", "Toque hipoalergênico refinado"]
    }
  };

  const cat = (product.category as string) || "Legging";
  return {
    reviews: reviews[cat] || reviews["Legging"],
    fabric: fabricTechnology[cat] || fabricTechnology["Legging"]
  };
};

interface SalesConsoleProps {
  products: Product[];
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
  onUpdateSale?: (sale: Sale) => void;
  onDeleteSale?: (saleId: string) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
}

export function SalesConsole({ products, sales, onAddSale, onUpdateSale, onDeleteSale, onUpdateProduct, onDeleteProduct, onUpdateProductStock }: SalesConsoleProps) {
  const defaultCategories = ["Short", "Camisa", "Legging", "Regata", "Top", "Acessórios"];
  const allCategories = Array.from(new Set([
    ...defaultCategories,
    ...products.map((p) => p.category).filter(Boolean)
  ]));

  // Sub tab tracking inside the sales console
  const [activeSubTab, setActiveSubTab] = useState<"cadastrar" | "historico">("cadastrar");
  const [searchQuery, setSearchQuery] = useState("");

  // Editing product properties in the virtual fitting room
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editProdName, setEditProdName] = useState("");
  const [editProdCategory, setEditProdCategory] = useState<string>("Short");
  const [editProdCategoryInputMethod, setEditProdCategoryInputMethod] = useState<"select" | "custom">("select");
  const [editProdSize, setEditProdSize] = useState<Product["size"]>("P");
  const [editProdColor, setEditProdColor] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdCostPrice, setEditProdCostPrice] = useState("");
  const [editProdStock, setEditProdStock] = useState("");
  const [editProdMinStock, setEditProdMinStock] = useState("");
  const [editProdDescription, setEditProdDescription] = useState("");
  const [editProdImageUrl, setEditProdImageUrl] = useState("");
  const [editProdCode, setEditProdCode] = useState("");
  const [editProdImageInputMethod, setEditProdImageInputMethod] = useState<"preset" | "upload" | "url">("preset");
  const editProdFileInputRef = React.useRef<HTMLInputElement>(null);

  const startEditingProduct = (p: Product) => {
    setEditProdName(p.name);
    setEditProdCategory(p.category);
    
    // Check if category is standard or custom
    const standardCategories = ["Short", "Camisa", "Legging", "Regata", "Top", "Acessórios"];
    const isStandard = standardCategories.includes(p.category);
    setEditProdCategoryInputMethod(isStandard ? "select" : "custom");

    setEditProdSize(p.size);
    setEditProdColor(p.color);
    setEditProdPrice(p.price.toString());
    setEditProdCostPrice(p.costPrice.toString());
    setEditProdStock(p.stock.toString());
    setEditProdMinStock(p.minStock.toString());
    setEditProdDescription(p.description);
    setEditProdImageUrl(p.imageUrl || "");
    setEditProdCode(p.code);
    setEditProdImageInputMethod(p.imageUrl && p.imageUrl.startsWith("data:") ? "upload" : "preset");
    setIsEditingProduct(true);
  };

  const handleEditProdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A foto excedeu o limite máximo de 2MB. Por favor envie uma menor.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditProdImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEditedProduct = () => {
    if (!selectedDetailProduct) return;
    const updated: Product = {
      ...selectedDetailProduct,
      name: editProdName,
      category: editProdCategory,
      size: editProdSize,
      color: editProdColor,
      price: parseFloat(editProdPrice) || 0,
      costPrice: parseFloat(editProdCostPrice) || 0,
      stock: parseInt(editProdStock) || 0,
      minStock: parseInt(editProdMinStock) || 0,
      description: editProdDescription,
      imageUrl: editProdImageUrl,
      code: editProdCode,
    };
    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    setSelectedDetailProduct(updated);
    setIsEditingProduct(false);
  };

  const handleDeleteProductInFittingRoom = (productId: string, productName: string) => {
    if (confirm(`Confirma excluir a peça de roupa "${productName}" permanentemente de todo o estoque e do provador?`)) {
      if (onDeleteProduct) {
        onDeleteProduct(productId);
      }
      setSelectedDetailProduct(null);
      setIsEditingProduct(false);
    }
  };

  // Current active sales cart
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Wishlist of clothing items they "liked"
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  
  // Checkout Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Pix" | "Crédito" | "Boleto" | "Parcelamento">("Pix");

  // Formal Installment settings states
  const [installmentsCount, setInstallmentsCount] = useState(3);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [dueDateDay, setDueDateDay] = useState(10);
  
  // Cart items count tracker
  const [shippingCep, setShippingCep] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"PAC" | "Sedex" | "Retirada">("PAC");
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingDays, setShippingDays] = useState(0);

  // Credit Card Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Completed receipt view state
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [wishlistReport, setWishlistReport] = useState<string | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Abandoned carts simulation database
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCartNotification[]>([
    {
      id: "abc-1",
      customerName: "Camila Rodrigues",
      phone: "(11) 98765-4321",
      abandonedAt: "Há 42 minutos",
      itemsCount: 2,
      totalValue: 239.80,
      status: "Pendente"
    },
    {
      id: "abc-2",
      customerName: "Letícia Mendes",
      phone: "(21) 97120-4592",
      abandonedAt: "Há 2 horas",
      itemsCount: 1,
      totalValue: 149.90,
      status: "Pendente"
    }
  ]);

  // Handle calculation of Brazilian logistics deadlines and values
  const handleCalculateShipping = () => {
    if (!shippingCep || shippingCep.length < 8) {
      alert("Por favor, informe um CEP válido com 8 dígitos.");
      return;
    }
    
    if (shippingMethod === "Retirada") {
      setShippingCost(0);
      setShippingDays(0);
      return;
    }

    // Interactive CEP simulation
    const numericPart = parseInt(shippingCep.replace(/\D/g, "").substring(0, 3)) || 100;
    const baseCost = shippingMethod === "Sedex" ? 28.50 : 12.90;
    const computedCost = baseCost + (numericPart % 15);
    const computedDays = shippingMethod === "Sedex" ? Math.max(1, numericPart % 4) : Math.max(3, numericPart % 10);
    
    setShippingCost(computedCost);
    setShippingDays(computedDays);
  };

  // Add Item to active Cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`O produto ${product.name} está esgotado no estoque do armazém!`);
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex !== -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= product.stock) {
        alert(`Não é possível adicionar mais unidades. Limite de estoque real de ${product.stock} atingido.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: product.size, selectedColor: product.color }]);
    }
  };

  // Adjust Quantity inside the cart
  const handleSetQuantity = (index: number, change: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + change;
    
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      if (newQty > updated[index].product.stock) {
        alert(`Limite de estoque máximo (${updated[index].product.stock} un) atingido para esta peça.`);
        return;
      }
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // Toggle user liking of a product
  const handleToggleLike = (product: Product) => {
    const isLiked = likedProducts.some((p) => p.id === product.id);
    if (isLiked) {
      setLikedProducts(likedProducts.filter((p) => p.id !== product.id));
    } else {
      setLikedProducts([...likedProducts, product]);
    }
  };

  // Generate Clothing Affinity Report for Liked Pieces
  const handleGenerateWishlistReport = () => {
    if (likedProducts.length === 0) {
      alert("Selecione pelo menos um produto curtido (clique no ícone de coração) para gerar o relatório de afinidade de roupas.");
      return;
    }

    const nameToUse = customerName || "Cliente Especial Angelina";
    let reportText = `ANGELINA APPAREL • RELATÓRIO DE AFINIDADE DE MODA FITNESS\n`;
    reportText += `Documento Gerado para: ${nameToUse} • Data: ${new Date().toLocaleDateString("pt-BR")}\n`;
    reportText += `===========================================================\n\n`;
    reportText += `Peças Selecionadas e Curtidas pelo Cliente:\n`;
    
    likedProducts.forEach((p, index) => {
      reportText += `${index + 1}) [Código: ${p.code}] ${p.name}\n`;
      reportText += `   - Categoria: ${p.category} | Grade de Cores: ${p.color} | Tamanho Indicado: ${p.size}\n`;
      reportText += `   - Preço Unitário Comercial: R$ ${p.price.toFixed(2)}\n`;
      reportText += `   - Especificação de Conforto: ${p.description}\n\n`;
    });

    reportText += `===========================================================\n`;
    reportText += `💡 RECOMENDAÇÕES DA ESTILISTA VANESSA:\n`;
    reportText += `Excelente bom gosto! Os modelos selecionados contam com Poliamida de alta elasticidade com secagem veloz.\n`;
    reportText += `Sugerimos calçados pretos minimalistas e tops de alta sustentação para harmonizar e criar o look fitness ideal para caminhadas ou musculação avançada.\n`;
    reportText += `\n*Este relatório está pronto para envio em PDF.*`;
    
    setWishlistReport(reportText);
  };

  // Calculate Subtotal and Total values
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalValue = cartSubtotal + shippingCost;

  // Real-time calculation helper for installment preview & plans
  const calculateParcelPreview = (
    total: number,
    installmentsCountVal: number,
    downPaymentVal: number,
    interestRateVal: number,
    dueDateDayVal: number
  ) => {
    const financed = total - downPaymentVal;
    if (financed <= 0) return [];

    // Simple flat interest rate premium on financed amount
    const totalWithInterest = financed * (1 + (interestRateVal / 100));
    const parcelVal = totalWithInterest / installmentsCountVal;

    const parcels = [];
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    for (let i = 1; i <= installmentsCountVal; i++) {
      let nextMonth = month + i;
      let targetYear = year + Math.floor(nextMonth / 12);
      let targetMonth = nextMonth % 12;

      // Safe date calculation capping day to 28 for February compatibility
      const targetDay = Math.min(dueDateDayVal, 28);
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

  // Complete Order Checkout and deduct real stock levels
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Seu carrinho de compras está vazio.");
      return;
    }

    const nameToUse = customerName || "Cliente Portador";

    // Deduct stock levels in local DB state
    cart.forEach((item) => {
      const currentStock = item.product.stock;
      const soldQty = item.quantity;
      onUpdateProductStock(item.product.id, Math.max(0, currentStock - soldQty));
    });

    let planData = undefined;
    if (paymentMethod === "Parcelamento") {
      const parcels = calculateParcelPreview(
        totalValue,
        installmentsCount,
        downPayment,
        interestRate,
        dueDateDay
      );
      planData = {
        totalValue: totalValue,
        installmentsCount: installmentsCount,
        downPayment: downPayment,
        interestRate: interestRate,
        dueDateDay: dueDateDay,
        parcels: parcels
      };
    }

    const newSale: Sale = {
      id: `sale-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        category: item.product.category,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: totalValue,
      paymentMethod,
      customerName: nameToUse,
      customerPhone,
      shippingCost,
      status: "Completed",
      installmentPlan: planData
    };

    onAddSale(newSale);
    setCompletedSale(newSale);
    setShowInvoiceModal(true);
    
    // Clear Active Card & Cart
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setCardNumber("");
    setCardHolder("");
    setCardExpiry("");
    setCardCvv("");
    setShippingCep("");
    setShippingCost(0);
    setShippingDays(0);
    setInstallmentsCount(3);
    setDownPayment(0);
    setInterestRate(0);
    setDueDateDay(10);
  };

  // Trigger simulated WhatsApp / Email recovery notification for abandoned carts
  const handleRecoverCartNotification = (notificationId: string, channel: "WhatsApp" | "E-mail") => {
    setAbandonedCarts(prev => prev.map(notif => {
      if (notif.id === notificationId) {
        return {
          ...notif,
          status: channel === "WhatsApp" ? "Enviado_WhatsApp" : "Enviado_E-mail"
        };
      }
      return notif;
    }));
    
    const notification = abandonedCarts.find(n => n.id === notificationId);
    if (notification) {
      alert(
        `Notificação de Abandono enviada com sucesso para ${notification.customerName} via ${channel}!\n\n` +
        `Mensagem enviada: "Olá ${notification.customerName}! Percebemos que você amou peças em nosso provador virtual Angelina Moda Fitness. Liberamos um cupom de 10% OFF + Frete Grátis em sua compra! Digite ANGELINARECUP para garantir."`
      );
    }
  };

  // Filter sales based on query
  const filteredSales = sales.filter((s) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      s.id.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      (s.customerPhone && s.customerPhone.includes(q)) ||
      s.paymentMethod.toLowerCase().includes(q) ||
      s.items.some((it) => it.name.toLowerCase().includes(q))
    );
  });

  const totalFilteredValue = filteredSales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">
      {/* Sub-navigation nested tab switcher */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-700">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-850">Terminal & Registro de Vendas Angelina</h3>
            <p className="text-[10px] text-slate-450">Efetue vendas de peças no caixa ou visualize históricos e emita segundas vias de recibos</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab("cadastrar")}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "cadastrar" 
                ? "bg-white text-indigo-750 shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Plus size={13} />
            Cadastrar Nova Venda
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubTab("historico")}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "historico" 
                ? "bg-white text-indigo-750 shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText size={13} />
            Vendas Cadastradas ({sales.length})
          </button>
        </div>
      </div>

      {activeSubTab === "cadastrar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: PRODUCT SELECTION & WISHLISTS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Wishlist Liked Items Panel */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                    <Heart className="text-rose-500 fill-rose-500" size={16} />
                    Peças Favoritas da Cliente ({likedProducts.length})
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Clique no ♥ dos produtos listados abaixo para montar a curadoria</p>
                </div>
                {likedProducts.length > 0 && (
                  <button
                    onClick={handleGenerateWishlistReport}
                    className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 py-1 px-3 rounded-lg border border-rose-100 transition flex items-center gap-1"
                    id="btn-gen-wishlist-report"
                  >
                    <FileText size={12} />
                    Gerar Relatório de Afinidade
                  </button>
                )}
              </div>

              {likedProducts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {likedProducts.map((lp) => (
                    <div key={lp.id} className="bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
                      <span className="font-medium text-slate-800">{lp.name}</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md">{lp.size}</span>
                      <button 
                        onClick={() => handleToggleLike(lp)}
                        className="text-neutral-400 hover:text-rose-500 ml-1 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-neutral-100 rounded-2xl text-neutral-400 text-[11px]">
                  Selecione peças curtidas no catálogo abaixo para emitir relatórios de provices e combinações de estilo.
                </div>
              )}

              {/* Render Wishlist Report simulation pre-box */}
              {wishlistReport && (
                <div className="mt-4 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-[10px] relative">
                  <button 
                    onClick={() => setWishlistReport(null)}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-white"
                  >
                    Fechar ×
                  </button>
                  <h4 className="text-xs font-bold text-rose-400 mb-2">Relatório de Afinidade Gerado de Acordo com Mandatos</h4>
                  <pre className="whitespace-pre-wrap overflow-x-auto text-[10px] leading-relaxed max-h-36 font-sans">
                    {wishlistReport}
                  </pre>
                  <div className="mt-3 pt-2.5 border-t border-zinc-900 flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (printWindow) {
                          printWindow.document.write(`<pre style="font-family:monospace;padding:20px;">${wishlistReport}</pre>`);
                          printWindow.document.close();
                          printWindow.print();
                        }
                      }}
                      className="bg-zinc-805 hover:bg-zinc-700 text-white font-semibold py-1 px-3 rounded text-[10px] flex items-center gap-1"
                    >
                      <Printer size={10} /> Imprimir Relatório
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fashion Clothing catalog picker */}
            <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <ShoppingBag className="text-indigo-600" size={16} />
                Selecione Peças do Provador Angelina (Clique para Ver Detalhes & Avaliações)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map((p) => {
                  const isLiked = likedProducts.some((lp) => lp.id === p.id);
                  const isOut = p.stock <= 0;

                  return (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedDetailProduct(p)}
                      className={`group border rounded-2xl p-3 transition flex flex-col justify-between cursor-pointer select-none ${
                        isOut 
                          ? 'bg-slate-50 border-slate-100 opacity-65' 
                          : 'bg-white border-slate-200/60 hover:shadow-md hover:border-indigo-300 transform hover:-translate-y-0.5'
                      }`}
                    >
                      <div>
                        {p.imageUrl && (
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-slate-100 border border-slate-200/30">
                            <img 
                              src={p.imageUrl} 
                              alt={p.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white/95 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-xs flex items-center gap-1">
                                <Info size={10} /> Espiar Peça
                              </span>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-indigo-600/90 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-md uppercase font-mono shadow-sm">
                              {p.category}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wide font-mono">
                            {p.code}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLike(p);
                            }}
                            className={`hover:scale-115 transition ${isLiked ? 'text-rose-500' : 'text-neutral-300 hover:text-rose-400'}`}
                          >
                            <Heart size={14} className={isLiked ? "fill-rose-500" : ""} />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-slate-805 line-clamp-1 group-hover:text-indigo-805 transition-colors">{p.name}</h4>
                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">{p.size}</span>
                          <span className="text-slate-500">{p.color}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-neutral-400 text-[10px]">R$</span>
                          <span className="text-sm font-black text-neutral-900">{p.price.toFixed(2)}</span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[9px] ${isOut ? 'text-rose-500 font-bold' : 'text-slate-500 font-semibold'}`}>
                            {isOut ? "Sem Estoque" : `Qtd: ${p.stock}`}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(p);
                            }}
                            disabled={isOut}
                            className={`py-1 px-2.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                              isOut 
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                                : 'bg-neutral-900 text-white hover:bg-neutral-800'
                            }`}
                            id={`btn-add-to-cart-${p.id}`}
                          >
                            <Plus size={10} />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Logistics/Shipping CEP estimate calculator */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-800 mb-3 flex items-center gap-1.5">
                <Truck className="text-neutral-700" size={16} />
                Cálculo Logístico (Rastreamento & Entrega Correios)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 mb-1">Informe o CEP de Destino:</label>
                  <input
                    type="text"
                    placeholder="Ex: 01001-000"
                    maxLength={9}
                    value={shippingCep}
                    onChange={(e) => setShippingCep(e.target.value.replace(/[^\d-]/g, ""))}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 mb-1">Transportadora / Serviço:</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value as any)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-neutral-700 focus:outline-none"
                  >
                    <option value="PAC">PAC Correios (Econômico)</option>
                    <option value="Sedex">Sedex Correios (Expresso)</option>
                    <option value="Retirada">Retirar na Loja Angelina (Sede)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleCalculateShipping}
                    className="w-full bg-neutral-900 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-neutral-800 transition"
                    id="btn-calc-shipping"
                  >
                    Calcular Frete
                  </button>
                </div>
              </div>

              {shippingCost > 0 ? (
                <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="text-emerald-600 animate-bounce" size={14} />
                    <span className="font-semibold text-neutral-800">{shippingMethod} Estimado:</span>
                    <span className="text-neutral-500">Chega em até {shippingDays} dias úteis</span>
                  </div>
                  <span className="font-bold text-neutral-900">R$ {shippingCost.toFixed(2)}</span>
                </div>
              ) : shippingMethod === "Retirada" ? (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 size={14} />
                  <span>Retirada em loja autorizada sem custo logístico adicional! Disponível em até 2 horas.</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT COLUMN: REALTIME SALES CART, 2FA INTEGRATION & PAYMENTS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Shopping Cart box */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                  <ShoppingCart className="text-neutral-700" size={16} />
                  Carrinho de Compras Ativo
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono font-bold">
                  {cart.reduce((s, c) => s + c.quantity, 0)} Itens
                </span>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-slate-800">
                      <div className="max-w-[60%]">
                        <h5 className="font-bold text-slate-800 truncate">{item.product.name}</h5>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5">
                          <span className="bg-white py-0.5 px-1.5 rounded border border-neutral-200 font-bold text-neutral-700">{item.selectedSize}</span>
                          <span>•</span>
                          <span>{item.selectedColor}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 border border-neutral-200 bg-white rounded-lg p-0.5">
                          <button 
                            type="button" 
                            onClick={() => handleSetQuantity(idx, -1)}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-600"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono">{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => handleSetQuantity(idx, 1)}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-600"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <div className="text-right font-mono">
                          <div className="font-bold text-neutral-805">R$ {(item.product.price * item.quantity).toFixed(2)}</div>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-neutral-400 hover:text-rose-500 transition-all p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-dashed border-neutral-150 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-neutral-800">R$ {cartSubtotal.toFixed(2)}</span>
                    </div>
                    {shippingCost > 0 && (
                      <div className="flex justify-between text-neutral-500">
                        <span>Custo do Frete:</span>
                        <span className="font-semibold">R$ {shippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-2.5">
                      <span>Total Operação:</span>
                      <span className="text-sm font-black text-indigo-600 font-mono">R$ {totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  <ShoppingCart size={24} className="mx-auto mb-2 text-neutral-300" />
                  Nenhuma peça foi adicionada ao checkout.
                </div>
              )}
            </div>

            {/* Customer info & Checkout Payment Details */}
            <form onSubmit={handlePlaceOrder} className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User size={16} className="text-indigo-600" />
                Dados da Venda & Cobrança
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Nome da Compradora:</label>
                  <input
                    type="text"
                    placeholder="Ex: Luana Oliveira"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Telefone WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 99999-9999"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1.5">Escolha o Método de Pagamento:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Pix")}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1.5 ${
                      paymentMethod === "Pix" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode size={16} />
                    PIX
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Crédito")}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1.5 ${
                      paymentMethod === "Crédito" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard size={16} />
                    Cartão
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Boleto")}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1.5 ${
                      paymentMethod === "Boleto" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Barcode size={16} />
                    Boleto
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Parcelamento")}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center gap-1.5 ${
                      paymentMethod === "Parcelamento" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Calendar size={16} />
                    Crediário
                  </button>
                </div>
              </div>

              {/* DYNAMIC FORM AND LIVE PREVIEW FOR FORMAL INSTALLMENTS */}
              {paymentMethod === "Parcelamento" && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[10px] uppercase tracking-wider pb-1 border-b border-indigo-105">
                    <Calendar size={13} className="text-indigo-600" />
                    Simulador de Venda por Parcelamento Formal
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Entrada (R$):</label>
                      <input
                        type="number"
                        min="0"
                        max={totalValue}
                        value={downPayment || ""}
                        placeholder="0.00"
                        onChange={(e) => setDownPayment(Math.min(totalValue, Math.max(0, Number(e.target.value))))}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1.5 text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nº de Parcelas:</label>
                      <select
                        value={installmentsCount}
                        onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1.5 text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num}x {num === 1 ? "(À Vista)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Vencimento (Dia):</label>
                      <select
                        value={dueDateDay}
                        onChange={(e) => setDueDateDay(Number(e.target.value))}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1.5 text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {[5, 10, 15, 20, 25, 28].map((day) => (
                          <option key={day} value={day}>
                            Dia {day.toString().padStart(2, "0")} de cada mês
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Acréscimo/Juros (%):</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={interestRate || ""}
                        placeholder="0.0"
                        onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1.5 text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Installments Breakdown Preview */}
                  <div className="bg-white rounded-xl border border-slate-200/60 p-3 space-y-2">
                    <span className="block text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">
                      Fluxo do Carnê / Crediário:
                    </span>
                    
                    {downPayment > 0 && (
                      <div className="flex justify-between items-center text-[10px] text-emerald-700 bg-emerald-50/70 py-1 px-2 rounded-lg border border-emerald-100">
                        <span className="font-semibold">Entrada à Vista:</span>
                        <span className="font-bold font-mono">R$ {downPayment.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {calculateParcelPreview(totalValue, installmentsCount, downPayment, interestRate, dueDateDay).length === 0 ? (
                        <p className="text-[10px] text-amber-600 italic text-center py-1">
                          Sem saldo financiado (Entrada quita o total).
                        </p>
                      ) : (
                        calculateParcelPreview(totalValue, installmentsCount, downPayment, interestRate, dueDateDay).map((parc) => (
                          <div key={parc.number} className="flex justify-between items-center text-slate-650 border-b border-dashed border-slate-100 py-1 last:border-0 text-[10.5px]">
                            <span className="font-bold text-slate-700">Parcela {parc.number}/{installmentsCount}</span>
                            <span className="text-slate-400 font-mono text-[9px]">venc. {parc.dueDate}</span>
                            <span className="font-bold text-indigo-700 font-mono">R$ {parc.value.toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {totalValue - downPayment > 0 && (
                      <div className="flex justify-between items-center text-[11px] font-black text-slate-800 border-t border-slate-100 pt-2 font-mono">
                        <span>Total Parcelado ({installmentsCount}x):</span>
                        <span>
                          R$ {(
                            (totalValue - downPayment) * (1 + interestRate / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DYNAMIC CARD LAYOUT FOR CARD PAYMENT METHOD */}
              {paymentMethod === "Crédito" && (
                <div className="bg-neutral-50/75 p-4 rounded-xl border border-neutral-200 space-y-3 animate-fade-in/90">
                  <div className="bg-gradient-to-tr from-neutral-900 via-neutral-800 to-zinc-700 text-white p-4 rounded-xl h-28 flex flex-col justify-between shadow-md relative overflow-hidden font-mono text-[10px]">
                    <div className="flex justify-between items-start">
                      <span className="font-bold tracking-widest text-[8px] uppercase">ANGELINA GOLD CARD</span>
                      <span className="italic text-[9px] font-black">VISA</span>
                    </div>
                    <div className="text-center text-sm font-semibold tracking-widest">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between text-[8px]">
                      <div>
                        <span className="block text-zinc-400 text-[6px]">TITULAR PORTADOR</span>
                        <span className="uppercase text-[8px]">{cardHolder || "NOME DO CLIENTE"}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-zinc-400 text-[6px]">VALIDADE</span>
                        <span>{cardExpiry || "MM/AA"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Número do Cartão"
                      maxLength={19}
                      required={paymentMethod === "Crédito"}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                      className="p-2 border rounded-lg text-xs bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Nome do Titular"
                      required={paymentMethod === "Crédito"}
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="p-2 border rounded-lg text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Validade (MM/AA)"
                      maxLength={5}
                      required={paymentMethod === "Crédito"}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="p-2 border rounded-lg text-xs bg-white focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={3}
                      required={paymentMethod === "Crédito"}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      className="p-2 border rounded-lg text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "Pix" && (
                <div className="bg-zinc-50 p-3 rounded-lg border border-neutral-205 flex items-center gap-3 animate-fade-in">
                  <QrCode size={40} className="text-neutral-700 shrink-0 border p-1 rounded bg-white shadow-xs" />
                  <div>
                    <h5 className="text-[11px] font-bold text-neutral-805">Pagamento Pix Instantâneo</h5>
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Chave Pix de recepção será gerada automaticamente no PDF de faturamento, permitindo liquidação em até 5 segundos.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "Boleto" && (
                <div className="bg-zinc-50 p-3 rounded-lg border border-neutral-205 flex items-center gap-3 animate-fade-in">
                  <Barcode size={40} className="text-neutral-700 shrink-0 border p-1 rounded bg-white shadow-xs" />
                  <div>
                    <h5 className="text-[11px] font-bold text-neutral-805">Boleto Bancário</h5>
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Compensação de 1 a 2 dias úteis. Código de barras gerado e associado ao orçamento ao finalizar.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={cart.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-xs font-bold shadow-md shadow-indigo-600/10 transition disabled:bg-neutral-300"
                id="btn-complete-checkout"
              >
                Finalizar Venda & Confirmar Baixa
              </button>
            </form>

            {/* Abandoned Cart automatic alerts simulator panel */}
            <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle size={15} className="text-amber-500" />
                  Abandonos de Carrinho Ativos (Recuperação Automática)
                </h3>
                <span className="text-[9px] bg-neutral-100 text-neutral-600 font-bold py-0.5 px-2 rounded-full uppercase">Estável</span>
              </div>

              <div className="space-y-2.5">
                {abandonedCarts.map((item) => (
                  <div key={item.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 text-[11px] space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-808">{item.customerName}</span>
                      <span className="text-[9px] font-mono text-zinc-400">{item.abandonedAt}</span>
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span>{item.itemsCount} roupas esquecidas</span>
                      <span className="font-semibold text-neutral-800">Total: R$ {item.totalValue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-neutral-200">
                      <span className={`text-[9px] uppercase font-bold py-0.5 px-2 rounded ${
                        item.status === "Pendente" 
                          ? "bg-amber-100 text-amber-700 border border-amber-200" 
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}>
                        {item.status.replace("_", " ")}
                      </span>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleRecoverCartNotification(item.id, "WhatsApp")}
                          className="py-1 px-1.5 bg-neutral-200 hover:bg-neutral-300 rounded text-[9px] font-bold text-neutral-700 flex items-center gap-1"
                          title="Enviar Alerta WhatsApp"
                        >
                          <PhoneCall size={9} />
                          whats
                        </button>
                        <button
                          onClick={() => handleRecoverCartNotification(item.id, "E-mail")}
                          className="py-1 px-1.5 bg-neutral-200 hover:bg-neutral-300 rounded text-[9px] font-bold text-neutral-700"
                          title="Enviar Alerta E-mail"
                        >
                          e-mail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-sm space-y-6">
          {/* SALES HISTORY SEARCH BAR AND OVERVIEW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">Histórico de Pedidos e Vendas Registradas</h4>
              <p className="text-[10px] text-slate-500 font-sans">Consulte relatórios de faturamento rápido e emita segundas vias de ordens de compra, recibos ou boletos</p>
            </div>

            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Buscar por cliente, ID, produto, pagamento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-slate-705 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Quick Metrics of filtered list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50/55 border border-indigo-100/50 rounded-xl p-3 text-slate-800">
              <span className="text-[9px] block uppercase font-bold text-indigo-700 font-mono">Faturamento das Vendas</span>
              <span className="text-lg font-black font-mono">R$ {totalFilteredValue.toFixed(2)}</span>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-slate-800 font-mono">
              <span className="text-[9px] block uppercase font-bold text-slate-500 font-sans">Total de Ordens Registradas</span>
              <span className="text-lg font-black">{filteredSales.length} ordens</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-slate-805">
              <span className="text-[9px] block uppercase font-bold text-slate-500 font-sans">Divisão por Meio de Cobrança</span>
              <span className="text-[10px] font-bold block mt-1 leading-tight text-slate-600">
                ⚡ Pix: {filteredSales.filter(s => s.paymentMethod === "Pix").length} • 💳 Cartão: {filteredSales.filter(s => s.paymentMethod === "Crédito").length} <br />
                📄 Bol: {filteredSales.filter(s => s.paymentMethod === "Boleto").length} • 🗓️ Crediário: {filteredSales.filter(s => s.paymentMethod === "Parcelamento").length}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-slate-800">
              <span className="text-[9px] block uppercase font-bold text-slate-500 font-sans font-mono">Última Compradora</span>
              <span className="text-xs font-bold block mt-1 text-indigo-700 truncate">
                {filteredSales.length > 0 ? filteredSales[0].customerName : 'Nenhuma'}
              </span>
            </div>
          </div>

          {/* TABLE OF SALES */}
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-3 pl-4">ID Pedido</th>
                  <th className="p-3">Compradora / Contato</th>
                  <th className="p-3">Peças Adquiridas</th>
                  <th className="p-3">Meio de Cobrança</th>
                  <th className="p-3 text-right">Data / Horário</th>
                  <th className="p-3 text-right pr-4">Preço Total</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 pl-4 font-mono font-bold text-indigo-900 text-[11px]">
                        #{sale.id}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{sale.customerName}</div>
                        {sale.customerPhone ? (
                          <div className="text-[10px] text-slate-500 font-mono">{sale.customerPhone}</div>
                        ) : (
                          <div className="text-[10px] text-slate-400">Sem telefone cadastrado</div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-0.5 max-w-xs">
                          {sale.items.map((it, index) => (
                            <span key={index} className="text-[10.5px] font-normal leading-tight text-slate-650">
                              • <span className="font-bold text-slate-805">{it.quantity}x</span> {it.name} <span className="text-indigo-600 font-semibold">({it.size})</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`py-0.5 px-2 font-bold rounded-md text-[9px] uppercase tracking-wide border ${
                            sale.paymentMethod === "Pix" 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                              : sale.paymentMethod === "Crédito" 
                                ? "bg-indigo-50 text-indigo-750 border-indigo-100" 
                                : sale.paymentMethod === "Boleto"
                                  ? "bg-amber-50 text-amber-805 border-amber-100"
                                  : "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-100"
                          }`}>
                            {sale.paymentMethod === "Parcelamento" ? "Crediário 🗓️" : sale.paymentMethod}
                          </span>
                          {sale.paymentMethod === "Parcelamento" && sale.installmentPlan && (
                            <span className="text-[10px] font-semibold text-fuchsia-600 font-sans">
                              {sale.installmentPlan.parcels.filter(p => p.status === "Pago").length} de {sale.installmentPlan.installmentsCount} pagas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono text-[10.5px] text-slate-500">
                        <div>{new Date(sale.date).toLocaleDateString("pt-BR")}</div>
                        <div className="text-[9px] text-slate-450">{new Date(sale.date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="p-3 text-right font-black text-slate-900 font-mono text-[11.5px] pr-4">
                        R$ {sale.total.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => {
                              setCompletedSale(sale);
                              setShowInvoiceModal(true);
                            }}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded-lg text-[10px] transition flex items-center gap-1 shadow-sm"
                          >
                            <FileText size={10} />
                            Recibo PDF
                          </button>
                          
                          <button
                            onClick={() => {
                              const message = `Olá ${sale.customerName}! Aqui está o comprovante da sua compra no valor de R$ ${sale.total.toFixed(2)} na Angelina Activewear. Acesse o comprovante completo no link: angelina.com/recibo/${sale.id}`;
                              alert(`Pronto para enviar via cliente!\n\nMensagem simulada:\n"${message}"`);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded-lg text-[10px] transition"
                            title="Compartilhar Comprovante"
                          >
                            <Share2 size={10} />
                          </button>

                          {onDeleteSale && (
                            <button
                              onClick={() => {
                                if (confirm(`Confirma excluir de forma permanente esta venda/peça programada de código #${sale.id} de ${sale.customerName}?`)) {
                                  onDeleteSale(sale.id);
                                }
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 p-1 rounded-lg transition"
                              title="Excluir Venda/Peça Registrada"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Nenhuma venda encontrada para esta busca.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED RECEIPT / STATEMENT MODAL VIEW "Orçamento / PDF" */}
      {showInvoiceModal && completedSale && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-3">
              <div>
                <h4 className="font-extrabold text-neutral-900 text-base">Orçamento & Ordem de Venda</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Sintonia e Moda Fitness Angelina</p>
              </div>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="text-neutral-450 hover:text-neutral-600 font-semibold bg-neutral-100 rounded-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Document Printable container */}
            <div className="border border-neutral-200 rounded-2xl p-5 space-y-4 text-xs bg-stone-50 font-sans" id="invoice">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-neutral-250 pb-3">
                <div>
                  <h3 className="font-extrabold text-neutral-950 uppercase text-sm tracking-widest">Angelina activewear</h3>
                  <p className="text-[9px] text-neutral-500 mt-0.5">Atelier de Alta Costura Esportiva</p>
                  <p className="text-[8px] text-neutral-400 font-mono">São Paulo - SP • CNPJ: 52.889.206/0001-99</p>
                </div>
                <div className="text-right font-mono text-[9px] text-neutral-600">
                  <span className="block font-bold">CÓDIGO: {completedSale.id}</span>
                  <span className="block">{new Date(completedSale.date).toLocaleString("pt-BR")}</span>
                </div>
              </div>

              {/* Customer summary */}
              <div>
                <h5 className="font-bold text-neutral-800 tracking-wider uppercase text-[8px] mb-1">Destinatário:</h5>
                <p className="font-semibold text-neutral-900 text-xs">{completedSale.customerName}</p>
                {completedSale.customerPhone && (
                  <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Telefone: {completedSale.customerPhone}</p>
                )}
                {shippingCep && (
                  <p className="text-[9px] text-neutral-500 font-mono">Endereço de Carga CEP: {shippingCep}</p>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1.5 border-t border-b border-solid border-neutral-200 py-3">
                <span className="block font-bold text-[8px] text-neutral-500 uppercase tracking-widest mb-1">Itens Adquiridos:</span>
                
                {completedSale.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>
                      {it.quantity}x {it.name} - <span className="font-semibold">{it.size}</span> | {it.color}
                    </span>
                    <span className="font-mono font-bold">R$ {(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals & payment method */}
              <div className="space-y-1 font-mono text-[11px] text-neutral-700">
                {completedSale.shippingCost > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span>Frete:</span>
                    <span>R$ {completedSale.shippingCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xs text-neutral-900 pt-1">
                  <span>Faturamento Final:</span>
                  <span className="text-indigo-600 font-bold">R$ {completedSale.total.toFixed(2)}</span>
                </div>
                <div className="text-[9px] text-neutral-400 mt-2">
                  Método Indicado: <span className="font-bold text-neutral-700 uppercase">{completedSale.paymentMethod}</span>
                </div>
              </div>

              {/* IF PIX: INVOLVE RECEIPT MOCK CODE */}
              {completedSale.paymentMethod === "Pix" && (
                <div className="border border-neutral-250 p-2.5 rounded-lg bg-white space-y-2 flex flex-col items-center">
                  <QrCode size={80} className="text-zinc-800" />
                  <div className="text-center w-full">
                    <span className="text-[8px] block font-bold text-neutral-500">CÓDIGO COPIA E COLA PIX ANGELINA:</span>
                    <span className="text-[7px] font-mono bg-neutral-50 border p-1 rounded block truncate w-full select-all">
                      00020101021226840014br.gov.bcb.pix2562angelinamoda.com.br520400005303986
                    </span>
                  </div>
                </div>
              )}

              {/* IF BOLETO */}
              {completedSale.paymentMethod === "Boleto" && (
                <div className="space-y-1 border border-neutral-250 p-2 bg-white rounded flex flex-col items-center">
                  <Barcode size={30} className="w-full text-zinc-900" />
                  <span className="text-[7px] font-mono text-zinc-500 text-center select-all block w-full truncate">
                    34191.79001 01043.513184 91020.150008 7 900200000{completedSale.total.toFixed(0)}0
                  </span>
                </div>
              )}

              {/* IF PARCELAMENTO FORMAL (CARNÊ) */}
              {completedSale.paymentMethod === "Parcelamento" && completedSale.installmentPlan && (
                <div className="space-y-1.5 border border-dashed border-neutral-300 p-3 bg-white rounded-xl">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1">🗓️ Carnê de Pagamento Formal</span>
                    <span className="text-[8px] font-mono text-slate-400">Plano: {completedSale.installmentPlan.installmentsCount}x</span>
                  </div>
                  
                  {completedSale.installmentPlan.downPayment > 0 && (
                    <div className="flex justify-between text-[9.5px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono">
                      <span>Entrada à Vista:</span>
                      <span className="font-bold">R$ {completedSale.installmentPlan.downPayment.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="space-y-1 font-mono text-[9.5px] text-slate-600">
                    {completedSale.installmentPlan.parcels.map((p) => (
                      <div key={p.number} className="flex justify-between border-b border-slate-100 py-1 last:border-0">
                        <span>Parcela {p.number}/{completedSale.installmentPlan!.installmentsCount}</span>
                        <span>Vencimento: {p.dueDate}</span>
                        <span className="font-bold text-slate-900">
                          R$ {p.value.toFixed(2)} ({p.status})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="text-[8px] text-neutral-400 leading-normal text-center pt-2">
                Ao receber esta ordem, separe as roupas imediatamente do controle de estoque.
                Termos de trocas: 7 dias corridos após recebimento da encomenda física.
              </div>
            </div>

            {/* INTERACTIVE MERCHANDISE INSTALLMENT STATUS CONTROL (Outside the printable container) */}
            {completedSale.paymentMethod === "Parcelamento" && completedSale.installmentPlan && onUpdateSale && (
              <div className="mt-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h5 className="font-black text-xs text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    Controle de Baixa do Crediário Próprio
                  </h5>
                  <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Ações de Caixa
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-650 leading-normal">
                  Marque as parcelas abaixo à medida que o cliente realizar o pagamento (Ex: dinheiro, Pix de parcela, ou depósito). O sistema recalcula o faturamento imediatamente.
                </p>

                <div className="space-y-2">
                  {completedSale.installmentPlan.parcels.map((parcel) => (
                    <div 
                      key={parcel.number} 
                      className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-150 text-xs shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          Parcela {parcel.number} / {completedSale.installmentPlan!.installmentsCount}
                        </span>
                        <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                          <span>Vencimento: {parcel.dueDate}</span>
                          {parcel.paymentDate && (
                            <span className="text-emerald-600 font-bold">Pago: {parcel.paymentDate}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          parcel.status === "Pago" 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : parcel.status === "Atrasado"
                              ? "bg-rose-50 text-rose-800 border border-rose-100"
                              : "bg-amber-50 text-amber-800 border border-amber-100"
                        }`}>
                          {parcel.status}
                        </span>

                        {parcel.status !== "Pago" ? (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedParcels = completedSale.installmentPlan!.parcels.map(p => {
                                if (p.number === parcel.number) {
                                  return { 
                                    ...p, 
                                    status: "Pago" as const,
                                    paymentDate: new Date().toLocaleDateString("pt-BR")
                                  };
                                }
                                return p;
                              });
                              
                              const updatedSale: Sale = {
                                ...completedSale,
                                installmentPlan: {
                                  ...completedSale.installmentPlan!,
                                  parcels: updatedParcels
                                }
                              };
                              
                              if (onUpdateSale) onUpdateSale(updatedSale);
                              setCompletedSale(updatedSale);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-lg text-[9px] transition-all flex items-center gap-1"
                          >
                            <Check size={11} /> Baixar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedParcels = completedSale.installmentPlan!.parcels.map(p => {
                                if (p.number === parcel.number) {
                                  return { 
                                    ...p, 
                                    status: "Pendente" as const,
                                    paymentDate: undefined
                                  };
                                }
                                return p;
                              });
                              
                              const updatedSale: Sale = {
                                ...completedSale,
                                installmentPlan: {
                                  ...completedSale.installmentPlan!,
                                  parcels: updatedParcels
                                }
                              };
                              
                              if (onUpdateSale) onUpdateSale(updatedSale);
                              setCompletedSale(updatedSale);
                            }}
                            className="text-xs text-slate-450 hover:text-rose-600 hover:bg-rose-50 px-1.5 py-1 rounded-md transition-all font-semibold"
                          >
                            Estornar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Print/Download Action trigger buttons */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  const printContents = document.getElementById("invoice")?.innerHTML;
                  const originalContents = document.body.innerHTML;
                  if (printContents) {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Orçamento Angelina activewear</title>
                            <style>
                              body { font-family: sans-serif; padding: 30px; background-color: #faf9f6; }
                              #invoice { border: 1px solid #ddd; padding: 25px; border-radius: 12px; max-width: 500px; margin: 0 auto; background-color: #fff; }
                              .flex { display: flex; justify-content: space-between; }
                              .border-b { border-bottom: 1px solid #eee; margin-bottom: 15px; padding-bottom: 15px; }
                              font-mono { font-family: monospace; }
                            </style>
                          </head>
                          <body>
                            <div id="invoice">${printContents}</div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}
                className="flex-1 bg-neutral-900 text-white rounded-xl py-2.5 text-xs font-semibold hover:bg-neutral-800 transition flex items-center justify-center gap-1.5"
              >
                <Printer size={13} />
                Confirmar & Imprimir PDF
              </button>
              
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-4 rounded-xl py-2.5 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedDetailProduct && (() => {
        const extra = getProductExtraDetails(selectedDetailProduct);
        const isOut = selectedDetailProduct.stock <= 0;
        return (
          <div className="fixed inset-0 bg-slate-905/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto animate-fade-in animate-duration-200">
            <div 
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row border border-slate-100 text-slate-800 font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedDetailProduct(null);
                  setIsEditingProduct(false);
                }}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-2 rounded-full transition z-10 font-bold text-lg leading-none"
              >
                &times;
              </button>

              {isEditingProduct ? (
                /* FULL COMPREHENSIVE PRODUCT FORM EDITOR */
                <div className="w-full p-8 space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3.5">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Edit className="text-indigo-600" size={16} />
                      Editar Todas as Opções do Provador: <span className="text-indigo-700 font-black">{selectedDetailProduct.name}</span>
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-[11px] text-[#233E82] font-bold hover:underline"
                    >
                      &larr; Voltar para Detalhes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1 px-1">Nome da Peça *</label>
                      <input 
                        type="text"
                        required
                        value={editProdName}
                        onChange={(e) => setEditProdName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-medium"
                      />
                    </div>

                    {/* Code */}
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 px-1">Código de Referência *</label>
                      <input 
                        type="text"
                        required
                        value={editProdCode}
                        onChange={(e) => setEditProdCode(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-mono font-bold"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 px-1">Categoria Fitness</label>
                      {editProdCategoryInputMethod === "select" ? (
                        <select 
                          value={editProdCategory}
                          onChange={(e) => {
                            if (e.target.value === "CUSTOM") {
                              setEditProdCategoryInputMethod("custom");
                              setEditProdCategory("");
                            } else {
                              setEditProdCategory(e.target.value);
                            }
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-medium"
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
                            value={editProdCategory}
                            onChange={(e) => setEditProdCategory(e.target.value)}
                            className="w-full p-2.5 bg-indigo-50/20 border border-indigo-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-indigo-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditProdCategoryInputMethod("select");
                              setEditProdCategory("Short");
                            }}
                            className="px-3 bg-slate-150 text-slate-705 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                            title="Voltar para a seleção"
                          >
                            Voltar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 px-1">Tamanho Principal</label>
                      <select 
                        value={editProdSize}
                        onChange={(e) => setEditProdSize(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-bold"
                      >
                        <option value="P">P (Pequeno)</option>
                        <option value="M">M (Médio)</option>
                        <option value="G">G (Grande)</option>
                        <option value="GG">GG (Extra Grande)</option>
                        <option value="U">U (Tamanho Único)</option>
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 px-1">Tom de Cor *</label>
                      <input 
                        type="text"
                        required
                        value={editProdColor}
                        onChange={(e) => setEditProdColor(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none"
                      />
                    </div>

                    {/* Price and CostPrice */}
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 px-1">Preço de Venda (R$) *</label>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        value={editProdPrice}
                        onChange={(e) => setEditProdPrice(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-mono font-bold text-indigo-750"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1 px-1">Preço de Custo (R$) *</label>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        value={editProdCostPrice}
                        onChange={(e) => setEditProdCostPrice(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-mono text-emerald-700"
                      />
                    </div>

                    {/* Stock & MinStock */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1">Qtd Estoque</label>
                        <input 
                          type="number"
                          required
                          value={editProdStock}
                          onChange={(e) => setEditProdStock(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1">Qtd Mínima</label>
                        <input 
                          type="number"
                          required
                          value={editProdMinStock}
                          onChange={(e) => setEditProdMinStock(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* INTERACTIVE CLOTHING IMAGE SELECTOR FOR SALES CONSOLE EDIT */}
                    <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200/60 font-sans">
                        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                          <ImageIcon size={14} className="text-[#233E82]" />
                          Mudar Foto no Provador
                        </label>
                        <div className="flex bg-slate-200/60 p-1 rounded-lg gap-1 text-[10px] font-bold text-slate-700">
                          <button
                            type="button"
                            onClick={() => setEditProdImageInputMethod("preset")}
                            className={`px-3 py-1 rounded-md transition-all ${
                              editProdImageInputMethod === "preset"
                                ? "bg-white text-indigo-700 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Modelos Prontos
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditProdImageInputMethod("upload")}
                            className={`px-3 py-1 rounded-md transition-all ${
                              editProdImageInputMethod === "upload"
                                ? "bg-white text-indigo-700 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Enviar Foto (PC/Celular)
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditProdImageInputMethod("url")}
                            className={`px-3 py-1 rounded-md transition-all ${
                              editProdImageInputMethod === "url"
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
                          {editProdImageInputMethod === "preset" && (
                            <div className="space-y-3">
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Escolha uma foto de modelo profissional com base na categoria <span className="font-bold text-[#233E82] uppercase">{editProdCategory}</span>:
                              </p>
                              <div className="grid grid-cols-4 gap-2">
                                {((PRESETS_BY_CATEGORY[editProdCategory] || PRESETS_BY_CATEGORY["Short"]).map((preset, idx) => {
                                  const isSelected = editProdImageUrl === preset.url;
                                  return (
                                    <div
                                      key={idx}
                                      onClick={() => setEditProdImageUrl(preset.url)}
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

                          {editProdImageInputMethod === "upload" && (
                            <div className="space-y-3">
                              <p className="text-[11px] text-slate-500">
                                Tire ou envie uma foto do celular/computador para atualizar a imagem desta peça de roupa:
                              </p>
                              <div
                                onClick={() => editProdFileInputRef.current?.click()}
                                className="border-2 border-dashed border-indigo-200 hover:border-[#233E82] bg-white hover:bg-indigo-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all space-y-1 group shadow-xs"
                              >
                                <input
                                  ref={editProdFileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditProdImageUpload}
                                  className="hidden"
                                />
                                <div className="mx-auto w-8 h-8 rounded-full bg-indigo-50 text-[#233E82] flex items-center justify-center group-hover:scale-105 transition-transform">
                                  <Upload size={14} />
                                </div>
                                <div className="text-xs text-slate-705">
                                  <span className="font-bold text-[#233E82] hover:underline">Clique para enviar</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {editProdImageInputMethod === "url" && (
                            <div className="space-y-2">
                              <p className="text-[11px] text-slate-500">
                                Cole o endereço (URL) da nova foto do modelo:
                              </p>
                              <input
                                type="url"
                                placeholder="Ex: https://endereço-de-imagem.com/foto.jpg"
                                value={editProdImageUrl}
                                onChange={(e) => setEditProdImageUrl(e.target.value)}
                                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                              />
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-3 md:pt-0 md:pl-4">
                          <span className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Preview Provador</span>
                          <div className="relative aspect-square w-20 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center text-slate-350">
                            {editProdImageUrl ? (
                              <>
                                <img
                                  src={editProdImageUrl}
                                  alt="Preview Provador Novo"
                                  className="w-full h-full object-cover object-top animate-fade-in"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditProdImageUrl("")}
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

                    {/* Description */}
                    <div className="md:col-span-3">
                      <label className="block text-slate-600 font-bold mb-1 px-1">Descrição Comercial do Modelo *</label>
                      <textarea 
                        required
                        value={editProdDescription}
                        onChange={(e) => setEditProdDescription(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none leading-normal font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditedProduct}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/15 cursor-pointer"
                    >
                      Gravar Peça do Provador
                    </button>
                  </div>
                </div>
              ) : (
                /* TWO-COLUMN DETAILS DISPLAY & ADMINISTRATIVE OPERATIONS BANNER */
                <>
                  {/* Column 1: Image & Technical Base */}
                  <div className="w-full md:w-1/2 p-6 bg-slate-50/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/50">
                    <div>
                      <div className="aspect-square w-full rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200/50 p-1 mb-4 flex items-center justify-center">
                        <img 
                          src={selectedDetailProduct.imageUrl} 
                          alt={selectedDetailProduct.name}
                          className="w-full h-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Sourcing integrity seal */}
                      <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 text-[11px] leading-relaxed text-slate-500 space-y-1 shadow-xs">
                        <h5 className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          Garantia de Confecção Angelina
                        </h5>
                        <p>Produzido com fiação nobre rastreável, pigmentação de alta solidez (zero desbotamento) e costura de alta durabilidade.</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2 font-mono">Especificações do Modelo</span>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-650">
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xxs">
                          <span className="text-[9px] text-slate-400 block">Identificador</span>
                          <strong className="font-mono text-slate-800">{selectedDetailProduct.code}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xxs">
                          <span className="text-[9px] text-slate-400 block">Linha Fitness</span>
                          <strong className="text-slate-800">{selectedDetailProduct.category}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xxs">
                          <span className="text-[9px] text-slate-400 block">Grade Corrente</span>
                          <strong className="text-slate-800">Tamanho {selectedDetailProduct.size}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 shadow-xxs">
                          <span className="text-[9px] text-slate-400 block">Tom de Cor</span>
                          <strong className="text-slate-800">{selectedDetailProduct.color}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Details & Customer Feedbacks */}
                  <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      
                      {/* PAINEL ADMINISTRATIVO DE EDICAO E EXCLUSAO DA PECA */}
                      <div className="bg-orange-50 border border-orange-200/75 rounded-2xl p-3 flex justify-between items-center text-xs animate-fade-in shadow-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-orange-850 uppercase tracking-wide flex items-center gap-1">
                            <Edit size={12} className="text-orange-600" />
                            Ações da Peça
                          </span>
                          <span className="text-[9.5px] text-orange-700 block leading-tight">Configurações diretas de vestuários.</span>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditingProduct(selectedDetailProduct)}
                            className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition cursor-pointer"
                          >
                            Editar Detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProductInFittingRoom(selectedDetailProduct.id, selectedDetailProduct.name)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 py-1.5 px-2.5 rounded-lg text-[10px] transition flex items-center gap-1 font-bold cursor-pointer"
                            title="Apagar peça do sistema"
                          >
                            <Trash2 size={11} /> Apagar
                          </button>
                        </div>
                      </div>

                      {/* Title & Badge */}
                      <div>
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Tecnologia Ativa {selectedDetailProduct.category}wear
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2">{selectedDetailProduct.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex text-amber-500">
                            <Star size={13} className="fill-amber-500" />
                            <Star size={13} className="fill-amber-500" />
                            <Star size={13} className="fill-amber-500" />
                            <Star size={13} className="fill-amber-500" />
                            <Star size={13} className="fill-amber-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-705">4.9</span>
                          <span className="text-[10px] text-slate-400">({extra.reviews.length * 6 + 4} avaliações reais)</span>
                        </div>
                      </div>

                      {/* Pricing and Stock info */}
                      <div className="bg-slate-50 border border-slate-200/55 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-450 block uppercase font-bold">Preço de Tabela</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs text-indigo-700 font-bold">R$</span>
                            <span className="text-2xl font-black text-indigo-900">{selectedDetailProduct.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-450 block uppercase font-bold">Unidades Ativas</span>
                          <span className={`text-xs font-bold leading-none inline-block mt-1 ${isOut ? "text-rose-500" : "text-emerald-600"}`}>
                            {isOut ? "Sem estoque disponível" : `${selectedDetailProduct.stock} peças em armazém`}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1 text-xs text-slate-650">
                        <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[9px]">Sobre o Modelo</h5>
                        <p className="leading-relaxed font-normal">{selectedDetailProduct.description}</p>
                      </div>

                      {/* Tecidual Technology */}
                      <div className="space-y-2 border-t border-b border-slate-100 py-3.5">
                        <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[9px] flex items-center gap-1">
                          <Sparkles size={12} className="text-indigo-600" />
                          Tecnologia de Fiação & Proteção
                        </h5>
                        <div className="text-xs space-y-1 text-slate-650">
                          <div><strong className="text-slate-805 font-bold">Composição: </strong>{extra.fabric.fabric}</div>
                          <div><strong className="text-slate-805 font-bold">Fator de Proteção: </strong>{extra.fabric.protection}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {extra.fabric.features.map((feat, idx) => (
                            <span key={idx} className="bg-emerald-50 text-[10px] font-semibold text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100/30">
                              <Check size={9} /> {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reviews Section from other clients */}
                      <div className="space-y-2.5">
                        <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[9px]">Opinião de Compradoras Satisfeitas</h5>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {extra.reviews.map((rev, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-150/40 text-[11px] leading-relaxed text-slate-650">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  {rev.author}
                                  <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1 py-0.5 rounded-sm flex items-center gap-0.5 border border-emerald-100/30 font-medium font-sans">
                                    <Check size={8} className="text-emerald-600" /> Compradora Confirmada
                                  </span>
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">{rev.date}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex text-amber-500">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <Star key={i} size={9} className="fill-amber-500" />
                                  ))}
                                </div>
                                <span className="text-[9px] text-slate-400">Adquiriu tamanho: <span className="font-bold text-slate-600">{rev.sizeBought}</span></span>
                              </div>
                              <p className="italic text-slate-500 text-[10.5px]">"{rev.comment}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Adding to Cart Actions inside details modal */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          handleAddToCart(selectedDetailProduct);
                          setSelectedDetailProduct(null);
                        }}
                        disabled={isOut}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/15 disabled:bg-slate-200"
                      >
                        <ShoppingBag size={14} />
                        Adicionar ao Carrinho • R$ {selectedDetailProduct.price.toFixed(2)}
                      </button>
                      <button
                        onClick={() => setSelectedDetailProduct(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold px-4 rounded-xl text-xs transition"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
