import { api } from "./api";

export type ViaCepAddress = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export async function lookupCep(
  cep: string
): Promise<ViaCepAddress | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await api<{ data: ViaCepAddress }>(
      `/address/${digits}`
    );
    return response.data;
  } catch {
    return null;
  }
}
