"use client";

import ListEquipment from "@/components/pfi-app/ListEquipment";
import PowerPlant from "@/components/pfi-app/PowerPlant";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetEquipment, useGetEquipmentByParams } from "@/lib/APIs/useGetEquipments";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";


const Page = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();

  const {
    data: equipmentsData,
    isLoading,
    isValidating,
    mutate
  } = useGetEquipment(session?.user.access_token, params.id);

  const {
    data: tjbEquipments,
  } = useGetEquipmentByParams(session?.user.access_token, "TJB 3");


  const equipments = equipmentsData?.equipments ?? [];
  const tjbData = tjbEquipments?.equipments ?? [];

  if (isLoading || isValidating)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading ? "Loading..." : "Validating..."}
        />
      </div>
    );

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <PowerPlant equipments={tjbData} />

        <ListEquipment dataRow={equipments}
          mutate={mutate}
          isValidating={isValidating}
          parent_id={null}
          title={"TJB 3 Master Equipment Healt"} />
      </div>
    </PFIContentLayout>
  );
};

export default Page;
