"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ContactForm } from "@/components/contacts/contact-form";
import { useContact, useCreateContact, useUpdateContact } from "@/hooks/use-contacts";

type ContactFormPageProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      contactId: string;
    };

export function ContactFormPage(props: ContactFormPageProps) {
  const isEditMode = props.mode === "edit";

  const { data, isLoading } = useContact(isEditMode ? props.contactId : "");
  const createContact = useCreateContact();
  const updateContact = useUpdateContact(isEditMode ? props.contactId : "");

  if (isEditMode && isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  const contact = data?.data;

  if (isEditMode && !contact) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Contato nao encontrado.</p>
        <Link
          href="/contacts"
          className="text-sm text-primary hover:underline mt-2 inline-block"
        >
          Voltar para contatos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-foreground">
          {isEditMode ? "Editar contato" : "Novo contato"}
        </h1>
      </div>

      <div className="rounded-lg border border-border bg-white p-6">
        <ContactForm
          defaultValues={
            isEditMode
              ? {
                  name: contact.name,
                  cpf: contact.cpf,
                  phone: contact.phone,
                  cep: contact.cep,
                  street: contact.street,
                  number: contact.number,
                  district: contact.district,
                  city: contact.city,
                  state: contact.state,
                  complement: contact.complement ?? "",
                }
              : undefined
          }
          onSubmit={(formData) => {
            if (isEditMode) {
              updateContact.mutate(formData);
              return;
            }

            createContact.mutate(formData);
          }}
          isPending={isEditMode ? updateContact.isPending : createContact.isPending}
          submitLabel={isEditMode ? "Salvar alteracoes" : "Criar contato"}
        />
      </div>
    </div>
  );
}
