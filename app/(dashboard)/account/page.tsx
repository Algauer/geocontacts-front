"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Trash2, Clock, ShieldAlert } from "lucide-react";
import {
  deleteAccountSchema,
  type DeleteAccountData,
} from "@/lib/validations/auth";
import { useDeleteAccount } from "@/hooks/use-auth";
import { PasswordInput } from "@/components/ui/password-input";

type DeletionMode = "soft" | "immediate";

export default function AccountPage() {
  const [mode, setMode] = useState<DeletionMode>("soft");
  const deleteAccount = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  function onSubmit(data: DeleteAccountData) {
    deleteAccount.mutate({ ...data, immediate: mode === "immediate" });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minha conta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie sua conta e seguranca.
        </p>
      </div>

      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-destructive mt-0.5" size={18} />
          <div>
            <h2 className="font-semibold text-foreground">Excluir conta</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha como deseja excluir sua conta e confirme com sua senha.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium mb-1.5">
            Modo de exclusao
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("soft")}
              className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                mode === "soft"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-input hover:border-primary/40"
              }`}
            >
              <Clock
                size={20}
                className={`mt-0.5 shrink-0 ${mode === "soft" ? "text-primary" : "text-muted-foreground"}`}
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Exclusão com periodo de arrependimento
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Sua conta e contatos ficam desativados por 7 dias. Você pode
                  restaurar tudo nesse período.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("immediate")}
              className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                mode === "immediate"
                  ? "border-destructive bg-destructive/5 ring-2 ring-destructive/30"
                  : "border-input hover:border-destructive/40"
              }`}
            >
              <ShieldAlert
                size={20}
                className={`mt-0.5 shrink-0 ${mode === "immediate" ? "text-destructive" : "text-muted-foreground"}`}
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Exclusao imediata e permanente
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos os dados sao removidos da base de dados imediatamente.
                  Essa acao e irreversivel.
                </p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Confirme sua senha
            </label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
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
            disabled={deleteAccount.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {deleteAccount.isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            {deleteAccount.isPending
              ? "Excluindo..."
              : mode === "immediate"
                ? "Excluir permanentemente"
                : "Excluir minha conta"}
          </button>
        </form>
      </section>
    </div>
  );
}
