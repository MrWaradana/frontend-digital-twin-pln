import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface Category {
  id: string
  name: string,
  created_at: string,
  updated_at: string,
}

export function useGetCategories(
  token: string | undefined,
): HookReply<Array<Category>> {
  return useApiFetch(
      `${PFI_API_URL}/categories`,
      !!token,
      token
  )
}