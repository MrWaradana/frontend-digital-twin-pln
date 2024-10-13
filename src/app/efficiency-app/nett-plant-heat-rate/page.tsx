"use client";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
// import BarChartNPHR from "@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR";
import { Button, Link, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import ModalNPHRInput from "@/components/efficiency-app/nett-plant-heat-rate/ModalNPHRInput";
import dynamic from "next/dynamic";
import { useGetNphrNiaga } from "@/lib/APIs/useGetNphrNiaga";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const BarChartNPHR = dynamic(() => import('@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR'));


export default function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const [niagaNphr, setNiagaNphr] = useState(0)

  const {
    data,
    isLoading
  } = useGetNphrNiaga(session?.user.access_token)

  const nphr_niaga = data ?? []

  useEffect(() => {
    if (nphr_niaga.length > 0) {
      const nphr = nphr_niaga.find(item => item.name === "Niaga")?.nphr_value ?? 0;
      setNiagaNphr(nphr);
    }
  }, [nphr_niaga]);


  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      <Button
        color="primary"
        startContent={
          <>
            <PlusIcon />
          </>
        }
        onPress={onOpen}
      >
        Input Niaga
      </Button>
      <ModalNPHRInput isOpen={isOpen} onOpenChange={onOpenChange} niagaData={nphr_niaga} setNiagaValue={setNiagaNphr} niagaValue={niagaNphr} />
      <div>
        <BarChartNPHR niagaLoading={isLoading} niagaNPHR={niagaNphr} />
      </div>
    </EfficiencyContentLayout>
  );
}
