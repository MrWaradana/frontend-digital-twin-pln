"use client";

import ListEquipment from "@/components/pfi-app/ListEquipment";
import PowerPlant from "@/components/pfi-app/PowerPlant";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetEquipments } from "@/lib/APIs/useGetEquipments";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data: session } = useSession();

  const {
    data: equipmentsData,
    isLoading,
    isValidating,
    mutate
  } = useGetEquipments(session?.user.access_token);

  const equipments = equipmentsData?.equipments ?? [];
  const data = React.useMemo(() => {
    return equipments.map(((item, index) => {
      return { ...item, index: index + 1 }
    }))
  }, [equipments])

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

        <ListEquipment dataRow={data}
          mutate={mutate}
          isValidating={isValidating}
          parent_id={null}
          title={"TJB 3 Master Equipment Healt"} />
      </div>
    </PFIContentLayout>
  );
};

export default Page;
