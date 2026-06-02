import type { Department } from '../../src/types/department';
import { analyzeImage } from './openaiService';

export async function parseOrgStructureImage(file: {
  buffer: Buffer;
  mimetype: string;
}): Promise<{ departments: Department[]; rawText: string; confidence: 'high' | 'medium' | 'low' }> {
  const rawText = await analyzeImage({
    system:
      '你是组织架构图识别助手。请识别部门名称、层级、部门类型、访谈重点和访谈优先级。只输出合法 JSON。',
    prompt:
      '请识别这张组织架构图，输出 {"departments":[{"id":"","name":"","parentName":"","type":"","description":"","interviewPriority":"high|medium|low","interviewFocus":[]}],"rawText":"","confidence":"high|medium|low"}',
    imageBase64: file.buffer.toString('base64'),
    mimeType: file.mimetype
  });
  const parsed = JSON.parse(rawText.trim().replace(/^```json\s*/i, '').replace(/```$/i, ''));
  return parsed;
}
