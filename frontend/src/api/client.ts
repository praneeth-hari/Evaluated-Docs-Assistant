import type { AskResponse, HealthResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";
const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function ask(query: string, signal?: AbortSignal): Promise<AskResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error("Request timed out after 5 minutes")), TIMEOUT_MS);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }

  try {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });
    } catch (networkErr: unknown) {
      if (networkErr instanceof Error && networkErr.name === "AbortError") {
        throw new ApiError(controller.signal.reason?.message || "Request timed out or was cancelled.");
      }
      throw new ApiError("Can't reach the API. Check that it is running, then retry.");
    }

    if (!res.ok) {
      throw new ApiError(`The server returned an error (${res.status}).`, res.status);
    }

    return (await res.json()) as AskResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error("Health check timed out")), 10000);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }

  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ApiError(`The server returned an error (${res.status}).`, res.status);
    }

    return (await res.json()) as HealthResponse;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("Can't reach the API. Check that it is running, then retry.");
  } finally {
    clearTimeout(timeoutId);
  }
}
