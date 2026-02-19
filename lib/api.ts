export async function apiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  headers: Record<string, string> = {}
): Promise<T> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);

  if (!res.ok) {
    let errorMessage = 'An error occurred';
    try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
    } catch {
        // failed to parse json
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
    get: <T>(url: string, headers?: Record<string, string>) => apiRequest<T>(url, 'GET', undefined, headers),
    post: <T>(url: string, body: unknown, headers?: Record<string, string>) => apiRequest<T>(url, 'POST', body, headers),
    put: <T>(url: string, body: unknown, headers?: Record<string, string>) => apiRequest<T>(url, 'PUT', body, headers),
    delete: <T>(url: string, headers?: Record<string, string>) => apiRequest<T>(url, 'DELETE', undefined, headers),
};
