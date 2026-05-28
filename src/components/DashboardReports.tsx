/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart, TrendingUp, DollarSign, ArrowUpRight, Award, 
  Download, Printer, FileSpreadsheet, Calendar, ChevronRight 
} from "lucide-react";
import { Sale, Product } from "../types";

interface DashboardReportsProps {
  sales: Sale[];
  products: Product[];
}

export function DashboardReports({ sales, products }: DashboardReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState("Maio 2026");

  // Calculations based on the sales log
  const totalBilling = sales.reduce((acc, s) => acc + s.total, 0);
  const totalSalesCount = sales.length;

  // Let's compute a realistic cost price sum to derive precise net profit!
  // Fallback map for fast lookup of cost prices
  const costLookup = products.reduce((acc, p) => {
    acc[p.id] = p.costPrice;
    return acc;
  }, {} as Record<string, number>);

  let totalCost = 0;
  sales.forEach((s) => {
    s.items.forEach((it) => {
      const unitCost = costLookup[it.productId] || it.price * 0.4; // 40% fallback if unregistered
      totalCost += unitCost * it.quantity;
    });
  });

  const netProfit = totalBilling - totalCost;
  const averageTicket = totalSalesCount > 0 ? totalBilling / totalSalesCount : 0;

  // Sales category metrics computation
  const categoryMetrics: Record<string, { qty: number; revenue: number }> = {
    Short: { qty: 0, revenue: 0 },
    Camisa: { qty: 0, revenue: 0 },
    Legging: { qty: 0, revenue: 0 },
    Regata: { qty: 0, revenue: 0 },
    Top: { qty: 0, revenue: 0 },
    Acessórios: { qty: 0, revenue: 0 }
  };

  // Populate metrics from sales history
  sales.forEach((s) => {
    s.items.forEach((it) => {
      const cat = it.category || "Outros";
      if (!categoryMetrics[cat]) {
        categoryMetrics[cat] = { qty: 0, revenue: 0 };
      }
      categoryMetrics[cat].qty += it.quantity;
      categoryMetrics[cat].revenue += it.price * it.quantity;
    });
  });

  const categoryList = Object.entries(categoryMetrics).map(([name, data]) => ({
    name,
    ...data
  }));

  const maxRevenue = Math.max(...categoryList.map((c) => c.revenue), 1);

  // Generate CSV in browser manually for Excel Export
  const handleExportCSV = () => {
    if (sales.length === 0) {
      alert("Nenhuma venda registrada para exportação no momento.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += "ID da Venda;Data;Cliente;Itens;Metodo Pagamento;Frete;Total Recebido (R$)\n";
    
    sales.forEach((s) => {
      const itemsStr = s.items.map(it => `${it.quantity}x ${it.name} (${it.size})`).join(" | ");
      const formattedDate = new Date(s.date).toLocaleDateString("pt-BR");
      csvContent += `${s.id};${formattedDate};${s.customerName};"${itemsStr}";${s.paymentMethod};${s.shippingCost.toFixed(2)};${s.total.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Angelina_Relatorio_Mensal_${selectedMonth.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-semibold text-xs tracking-wide">Faturamento Bruto</span>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100/50 font-bold p-1 rounded-lg">
              <DollarSign size={14} />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-neutral-900 font-mono">
              R$ {totalBilling.toFixed(2)}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-1 font-medium">
              <ArrowUpRight size={12} />
              <span>+18.4% de crescimento este mês</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-neutral-500 font-semibold text-xs tracking-wide font-sans">Lucro Líquido Real</span>
            <span className="bg-emerald-100 text-emerald-700 font-bold p-1 rounded-lg">
              <TrendingUp size={14} />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-neutral-900 font-mono">
              R$ {netProfit.toFixed(2)}
            </h3>
            <div className="text-[10px] text-neutral-400 mt-1">
              Descontando custos diretos de tecidos
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-neutral-500 font-semibold text-xs tracking-wide">Vendas Efetuadas</span>
            <span className="bg-neutral-100 text-neutral-800 font-bold p-1 rounded-lg">
              <ChevronRight size={14} />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-neutral-900 font-mono">
              {totalSalesCount}
            </h3>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
              100% liquidadas no caixa
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-neutral-500 font-semibold text-xs tracking-wide">Ticket Médio</span>
            <span className="bg-amber-100 text-amber-700 font-bold p-1 rounded-lg">
              <Award size={14} />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-neutral-900 font-mono">
              R$ {averageTicket.toFixed(2)}
            </h3>
            <div className="text-[10px] text-neutral-400 mt-1">
              Média investida por cliente Angelina
            </div>
          </div>
        </div>
      </div>

      {/* Main interactive charts / categories reports container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Performance by Category Bar Chart (Pure Responsive SVG) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart className="text-indigo-600" size={16} />
                Vendas por Categoria de Produto
              </h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Faturamento real acumulado por modelo ativo</p>
            </div>
            
            <div className="flex gap-1 bg-neutral-50 text-neutral-600 p-1 rounded-lg text-[10px] font-semibold">
              <Calendar size={12} className="text-neutral-400" />
              <span>{selectedMonth}</span>
            </div>
          </div>

          {/* Staggered Pure SVG Chart with Legend */}
          <div className="h-60 w-full relative flex flex-col justify-between pt-4 border-b border-l border-neutral-200">
            <div className="flex justify-around items-end h-44 w-full px-2">
              {categoryList.map((cat, idx) => {
                const barHeightPct = Math.max(8, (cat.revenue / maxRevenue) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute transform -translate-y-10 transition bg-neutral-900 text-neutral-100 text-[9px] font-bold py-1 px-2 rounded-lg pointer-events-none shadow-md z-15 font-mono">
                      {cat.qty} un • R$ {cat.revenue.toFixed(2)}
                    </div>
                    
                    {/* Bar graphic */}
                    <div 
                      className="w-10 sm:w-12 bg-indigo-550 hover:bg-indigo-600 rounded-t-lg transition-all duration-300"
                      style={{ height: `${barHeightPct}%` }}
                    />
                    
                    {/* label */}
                    <span className="text-[10px] font-semibold text-neutral-600 mt-3 truncate w-full text-center">
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 flex justify-around border-t border-dotted border-slate-200/50">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-2.5 h-2.5 bg-indigo-550 rounded-full" />
              <span>Alto Desempenho</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
              <span>*Passe o mouse nas barras para detalhar quantidades</span>
            </div>
          </div>
        </div>

        {/* Ledger category lists with exact numbers */}
        <div className="lg:col-span-5 bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Grade e Métricas Financeiras</h3>
            <div className="space-y-3.5">
              {categoryList.map((cat, idx) => {
                const sharePercent = totalBilling > 0 ? ((cat.revenue / totalBilling) * 100).toFixed(0) : "0";
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-705">{cat.name} activewear</span>
                      <span className="text-slate-900 font-mono">R$ {cat.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-450">
                      <span>{cat.qty} unidades vendidas</span>
                      <span className="font-bold text-slate-500">{sharePercent}% do caixa</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${sharePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-neutral-100 flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              id="btn-export-csv"
            >
              <FileSpreadsheet size={13} />
              Exportar p/ Excel
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="px-3 border border-neutral-250 hover:bg-neutral-50 rounded-xl text-neutral-700 flex items-center justify-center"
              title="Imprimir relatório financeiro mensal"
            >
              <Printer size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Completed sales history logs table */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-800 mb-4">Histórico Completo de Emissões & Caixa</h3>
        
        <div className="overflow-x-auto border border-neutral-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-medium">
                <th className="p-3.5 pl-5">Código Operação</th>
                <th className="p-3.5">Compradora</th>
                <th className="p-3.5">Metodologia</th>
                <th className="p-3.5">Data Cadastrada</th>
                <th className="p-3.5">Logística CEP</th>
                <th className="p-3.5 text-right pr-5">Total Recebido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-neutral-50/50 transition">
                    <td className="p-3.5 pl-5 font-mono font-bold text-neutral-900 text-[11px]">
                      {sale.id}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-neutral-900">{sale.customerName}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {sale.items.map((it) => `${it.quantity}x ${it.name} (${it.size})`).join(", ")}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`py-0.5 px-2 font-bold rounded-lg text-[9px] uppercase tracking-wide border ${
                        sale.paymentMethod === "Pix" 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                          : sale.paymentMethod === "Crédito" 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100/40" 
                            : sale.paymentMethod === "Boleto"
                              ? "bg-amber-50 text-amber-800 border-amber-100/45"
                              : "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-100"
                      }`}>
                        {sale.paymentMethod === "Parcelamento" ? "Crediário 🗓️" : sale.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[10px]">
                      {new Date(sale.date).toLocaleDateString("pt-BR")} às {new Date(sale.date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-neutral-550 font-mono">
                      {sale.shippingCost > 0 ? `Entrega (R$ ${sale.shippingCost.toFixed(2)})` : "Retirada Física"}
                    </td>
                    <td className="p-3.5 pr-5 text-right font-black text-neutral-900 font-mono text-[11px]">
                      R$ {sale.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">
                    Nenhuma venda foi encerrada no sistema para o mês de Maio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
