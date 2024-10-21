"use client";

import React from "react";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useSession } from "next-auth/react";
import { useGetEquipment } from "@/lib/APIs/useGetEquipments";
import { useGetCategories } from "@/lib/APIs/useGetCategoryPfi";
import { useGetEqTrees } from "@/lib/APIs/useGetEqTree";
import { CircularProgress, Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import TableEquipment from "@/components/pfi-app/TableEquipment";

const Page = ({ params }: { params: { equipment_id: string } }) => {
  const { data: session } = useSession();
  const id = params.equipment_id;
  const [isLoading, setLoading] = React.useState(true);

  const {
    data: equipmentsData,
    isLoading: equipmentLoading,
    isValidating,
    mutate,
  } = useGetEquipment(session?.user.access_token, id);

  const { data: categoriesData } = useGetCategories(session?.user.access_token);
  const { data: eqTreesData } = useGetEqTrees(session?.user.access_token);

  if (isLoading && equipmentLoading) {
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress color="primary" />
        Loading ...
      </div>
    );
  }

  const childrens = equipmentsData?.children ?? [];
  const categories = categoriesData ?? [];
  const eqTrees = eqTreesData ?? [];

  return (
    <PFIContentLayout title="All PFI Data">
      <div className="flex flex-col items-center justify-center mt-24">
        {/* Content */}
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          <div className="w-full text-left">
            <Button
              as={Link}
              href={`/pfi-app`}
              color="primary"
              size="sm"
              className="mb-10"
            >
              <ChevronLeftIcon size={12} />
              Back to main
            </Button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {equipmentsData?.name} Sub Equipment Lists
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Manage your {equipmentsData?.name} sub equipments by viewing the
              list below.
            </p>
          </div>

          {/* Table disini */}
          <TableEquipment
            dataRow={childrens}
            categories={categories}
            eqTrees={eqTrees}
            mutate={mutate}
            isValidating={isValidating}
            parent_id={id}
          />
        </div>
      </div>
    </PFIContentLayout>
  );
};

export default Page;
