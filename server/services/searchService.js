import { config } from './config';
import { generateWebResearch, isOpenAIConfigured } from './openaiService';
export async function researchCompany({ companyName, industry }) {
    if (config.searchProvider === 'openai' && isOpenAIConfigured()) {
        const system = [
            '你是企业线下调研前的公开资料研究助手。',
            '只把公网信息作为访谈前假设，不能写成最终诊断结论。',
            '输出 Markdown，必须区分公开事实、来源线索、访谈前假设。'
        ].join('\n');
        const user = [
            `企业名称：${companyName}`,
            industry ? `行业：${industry}` : '',
            '请联网检索并整理：企业基本信息、主营业务、产品服务、行业定位、官网资料、公开新闻、资质荣誉、招聘信息反映出的组织能力、可能业务流程、可能AI应用假设。',
            '请在文末列出来源 URL。'
        ]
            .filter(Boolean)
            .join('\n');
        const publicResearch = await generateWebResearch({ system, user });
        return {
            publicResearch,
            sources: extractSources(publicResearch),
            assumptions: extractAssumptions(publicResearch)
        };
    }
    return {
        publicResearch: '未配置可用搜索服务。请手动粘贴企业公开资料，系统会将其作为访谈前假设，不会作为最终诊断结论。',
        sources: [],
        assumptions: ['需要人工补充企业官网、新闻、招聘、公开资质等资料。']
    };
}
function extractSources(markdown) {
    const urls = Array.from(markdown.matchAll(/https?:\/\/[^\s)]+/g)).map((match) => match[0]);
    return urls.map((url) => ({ title: url, url }));
}
function extractAssumptions(markdown) {
    return markdown
        .split('\n')
        .filter((line) => /假设|可能|待核实/.test(line))
        .slice(0, 12);
}
