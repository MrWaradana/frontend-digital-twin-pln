"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import boiler from "../../../../public/boiler-system.png";
import Image from "next/image";
import TableShow from "@/components/pfi-app/TableShow";
import { Button, CircularProgress, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetEquipment } from "@/lib/APIs/useGetEquipments";
import { useGetCategories } from "@/lib/APIs/useGetCategoryPfi";
import { useGetEqTrees } from "@/lib/APIs/useGetEqTree";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession();
  const id = params.id;

  const {
    data: equipmentsData,
    isLoading,
    isValidating,
    mutate,
  } = useGetEquipment(session?.user.access_token, id);

  const { data: categoriesData } = useGetCategories(session?.user.access_token);
  const { data: eqTreesData } = useGetEqTrees(session?.user.access_token);

  if (isLoading) {
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
      <div className="container mx-auto">
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

          <h1 className="text-3xl font-bold text-gray-800">Equipment Lists</h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage your equipment efficiently by viewing the list below.
          </p>
        </div>

        <div className="flex flex-row mt-14">
          {/* Content */}
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-black-500 mb-5">Overall Observation</h3>
              <Image src={boiler} alt="Boiler system" className="mx-start" />
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-left items-left w-full">
            {/* Table disini */}
            <TableShow
              dataRow={childrens}
              categories={categories}
              eqTrees={eqTrees}
              mutate={mutate}
              isValidating={isValidating}
              parent_id={null}
            />
          </div>
        </div>
      </div>
    </PFIContentLayout>
  );
}
