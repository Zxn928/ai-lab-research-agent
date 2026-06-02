export function asDownloadMarkdown(title, markdown) {
    return [`# ${title}`, '', markdown].join('\n');
}
export function jsonToMarkdownTable(rows, columns) {
    if (!rows.length)
        return '';
    const header = `| ${columns.map((column) => column.label).join(' |')} |`;
    const sep = `| ${columns.map(() => '---').join(' |')} |`;
    const body = rows
        .map((row) => `| ${columns.map((column) => String(row[column.key] ?? '')).join(' |')} |`)
        .join('\n');
    return [header, sep, body].join('\n');
}
