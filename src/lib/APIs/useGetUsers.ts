import { AUTH_API_URL, EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface UserAPIType {
  current_page: number | string;
  has_next_page: boolean;
  has_previous_page: boolean;
  page_size: number | string;
  total_items: number | string;
  total_pages: number | string;
  users: UserType[];
}

interface UserType {
  created_at: string | undefined;
  deleted_at: string | null;
  email: string | undefined;
  id: string | undefined;
  name: string | undefined;
  position: string | undefined;
  role: string | undefined;
  role_id: string | undefined;
  username: string | undefined;
}

export function useGetUsers(token: string | undefined): HookReply<UserAPIType> {
  return useApiFetch(`${AUTH_API_URL}/users?page=1&size=5`, !!token, token, {
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
