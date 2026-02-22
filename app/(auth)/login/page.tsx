"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { loginSchema, type LoginData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginData) {
    login.mutate(data);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Entrar</h2>
        <p className="text-muted-foreground mt-1">
          Acesse sua conta para gerenciar seus contatos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {login.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <LogIn size={18} />
          )}
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Nao tem uma conta?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
