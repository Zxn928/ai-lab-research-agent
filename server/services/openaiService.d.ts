export declare const isOpenAIConfigured: () => boolean;
export declare function generateText({ system, user, temperature }: {
    system: string;
    user: string;
    temperature?: number;
}): Promise<string>;
export declare function generateWebResearch({ system, user }: {
    system: string;
    user: string;
}): Promise<string>;
export declare function generateJson<T>({ system, user, temperature }: {
    system: string;
    user: string;
    temperature?: number;
}): Promise<T>;
export declare function analyzeImage({ system, prompt, imageBase64, mimeType }: {
    system: string;
    prompt: string;
    imageBase64: string;
    mimeType: string;
}): Promise<string>;
