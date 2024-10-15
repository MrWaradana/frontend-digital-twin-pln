"use client";

import { useGetDataCostBenefit } from "@/lib/APIs/useGetDataCostBenefit";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import AsyncSelect from "react-select/async";

export default function CostBenefitContainer() {
  const { data: session } = useSession();
  const [costThreshold, setCostThreshold] = useState("");

  const { data, error, mutate, isLoading, isValidating } =
    useGetDataCostBenefit(session?.user.access_token, costThreshold);

  const [costInitialThreshold, setInitialCostThreshold] = useState("");

  const costData = data?.cost_benefit_result ?? [];
  const costThresholdData = data?.cost_threshold ?? 0;
  // const costData = data ?? [];

  // Dummy Data
  const DateOptions = [
    { value: "12-12-2024", label: "12-12-2024", date: "12-12-2024" },
    { value: "13-12-2024", label: "13-12-2024", date: "13-12-2024" },
    { value: "14-12-2024", label: "14-12-2024", date: "14-12-2024" },
  ];

  const filterDates = (inputValue: string) => {
    return DateOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue: string, callback: (options) => void) => {
    setTimeout(() => {
      callback(filterDates(inputValue));
    }, 1000);
  };

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-1/4">
        <p>Select Data</p>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          placeholder={"Select Cost Benefit Data..."}
          defaultOptions
          defaultValue={"12-12-2024"}
          className="z-[100]"
          isDisabled={true}
        />
        <hr />
      </div>
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
