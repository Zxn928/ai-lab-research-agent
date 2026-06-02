import OpenAI from 'openai';
import { config } from './config';

type TextResponse = { output_text: string };

const client = config.openaiApiKey
  ? new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseUrl
    })
  : undefined;

export const isOpenAIConfigured = () => Boolean(client);
export const isWebSearchEnabled = () => config.openaiEnableWebSearch;

export async function generateText({
  system,
  user,
  temperature = config.openaiTemperature
}: {
  system: string;
  user: string;
  temperature?: number;
}) {
  if (!client) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const payload = {
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
    ...(temperature !== undefined ? { temperature } : {})
  };

  const response: TextResponse = config.openaiBaseUrl
    ? await createResponseWithFetch(payload)
    : ((await client.responses.create(payload as Parameters<typeof client.responses.create>[0])) as TextResponse);

  return response.output_text;
}

export async function generateWebResearch({
  system,
  user
}: {
  system: string;
  user: string;
}) {
  if (!client) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }
  if (!config.openaiEnableWebSearch) {
    throw new Error('OPENAI_ENABLE_WEB_SEARCH is disabled.');
  }

  const payload = {
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
  };

  const response: TextResponse = config.openaiBaseUrl
    ? await createResponseWithFetch(payload)
    : ((await client.responses.create(payload as Parameters<typeof client.responses.create>[0])) as TextResponse);

  return response.output_text;
}

export async function generateJson<T>({
  system,
  user,
  temperature = config.openaiTemperature
}: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<T> {
  const text = await generateText({
    system,
    user: `${user}\n\n请只输出合法 JSON，不要输出 Markdown 代码块。`,
    temperature
  });
  const cleaned = extractJsonObject(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    throw new Error(`Failed to parse model JSON output: ${text.slice(0, 300)}`);
  }
}

function extractJsonObject(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

export async function analyzeImage({
  system,
  prompt,
  imageBase64,
  mimeType
}: {
  system: string;
  prompt: string;
  imageBase64: string;
  mimeType: string;
}) {
  if (!client) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const payload = {
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
  };

  const response: TextResponse = config.openaiBaseUrl
    ? await createResponseWithFetch(payload)
    : ((await client.responses.create(payload as Parameters<typeof client.responses.create>[0])) as TextResponse);
  return response.output_text;
}

async function createResponseWithFetch(payload: Record<string, unknown>) {
  const baseUrl = config.openaiBaseUrl?.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Relay responses request failed (${response.status}): ${text.slice(0, 500)}`);
  }

  const data = parseJsonResponse(text) as { output_text?: string; output?: Array<unknown> };
  return {
    output_text: data.output_text || collectOutputText(data.output)
  };
}

function parseJsonResponse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(extractFirstJsonObject(text));
  }
}

function extractFirstJsonObject(text: string) {
  const start = text.indexOf('{');
  if (start < 0) return text;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return text.slice(start, index + 1);
  }

  return text.slice(start);
}

function collectOutputText(output: unknown) {
  if (!Array.isArray(output)) return '';

  const chunks: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const part of content) {
      if (part && typeof part === 'object' && 'text' in part) {
        chunks.push(String((part as { text?: unknown }).text ?? ''));
      }
    }
  }

  return chunks.join('');
}
