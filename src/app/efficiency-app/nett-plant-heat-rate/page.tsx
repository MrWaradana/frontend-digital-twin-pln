"use client";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
// import BarChartNPHR from "@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR";
import { Button, Link, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import ModalNPHRInput from "@/components/efficiency-app/nett-plant-heat-rate/ModalNPHRInput";
import dynamic from "next/dynamic";
import { useGetNphrNiaga } from "@/lib/APIs/useGetNphrNiaga";
import { useGetDataNPHR } from "@/lib/APIs/useGetDataNPHR";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelectedEfficiencyDataStore } from "../../../store/selectedEfficiencyData";

const BarChartNPHR = dynamic(
  () => import("@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR")
);

export default function Page({ params }: { params: { data_id: string } }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const [niagaNphr, setNiagaNphr] = useState(0);

  const selectedEfficiencyData = useSelectedEfficiencyDataStore(
    (state) => state.selectedEfficiencyData
  );

  const setSelectedEfficiencyData = useSelectedEfficiencyDataStore(
    (state) => state.setSelectedEfficiencyData
  );

  const { data, isLoading } = useGetNphrNiaga(session?.user.access_token);

  // console.log(selectedEfficiencyData, "selected");
  const {
    data: dataNPHR,
    mutate,
    isLoading: isLoadingNPHR,
    isValidating,
    error,
  } = useGetDataNPHR(session?.user.access_token, selectedEfficiencyData);

  const nphr_niaga = data ?? [];

  useEffect(() => {
    if (nphr_niaga.length > 0) {
      const nphr =
        nphr_niaga.find((item) => item.name === "Niaga")?.nphr_value ?? 0;
      setNiagaNphr(nphr);
    }
  }, [nphr_niaga]);

  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      <Button
        color="primary"
        isLoading={isLoadingNPHR}
        startContent={
          <>
            <PlusIcon />
          </>
        }
        onPress={onOpen}
        className={`${
          session?.user.user.role === "Management" ? "hidden" : ""
        }`}
      >
        Input Niaga
      </Button>
      <ModalNPHRInput
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        niagaData={nphr_niaga}
        setNiagaValue={setNiagaNphr}
        niagaValue={niagaNphr}
      />
      <div>
        <BarChartNPHR
          data={dataNPHR}
          isLoading={isLoadingNPHR}
          isValidating={isValidating}
          error={error}
          niagaLoading={isLoading}
          niagaNPHR={niagaNphr}
        />
      </div>
    </EfficiencyContentLayout>
  );
}
