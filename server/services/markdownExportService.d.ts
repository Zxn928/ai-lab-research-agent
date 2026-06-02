export declare function asDownloadMarkdown(title: string, markdown: string): string;
export declare function jsonToMarkdownTable<T extends Record<string, unknown>>(rows: T[], columns: {
    key: keyof T;
    label: string;
}[]): string;
