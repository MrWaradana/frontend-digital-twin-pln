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
import { DataParetoList } from "@/lib/APIs/useGetDataPareto";

export default function Page({ params }: { params: { data_id: string } }) {
  const [tableParetoData, setTableParetoData] = useState([]);
  const [percentageThreshold, setPercentageThreshold] = useState(100);
  const session = useSession();

  const { data, mutate, isLoading, error, isValidating } = useGetDataPareto(
    session?.data?.user.access_token,
    params.data_id,
    percentageThreshold
  );
  const tableData = data ?? [];
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
    return mapped_data;
  }, [tableData]);

  const onMutate = () => {
    mutate();
  };

  useEffect(() => {
    mutate();
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
        <div className="max-w-full max-h-[564px] mb-24 mt-12 overflow-auto relative">
          {isLoading || isValidating ? (
            <div className="h-36">
              <Spinner color="primary" label="loading..." />
            </div>
          ) : (
            <TableParetoHeatloss tableData={tableData} mutate={onMutate} />
          )}
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
