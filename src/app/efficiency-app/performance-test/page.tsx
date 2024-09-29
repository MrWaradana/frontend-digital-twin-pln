"use client";

import TablePerformanceTest from "@/components/efficiency-app/nett-plant-heat-rate/TablePerformanceTest";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetData } from "../../../lib/APIs/useGetData";
import { useSession } from "next-auth/react";
import MultipleLineChart from "../../../components/efficiency-app/performance-test/MultipleLineChart";

export default function Page() {
  const session = useSession();
  const { data, isLoading, isValidating, mutate } = useGetData(
    session?.data?.user.access_token,
    1
  );

  const performanceData = data?.transactions ?? [];

  return (
    <EfficiencyContentLayout title="Performance Test">
      <div className="flex flex-col gap-8">
        <section>
          <MultipleLineChart data={performanceData} />
        </section>
        <section>
          <TablePerformanceTest
            tableData={performanceData}
            isLoading={isLoading}
            isValidating={isValidating}
            addNewUrl="/efficiency-app/performance-test/input"
          />
        </section>
      </div>
    </EfficiencyContentLayout>
  );
}
