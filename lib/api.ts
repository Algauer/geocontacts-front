const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: Record<string, unknown>
  ) {
    super(data.message as string || `Request failed with status ${status}`);
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
}

export async function api<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token && !skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...rest,
  });

  if (response.status === 204) {
    return null as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}
