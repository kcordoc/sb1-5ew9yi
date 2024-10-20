import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

const systemPrompt = `You are an AI health coach using motivational interviewing techniques to assess the user's health goals. Ask a maximum of 10 questions to explore:
1. User's specific health goals
2. Motivation for improving health
3. Barriers to achieving health goals
4. Successful techniques used in the past

After the conversation, summarize the key points. Be empathetic, supportive, and encourage the user to elaborate on their responses.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.createChatCompletion({
    model: "mixtral-8x7b-32768",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}