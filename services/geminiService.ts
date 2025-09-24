
import type { Applicant, GeminiAnalysis } from '../types';
import { LoanStatus } from '../types';

// This is a mock service. In a real application, this would use the @google/genai SDK
// to call the Gemini API. The API key would be handled securely on the backend.

export const analyzeApplication = (applicant: Applicant): Promise<GeminiAnalysis> => {
  console.log('Simulating Gemini API call for applicant:', applicant.id);

  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate potential API failure
      if (applicant.id === 'APP-005') { // Chinedu Eze with rejected status
        reject(new Error('Simulated API Error: Invalid application data.'));
        return;
      }

      // Generate a mock analysis based on applicant data
      const mockAnalysis = generateMockAnalysis(applicant);
      resolve(mockAnalysis);

    }, 1500 + Math.random() * 1000); // random delay between 1.5 and 2.5 seconds
  });
};


const generateMockAnalysis = (applicant: Applicant): GeminiAnalysis => {
    let summary = `This is a loan application from ${applicant.businessName}, a business in the ${applicant.sector} sector, requesting ₦${applicant.loanAmount.toLocaleString()}. `;
    summary += `The stated purpose is for "${applicant.loanPurpose}". The business is described as: "${applicant.businessDescription}".`;

    const strengths: string[] = [];
    const risks: string[] = [];
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    
    // Logic to generate strengths/risks based on data
    if (applicant.documents.length > 1) {
        strengths.push("Sufficient documentation provided (e.g., Business Plan, ID).");
    } else {
        risks.push("Limited documentation submitted.");
    }

    if (applicant.sector === 'Technology' || applicant.sector === 'Manufacturing') {
        strengths.push(`High-growth potential sector (${applicant.sector}).`);
    }

    if (applicant.loanAmount > 1000000) {
        risks.push("High loan amount requires careful financial review.");
        riskLevel = 'Medium';
    } else {
        strengths.push("Moderate loan amount presents lower financial exposure.");
    }
    
    if (applicant.status === LoanStatus.Repaid) {
        strengths.push("Positive repayment history with a previous loan.");
        riskLevel = 'Low';
    }

    if (!applicant.businessDescription || applicant.businessDescription.length < 50) {
        risks.push("Business description is brief and lacks detail.");
    }
    
    if (risks.length >= 2) {
        riskLevel = 'High';
    } else if (risks.length === 1 && strengths.length < 2) {
        riskLevel = 'Medium';
    } else if (strengths.length >= 2 && risks.length === 0) {
        riskLevel = 'Low';
    }


    return {
        summary,
        strengths,
        risks,
        riskLevel,
    };
};
