"use client";

import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { EfficiencyContentLayout } from "../../../containers/EfficiencyContentLayout";
import { useGetDataCostBenefit } from "../../../lib/APIs/useGetDataCostBenefit";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";

export default function Page() {
  const session = useSession();

  const { data, error, mutate, isLoading, isValidating } =
    useGetDataCostBenefit(session?.data?.user.access_token);

  const costData = data?.cost_benefit_result ?? [];

  return (
    <EfficiencyContentLayout title={"Cost Benefit Analysis"}>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <Spinner label={`Loading...`} />
        </div>
      ) : (
        <div>
          <TableParetoHeatlossCost tableData={costData} summaryData={data} />
          {/* <div>{JSON.stringify(data?.cost_benefit_result)}</div> */}
        </div>
      )}
    </EfficiencyContentLayout>
  );
}
