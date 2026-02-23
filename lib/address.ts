import { api } from "./api";

export type ViaCepAddress = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type SearchAddressParams = {
  uf: string;
  city: string;
  street: string;
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

export async function searchAddress(
  params: SearchAddressParams
): Promise<ViaCepAddress[]> {
  const query = new URLSearchParams({
    uf: params.uf.trim().toUpperCase(),
    city: params.city.trim(),
    street: params.street.trim(),
  });

  const response = await api<{ data: ViaCepAddress[] }>(
    `/address/search?${query.toString()}`
  );

  return response.data ?? [];
}
