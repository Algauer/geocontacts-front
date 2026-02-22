import { z } from "zod";

function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let remainder = sum % 11;
  const first = remainder < 2 ? 0 : 11 - remainder;
  if (Number(digits[9]) !== first) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  remainder = sum % 11;
  const second = remainder < 2 ? 0 : 11 - remainder;
  return Number(digits[10]) === second;
}

export const contactSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  cpf: z
    .string()
    .min(1, "CPF obrigatorio")
    .refine((val) => isValidCpf(val), { message: "CPF invalido" }),
  phone: z.string().min(1, "Telefone obrigatorio"),
  cep: z.string().min(1, "CEP obrigatorio"),
  street: z.string().min(1, "Rua obrigatoria"),
  number: z.string().min(1, "Numero obrigatorio"),
  district: z.string().min(1, "Bairro obrigatorio"),
  city: z.string().min(1, "Cidade obrigatoria"),
  state: z
    .string()
    .min(1, "Estado obrigatorio")
    .length(2, "Use a sigla do estado (ex: SP)"),
  complement: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function sanitizeContactFormData(data: ContactFormData): ContactFormData {
  return {
    ...data,
    cpf: onlyDigits(data.cpf),
  };
}
