import { GoogleGenAI, Type } from "@google/genai";
import type { Applicant, GeminiAnalysis } from '../types';

// The API key is obtained exclusively from the pre-configured environment variable.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This check prevents the app from running without a key, providing a clear error.
  throw new Error("process.env.API_KEY is not set. Please add it to your environment configuration.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief one-paragraph summary of the loan application, including business name, sector, loan amount, and purpose.",
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 key strengths of the application. For example, a solid business plan, a high-growth sector, or previous successful loans.",
        },
        risks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 potential risks or concerns. For example, a lack of detailed financial projections, a highly competitive market, or a large loan amount relative to the business description.",
        },
        riskLevel: {
            type: Type.STRING,
            enum: ['Low', 'Medium', 'High'],
            description: "An overall assessment of the risk level, categorized as 'Low', 'Medium', or 'High'."
        },
    },
    required: ["summary", "strengths", "risks", "riskLevel"]
};


export const analyzeApplication = async (applicant: Applicant): Promise<GeminiAnalysis> => {
  console.log('Calling Gemini API for applicant:', applicant.id);

  const prompt = `
    Analyze the following small business loan application from Nwangele LGA, Imo State, Nigeria, and provide a risk assessment.
    
    Applicant Name: ${applicant.name}
    Business Name: ${applicant.businessName}
    Business Sector: ${applicant.sector}
    Loan Amount Requested: ₦${applicant.loanAmount.toLocaleString()}
    Stated Purpose of Loan: "${applicant.loanPurpose}"
    Business Description: "${applicant.businessDescription}"
    Number of documents submitted: ${applicant.documents.length}

    Based on this information, evaluate the application's strengths and potential risks from the perspective of a local government loan officer. Consider the local economic context. Provide a concise summary and assign an overall risk level.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Validate the parsed JSON against the expected structure for robustness.
    if (
        typeof parsedJson.summary === 'string' &&
        Array.isArray(parsedJson.strengths) &&
        Array.isArray(parsedJson.risks) &&
        ['Low', 'Medium', 'High'].includes(parsedJson.riskLevel)
    ) {
        return parsedJson as GeminiAnalysis;
    } else {
        console.error("Gemini response did not match the expected schema:", parsedJson);
        throw new Error("Received an invalid analysis format from the AI.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide more user-friendly error messages for common issues.
    if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
        throw new Error("The provided API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to get analysis from the AI service. Please try again later.");
  }
};
