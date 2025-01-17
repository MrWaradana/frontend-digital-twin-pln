import { KeyedMutator } from 'swr';

interface HookLoadingReply {
  data?: undefined;
  isLoading: true;
  isValidating: boolean;
  error?: undefined;
  mutate: KeyedMutator<unknown>;
}

interface HookLoadedReply<T = unknown> {
  data?: T;
  isLoading: false;
  isValidating: boolean;
  error?: Error;
  mutate: KeyedMutator<T>;
}

// types.ts
export interface ApiError extends Error {
  status: number;
  message: string;
}

export type HookReply<T = unknown> = HookLoadingReply | HookLoadedReply<T>;


