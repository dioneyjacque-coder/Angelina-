/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, RefreshCw, HelpCircle } from "lucide-react";
import { SupportMessage } from "../types";

export function VanessaChat() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "msg-1",
      sender: "model",
      text: "Olá! Sou Vanessa, a Consultora de Estilo e Estilista com Inteligência Artificial da Angelina activewear. ✨\n\nComo posso ajudar você hoje? Posso sugerir combinações de looks incríveis, explicar os detalhes tecnológicos de nossos tecidos premium (como nossa poliamida 6.6 biodegradável e proteção UV50+), ou guiar você no uso de nosso sistema!",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg = inputText.trim();
    setInputText("");
    
    // Add User Message
    const userMessageObj: SupportMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: userMsg,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
    
    setMessages((prev) => [...prev, userMessageObj]);
    setLoading(true);

    try {
      // Map message log to Gemini chat contents history { role: "user" | "model", parts: [{ text: string }] }
      const formattedHistory = messages.map((msg) => ({
        role: msg.sender,
        parts: [{ text: msg.text }]
      }));

      const res = await fetch("/api/chat/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: formattedHistory,
          message: userMsg
        })
      });

      if (!res.ok) {
        throw new Error("Conexão falhou");
      }

      const data = await res.json();
      
      const modelMessageObj: SupportMessage = {
        id: `msg-${Date.now()}-model`,
        sender: "model",
        text: data.text || "Desculpe, tive um contratempo de conexão cognitiva. Como posso te auxiliar adicionalmente?",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
      
      setMessages((prev) => [...prev, modelMessageObj]);
    } catch (err) {
      console.error("Chat error:", err);
      // Simulated elegant offline response
      const offlineMsg = `[Sintonia Local - Modo Auxiliar]
Obrigada por perguntar! Para looks de alto impacto físico e estético, nossa recomendação é combinar nossas Leggings Sculpt Seamless com o Top Angelina Hyper Compression de bojo removível. 

Essa harmonia proporciona compressão estratégica no abdômen sem prender os movimentos do quadril e costas, otimizando os treinos pesados ou sessões de cardio intenso. 

Sobre nossos tecidos: Usamos exclusivamente fibras virgens de poliamida com fios elastoméricos importados, garantindo toque sedoso frio ao contato com a pele, secagem rápida e proteção UV solar garantida.`;

      const backupMessageObj: SupportMessage = {
        id: `msg-${Date.now()}-model`,
        sender: "model",
        text: offlineMsg,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
      
      setMessages((prev) => [...prev, backupMessageObj]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const activeSuggests = [
    "Qual look ideal para treinos pesados de perna?",
    "Quais as vantagens da Poliamida em relação ao Poliéster?",
    "Como cadastrar um novo produto no sistema Angelina?"
  ];

  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm flex flex-col h-[520px]">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60 mb-4 font-sans">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-indigo-600 animate-pulse" size={18} />
            Suporte em Tempo Real • Estilista Virtual Vanessa IA
          </h2>
          <p className="text-[10px] text-neutral-400 mt-0.5">Dicas de moda, combinações e explicações detalhadas de tecidos fitness</p>
        </div>
        <button
          onClick={() => {
            if (confirm("Deseja redefinir o histórico da conversa?")) {
              setMessages([
                {
                  id: "msg-init",
                  sender: "model",
                  text: "Conversa reiniciada. Qual look ativo ou inovação tecnológica de activewear conversaremos agora? ✨",
                  timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                }
              ]);
            }
          }}
          className="text-neutral-400 hover:text-neutral-600 text-[10px] flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border hover:bg-neutral-100 transition-all font-semibold"
          title="Limpar Conversa"
        >
          <RefreshCw size={10} />
          Reiniciar Chat
        </button>
      </div>

      {/* Messages layout */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3.5 pr-1 text-xs">
        {messages.map((msg) => {
          const isModel = msg.sender === "model";
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 max-w-[85%] ${isModel ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${isModel ? "bg-indigo-50 text-indigo-600 border border-indigo-100/50" : "bg-slate-100 text-slate-600"}`}>
                {isModel ? <Sparkles size={14} /> : <User size={14} />}
              </div>
              
              <div className={`rounded-2xl p-3.5 shadow-xs leading-relaxed ${
                isModel 
                   ? "bg-slate-50 text-slate-800 border border-slate-100 whitespace-pre-wrap font-sans" 
                   : "bg-indigo-600 text-white font-medium whitespace-pre-wrap font-sans"
              }`}>
                {msg.text}
                <span className={`block text-[8px] mt-1.5 text-right ${isModel ? "text-slate-400" : "text-indigo-200"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl animate-pulse border border-indigo-100/50">
              <Sparkles size={14} />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions questions buttons */}
      <div className="my-2 flex flex-wrap gap-1.5">
        {activeSuggests.map((s, i) => (
          <button
            key={i}
            onClick={() => handleQuickQuestion(s)}
            className="text-[10px] bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 py-1.5 px-3 rounded-lg border border-neutral-150 transition font-medium"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Inputs box */}
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 pt-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua dúvida de looks ativo, fiação têxtil ou operacional..."
          className="flex-1 text-xs bg-slate-55 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          id="chat-input-text"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all shadow-sm disabled:bg-neutral-200 flex items-center justify-center shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
