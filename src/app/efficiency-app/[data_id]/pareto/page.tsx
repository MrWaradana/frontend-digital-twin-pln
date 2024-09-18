"use client";

import TablePareto from "@/components/efficiency-app/TablePareto";
// import TableParetoEdit from "@/components/efficiency-app/TableParetoEdit";
import { Button, CircularProgress, Link, Spinner } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import MultipleLineChart from "@/components/MultipleLineChart";
import LineBarAreaComposedChart from "@/components/LineBarAreaComposedChart";
import { columns, users, statusOptions } from "@/lib/pareto-data";
import { paretoData, ParetoType } from "@/lib/pareto-api-data";
import TableParetoHeatloss from "@/components/efficiency-app/TableParetoHeatloss";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useEffect, useMemo, useState, useRef } from "react";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { useGetDataPareto } from "@/lib/APIs/useGetDataPareto";
import { useSession } from "next-auth/react";
import {
  DataParetoList,
  ParetoResultDataList,
} from "@/lib/APIs/useGetDataPareto";

export default function Page({ params }: { params: { data_id: string } }) {
  const [tableParetoData, setTableParetoData] = useState([]);
  const [percentageThreshold, setPercentageThreshold] = useState(100);
  const [isMutating, setIsMutating] = useState(false);
  const session = useSession();

  const { data, mutate, isLoading, error, isValidating } = useGetDataPareto(
    session?.data?.user.access_token,
    params.data_id,
    percentageThreshold
  );

  console.log(data?.pareto_result, "table data pareto");

  const tableData = data?.pareto_result ?? [];
  const summaryData = data ?? [];
  const chartDataRef = useRef<any | null>(null);
  // Recalculate chartData every time tableData or validation state changes
  const chartData = useMemo(() => {
    const mapped_data = tableData.map((item: any, index: number) => {
      const cum_frequency = tableData
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
    });

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
  }, [tableData]);

  const onMutate = () => {
    setIsMutating(true);
    mutate();
    setIsMutating(false);
  };

  useEffect(() => {
    setIsMutating(true);
    onMutate();
    setIsMutating(false);
  }, [percentageThreshold]);

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center mt-12">
  //       <CircularProgress color="primary" />
  //     </div>
  //   );
  if (error) return <div>{error.message}</div>;

  return (
    <EfficiencyContentLayout title="Pareto Heat Loss">
      <div
        className="flex flex-col w-full items-center justify-center mt-24"
        id="root"
      >
        Pareto Page
        <Button
          as={Link}
          color="primary"
          startContent={<ChevronLeftIcon size={18} />}
          href={`/efficiency-app`}
          size="sm"
        >
          Back to all data
        </Button>
        <MultipleLineChart
          data={chartData}
          onThresholdChange={setPercentageThreshold}
          thresholdNumber={percentageThreshold}
        />
        {isLoading ? (
          <Spinner color="primary" label="loading..." />
        ) : (
          <div className="max-w-full max-h-[564px] mb-24 mt-12 overflow-auto relative">
            {isValidating || isMutating ? (
              <div className="h-36">
                <Spinner color="primary" label="validating..." />
              </div>
            ) : (
              <TableParetoHeatloss
                tableData={tableData}
                summaryData={summaryData}
                mutate={onMutate}
                isValidating={isValidating}
                data_id={params.data_id}
                setIsMutating={setIsMutating}
              />
            )}
          </div>
        )}
      </div>
    </EfficiencyContentLayout>
  );
}
