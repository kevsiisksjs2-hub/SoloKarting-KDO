
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  // Inicialización de la instancia de IA para cada llamada para asegurar el uso de la clave más reciente
  async chat(message: string) {
    // Correct initialization: always use new GoogleGenAI({ apiKey: process.env.API_KEY });
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message
      });
      // Extracting text output: use response.text property directly.
      return response.text || "Enlace de radio interrumpido.";
    } catch (e) {
      console.error("AI Error:", e);
      return "Error en la telemetría de IA.";
    }
  },

  async chatMessage(history: any[], message: string) {
    // Correct initialization: always use new GoogleGenAI({ apiKey: process.env.API_KEY });
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const formattedHistory = history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: Array.isArray(h.parts) ? h.parts : [{ text: h.text || '' }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...formattedHistory,
          { role: 'user', parts: [{ text: message }] }
        ]
      });
      // Extracting text output: use response.text property directly.
      return response.text || "Sin respuesta del sistema.";
    } catch (e) {
      console.error("AI Error:", e);
      return "Error en el enlace de datos IA.";
    }
  },

  async getSpotterAdvice(pilotTimes: any, leaderTimes: any, trackContext?: any) {
    const prompt = `Actúa como un Spotter de Karting profesional. 
    Piloto: ${JSON.stringify(pilotTimes)}, 
    Líder: ${JSON.stringify(leaderTimes)}, 
    Contexto: ${JSON.stringify(trackContext)}. 
    Dame una instrucción táctica directa de máximo 30 palabras.`;
    return this.chat(prompt);
  },

  async getTechnicalSetup(query: string, trackInfo: any) {
    const prompt = `Eres un ingeniero de pista. Analiza: "${query}". 
    Pista: ${JSON.stringify(trackInfo)}. 
    Proporciona 3 ajustes técnicos clave para karting en tierra.`;
    return this.chat(prompt);
  },

  async generateSponsorshipPitch(name: string, category: string, ranking: number, company: string, budget: string) {
    const prompt = `Genera una propuesta de patrocinio profesional para el piloto ${name} (Cat: ${category}, Rank: ${ranking}). 
    Empresa: ${company}. Presupuesto: ${budget}. Enfócate en el ROI y visibilidad en Solo Karting.`;
    return this.chat(prompt);
  },

  async getMaintenanceAdvice(hours: number, category: string, service: string) {
    const prompt = `Analiza mantenimiento de motor para ${category}. Horas: ${hours}. Último service: ${service}. Alerta sobre componentes críticos.`;
    return this.chat(prompt);
  }
};
