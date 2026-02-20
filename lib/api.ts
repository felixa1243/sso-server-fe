import axios from 'axios';

export async function apiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: unknown,
  headers: Record<string, string> = {}
): Promise<T> {
  try {
    const res = await axios({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data,
    });
    return res.data;
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
}

export const api = {
  get: <T>(url: string, headers?: Record<string, string>) => apiRequest<T>(url, 'GET', undefined, headers),
  post: <T>(url: string, body: unknown, headers?: Record<string, string>) => apiRequest<T>(url, 'POST', body, headers),
  put: <T>(url: string, body: unknown, headers?: Record<string, string>) => apiRequest<T>(url, 'PUT', body, headers),
  delete: <T>(url: string, headers?: Record<string, string>) => apiRequest<T>(url, 'DELETE', undefined, headers),
};
