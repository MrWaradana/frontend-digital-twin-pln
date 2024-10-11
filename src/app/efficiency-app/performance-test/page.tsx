"use client";

import TablePerformanceTest from "@/components/efficiency-app/nett-plant-heat-rate/TablePerformanceTest";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetData } from "../../../lib/APIs/useGetData";
import { useSession } from "next-auth/react";
import MultipleLineChart from "../../../components/efficiency-app/performance-test/MultipleLineChart";
import EChartsStackedLine from "../../../components/efficiency-app/performance-test/EChartsStackedLine";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const session = useSession();
  const { data, isLoading, isValidating, mutate } = useGetData(
    session?.data?.user.access_token,
    1
  );

  const thermoStatus = data?.thermo_status ?? false;
  const performanceData = data?.transactions ?? [];

  const chartData = data?.chart_data ?? [];

  // useEffect(() => {
  //   const api = `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/stream`;
  //   const es = new EventSource(api);
  //   // @ts-ignore
  //   es.addEventListener("data_outputs", (e) => {
  //     toast.success(`Efficiency data has been processed!`);
  //     // console.log(e, "DATA STREAM!");
  //     if (pathname === "/efficiency-app/performance-test") {
  //       setTimeout(() => window.location.reload(), 3000);
  //     }
  //   });

  //   // Handle SSE connection errors
  //   es.onerror = (_) => {
  //     toast.error(`Something went wrong!, ${_}`);
  //     // Close the SSE connection
  //     es.close();
  //   };
  // }, []);

  return (
    <EfficiencyContentLayout title="Performance Test">
      <div className="flex flex-col gap-8">
        <section>
          <EChartsStackedLine data={chartData} />
        </section>
        {/* <section>
          <MultipleLineChart data={chartData} />
        </section> */}
        <section>
          <TablePerformanceTest
            tableData={performanceData}
            isLoading={isLoading}
            isValidating={isValidating}
            thermoStatus={thermoStatus}
            addNewUrl="/efficiency-app/performance-test/input"
          />
        </section>
      </div>
    </EfficiencyContentLayout>
  );
}
