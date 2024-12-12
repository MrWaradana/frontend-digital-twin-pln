import { OPTIMUM_OH_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetScopeOH(
  token: string | undefined,
  scope_name: string | undefined,
  page?: number | undefined,
  itemsPerPage?: number | undefined
): HookReply<any> {
  return useApiFetch(
    `${OPTIMUM_OH_API_URL}/scope-equipments?${
      page ? `page=${page}` : `page=${1}`
    }${scope_name ? `&scope_name=${scope_name}` : `&scope_name=A`}${
      itemsPerPage ? `&itemsPerPage=${itemsPerPage}` : `&itemsPerPage=${5}`
    }${scope_name ? `&scope_name=${scope_name}` : ``}`,
    !!token,
    token,
    {
      // keepPreviousData: true,
      // refreshInterval: 7200000,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      // refreshWhenHidden: false,
      // refreshWhenOffline: false,
      // errorRetryInterval: 60000,
      // shouldRetryOnError: false,
      // revalidateIfStale: false,
      // revalidateOnMount: false,
    }
  );
}
