"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Contact } from "@/lib/contacts";
import { useDeleteContact } from "@/hooks/use-contacts";

type ContactCardProps = {
  contact: Contact;
};

export function ContactCard({ contact }: ContactCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteContact = useDeleteContact();

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteContact.mutate(contact.id, {
      onSettled: () => setConfirmDelete(false),
    });
  }

  const cpfFormatted = contact.cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );

  return (
    <div className="rounded-lg border border-border bg-white p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">
            {contact.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            CPF: {cpfFormatted}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            disabled={deleteContact.isPending}
            className={`rounded-md p-1.5 transition-colors ${
              confirmDelete
                ? "text-destructive-foreground bg-destructive hover:bg-destructive/90"
                : "text-muted-foreground hover:text-destructive hover:bg-muted"
            }`}
            title={confirmDelete ? "Confirmar exclusao" : "Excluir"}
          >
            {deleteContact.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Phone size={14} className="shrink-0" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <span>
            {contact.street}, {contact.number}
            {contact.complement ? ` - ${contact.complement}` : ""},{" "}
            {contact.district}, {contact.city}/{contact.state} - CEP{" "}
            {contact.cep}
          </span>
        </div>
      </div>
    </div>
  );
}
