"use client";

import { useGetDataCostBenefit } from "@/lib/APIs/useGetDataCostBenefit";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

export default function CostBenefitContainer() {
  const { data: session } = useSession();
  const [costThreshold, setCostThreshold] = useState("");

  const { data, error, mutate, isLoading, isValidating } =
    useGetDataCostBenefit(session?.user.access_token, costThreshold);

  const [costInitialThreshold, setInitialCostThreshold] = useState("");

  const costData = data?.cost_benefit_result ?? [];
  const costThresholdData = data?.cost_threshold ?? 0;
  // const costData = data ?? [];

  // const debounced = useDebouncedCallback(
  //   // function
  //   (value) => {
  //     setInitialCostThreshold(String(value));
  //   },
  //   // delay in ms
  //   500
  // );

  // Effect to update the costInitialThreshold once data is fetched
  useEffect(() => {
    if (data) {
      setCostThreshold(String(data.cost_threshold));
      setInitialCostThreshold(String(data.cost_threshold));
    }
  }, [data]);

  // useEffect(() => {
  //   if (costData) {
  //     setInitialCostThreshold(String(costInitialThreshold));
  //   }
  // }, [costData]);

  if (error) {
    toast.error(`${JSON.stringify(error)}`);
  }

  // Handle the filter button click
  const handleFilterClick = () => {
    setCostThreshold(costInitialThreshold); // Update the costThreshold when button is clicked
  };

  return (
    <div>
      {isLoading || isValidating ? (
        <div className="w-full flex justify-center">
          <Spinner label={`Loading...`} />
        </div>
      ) : (
        <div>
          <TableParetoHeatlossCost
            tableData={costData}
            summaryData={data}
            setCostThreshold={setCostThreshold}
            isValidating={isValidating}
            isLoading={isLoading}
            costThresholdData={costThresholdData}
            setInitialCostThreshold={setInitialCostThreshold}
            costThreshold={costThreshold}
            costInitialThreshold={costInitialThreshold}
            handleFilterClick={handleFilterClick}
            mutate={mutate}
          />
          {/* <div>{JSON.stringify(data?.cost_benefit_result)}</div> */}
        </div>
      )}
    </div>
  );
}
