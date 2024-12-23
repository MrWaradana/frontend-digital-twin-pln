"use client";

import { useSession } from "next-auth/react";
import MultipleLineChart from "@/components/optimum-oh-app/target-reliability/MultipleLineChart";
import TableTargetReliability from "./target-reliability/TableTargetReliability";
import { useGetTargetReliabilityCalculation } from "@/lib/APIs/useGetTargetReliabilityCalculation";
import { json } from "stream/consumers";
import { useMemo, useState } from "react";

export default function TargetReliabilityContainer() {
  const { data: session } = useSession();
  const [eaf, setEaf] = useState(100)
  const [selectedScope, setSelectedScope] = useState("A")

  const {
    data,
    mutate,
    isLoading,
    isValidating
  } = useGetTargetReliabilityCalculation(session?.user.access_token, selectedScope, eaf)

  const targetReliabilityData = data ?? []

  const chartData = useMemo(() => {
    if (!targetReliabilityData?.length) return [];

    let cumValue = 0;
    const totalEAF = targetReliabilityData.reduce((sum, item) => sum + item.eaf, 0);

    return targetReliabilityData.map((item) => {
      cumValue += item.eaf;
      return {
        ...item,
        cum_frequency: (cumValue / totalEAF) * 100 // Convert to percentage
      };
    });
  }, [targetReliabilityData]); // Empty dependency array means it will only calculate once on mount


  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl">
        <MultipleLineChart
          data={chartData}
          thresholdNumber={eaf}
          onFilterScopeChange={setSelectedScope}
          onThresholdChange={setEaf}
        />
      </div>



      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl">
        <TableTargetReliability
          tableData={targetReliabilityData}
          isValidating={isLoading || isValidating}
        />
      </div>
    </section>
  );
}


