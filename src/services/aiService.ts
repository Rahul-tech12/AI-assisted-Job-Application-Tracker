import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

let openai: OpenAI | null = null;

const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

export const parseJobDescription = async (jd: string) => {
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "Extract structured job data in JSON format."
      },
      {
        role: "user",
        content: jd
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content in response");
  return JSON.parse(content);
};

export const generateResumePoints = async (jd: string) => {
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "Generate 3-5 strong resume bullet points tailored to the job."
      },
      {
        role: "user",
        content: jd
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
};