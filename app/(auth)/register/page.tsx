"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { registerSchema, type RegisterData } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/use-auth";

export default function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterData) {
    registerMutation.mutate(data);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Criar conta</h2>
        <p className="text-muted-foreground mt-1">
          Crie sua conta para comecar a gerenciar seus contatos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Nome
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimo 8 caracteres"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium mb-1.5"
          >
            Confirmar senha
          </label>
          <input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            {...register("password_confirmation")}
          />
          {errors.password_confirmation && (
            <p className="text-destructive text-sm mt-1">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {registerMutation.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <UserPlus size={18} />
          )}
          {registerMutation.isPending ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Ja tem uma conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
