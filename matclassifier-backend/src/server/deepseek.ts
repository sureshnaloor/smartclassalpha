import OpenAI from "openai";

// Initialize DeepSeek client (DeepSeek uses OpenAI-compatible API)
const deepseek = new OpenAI({ 
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

// Default DeepSeek model
const DEFAULT_MODEL = "deepseek-chat";

export async function callDeepSeek(prompt: string, temperature: number = 0.1): Promise<string> {
  try {
    const response = await deepseek.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a material standardization expert. Respond with only the standardized description or the specified keywords."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: temperature,
      max_tokens: 100
    });

    const result = response.choices[0].message.content?.trim() || 'UNCLEANSED';
    return result;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw error;
  }
} 