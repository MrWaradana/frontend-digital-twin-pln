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
import { useEffect, useState, useRef, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { useSelectedEfficiencyDataStore } from "@/store/selectedEfficiencyData";
import { useGetData } from "@/lib/APIs/useGetData";
import MultipleLineChart from "@/components/efficiency-app/nett-plant-heat-rate/MultipleLineChart";

const BarChartNPHR = dynamic(
  () => import("@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR")
);

export default function Page({ params }: { params: { data_id: string } }) {
  const { isOpen, onOpen: onOpenTarget, onOpenChange } = useDisclosure();
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

  // ==================================================================================

  const summaryData = dataNPHR ?? [];
  const chartParetoData = dataNPHR?.chart_result ?? [];
  const nphrData: any = dataNPHR?.nphr_result ?? [];
  const paretoData: any = dataNPHR?.pareto_result ?? [];
  const chartDataRef = useRef<any | null>(null);
  const chartParetoDataWithCumFeq = useMemo(() => {
    const mapped_data = chartParetoData
      .map((item: any, index: number) => {
        const cum_frequency = chartParetoData
          .slice(0, index + 1) // Get all previous items up to the current index
          .reduce(
            (acc: any, current: { total_persen_losses: any }) =>
              acc + current.total_persen_losses,
            0
          ); // Accumulate total_persen_losses
        return {
          ...item, // Spread the original item
          cum_frequency, // Add the accumulated frequency
        };
      })
      // .filter((item: any) => item.cum_frequency <= 300 && );
      .filter((item: any) => item.category);

    // console.log(mapped_data, "mapped chart data");
    //   return mapped_data;
    // }, [tableData]);

    // Ensure that chartDataRef is always updated correctly
    if (!chartDataRef.current) {
      chartDataRef.current = mapped_data;
    } else if (chartDataRef.current.length === mapped_data.length) {
      // Preserve array length and only update necessary fields
      chartDataRef.current = chartDataRef.current.map(
        (item: any, index: number) => ({
          ...item,
          total_persen_losses: mapped_data[index].total_persen_losses,
          total_nilai_losses: mapped_data[index].total_nilai_losses,
          cum_frequency: mapped_data[index].cum_frequency,
        })
      );
    } else {
      // In case of mismatch, reset chartDataRef to match the mapped_data
      chartDataRef.current = mapped_data;
    }

    // if (chartDataRef.current != null && mapped_data.length > 0) {
    //   chartDataRef.current = mapped_data;
    // }

    return chartDataRef.current;
  }, [chartParetoData]);

  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      <ModalNPHRInput
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        niagaData={nphr_niaga}
        setNiagaValue={setNiagaNphr}
        niagaValue={niagaNphr}
      />
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
        <div>
          <div>
            <BarChartNPHR
              data={dataNPHR}
              isLoading={isLoadingNPHR}
              isValidating={isValidating}
              error={error}
              niagaLoading={isLoading}
              niagaNPHR={niagaNphr}
              chartParetoDataWithCumFeq={chartParetoDataWithCumFeq}
              summaryData={summaryData}
              paretoData={paretoData}
              nphrData={nphrData}
              isLoadingEfficiencyData={isLoadingEfficiencyData}
              loadOptions={loadOptions}
              EfficiencyDataOptions={EfficiencyDataOptions}
              isLoadingNPHR={isLoadingNPHR}
              onOpenTarget={onOpenTarget}
              setDataId={setDataId}
            />
          </div>
        </div>
        <div>
          <MultipleLineChart
            data={chartParetoDataWithCumFeq}
            summaryData={summaryData}
            paretoData={paretoData}
            nphrData={nphrData}
          />
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
