"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Users,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useUser, useLogout } from "@/hooks/use-auth";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function DashboardSidebar() {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { data: user } = useUser();
  const logout = useLogout();
  const items = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/contacts", label: "Contatos", icon: Users },
  ];
  const isAccountActive = pathname === "/account";

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-white">
      <div className="h-full flex flex-col">
        <Link
          href="/"
          className="h-14 px-4 border-b border-border flex items-center gap-2 font-semibold text-primary"
        >
          <MapPin size={20} />
          <span>GeoContacts</span>
        </Link>

        <nav className="p-3 space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href === "/contacts" && pathname.startsWith("/contacts/"));

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-3 space-y-2">
          <Link
            href="/account"
            className={`block rounded-lg border px-3 py-2 transition-colors ${
              isAccountActive
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/30 hover:bg-muted/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <CircleUserRound
                size={18}
                className={isAccountActive ? "text-primary" : "text-foreground"}
              />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Minha conta</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
              </div>
            </div>
          </Link>

          <ConfirmDialog
            open={isLogoutDialogOpen}
            onOpenChange={setIsLogoutDialogOpen}
            title="Sair da conta"
            description="Tem certeza que deseja encerrar sua sessao?"
            confirmLabel="Sair"
            cancelLabel="Cancelar"
            onConfirm={() =>
              logout.mutate(undefined, {
                onSettled: () => setIsLogoutDialogOpen(false),
              })
            }
            isPending={logout.isPending}
            variant="destructive"
          >
            <button
              type="button"
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </ConfirmDialog>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30 flex">
        <DashboardSidebar />
        <main className="flex-1 px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
