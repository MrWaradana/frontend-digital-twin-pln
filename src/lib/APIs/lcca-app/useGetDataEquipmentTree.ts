import { LCCA_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface EquipmentMaster {
  id: string;
  name: string;
  equipment_tree_id?: string;
  category_id?: string;
  system_tag?: string;
  assetnum?: string;
  location_tag?: string;
  children: EquipmentMaster[];
}

export interface EquipmentTreeNode {
  key: string;
  label: string;
  data: string;
  children?: EquipmentTreeNode[];
}

export interface EquipmentPagination {
  items: EquipmentMaster[];
  page: number;
  total: number;
  itemsPerPage: number;
  totalPages: number;
}

export function useGetDataEquipmentTree(
  token: string | undefined,
  page: number,
  parent_id?: string | undefined,
  search?: string | undefined
): HookReply<EquipmentPagination> {
  return useApiFetch(
    `${LCCA_API_URL}/equipment-master?page=${page}${
      parent_id ? `&parent_id=${parent_id}` : ``
    }${search ? `${parent_id ? "&" : "?"}search=${search}` : ``}`,
    !!token,
    token
  );
}
