export interface AgentRunRequest<TInput = unknown> {
    agentName: string;
    projectId?: string;
    input: TInput;
}
export interface AgentRunResponse<TResult = unknown> {
    result: TResult;
    markdown?: string;
    warnings: string[];
}
