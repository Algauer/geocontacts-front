"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authApi from "@/lib/auth";
import { removeToken } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  RestoreAccountData,
  DeleteAccountData,
} from "@/lib/validations/auth";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Email ou senha incorretos.");
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data);
      toast.success("Conta criada com sucesso!");
      router.push("/");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.data.errors) {
        const errors = error.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError || "Erro ao criar conta.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logout realizado.");
      router.push("/login");
    },
    onError: () => {
      removeToken();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success("Email de recuperacao enviado! Verifique sua caixa de entrada.");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.data.errors) {
        const errors = error.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError || "Erro ao enviar email.");
      } else {
        toast.error("Erro ao enviar email. Tente novamente.");
      }
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso! Faca login.");
      router.push("/login");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error("Token invalido ou expirado. Solicite um novo link.");
      } else {
        toast.error("Erro ao resetar senha. Tente novamente.");
      }
    },
  });
}

export function useRestoreAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RestoreAccountData) => authApi.restoreAccount(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data);
      toast.success("Conta restaurada com sucesso!");
      router.push("/");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.status === 410) {
        toast.error("Prazo de 7 dias expirado para restaurar esta conta.");
        return;
      }

      if (error instanceof ApiError && error.status === 401) {
        toast.error("Email ou senha invalidos.");
        return;
      }

      toast.error("Erro ao restaurar conta. Tente novamente.");
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: DeleteAccountData) => authApi.deleteAccount(data),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Conta excluida. Voce pode restaurar em ate 7 dias.");
      router.push("/restore-account");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.status === 422) {
        toast.error("Senha incorreta.");
        return;
      }

      toast.error("Erro ao excluir conta. Tente novamente.");
    },
  });
}
