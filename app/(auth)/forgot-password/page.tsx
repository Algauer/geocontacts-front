"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordData,
} from "@/lib/validations/auth";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: ForgotPasswordData) {
    forgotPassword.mutate(data);
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
        <h2 className="text-2xl font-bold">Esqueceu a senha?</h2>
        <p className="text-muted-foreground mt-1">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      {forgotPassword.isSuccess ? (
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm text-primary">
          <p className="font-medium">Email enviado!</p>
          <p className="mt-1">
            Verifique sua caixa de entrada e clique no link para redefinir sua
            senha.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
            >
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
              <p className="text-destructive text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {forgotPassword.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Mail size={18} />
            )}
            {forgotPassword.isPending ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}
    </div>
  );
}
