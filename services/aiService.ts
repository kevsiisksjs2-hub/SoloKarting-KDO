
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  // Get tactical advice from a virtual spotter using Gemini
  async getSpotterAdvice(pilotTimes: any, leaderTimes: any, sectorDetails: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `Actúa como un AI Spotter profesional de Karting. Piloto: ${JSON.stringify(pilotTimes)}, Líder: ${JSON.stringify(leaderTimes)}. Dame una instrucción táctica directa (max 50 palabras).`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (e) {
      return "Enlace de radio interrumpido.";
    }
  },

  // General chat interface for the assistant
  async chatMessage(history: any[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message
      });
      return response.text;
    } catch (e) {
      return "Error de procesamiento.";
    }
  },

  // Provide technical setup adjustments based on pilot feedback and track conditions
  async getTechnicalSetup(query: string, trackInfo: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `Eres un ingeniero de pista senior de karting. 
    Estado de pista: ${JSON.stringify(trackInfo)}. 
    Consulta del piloto: "${query}". 
    Proporciona un ajuste técnico preciso para chasis, carburación o presión de neumáticos. Máximo 100 palabras.`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
      });
      return response.text;
    } catch (e) {
      return "Falla en el enlace con ingeniería.";
    }
  },

  // Generate sponsorship pitches for pilots
  async generateSponsorshipPitch(pilotName: string, category: string, ranking: number, targetCompany: string, budget: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `Eres un experto en marketing deportivo. Redacta una propuesta de patrocinio (pitch) convincente.
    Piloto: ${pilotName}, Categoría: ${category}, Ranking Actual: ${ranking}º.
    Empresa objetivo: ${targetCompany}. Presupuesto solicitado: ${budget}.
    Resalta el retorno de inversión y la visibilidad de marca. Tono profesional y motivador.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (e) {
      throw e;
    }
  },

  // Provide maintenance advice based on engine usage hours
  async getMaintenanceAdvice(engineHours: number, category: string, lastService: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `Eres un mecánico de competición especialista en motores de karting ${category}.
    Horas de uso del motor: ${engineHours}.
    Último service: ${lastService}.
    Proporciona recomendaciones de mantenimiento preventivo y alertas de seguridad. Sé conciso.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (e) {
      return "Error al analizar ciclos de motor.";
    }
  }
};
