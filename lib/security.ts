export function isAllowedExternalUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function sanitizeExternalUrl(value?: string) {
  return isAllowedExternalUrl(value) ? value! : undefined;
}
