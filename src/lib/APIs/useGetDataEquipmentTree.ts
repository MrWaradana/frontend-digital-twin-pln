import { LCCA_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

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

export function useGetDataEquipmentTree(
    token: string | undefined,
    parent_id?: string | undefined
): HookReply<EquipmentMaster[]> {

    return useApiFetch(
        `${LCCA_API_URL}/equipment-master${parent_id ? `?parent_id=${parent_id}` : ``}`,
        !!token,
        token
    );



}
