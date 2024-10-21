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
import AsyncSelect from "react-select/async";
import { useSelectedEfficiencyDataStore } from "@/store/selectedEfficiencyData";
import { useGetData } from "@/lib/APIs/useGetData";

const BarChartNPHR = dynamic(
  () => import("@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR")
);

export default function Page({ params }: { params: { data_id: string } }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const [niagaNphr, setNiagaNphr] = useState(0);
  const [dataId, setDataId] = useState("");
  // const selectedEfficiencyData = useSelectedEfficiencyDataStore(
  //   (state) => state.selectedEfficiencyData
  // );

  // const setSelectedEfficiencyData = useSelectedEfficiencyDataStore(
  //   (state) => state.setSelectedEfficiencyData
  // );

  const {
    data: efficiencyData,
    error: errorEfficiencyData,
    mutate: mutateEfficiencyData,
    isLoading: isLoadingEfficiencyData,
    isValidating: isValidatingEfficiencyData,
  } = useGetData(session?.user.access_token, 0);

  const { data, isLoading } = useGetNphrNiaga(session?.user.access_token);

  const selectedEfficiencyData = efficiencyData?.transactions ?? [];
  // console.log(selectedEfficiencyData, "selected");
  const {
    data: dataNPHR,
    mutate,
    isLoading: isLoadingNPHR,
    isValidating,
    error,
  } = useGetDataNPHR(session?.user.access_token, dataId);

  const nphr_niaga = data ?? [];

  useEffect(() => {
    if (nphr_niaga.length > 0) {
      const nphr =
        nphr_niaga.find((item) => item.name === "Niaga")?.nphr_value ?? 0;
      setNiagaNphr(nphr);
    }
  }, [nphr_niaga]);

  const EfficiencyDataOptions = selectedEfficiencyData
    .filter(
      (item) => item.status === "Done" && item.jenis_parameter === "current"
    )
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });

  // Function to filter efficiency data based on user input
  const filterEfficiencyData = (inputValue: string) => {
    return EfficiencyDataOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Load options asynchronously
  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterEfficiencyData(inputValue));
    }, 1000); // Simulating a delay for async data fetching
  };

  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      <div
        className={`flex gap-12 items-center justify-between fixed top-20 right-16 z-50`}
      >
        <div className="flex flex-col w-1/4">
          {isLoadingEfficiencyData ? (
            "Loading..."
          ) : (
            <AsyncSelect
              className="z-[99] min-w-64"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              loadOptions={loadOptions}
              placeholder={`Select Data...`}
              defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
              cacheOptions // Caches the loaded options
              isLoading={isLoadingEfficiencyData}
              onChange={(e) => {
                //@ts-ignore
                setDataId(e?.value ?? "new");
              }}
              name="efficiencyData"
            />
          )}
          <hr />
        </div>
        <Button
          color="primary"
          isLoading={isLoadingNPHR}
          startContent={
            <>
              <PlusIcon />
            </>
          }
          size="sm"
          onPress={onOpen}
          className={`${
            session?.user.user.role === "Management" ? "hidden" : ""
          }`}
        >
          Input Niaga
        </Button>
      </div>
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
