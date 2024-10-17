import { AUTH_API_URL, EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface RoleAPIType {
  roles: RoleType[];
  total_items: number | string;
}

interface RoleType {
  created_at: string | number;
  id: string | number;
  name: string | number;
  updated_at: string | number;
}

export function useGetRoles(token: string | undefined): HookReply<RoleAPIType> {
  return useApiFetch(`${AUTH_API_URL}/roles`, !!token, token, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      // @ts-ignore
      if (error.status === 404) return;

      // Never retry for a specific key.
      if (key === "/api/user") return;

      // Only retry up to 10 times.
      if (retryCount >= 10) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
    keepPreviousData: true,
    refreshInterval: 7200000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    errorRetryInterval: 60000,
    shouldRetryOnError: false,
  });
}
