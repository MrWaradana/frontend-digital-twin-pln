"use client";

import TablePareto from "@/components/efficiency-app/TablePareto";
// import TableParetoEdit from "@/components/efficiency-app/TableParetoEdit";
import { Button, CircularProgress, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import MultipleLineChart from "../../../../../components/MultipleLineChart";
import LineBarAreaComposedChart from "../../../../../components/LineBarAreaComposedChart";
import { columns, users, statusOptions } from "@/lib/pareto-data";
import { paretoData, ParetoType } from "@/lib/pareto-api-data";
import TableParetoHeatloss from "../../../../../components/efficiency-app/TableParetoHeatloss";
import { EfficiencyContentLayout } from "../../../../../containers/EfficiencyContentLayout";
import { useEffect, useMemo, useState, useRef } from "react";
import { EFFICIENCY_API_URL } from "../../../../../lib/api-url";
import { useGetDataPareto } from "../../../../../lib/APIs/useGetDataPareto";
import { useSession } from "next-auth/react";
import { DataParetoList } from "../../../../../lib/APIs/useGetDataPareto";

export default function Page({
  params,
}: {
  params: { excels_name: string; data_id: string };
}) {
  const [tableParetoData, setTableParetoData] = useState([]);
  const [percentageThreshold, setPercentageThreshold] = useState(100);
  const session = useSession();

  const { data, mutate, isLoading, error } = useGetDataPareto(
    session?.data?.user.accessToken,
    params.data_id,
    percentageThreshold * 10000
  );
  const tableData = data ?? [];
  const chartDataRef = useRef<DataParetoList[] | null>(null);
  // If chartDataRef is null (first load), initialize it with tableData
  const chartData = useMemo(() => {
    if (chartDataRef.current === null && tableData.length > 0) {
      chartDataRef.current = tableData;
    }
    return chartDataRef.current;
  }, [isLoading]);
  useEffect(() => {
    mutate();
  }, [mutate, percentageThreshold]);

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
        <div className="max-w-full h-[564px] px-8 mb-24 mt-12 overflow-auto">
          {isLoading ? (
            <div className="h-36">
              <CircularProgress color="primary" />
            </div>
          ) : (
            <TableParetoHeatloss tableData={tableData} />
          )}
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
