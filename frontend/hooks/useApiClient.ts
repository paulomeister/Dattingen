"use client";
import { useAuth } from "@/lib/AuthContext";
import { environment } from "@/env/environment.dev";

function buildUrl(endpoint: string): string {
  return `${environment.API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
}

export function useApiClient() {
  const { token } = useAuth();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
  };

  async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  return {
    get: async <T>(endpoint: string) => {
      const res = await fetch(buildUrl(endpoint), { method: "GET", headers });
      return handleResponse<T>(res);
    },

    post: async <T, D>(endpoint: string, data: D) => {
      const res = await fetch(buildUrl(endpoint), {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse<T>(res);
    },

    put: async <T, D>(endpoint: string, data: D) => {
      const res = await fetch(buildUrl(endpoint), {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      return handleResponse<T>(res);
    },

    del: async <T>(endpoint: string) => {
      const res = await fetch(buildUrl(endpoint), {
        method: "DELETE",
        headers,
      });
      return handleResponse<T>(res);
    },

    upload: async <T>(endpoint: string, formData: FormData) => {
      const uploadHeaders: Record<string, string> = {};
      if (token) uploadHeaders["Authorization"] = token;
      const res = await fetch(buildUrl(endpoint), {
        method: "POST",
        headers: Object.keys(uploadHeaders).length > 0 ? uploadHeaders : undefined,
        body: formData,
      });
      return handleResponse<T>(res);
    },
  };
}
