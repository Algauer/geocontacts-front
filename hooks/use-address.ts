"use client";

import { useState } from "react";
import { lookupCep, type ViaCepAddress } from "@/lib/address";

export function useCepLookup() {
  const [isLoading, setIsLoading] = useState(false);

  async function fetchAddress(cep: string): Promise<ViaCepAddress | null> {
    setIsLoading(true);
    try {
      return await lookupCep(cep);
    } finally {
      setIsLoading(false);
    }
  }

  return { fetchAddress, isLoading };
}
