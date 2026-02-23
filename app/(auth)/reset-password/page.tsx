"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordData } from "@/lib/validations/auth";
import { useResetPassword } from "@/hooks/use-auth";
import { PasswordInput } from "@/components/ui/password-input";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, email },
  });

  function onSubmit(data: ResetPasswordData) {
    resetPassword.mutate(data);
  }

  if (!token || !email) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
        <p className="font-medium">Link invalido</p>
        <p className="mt-1">
          Este link de recuperacao e invalido ou expirou. Solicite um novo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("token")} />
      <input type="hidden" {...register("email")} />

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">
          Nova senha
        </label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Minimo 8 caracteres"
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-medium mb-1.5"
        >
          Confirmar nova senha
        </label>
        <PasswordInput
          id="password_confirmation"
          autoComplete="new-password"
          placeholder="Repita a nova senha"
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
        disabled={resetPassword.isPending}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {resetPassword.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <KeyRound size={18} />
        )}
        {resetPassword.isPending ? "Redefinindo..." : "Redefinir senha"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Redefinir senha</h2>
        <p className="text-muted-foreground mt-1">
          Escolha uma nova senha para sua conta.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-muted-foreground">Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

