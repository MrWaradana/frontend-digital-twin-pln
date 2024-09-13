"use client";
import useSWR, { KeyedMutator, SWRConfiguration } from "swr";

import { HookReply } from "./types";
import { useGeneralErrorToast } from "./useGeneralErrorToast";
import { fetcher } from "../fetcher";

export function useApiFetch<T, RawT = T>(
  fetchUrl: string,
  isReadyCondition = true,
  token?: string,
  swrConfig?: SWRConfiguration<RawT | T, Error>,
  customFetcher?: ([url, token]: [string, string]) => Promise<RawT | T>
): HookReply<RawT | T> {
  const isReady = isReadyCondition;

  if (!isReady) console.log("Token is not Ready!");

  const fetcherToUse = customFetcher ? customFetcher : fetcher;

  const {
    data,
    error,
    mutate,
    isLoading: isDataLoading,
    isValidating,
  } = useSWR<RawT | T, Error>(
    isReady ? (token ? [fetchUrl, token] : fetchUrl) : null,
    fetcherToUse,
    swrConfig
  );

  useGeneralErrorToast(error);

  // Must include the isReady check, otherwise isLoading is false, but there is no data or error
  const isLoading = !isReady || isDataLoading;

  if (isLoading) {
    return {
      isLoading: true,
      isValidating,
      data: undefined,
      error: undefined,
      mutate: mutate as KeyedMutator<unknown>,
    };
  }

  return {
    data,
    error,
    isLoading: false,
    isValidating,
    mutate,
  };
}
