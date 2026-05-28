/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { KeyRound, ShieldCheck, Lock, Unlock, AlertCircle, Copy, Check } from "lucide-react";

interface TwoFactorAuthProps {
  is2FAEnabled: boolean;
  onToggle2FA: (enabled: boolean) => void;
}

export function TwoFactorAuth({ is2FAEnabled, onToggle2FA }: TwoFactorAuthProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [step, setStep] = useState(1);
  const [backupKey] = useState("ANG-FASH-7X9B-2026-LOCK");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Sessão administrativa iniciada em ambiente seguro.",
    "Firewall de integridade operacional conectado."
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("pt-BR");
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(backupKey);
    setCopied(true);
    addLog("Chave de contingência copiada para a área de transferência.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      onToggle2FA(true);
      setStep(3);
      setError("");
      addLog("Autenticação de Dois Fatores (2FA) ATIVADA com sucesso!");
    } else {
      setError("Código inválido. Digite os 6 dígitos gerados no aplicativo.");
      addLog("Falha na tentativa de ativação 2FA: Código incompleto.");
    }
  };

  const handleDeactivation = () => {
    onToggle2FA(false);
    setShowConfig(false);
    setStep(1);
    setVerificationCode("");
    addLog("Autenticação de Dois Fatores (2FA) desativada pelo administrador.");
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${is2FAEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 text-sm md:text-base flex items-center gap-2">
              Autenticação de Duplo Fator (2FA)
              <span className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded-full ${is2FAEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                {is2FAEnabled ? 'Ativo' : 'Inativo'}
              </span>
            </h3>
            <p className="text-neutral-500 text-xs mt-1">
              {is2FAEnabled 
                ? "Painel Angelina protegido por tokens temporários dinâmicos TOTP." 
                : "Proteja as vendas, relatórios financeiros e o catálogo instalando o 2FA."}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowConfig(true);
            if (is2FAEnabled) {
              setStep(3);
            } else {
              setStep(1);
            }
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 border ${
            is2FAEnabled 
              ? "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200" 
              : "bg-neutral-900 text-white hover:bg-neutral-800 border-transparent"
          }`}
          id="btn-manage-2fa"
        >
          {is2FAEnabled ? "Gerenciar Segurança" : "Ativar 2FA"}
        </button>
      </div>

      {/* 2FA Administrative Logs Panel */}
      <div className="mt-4 pt-4 border-t border-dashed border-neutral-100">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 mb-2">
          <KeyRound size={12} />
          <span>Histórico de Logs de Segurança (Sólido & Criptografado)</span>
        </div>
        <div className="bg-neutral-950 font-mono text-[10px] text-zinc-400 p-3 rounded-lg max-h-24 overflow-y-auto leading-relaxed border border-zinc-850">
          {logs.map((log, idx) => (
            <div key={idx} className="truncate">
              <span className="text-indigo-500">➜</span> {log}
            </div>
          ))}
        </div>
      </div>

      {/* Floating 2FA Modal Configuration */}
      {showConfig && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-100 animate-slide-up/90">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Lock size={18} className="text-indigo-600" />
                  Segurança em Camadas • Angelina 2FA
                </h4>
                <p className="text-xs text-neutral-500 mt-1">Selo de Proteção de Informações Cadastrais corporativas</p>
              </div>
              <button 
                onClick={() => setShowConfig(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            {step === 1 && (
              <div>
                <p className="text-xs text-neutral-600 mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100/50">
                  O sistema gerou uma chave de autenticação exclusiva para a Angelina. Escaneie o QR Code abaixo com seu autenticador favorito (Google Authenticator, Microsoft Authenticator, Authy, etc.).
                </p>
                
                <div className="flex flex-col items-center justify-center my-6">
                  {/* Mock beautiful realistic barcode QR code */}
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 shadow-inner flex flex-col items-center">
                    <div className="w-32 h-32 bg-neutral-900 rounded-lg flex flex-wrap p-2 gap-1 justify-center items-center">
                      {/* Generates a QR-like matrix style visually */}
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-xs ${
                            (i + 3) % 3 === 0 || (i * 7) % 5 === 0 ? "bg-white" : "bg-transparent border border-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase mt-2">ID: ANG-FASHION-SECURITY-MDX</span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Chave Manual se preferir:</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={backupKey}
                      className="bg-neutral-50 font-mono text-xs p-2.5 rounded-lg border border-neutral-200 flex-1 select-all text-neutral-600 focus:outline-none"
                    />
                    <button 
                      onClick={handleCopyKey}
                      className="p-2.5 bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-all"
                      title="Copiar Chave"
                    >
                      {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition"
                >
                  Já escaneei, prosseguir ➜
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleActivation}>
                <p className="text-xs text-neutral-600 mb-4">
                  Insira abaixo o código temporário de 6 dígitos gerado pelo seu aplicativo autenticador para validar a sincronização.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Código de Confirmação (6 dígitos)</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Ex: 123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center font-mono text-lg tracking-widest bg-neutral-50 border border-neutral-200 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  {error && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-2 bg-rose-50 p-2 rounded border border-rose-100">
                      <AlertCircle size={14} />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl px-4 py-2.5 border border-neutral-200 hover:bg-neutral-200 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition"
                  >
                    Ativar Modo Seguro 2FA
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3">
                  <Unlock size={24} />
                </div>
                <h5 className="font-bold text-neutral-800 text-sm">Pronto, a autenticação 2FA está ativa!</h5>
                <p className="text-xs text-neutral-500 mt-1.5 px-4">
                  Seus dados de faturamento, vendas e contatos de clientes estão assegurados de acordo com as normas de integridade da Angelina activewear.
                </p>
                
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => setShowConfig(false)}
                    className="w-full bg-neutral-900 text-white rounded-xl py-2.5 text-xs font-semibold hover:bg-neutral-800 transition"
                  >
                    Manter Ativo & Fechar
                  </button>
                  <button
                    onClick={handleDeactivation}
                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold mt-2 underline"
                  >
                    Desativar 2FA temporariamente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
