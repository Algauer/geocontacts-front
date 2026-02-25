"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // LayoutDashboard,
  MapPin,
  Users,
  LogOut,
  CircleUserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useUser, useLogout } from "@/hooks/use-auth";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

function DashboardSidebar() {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { data: user } = useUser();
  const logout = useLogout();
  const { collapsed, toggle } = useSidebar();
  const items = [
    // { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/contacts", label: "Contatos", icon: Users },
  ];
  const isAccountActive = pathname === "/account";

  return (
    <div className="relative shrink-0">
      <aside
        className={cn(
          "h-full border-r border-border bg-white transition-all duration-300 ease-in-out overflow-hidden",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
        <Link
          href="/"
          className={cn(
            "h-14 border-b border-border flex items-center font-semibold text-primary overflow-hidden whitespace-nowrap",
            collapsed ? "justify-center px-0" : "px-4 gap-2"
          )}
        >
          <MapPin size={20} className="shrink-0" />
          <span
            className={cn(
              "transition-opacity duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            GeoContacts
          </span>
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
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center rounded-md py-2 text-sm transition-colors overflow-hidden whitespace-nowrap",
                  collapsed ? "justify-center px-2" : "px-3 gap-2",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span
                  className={cn(
                    "transition-opacity duration-300",
                    collapsed ? "opacity-0 w-0" : "opacity-100"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-3 space-y-2">
          <Link
            href="/account"
            title={collapsed ? "Minha conta" : undefined}
            className={cn(
              "block rounded-lg border transition-colors",
              collapsed ? "p-2" : "px-3 py-2",
              isAccountActive
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/30 hover:bg-muted/60"
            )}
          >
            <div
              className={cn(
                "flex items-center",
                collapsed ? "justify-center" : "gap-2"
              )}
            >
              <CircleUserRound
                size={18}
                className={cn(
                  "shrink-0",
                  isAccountActive ? "text-primary" : "text-foreground"
                )}
              />
              <div
                className={cn(
                  "min-w-0 transition-opacity duration-300 overflow-hidden",
                  collapsed ? "opacity-0 w-0" : "opacity-100"
                )}
              >
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
              title={collapsed ? "Sair" : undefined}
              className={cn(
                "w-full flex items-center rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer",
                collapsed ? "justify-center px-2" : "gap-2 px-3"
              )}
            >
              <LogOut size={18} className="shrink-0" />
              <span
                className={cn(
                  "transition-opacity duration-300",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                Sair
              </span>
            </button>
          </ConfirmDialog>
        </div>
      </div>

      </aside>

      {/* Toggle handle (haleta) */}
      <button
        onClick={toggle}
        className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        title={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen bg-muted/30 flex">
          <DashboardSidebar />
          <main className="flex-1 px-4 sm:px-6 py-6">{children}</main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
