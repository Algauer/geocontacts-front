"use client";

import Link from "next/link";
import { ArrowRight, Plus, Users } from "lucide-react";

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/contacts"
          className="rounded-lg border border-border bg-white p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="text-primary" size={20} />
            <ArrowRight size={16} className="text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">Ver contatos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Lista, busca e edicao de contatos.
          </p>
        </Link>

        <Link
          href="/contacts/new"
          className="rounded-lg border border-border bg-white p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <Plus className="text-primary" size={20} />
            <ArrowRight size={16} className="text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">Novo contato</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre um novo contato com endereço completo.
          </p>
        </Link>
      </div>
    </div>
  );
}
