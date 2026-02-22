"use client";

import { use } from "react";
import { ContactFormPage } from "@/components/contacts/contact-form-page";

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ContactFormPage mode="edit" contactId={id} />;
}
