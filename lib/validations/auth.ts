import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "Senha obrigatoria"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nome obrigatorio"),
    email: z.string().email("Email invalido"),
    password: z.string().min(8, "Senha deve ter no minimo 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirmacao obrigatoria"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Senhas nao coincidem",
    path: ["password_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalido"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Email invalido"),
    token: z.string().min(1),
    password: z.string().min(8, "Senha deve ter no minimo 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirmacao obrigatoria"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Senhas nao coincidem",
    path: ["password_confirmation"],
  });

export const restoreAccountSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "Senha obrigatoria"),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Senha obrigatoria"),
  immediate: z.boolean().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type RestoreAccountData = z.infer<typeof restoreAccountSchema>;
export type DeleteAccountData = z.infer<typeof deleteAccountSchema>;
