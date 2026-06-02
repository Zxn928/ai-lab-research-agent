import type { AgentRunResponse } from '../../src/types/api';
export declare function runAgent(agentName: string, input: unknown): Promise<AgentRunResponse>;
