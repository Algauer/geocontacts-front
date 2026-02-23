"use client";

import { useState } from "react";
import {
  lookupCep,
  searchAddress,
  type SearchAddressParams,
  type ViaCepAddress,
} from "@/lib/address";

export function useCepLookup() {
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  async function fetchAddress(cep: string): Promise<ViaCepAddress | null> {
    setIsCepLoading(true);
    try {
      return await lookupCep(cep);
    } finally {
      setIsCepLoading(false);
    }
  }

  async function fetchAddressOptions(
    params: SearchAddressParams
  ): Promise<ViaCepAddress[]> {
    setIsSearchLoading(true);
    try {
      return await searchAddress(params);
    } catch {
      return [];
    } finally {
      setIsSearchLoading(false);
    }
  }

  return {
    fetchAddress,
    fetchAddressOptions,
    isCepLoading,
    isSearchLoading,
  };
}
