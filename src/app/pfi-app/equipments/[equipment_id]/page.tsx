"use client";

import React from "react";

import TableEquipment from "@/components/pfi-app/TableEquipment";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetCategories } from "@/lib/APIs/useGetCategoryPfi";
import { useGetEqTrees } from "@/lib/APIs/useGetEqTree";
import { useGetEquipment } from "@/lib/APIs/useGetEquipments";
import { Button, CircularProgress, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { equipment_id: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
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

  const childrens = equipmentsData?.equipments ?? [];
  const categories = categoriesData ?? [];
  const eqTrees = eqTreesData ?? [];

  return (
    <PFIContentLayout title="Intelligent P-F Interval Equipments">
      <div className="flex flex-col items-center justify-center mt-8">
        {/* Content */}
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          <div className="w-full text-left">
            <Button
              as={Link}
              onPress={() => router.back()}
              color="primary"
              size="sm"
              className="mb-10"
            >
              <ChevronLeftIcon size={12} />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {childrens[0]?.parent.name} Lists
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Manage your {childrens[0]?.parent.name + " " + childrens[0]?.equipment_tree.name}
              {" "}by viewing the list below.
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
            isCreated={true}
          />
        </div>
      </div>
    </PFIContentLayout>
  );
};

export default Page;
