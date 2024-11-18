"use client";

import ListEquipment from "@/components/pfi-app/ListEquipment";
import PowerPlant from "@/components/pfi-app/PowerPlant";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetEquipmentByParams } from "@/lib/APIs/useGetEquipments";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();

  const {
    data: equipmentsData,
    isLoading,
    isValidating,
    mutate
  } = useGetEquipmentByParams(session?.user.access_token, "TJB 3");

  const equipments = equipmentsData?.equipments ?? [];

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
        <PowerPlant equipments={equipments} />

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
