import { PFI_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface Information {
  name: string,
  value: any,
  satuan: string
}


export function useGetInformations(
  token: string | undefined,
  features_id: string,
  part_id: string,
): HookReply<Information[]> {
  return useApiFetch(
    `${PFI_API_URL}/chart/information?part_id=${part_id}&features_id=${features_id}`,
    !!token,
    token,
  )
}
