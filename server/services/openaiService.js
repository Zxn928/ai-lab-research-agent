import OpenAI from 'openai';
import { config } from './config';
const client = config.openaiApiKey
    ? new OpenAI({ apiKey: config.openaiApiKey })
    : undefined;
export const isOpenAIConfigured = () => Boolean(client);
export async function generateText({ system, user, temperature = 0.2 }) {
    if (!client) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }
    const response = await client.responses.create({
        model: config.openaiTextModel,
        input: [
            {
                role: 'system',
                content: system
            },
            {
                role: 'user',
                content: user
            }
        ],
        temperature
    });
    return response.output_text;
}
export async function generateWebResearch({ system, user }) {
    if (!client) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }
    const response = await client.responses.create({
        model: config.openaiTextModel,
        tools: [{ type: 'web_search' }],
        input: [
            {
                role: 'system',
                content: system
            },
            {
                role: 'user',
                content: user
            }
        ]
    });
    return response.output_text;
}
export async function generateJson({ system, user, temperature = 0.2 }) {
    const text = await generateText({
        system,
        user: `${user}\n\n请只输出合法 JSON，不要输出 Markdown 代码块。`,
        temperature
    });
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '');
    return JSON.parse(cleaned);
}
export async function analyzeImage({ system, prompt, imageBase64, mimeType }) {
    if (!client) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }
    const response = await client.responses.create({
        model: config.openaiVisionModel,
        input: [
            {
                role: 'system',
                content: system
            },
            {
                role: 'user',
                content: [
                    { type: 'input_text', text: prompt },
                    {
                        type: 'input_image',
                        image_url: `data:${mimeType};base64,${imageBase64}`,
                        detail: 'high'
                    }
                ]
            }
        ]
    });
    return response.output_text;
}
