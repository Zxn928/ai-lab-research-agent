import type { SearchResult } from '../types/server';
import { config } from './config';
import { generateWebResearch, isOpenAIConfigured, isWebSearchEnabled } from './openaiService';

export async function researchCompany({
  companyName,
  industry
}: {
  companyName: string;
  industry?: string;
}): Promise<SearchResult> {
  if (config.searchProvider === 'openai' && isOpenAIConfigured() && isWebSearchEnabled()) {
    const system = [
      '你是企业线下调研前的公开资料研究助手。',
      '只把公网信息作为访谈前假设，不能写成最终诊断结论。',
      '输出 Markdown，必须区分公开事实、来源线索、访谈前假设。'
    ].join('\n');
    const user = [
      `企业名称：${companyName}`,
      industry ? `行业：${industry}` : '',
      '请联网检索并输出一份精简访谈前企业画像。',
      '只包含：企业基本信息、主营业务/产品服务、行业定位、公开新闻或官网要点、访谈前AI应用假设、来源URL。',
      '控制在1000字以内，来源URL单独列出。'
    ]
      .filter(Boolean)
      .join('\n');

    const publicResearch = await generateWebResearch({ system, user, maxOutputTokens: 1600 });
    return {
      publicResearch,
      sources: extractSources(publicResearch),
      assumptions: extractAssumptions(publicResearch)
    };
  }

  return {
    publicResearch:
      '未配置可用搜索服务，或当前中转站未启用 web_search。请手动粘贴企业公开资料，系统会将其作为访谈前假设，不会作为最终诊断结论。',
    sources: [],
    assumptions: ['需要人工补充企业官网、新闻、招聘、公开资质等资料。']
  };
}

function extractSources(markdown: string) {
  const urls = Array.from(markdown.matchAll(/https?:\/\/[^\s)]+/g)).map((match) => match[0]);
  return urls.map((url) => ({ title: url, url }));
}

function extractAssumptions(markdown: string) {
  return markdown
    .split('\n')
    .filter((line) => /假设|可能|待核实/.test(line))
    .slice(0, 12);
}
