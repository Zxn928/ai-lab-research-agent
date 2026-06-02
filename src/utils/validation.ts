export function required(value: string | undefined, label: string) {
  if (!value?.trim()) return `${label}不能为空`;
  return undefined;
}
