import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

let gemini: GoogleGenerativeAI | null = null;

const getGemini = () => {
  if (!gemini) {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return gemini;
};

export const parseJobDescription = async (jd: string) => {
  const client = getGemini();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Extract structured job data from this job description and return as JSON with fields: company, role (job position/title), key_requirements (array), skills (array), experience_level, salary_range.
  
Job Description:
${jd}

Return only valid JSON, no markdown formatting.`;

  const response = await model.generateContent(prompt);
  const content = response.response.text();
  
  if (!content) throw new Error("No content in response");
  
  // Parse JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  
  return JSON.parse(jsonMatch[0]);
};

export const generateResumePoints = async (jd: string) => {
  const client = getGemini();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Generate 3-5 strong resume bullet points tailored to this job description. Return only the bullet points as a JSON array.

Job Description:
${jd}

Return only valid JSON array like: ["point 1", "point 2", "point 3"]`;

  const response = await model.generateContent(prompt);
  const content = response.response.text();
  
  if (!content) return [];
  
  // Parse JSON array from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return [content];
  }
};

// Streaming version for real-time updates
export const parseJobDescriptionStream = async (jd: string, onChunk: (text: string) => void) => {
  const client = getGemini();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Extract structured job data from this job description and return as JSON with fields: company, role (job position/title), key_requirements (array), skills (array), experience_level, salary_range.
  
Job Description:
${jd}

Return only valid JSON, no markdown formatting.`;

  const stream = await model.generateContentStream(prompt);
  
  let fullText = "";
  for await (const chunk of stream.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
    fullText += text;
    onChunk(fullText);
  }
  
  // Parse final JSON
  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  
  return JSON.parse(jsonMatch[0]);
};

// Streaming version for resume points
export const generateResumePointsStream = async (jd: string, onChunk: (text: string) => void) => {
  const client = getGemini();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Generate 3-5 strong resume bullet points tailored to this job description. Return only the bullet points as a JSON array.

Job Description:
${jd}

Return only valid JSON array like: ["point 1", "point 2", "point 3"]`;

  const stream = await model.generateContentStream(prompt);
  
  let fullText = "";
  for await (const chunk of stream.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
    fullText += text;
    onChunk(fullText);
  }
  
  // Parse final JSON array
  const jsonMatch = fullText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return [fullText];
  }
};