export function sanitizeString(str: string) {
  const nomalizeStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const stringSanitized = nomalizeStr.replace(/[^a-z0-9\.,_-]/gim, "");
  return stringSanitized.trim();
}
