export function asDownloadMarkdown(title: string, markdown: string) {
  return [`# ${title}`, '', markdown].join('\n');
}

export function jsonToMarkdownTable<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T; label: string }[]
) {
  if (!rows.length) return '';
  const header = `| ${columns.map((column) => column.label).join(' |')} |`;
  const sep = `| ${columns.map(() => '---').join(' |')} |`;
  const body = rows
    .map((row) => `| ${columns.map((column) => String(row[column.key] ?? '')).join(' |')} |`)
    .join('\n');
  return [header, sep, body].join('\n');
}
