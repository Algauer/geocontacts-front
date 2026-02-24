"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import {
  restoreAccountSchema,
  type RestoreAccountData,
} from "@/lib/validations/auth";
import { useRestoreAccount } from "@/hooks/use-auth";
import { PasswordInput } from "@/components/ui/password-input";

export default function RestoreAccountPage() {
  const restoreAccount = useRestoreAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestoreAccountData>({
    resolver: zodResolver(restoreAccountSchema),
  });

  function onSubmit(data: RestoreAccountData) {
    restoreAccount.mutate(data);
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} />
        Voltar ao login
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Restaurar conta</h2>
        <p className="text-muted-foreground mt-1">
          Se sua conta foi excluida, você pode restaurar em ate 7 dias.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email da conta
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
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Sua senha atual"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={restoreAccount.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {restoreAccount.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <RotateCcw size={18} />
          )}
          {restoreAccount.isPending ? "Restaurando..." : "Restaurar conta"}
        </button>
      </form>
    </div>
  );
}

