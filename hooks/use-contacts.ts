"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as contactsApi from "@/lib/contacts";
import { ApiError } from "@/lib/api";
import type { ContactFormData } from "@/lib/validations/contact";

export function useContacts(page = 1, search?: string) {
  return useQuery({
    queryKey: ["contacts", { page, search }],
    queryFn: () => contactsApi.listContacts(page, search),
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: () => contactsApi.getContact(id),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ContactFormData) => contactsApi.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contato criado com sucesso!");
      router.push("/contacts");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.data.errors) {
        const errors = error.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError || "Erro ao criar contato.");
      } else {
        toast.error("Erro ao criar contato. Tente novamente.");
      }
    },
  });
}

export function useUpdateContact(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ContactFormData) =>
      contactsApi.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contato atualizado com sucesso!");
      router.push("/contacts");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.data.errors) {
        const errors = error.data.errors as Record<string, string[]>;
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError || "Erro ao atualizar contato.");
      } else {
        toast.error("Erro ao atualizar contato. Tente novamente.");
      }
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contato excluido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir contato. Tente novamente.");
    },
  });
}
