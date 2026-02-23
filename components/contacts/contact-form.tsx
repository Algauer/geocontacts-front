"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { formatCpf, formatPhone, onlyDigits } from "@/lib/contact-format";
import { useCepLookup } from "@/hooks/use-address";
import {
  contactSchema,
  sanitizeContactFormData,
  type ContactFormData,
} from "@/lib/validations/contact";

type ContactFormProps = {
  defaultValues?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  isPending: boolean;
  submitLabel: string;
};

export function ContactForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
}: ContactFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      cpf: formatCpf(defaultValues?.cpf ?? ""),
      phone: formatPhone(defaultValues?.phone ?? ""),
      cep: defaultValues?.cep ?? "",
      street: defaultValues?.street ?? "",
      number: defaultValues?.number ?? "",
      district: defaultValues?.district ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      complement: defaultValues?.complement ?? "",
    },
  });

  const { fetchAddress, isLoading: isCepLoading } = useCepLookup();

  async function handleCepBlur(cepValue: string) {
    const digits = onlyDigits(cepValue);
    if (digits.length !== 8) return;

    const address = await fetchAddress(digits);
    if (!address) return;

    if (address.logradouro) setValue("street", address.logradouro);
    if (address.bairro) setValue("district", address.bairro);
    if (address.localidade) setValue("city", address.localidade);
    if (address.uf) setValue("state", address.uf);
    if (address.complemento) setValue("complement", address.complemento);
  }

  function handleFormSubmit(data: ContactFormData) {
    onSubmit(sanitizeContactFormData(data));
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome *
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          placeholder="Nome completo"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* CPF + Telefone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium mb-1">
            CPF *
          </label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <input
                id="cpf"
                type="text"
                value={formatCpf(field.value ?? "")}
                onChange={(event) => field.onChange(formatCpf(event.target.value))}
                onBlur={field.onBlur}
                ref={field.ref}
                className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            )}
          />
          {errors.cpf && (
            <p className="mt-1 text-xs text-destructive">{errors.cpf.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefone *
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                id="phone"
                type="text"
                value={formatPhone(field.value ?? "")}
                onChange={(event) =>
                  field.onChange(formatPhone(event.target.value))
                }
                onBlur={field.onBlur}
                ref={field.ref}
                className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="(11) 99999-8888"
                maxLength={15}
              />
            )}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* CEP + Rua */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="cep" className="block text-sm font-medium mb-1">
            CEP *
            {isCepLoading && (
              <Loader2
                className="inline-block ml-1 animate-spin text-primary"
                size={12}
              />
            )}
          </label>
          <input
            id="cep"
            type="text"
            {...register("cep", {
              onBlur: (e) => handleCepBlur(e.target.value),
            })}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="01001000"
            maxLength={9}
          />
          {errors.cep && (
            <p className="mt-1 text-xs text-destructive">{errors.cep.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium mb-1">
            Rua *
          </label>
          <input
            id="street"
            type="text"
            {...register("street")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Nome da rua"
          />
          {errors.street && (
            <p className="mt-1 text-xs text-destructive">
              {errors.street.message}
            </p>
          )}
        </div>
      </div>

      {/* Numero + Bairro + Complemento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="number" className="block text-sm font-medium mb-1">
            Numero *
          </label>
          <input
            id="number"
            type="text"
            {...register("number")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="100"
          />
          {errors.number && (
            <p className="mt-1 text-xs text-destructive">
              {errors.number.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium mb-1">
            Bairro *
          </label>
          <input
            id="district"
            type="text"
            {...register("district")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Centro"
          />
          {errors.district && (
            <p className="mt-1 text-xs text-destructive">
              {errors.district.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="complement"
            className="block text-sm font-medium mb-1"
          >
            Complemento
          </label>
          <input
            id="complement"
            type="text"
            {...register("complement")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Apto 12"
          />
        </div>
      </div>

      {/* Cidade + Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Cidade *
          </label>
          <input
            id="city"
            type="text"
            {...register("city")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Sao Paulo"
          />
          {errors.city && (
            <p className="mt-1 text-xs text-destructive">
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">
            Estado *
          </label>
          <input
            id="state"
            type="text"
            {...register("state")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary uppercase"
            placeholder="SP"
            maxLength={2}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-destructive">
              {errors.state.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="animate-spin mx-auto" size={18} />
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
