"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Pencil, Trash2, CalendarDays } from "lucide-react";
import { formatCpf, formatPhone, formatContactCreatedAt } from "@/lib/contact-format";
import type { Contact } from "@/lib/contacts";
import { useDeleteContact } from "@/hooks/use-contacts";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type ContactCardProps = {
  contact: Contact;
};

export function ContactCard({ contact }: ContactCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteContact = useDeleteContact();

  function handleDelete() {
    deleteContact.mutate(contact.id, {
      onSettled: () => setIsDeleteDialogOpen(false),
    });
  }

  const cpfFormatted = formatCpf(contact.cpf);
  const phoneFormatted = formatPhone(contact.phone);
  const createdAtFormatted = formatContactCreatedAt(contact.created_at);

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
            onClick={(e) => e.stopPropagation()}
            className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            title="Editar"
          >
            <Pencil size={16} />
          </Link>
          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Excluir contato"
            description={`Tem certeza que deseja excluir o contato ${contact.name}? Esta acao nao pode ser desfeita.`}
            confirmLabel="Excluir"
            cancelLabel="Cancelar"
            onConfirm={handleDelete}
            isPending={deleteContact.isPending}
            variant="destructive"
          >
            <button
              type="button"
              className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </ConfirmDialog>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="shrink-0" />
          <span>Criado em {createdAtFormatted}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="shrink-0" />
          <span>{phoneFormatted}</span>
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
