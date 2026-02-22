import { api } from "./api";
import type { ContactFormData } from "./validations/contact";

export type Contact = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  complement: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
};

export async function listContacts(
  page = 1,
  search?: string
): Promise<PaginatedResponse<Contact>> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return api<PaginatedResponse<Contact>>(`/contacts?${params}`);
}

export async function getContact(id: string): Promise<{ data: Contact }> {
  return api<{ data: Contact }>(`/contacts/${id}`);
}

export async function createContact(
  data: ContactFormData
): Promise<{ data: Contact }> {
  return api<{ data: Contact }>("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateContact(
  id: string,
  data: ContactFormData
): Promise<{ data: Contact }> {
  return api<{ data: Contact }>(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteContact(id: string): Promise<void> {
  await api(`/contacts/${id}`, { method: "DELETE" });
}
