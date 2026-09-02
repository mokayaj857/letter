// Letterbox Application Error Reporting

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[Letterbox Error]", error, context);
}
