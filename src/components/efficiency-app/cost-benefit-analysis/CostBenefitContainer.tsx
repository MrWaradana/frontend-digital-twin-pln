"use client";

import { useGetDataCostBenefit } from "@/lib/APIs/useGetDataCostBenefit";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { useEffect, useState } from "react";

export default function CostBenefitContainer() {
  const { data: session } = useSession();
  const [costThreshold, setCostThreshold] = useState("")

  const { data, error, mutate, isLoading, isValidating } =
    useGetDataCostBenefit(session?.user.access_token, costThreshold);

  const costData = data?.cost_benefit_result ?? [];
  const costThresholdData = data?.cost_threshold ?? 0;
  // const costData = data ?? [];

  useEffect(() =>  {
    if(costData){
      setCostThreshold(String(costThresholdData))
    }
    
  }, [costData])


  return (
    <div>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <Spinner label={`Loading...`} />
        </div>
      ) : (
        <div>
          <TableParetoHeatlossCost tableData={costData} summaryData={data} setCostThreshold={setCostThreshold} costThreshold={costThreshold} mutate={mutate} />
          {/* <div>{JSON.stringify(data?.cost_benefit_result)}</div> */}
        </div>
      )}
    </div>
  );
}
