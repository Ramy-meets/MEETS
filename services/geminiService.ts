
import { GoogleGenAI, Type } from "@google/genai";
import { Grade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeGrades(grades: Grade[], studentName: string): Promise<string> {
    if (grades.length === 0) return "لا توجد درجات كافية للتحليل.";

    const prompt = `
      بناءً على درجات الطالب ${studentName} التالية:
      ${grades.map(g => `- المادة: ${g.subject}, الدرجة: ${g.score}/${g.maxScore}`).join('\n')}
      
      قم بتقديم تحليل موجز باللغة العربية يتضمن:
      1. نقاط القوة.
      2. المواد التي تحتاج تحسين.
      3. نصيحة دراسية واحدة محددة.
      اجعل الرد مشجعاً ومهنياً.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "لم يتمكن الذكاء الاصطناعي من توليد تحليل حالياً.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "حدث خطأ أثناء محاولة تحليل الدرجات بالذكاء الاصطناعي.";
    }
  }
};
