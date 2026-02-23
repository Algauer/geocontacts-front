"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  deleteAccountSchema,
  type DeleteAccountData,
} from "@/lib/validations/auth";
import { useDeleteAccount } from "@/hooks/use-auth";
import { PasswordInput } from "@/components/ui/password-input";

export default function AccountPage() {
  const deleteAccount = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  function onSubmit(data: DeleteAccountData) {
    deleteAccount.mutate(data);
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
              Sua conta e contatos serao desativados. Voce pode restaurar em ate
              7 dias usando email e senha.
            </p>
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
            {deleteAccount.isPending ? "Excluindo..." : "Excluir minha conta"}
          </button>
        </form>
      </section>
    </div>
  );
}

