/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Copy, Check, Instagram, Video, Subtitles, HelpCircle, Flame, Image } from "lucide-react";
import { Product } from "../types";

interface MarketingPanelProps {
  products: Product[];
}

export function MarketingPanel({ products }: MarketingPanelProps) {
  const [selectedProductId, setSelectedProductId] = useState("");
  // Custom temporary fields
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Legging");
  const [color, setColor] = useState("Rosa Fúcsia");
  const [style, setStyle] = useState("Empoderado & Sofisticado");
  const [targetAudience, setTargetAudience] = useState("Mulheres focadas em alta performance e bem-estar");
  
  const [activeTab, setActiveTab] = useState<"slogans" | "stories" | "feed" | "video">("slogans");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Auto-fill form when product is selected from dropdown
  const handleProductSelection = (productId: string) => {
    setSelectedProductId(productId);
    if (!productId) {
      setCustomName("");
      return;
    }
    const found = products.find((p) => p.id === productId);
    if (found) {
      setCustomName(found.name);
      setCustomCategory(found.category);
      setColor(found.color);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setNotice(null);

    const productName = customName || "Peça Nova Angelina";

    try {
      const response = await fetch("/api/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category: customCategory,
          color,
          style,
          targetAudience,
          type: activeTab
        })
      });

      if (!response.ok) {
        throw new Error("Erro na conexão com o servidor. Verifique a API.");
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.text);
      } else {
        // Fallback simulated logic if API key isn't setup
        setNotice("Chave do Gemini pendente de configuração nos Secrets. Ativamos a Geração Inteligente Assistida:");
        setResult(getMockTemplate(activeTab, productName, customCategory, color, style, targetAudience));
      }
    } catch (err: any) {
      console.error(err);
      setNotice("Modo Offline Ativado (Não foi possível conectar ao servidor):");
      setResult(getMockTemplate(activeTab, productName, customCategory, color, style, targetAudience));
    } finally {
      setLoading(false);
    }
  };

  // Luxury Fallback generator for a seamless operator experience even offline
  const getMockTemplate = (
    type: string, name: string, category: string, colors: string, styleWord: string, target: string
  ): string => {
    const today = new Date().getFullYear();
    if (type === "slogans") {
      return `[SELO DE IA ANGELINA - ORGULHO FEMININO]

1. "Veste tua força. Sente tua leveza. Coleção Angelina activewear."
   • Propósito: Inspirar confiança corporal e liberdade de movimentos.

2. "Angelina: Alta tecnologia costurada sob medida para seu limite de treino na cor ${colors}."
   • Propósito: Focar na poliamida inteligente e caimento anatômico.

3. "O conforto que modela, o estilo que impulsiona. Sinta a diferença ${styleWord}."
   • Propósito: Destacar a fusão de estilo social chic e fitness de elite.

4. "Mais que vestuário, seu segundo escudo. Potencialize seu amanhã com Angelina ${category}."
   • Propósito: Criar senso de empoderamento e alta performance.

5. "Elegância que respira, modelagem que abraça. Conquiste a cidade e o treino."
   • Propósito: Foco na versatilidade urbana de uso diário.`;
    } else if (type === "stories") {
      return `🎬 ROTEIRO DE ENGANJAMENTO PARA INSTAGRAM STORIES (3 Quadros)
PRODUTO: ${name} • ESTILO: ${styleWord}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ STORY 1: O GANCHO VISUAL (Mistério & Atração)
• CENA: Vídeo macro curto em câmera lenta, mostrando a costura reforçada e textura luxuosa do tecido '${colors}' se esticando suavemente.
• TEXTO NA TELA: "Você sente a diferença quando o tecido abraça o seu corpo com sustentação premium? 🤫✨"
• INTERAÇÃO: Enquete deslizante com emoji de fogo 🔥 ou coração rosa.

✦ STORY 2: DEMONSTRAÇÃO PRÁTICA (Resolução de Dor)
• CENA: Modelo fazendo agachamento profundo, mostrando que a peça é 100% à prova de agachamentos (Zero Transparência).
• TEXTO NA TELA: "Nosso Queridinho: Costuras anatômicas inteligentes, cós duplo de compressão confortável e frescor absoluto. Conheça a ${category} Angelina."
• INTERAÇÃO: Caixinha de perguntas: "Qual tamanho veste seu estilo: P, M ou G?"

✦ STORY 3: CHAMADA DE AÇÃO (Escassez)
• CENA: Modelo rindo, pronta para o treino diário ou caminhada, com as peças combinadas.
• TEXTO NA TELA: "Poucas peças disponíveis no estoque da semana! Toque no link abaixo para receber catálogo completo com frete promocional na sua região. 🤍🛍️"
• INTERAÇÃO: Figurinha de Link de Compra / WhatsApp de suporte Angelina.`;
    } else if (type === "feed") {
      return `📝 LEGENDA FORMATADA PARA FEED DO INSTAGRAM
TEMA: Empoderamento e Atletas de Si Mesmas

A segurança para vencer qualquer desafio começa no que veste sua determinação. 💥

Apresentamos a nova ${name} (${category}) na icônica cor ${colors}. Pensada para acompanhar sua rotina intensa com sofisticação inside & outside das academias. 

💎 Alta Poliamida Inteligente: Toque macio, secagem ultra-rápida e elasticidade que acompanha cada centímetro da sua determinação. Nosso estilo ${styleWord} abraça suas curvas mantendo sustentação cirúrgica.

Porque treinar pesado não significa abrir mão da elegância que define sua essência. Seu corpo merece o abraço firme e a exclusividade Angelina activewear.

✨ Toque no link da nossa Bio para garantir a sua peça exclusiva ou fale com a Vanessa no Chat para sugestão de looks integrados no tamanho ideal!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#modafitness #mulheresquetreinam #angelinaActivewear #vestuariofitness #leggingzerotransparencia #fitnessdeluxo #shortsAngelina #focoEstilo #mulheresempoderadas`;
    } else {
      return `🎥 COMPROVAÇÃO DE CONCEITO - ROTEIRO REELS VIRAL (25 Segundos)
IDÉIA: "Da Reunião do Trabalho Direto para o Legday!"

• TRILHA SONORA SUGERIDA: Batida eletropop em alta, com cortes curtos sincronizados.
• FOCO: Mostrar a transição rápida provando a versatilidade absoluta da marca.

⏱️ CRONOGRAMA DE GRAVAÇÃO (Segundo a Segundo):
- 00s a 04s (GANCHO): A empresária aparece de blazer corporativo chic sentada com tablet, segurando um copo de café. Texto piscando rápido: "Ativa do office ao agachamento..."
- 04s a 10s (TRANSIÇÃO VORTEX): Ela joga o blazer em direção à câmera. Corte estalado e ela surge vestida com a ${name} (${colors}) por baixo com tênis descolado e as mãos na cintura em posição forte.
- 10s a 18s (PROVA DE QUALIDADE): Zoom aproximado na modelagem e na costura flexível enquanto ela faz um alongamento ou passada. Mostre o cós que mantém tudo no lugar de forma confortável.
- 18s a 25s (CHAMADA VENDAS): Ela sorri e aponta para baixo com uma sacola Angelina requintada de papel kraft. Texto: "Clique no Link e use CUPOM: ANGELINAFIT para 10% de desconto na primeira compra oficial!"

💡 DICA DE PRODUÇÃO: Mantenha iluminação clara de estúdio ou luz natural próxima à janela para que a nuance do tom ${colors} brilhe na gravação!`;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600 animate-pulse" size={20} />
            Módulo Angelina Marketing IA
          </h2>
          <p className="text-xs text-slate-500 mt-1">Conecte sua marca ao público feminino com copywriting refinado e planejamento do Instagram</p>
        </div>
        <div className="flex gap-1.5 items-center bg-indigo-50 text-indigo-700 text-xs py-1 px-3 rounded-full font-medium border border-indigo-100/50">
          <Flame size={14} />
          <span>Fórmula de Tráfego 2026 Ativa</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Helper Configuration sidebar */}
        <form onSubmit={executeGeneration} className="lg:col-span-5 space-y-4 bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex justify-between">
              <span>Selecione uma peça do Estoque:</span>
              <span className="text-[10px] text-neutral-400 font-normal">Auto-preenche campos</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelection(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Criar para Produto Novo --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category}) - {p.color}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Nome da Peça:</label>
            <input
              type="text"
              required
              placeholder="Ex: Legging Angelina Seamless"
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value);
                setSelectedProductId(""); // Reset selections
              }}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Categoria:</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Short">Short</option>
                <option value="Camisa">Camisa</option>
                <option value="Legging">Legging</option>
                <option value="Regata">Regata</option>
                <option value="Top">Top</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Variação de Cor:</label>
              <input
                type="text"
                placeholder="Ex: Rosa Neon, Preto Fosco"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full text-xs bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Estilo Principal (Tom de Voz):</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Empoderado & Sofisticado">Empoderado & Sofisticado (Premium)</option>
              <option value="Atleta Resistente e Hardcore">Atleta Resistente (Musculação)</option>
              <option value="Zen, Leve e Minimalista">Zen, Leve e Equilibrado (Yoga/Pilates)</option>
              <option value="Jovem, Viral & Colorido">Jovem e TikToker (Tendências)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Público-Alvo Específico:</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-xs bg-white border border-neutral-200 rounded-xl p-2.5 text-neutral-700 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:bg-neutral-300"
            id="btn-ai-generate-marketing"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                IA está formatando Copy...
              </span>
            ) : (
              <>
                <Sparkles size={14} />
                Gerar Conteúdo com IA
              </>
            )}
          </button>
        </form>

        {/* Output Screen */}
        <div className="lg:col-span-7 flex flex-col h-full border border-slate-100 rounded-2xl overflow-hidden min-h-[460px]">
          {/* Format Selection Tab bar */}
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1 gap-1">
            <button
              onClick={() => {
                setActiveTab("slogans");
                setResult("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "slogans" 
                  ? "bg-white text-indigo-600 shadow-xs border border-indigo-100/50" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              type="button"
            >
              <Subtitles size={13} />
              Slogans
            </button>
            <button
              onClick={() => {
                setActiveTab("stories");
                setResult("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "stories" 
                  ? "bg-white text-indigo-600 shadow-xs border border-indigo-100/50" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              type="button"
            >
              <Image size={13} />
              Stories
            </button>
            <button
              onClick={() => {
                setActiveTab("feed");
                setResult("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "feed" 
                  ? "bg-white text-indigo-600 shadow-xs border border-indigo-100/50" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              type="button"
            >
              <Instagram size={13} />
              Feed IG
            </button>
            <button
              onClick={() => {
                setActiveTab("video");
                setResult("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "video" 
                  ? "bg-white text-indigo-600 shadow-xs border border-indigo-100/50" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              type="button"
            >
              <Video size={13} />
              Roteiro Vídeo
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between bg-neutral-900 text-neutral-100 font-sans relative">
            {loading ? (
              <div className="absolute inset-0 bg-neutral-900/90 flex flex-col justify-center items-center p-8 text-center gap-4 z-10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-indigo-550 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-indigo-550 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-indigo-550 rounded-full animate-bounce"></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-400">Vanessa AI está escrevendo</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                    Pesquisando gatilhos de compra, unindo a essência Angelina aos tecidos tecnológicos de última geração...
                  </p>
                </div>
              </div>
            ) : null}

            {result ? (
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  {notice && (
                    <div className="text-[10px] text-amber-400 bg-amber-950/40 p-2 rounded-lg border border-amber-900/40 mb-3 flex items-center gap-1.5">
                      <HelpCircle size={12} className="shrink-0" />
                      <span>{notice}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line text-xs leading-relaxed text-zinc-300 font-mono overflow-y-auto max-h-[340px] pr-2">
                    {result}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-mono">Formato: {activeTab.toUpperCase()} • Copy Pronta</span>
                  
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all"
                    type="button"
                    title="Copiar texto"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copiar Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Instagram size={40} className="text-neutral-800 mb-3" />
                <h4 className="text-xs font-semibold text-neutral-400">Pronto para criar campanhas</h4>
                <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">
                  Preencha os detalhes à esquerda e clique em "Gerar Conteúdo" para pedir sugestões sob medida de divulgação para a Angelina.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
