"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  Map,
  X,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
} from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import { ContactCard } from "@/components/contacts/contact-card";
import { ContactsMap } from "@/components/maps/contacts-map";
import { useSidebar } from "@/contexts/sidebar-context";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<"name" | "created_at">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);
  const { setCollapsed } = useSidebar();
  const { data, isLoading } = useContacts({
    page,
    perPage,
    search: debouncedSearch || undefined,
    sortBy,
    sortDir,
  });

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    setTimer(newTimer);
  }

  const contacts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className={`h-[calc(100vh-3rem)] flex flex-col ${showMap ? "lg:flex-row" : ""} gap-4`}>
      {/* Contact list panel */}
      <div className={`${showMap ? "lg:w-105 lg:shrink-0" : ""} flex flex-col min-h-0`}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-foreground">Contatos</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowMap((prev) => {
                  const next = !prev;
                  if (next) setCollapsed(true);
                  return next;
                });
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                showMap
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {showMap ? <X size={14} /> : <Map size={14} />}
              {showMap ? "Fechar mapa" : "Ver mapa"}
            </button>
            <Link
              href="/contacts/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} />
              Novo
            </Link>
          </div>
        </div>

        <div className={`flex justify-between ${showMap ? "flex-col" : "flex-row"}`}>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por nome ou CPF..."
              className="w-full rounded-lg border border-input pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-2 ">
              <span className="text-sm text-muted-foreground shrink-0">
                Ordenação:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as "name" | "created_at");
                  setPage(1);
                }}
                className={`rounded-lg border border-input bg-background px-3 py-2 text-sm flex-1 `}
              >
                <option value="name">Nome</option>
                <option value="created_at">Data de criação</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
                  setPage(1);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={sortDir === "asc" ? "Crescente" : "Decrescente"}
              >
                {sortDir === "asc" ? (
                  <ArrowUpWideNarrow size={16} />
                ) : (
                  <ArrowDownWideNarrow size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users size={40} className="mb-3 opacity-50" />
              <p className="text-sm">
                {debouncedSearch
                  ? "Nenhum contato encontrado."
                  : "Você ainda nao tem contatos."}
              </p>
              {!debouncedSearch && (
                <Link
                  href="/contacts/new"
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Adicionar primeiro contato
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-3 pr-1">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() =>
                    setSelectedContactId((prev) =>
                      prev === contact.id ? null : contact.id
                    )
                  }
                  className={`cursor-pointer rounded-lg transition-all ${
                    selectedContactId === contact.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <ContactCard contact={contact} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="py-2 flex items-center gap-2 ">
          <span className="text-sm text-muted-foreground shrink-0">
            Paginação:
          </span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
          </select>
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-border mt-3 text-sm text-muted-foreground">
            <span>
              Pagina {meta.current_page} de {meta.last_page} ({meta.total} contatos)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page <= 1}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={meta.current_page >= meta.last_page}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map panel */}
      {showMap && (
        <div className="flex-1 min-h-75 lg:min-h-0 rounded-lg overflow-hidden border border-border">
          <ContactsMap
            contacts={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
          />
        </div>
      )}
    </div>
  );
}
