"use client";

import TableEquipment from "@/components/pfi-app/TableEquipment";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetCategories } from "@/lib/APIs/useGetCategoryPfi";
import { useGetEqTrees } from "@/lib/APIs/useGetEqTree";
import { useGetEquipments } from "@/lib/APIs/useGetEquipments";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  const {
    data: equipmentsData,
    isValidating,
    mutate,
  } = useGetEquipments(session?.user.access_token);

  const { data: categoriesData } = useGetCategories(session?.user.access_token);
  const { data: eqTreesData } = useGetEqTrees(session?.user.access_token);

  const equipments = equipmentsData?.equipments ?? [];
  const categories = categoriesData ?? [];
  const eqTrees = eqTreesData ?? [];

  return (
    <PFIContentLayout title="Intelligent P-F Interval Equipments">
      <div className="flex flex-col items-center justify-center mt-8">
        {/* Content */}
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          <div className="w-full text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              Equipment Lists
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage your equipment efficiently by viewing the list below.
            </p>
          </div>

          {/* Table disini */}
          <TableEquipment
            dataRow={equipments}
            categories={categories}
            eqTrees={eqTrees}
            mutate={mutate}
            isValidating={isValidating}
            parent_id={null}
            isCreated={false}
          />
        </div>
      </div>
    </PFIContentLayout>
  );
}
