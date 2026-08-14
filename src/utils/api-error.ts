type DetailItem = { msg?: string };

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: Record<string, unknown> } };
    const data = axiosErr.response?.data;
    if (data) {
      const detail = data.detail;
      if (typeof detail === "string" && detail.trim()) return detail;
      if (Array.isArray(detail)) {
        const msgs = detail
          .filter((d): d is DetailItem => !!d && typeof (d as DetailItem).msg === "string")
          .map((d) => d.msg as string)
          .filter((m) => m.trim());
        if (msgs.length) return msgs.join("; ");
      }
      if (typeof data.error === "string" && data.error.trim()) return data.error;
      if (typeof data.message === "string" && data.message.trim()) return data.message;
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
