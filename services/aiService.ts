
import { GoogleGenAI } from "@google/genai";

// Fixed: Added missing methods for technical advice, sponsorship pitch, and maintenance analysis.
// Fixed: Implemented chatMessage to handle history as used in AIChatBot and Resultados.
// Fixed: Updated getSpotterAdvice to accept additional context parameters to resolve argument count mismatch.
export const aiService = {
  // Common method for single-turn text generation
  async chat(message: string) {
    // Initializing with the required named parameter and using process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message
      });
      // Directly accessing the .text property of the response object as per guidelines.
      return response.text;
    } catch (e) {
      console.error("AI Error:", e);
      return "Enlace de radio interrumpido.";
    }
  },

  // Fix for: Property 'chatMessage' does not exist on type aiService
  // Used in AIChatBot.tsx and Resultados.tsx to support history-based conversations.
  async chatMessage(history: any[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      // Formats the history and new message into the correct Content structure.
      const contents = [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents
      });
      return response.text;
    } catch (e) {
      console.error("AI Error:", e);
      return "Error en el enlace de datos IA.";
    }
  },

  // Fix for: Expected 2 arguments, but got 3 in LiveCenter.tsx. 
  // Added trackContext to support richer spotter instructions.
  async getSpotterAdvice(pilotTimes: any, leaderTimes: any, trackContext?: any) {
    const prompt = `Actúa como un Spotter de Karting profesional. 
    Piloto: ${JSON.stringify(pilotTimes)}, 
    Líder: ${JSON.stringify(leaderTimes)}, 
    Contexto de pista: ${JSON.stringify(trackContext)}. 
    Dame una instrucción táctica directa (max 40 palabras).`;
    return this.chat(prompt);
  },

  // Fix for: Property 'getTechnicalSetup' does not exist on type aiService
  // Used in Telemetria.tsx to provide engineering advice based on track conditions.
  async getTechnicalSetup(query: string, trackInfo: any) {
    const prompt = `Como ingeniero de pista de karting, analiza la siguiente duda: "${query}". 
    Info ambiental y de pista: ${JSON.stringify(trackInfo)}. 
    Proporciona ajustes técnicos recomendados para mejorar el rendimiento del chasis o motor.`;
    return this.chat(prompt);
  },

  // Fix for: Property 'generateSponsorshipPitch' does not exist on type aiService
  // Used in Patrocinios.tsx to create professional sponsorship proposals.
  async generateSponsorshipPitch(name: string, category: string, ranking: number, company: string, budget: string) {
    const prompt = `Genera una propuesta de patrocinio profesional y persuasiva para el piloto ${name} (Categoría: ${category}, Ranking: ${ranking}). 
    Empresa objetivo: ${company}. 
    Presupuesto solicitado: ${budget}. 
    Enfócate en los beneficios de marca, visibilidad y la pasión del deporte para cerrar el trato.`;
    return this.chat(prompt);
  },

  // Fix for: Property 'getMaintenanceAdvice' does not exist on type aiService
  // Used in Logbook.tsx to analyze engine health and provide safety warnings.
  async getMaintenanceAdvice(hours: number, category: string, service: string) {
    const prompt = `Evalúa el mantenimiento técnico para un motor de kart en la categoría ${category}. 
    Horas actuales de uso: ${hours}. 
    Último servicio realizado: ${service}. 
    Proporciona recomendaciones de seguridad basadas en el desgaste típico y alerta sobre piezas que requieran revisión inmediata.`;
    return this.chat(prompt);
  }
};
