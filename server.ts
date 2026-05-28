import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Route for AI-powered activewear marketing generation
app.post("/api/marketing/generate", async (req: express.Request, res: express.Response) => {
  try {
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        error: "Confirmação de chave de API pendente. Configure a GEMINI_API_KEY no painel de Secrets para ativar a IA em tempo real."
      });
    }

    const { productName, category, color, style, targetAudience, type } = req.body;

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "slogans") {
      systemPrompt = "Você é um copywriter de renome internacional especialista em moda fitness feminina e marca esportiva premium Angelina. Crie slogans inspiradores e de alto impacto.";
      userPrompt = `Crie 5 slogans potentes para a peça "${productName}" (${category}) na cor ${color || "padrão"}, com estilo ${style || "moderno"} e voltado para o público: ${targetAudience || "Geral"}. Forneça opções que exalem confiança, força, conforto e elegância.`;
    } else if (type === "stories") {
      systemPrompt = "Você é um especialista em engajamento de redes sociais para marcas de vestuário fitness de luxo. Planeje narrativas efêmeras envolventes.";
      userPrompt = `Crie um roteiro de 3 Stories do Instagram para promover: "${productName}" (${category}). Cor: ${color || 'vibrante'}. Estilo: ${style}. Público-alvo: ${targetAudience}. Cada story deve incluir:
1) O que mostrar visualmente (cena)
2) Texto de sobreposição na tela (estimulando leitura rápida)
3) Sugestão de caixinha de pergunta, enquete ou link de ação interativo para engajamento.`;
    } else if (type === "feed") {
      systemPrompt = "Você é um estrategista de conteúdo focado no Instagram Feed e Pinterest de moda fitness feminina.";
      userPrompt = `Escreva uma legenda completa para o Feed do Instagram promovendo a peça "${productName}" (${category}). Cor: ${color}. Estilo: ${style}. Público: ${targetAudience}. A legenda deve conter:
- Conexão e gancho inicial emocionante sobre treino e estilo próprio
- Benefícios específicos da peça (elasticidade, conforto, toque gelado, zero transparência)
- Chamada para ação clara (CTA) direcionando para o site ou link da bio
- Bloco organizado de 8 hashtags poderosas no nicho de moda fitness, musculação feminina e activewear de luxo.`;
    } else if (type === "video") {
      systemPrompt = "Você é um diretor de vídeos curtos do Instagram Reels e TikTok focado em vendas virais de moda.";
      userPrompt = `Crie uma ideia inovadora de roteiro para vídeo curto (Reels/TikTok) de 15 a 30 segundos sobre: "${productName}" (${category}).
- Tema do vídeo: Desafio de transição de look, detalhes de tecido ou treino prático.
- Roteiro estruturado por segundos (0s-5s gancho, 5s-15s conteúdo, 15s-30s oferta e chamada para ação).
- Sugestão de áudio em alta (estilo de música) e instruções de câmera/edição para transmitir modernidade e dinamismo.`;
    } else {
      systemPrompt = "Você é um assistente de marketing criativo para a Angelina Moda Fitness.";
      userPrompt = `Gere insights criativos para promover: "${productName}" (${category}), cor ${color}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt + " Escreva em português brasileiro de forma inspiradora, empoderada e persuasiva.",
        temperature: 0.8
      }
    });

    res.json({
      success: true,
      text: response.text
    });
  } catch (error: any) {
    console.error("Error generating marketing content:", error);
    res.status(500).json({ success: false, error: error.message || "Erro interno do servidor ao gerar marketing." });
  }
});

// API Route for Virtual Stylist & Support assistant
app.post("/api/chat/support", async (req: express.Request, res: express.Response) => {
  try {
    if (!apiKey) {
      return res.status(200).json({
        text: "Olá! Sou Vanessa, a Estilista e Assistente Virtual da Angelina Moda Fitness. No momento, o sistema está configurado localmente sem uma chave ativa de API do Gemini para respostas cognitivas, mas estou pronta para guiar você sobre tecidos premium como Poliamida de alta compressão (bloqueio de raios UV) e Suplex ultra macio, ou ajudá-la(o) com as suas vendas!"
      });
    }

    const { history, message } = req.body;
    
    // Construct search query layout satisfying safety
    const contents = [...(history || []), { role: "user", parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "Você é Vanessa, a estilista e assistente virtual inteligente da Angelina Moda Fitness (fundada em 2026). Você ajuda tanto o gerente (operador do sistema) quanto eventuais clientes. Dê ideias incríveis de combinações de look, explique as vantagens físicas de tecidos tecnológicos (poliamida 6.6, controle de odor, zero transparência, respirabilidade inteligente), dê dicas de atendimento caloroso e fidelização, e ofereça soluções rápidas com energia positiva, espírito empoderado e sofisticação."
      }
    });

    res.json({
      text: response.text
    });
  } catch (error: any) {
    console.error("Error in support chat:", error);
    res.status(500).json({ error: error.message || "Erro no processamento do chat." });
  }
});

// Vite server integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Angelina Server] running on http://localhost:${PORT}`);
  });
}

startServer();
