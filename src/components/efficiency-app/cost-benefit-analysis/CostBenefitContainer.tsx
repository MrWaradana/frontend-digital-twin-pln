"use client";

import { useGetDataCostBenefit } from "@/lib/APIs/useGetDataCostBenefit";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import AsyncSelect from "react-select/async";
import { useGetData } from "@/lib/APIs/useGetData";

export default function CostBenefitContainer() {
  const { data: session } = useSession();
  const [costThreshold, setCostThreshold] = useState("");
  const [dataId, setDataId] = useState("");

  const { data, error, mutate, isLoading, isValidating } =
    useGetDataCostBenefit(session?.user.access_token, costThreshold, dataId);

  const {
    data: efficiencyData,
    error: errorEfficiencyData,
    mutate: mutateEfficiencyData,
    isLoading: isLoadingEfficiencyData,
    isValidating: isValidatingEfficiencyData,
  } = useGetData(session?.user.access_token, 0);

  const [costInitialThreshold, setInitialCostThreshold] = useState("");

  const costData = data?.cost_benefit_result ?? [];
  const selectedEfficiencyData = efficiencyData?.transactions ?? [];
  const costThresholdData = data?.cost_threshold ?? 0;
  // const costData = data ?? [];

  // Dummy Data
  const EfficiencyDataOptions = selectedEfficiencyData
    .filter(
      (item) => item.status === "Done" && item.jenis_parameter === "current"
    )
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });

  // Function to filter efficiency data based on user input
  const filterEfficiencyData = (inputValue: string) => {
    return EfficiencyDataOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Load options asynchronously
  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterEfficiencyData(inputValue));
    }, 1000); // Simulating a delay for async data fetching
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
        {isLoadingEfficiencyData ? (
          "Loading..."
        ) : (
          <AsyncSelect
            className="z-[99]"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            loadOptions={loadOptions}
            defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
            cacheOptions // Caches the loaded options
            isLoading={isLoadingEfficiencyData}
            onChange={(e) => {
              //@ts-ignore
              setDataId(e?.value ?? "new");
            }}
            name="efficiencyData"
          />
        )}
        <hr />
      </div>
      {isLoading || isValidating ? (
        <div className="w-full flex justify-center">
          <Spinner label={`Loading...`} />
        </div>
      ) : (
        <div>
          {/* {JSON.stringify(data)} */}
          <h2>
            Showing <span className="font-semibold pl-1 ">{data?.name}</span>
          </h2>
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
