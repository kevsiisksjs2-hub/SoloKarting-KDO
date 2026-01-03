
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  // Inicialización directa según especificaciones de la guía
  async chat(message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: message }] }]
      });
      return response.text || "Enlace de radio interrumpido.";
    } catch (e) {
      console.error("AI Error:", e);
      return "Error en la telemetría de IA.";
    }
  },

  async chatMessage(history: any[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      // Ajuste de formato para historial
      const contents = history.map(h => ({
        role: h.role,
        parts: h.parts || [{ text: h.text }]
      }));
      
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents
      });
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
