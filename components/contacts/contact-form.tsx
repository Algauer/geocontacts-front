"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  contactSchema,
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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      cep: "",
      street: "",
      number: "",
      district: "",
      city: "",
      state: "",
      complement: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <input
            id="cpf"
            type="text"
            {...register("cpf")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="00000000000"
            maxLength={11}
          />
          {errors.cpf && (
            <p className="mt-1 text-xs text-destructive">{errors.cpf.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefone *
          </label>
          <input
            id="phone"
            type="text"
            {...register("phone")}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="11999998888"
            maxLength={11}
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
          </label>
          <input
            id="cep"
            type="text"
            {...register("cep")}
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
