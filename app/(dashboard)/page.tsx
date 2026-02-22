"use client";

import { useUser, useLogout } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const { data: user } = useUser();
  const logout = useLogout();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  );
}
