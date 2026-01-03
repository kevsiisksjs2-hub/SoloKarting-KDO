
// Fix: Use correct import for GoogleGenAI
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  /**
   * Basic chat functionality using Gemini 3 Flash.
   */
  async chat(message: string) {
    // Fix: Initialize with process.env.API_KEY in the correct format
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message
      });
      return response.text;
    } catch (e) {
      console.error("AI Error:", e);
      return "Enlace de radio interrumpido.";
    }
  },

  /**
   * Fix: Added chatMessage method to handle conversations with history.
   * Used in AIChatBot and Resultados analysis.
   */
  async chatMessage(history: any[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: message }] }]
      });
      return response.text;
    } catch (e) {
      console.error("AI Chat Error:", e);
      return "Falla en el sistema de comunicación central.";
    }
  },

  /**
   * Fix: Updated getSpotterAdvice to accept context and return a professional instruction.
   */
  async getSpotterAdvice(pilotTimes: any, leaderTimes: any, context?: any) {
    const prompt = `Actúa como un Spotter de Karting en tiempo real. 
    Contexto de Pista: ${context ? JSON.stringify(context) : 'Carrera activa'}.
    Datos de Telemetría del Piloto: ${JSON.stringify(pilotTimes)}. 
    Datos del Líder: ${JSON.stringify(leaderTimes)}. 
    Dame una instrucción táctica directa, corta y profesional para mejorar el tiempo o defender posición (máximo 30 palabras).`;
    return this.chat(prompt);
  },

  /**
   * Fix: Added missing getTechnicalSetup method for Telemetria page.
   */
  async getTechnicalSetup(query: string, trackInfo: any) {
    const prompt = `Actúa como un Ingeniero de Pista experto en Karting. 
    Estado de Pista: ${JSON.stringify(trackInfo)}.
    Problema/Consulta del piloto: "${query}".
    Proporciona un ajuste técnico específico (carburación, chasis, presiones) para resolver el problema. Sé conciso y profesional. Máximo 60 palabras.`;
    return this.chat(prompt);
  },

  /**
   * Fix: Added missing generateSponsorshipPitch method for Patrocinios page.
   */
  async generateSponsorshipPitch(name: string, category: string, ranking: number, company: string, budget: string) {
    const prompt = `Genera una propuesta de patrocinio profesional y persuasiva para un piloto de karting.
    Piloto: ${name}.
    Categoría: ${category}.
    Ranking Actual: ${ranking}°.
    Empresa Objetivo: ${company}.
    Presupuesto Solicitado: ${budget}.
    La propuesta debe resaltar el retorno de inversión, la visibilidad de marca en el sistema RMS y los valores deportivos. Máximo 150 palabras.`;
    return this.chat(prompt);
  },

  /**
   * Fix: Added missing getMaintenanceAdvice method for Logbook page.
   */
  async getMaintenanceAdvice(hours: number, category: string, lastService: string) {
    const prompt = `Actúa como un Mecánico Jefe de Karting de alta competición. 
    Categoría: ${category}.
    Horas actuales de uso del motor: ${hours}.
    Última intervención: "${lastService}".
    Basado en las horas de uso, indica si es necesario realizar mantenimiento preventivo inmediato y qué componentes revisar (aros, biela, pistón, etc.). Máximo 50 palabras.`;
    return this.chat(prompt);
  }
};
