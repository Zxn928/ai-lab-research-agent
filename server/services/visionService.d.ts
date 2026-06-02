import type { Department } from '../../src/types/department';
export declare function parseOrgStructureImage(file: {
    buffer: Buffer;
    mimetype: string;
}): Promise<{
    departments: Department[];
    rawText: string;
    confidence: 'high' | 'medium' | 'low';
}>;
