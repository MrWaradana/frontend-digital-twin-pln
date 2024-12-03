import { OPTIMUM_OH_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetAvailableEquipment(
  token: string | undefined,
  scope_name: string = "A",
  page: string | number,
  size: string | number
): HookReply<any> {
  return useApiFetch(
    `${OPTIMUM_OH_API_URL}/scope-equipments/available/${scope_name}?${
      page ? `page=${page}` : `page=${1}`
    }${size ? `&itemsPerPage=${size}` : `&itemsPerPage=${5}`}`,
    !!token,
    token,
    {
      keepPreviousData: true,
      refreshInterval: 7200000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      errorRetryInterval: 60000,
      shouldRetryOnError: false,
      // revalidateIfStale: false,
      // revalidateOnMount: false,
    }
  );
}
