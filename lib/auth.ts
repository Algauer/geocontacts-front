import { api, setToken, removeToken } from "./api";
import type {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from "./validations/auth";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  data: User;
  token: string;
};

type MessageResponse = {
  message: string;
};

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setToken(response.token);
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setToken(response.token);
  return response;
}

export async function logout(): Promise<void> {
  await api("/auth/logout", { method: "POST" });
  removeToken();
}

export async function forgotPassword(
  data: ForgotPasswordData
): Promise<MessageResponse> {
  return api<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export async function resetPassword(
  data: ResetPasswordData
): Promise<MessageResponse> {
  return api<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export async function getUser(): Promise<User> {
  return api<User>("/user");
}
