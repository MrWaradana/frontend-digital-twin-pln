"use client";

import { useGetDataCostBenefit } from "@/lib/APIs/useGetDataCostBenefit";
import { useSession } from "next-auth/react";
import { Input, Spinner } from "@nextui-org/react";
import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import AsyncSelect from "react-select/async";
import { useGetData } from "@/lib/APIs/useGetData";
import { debounce } from "lodash";

export default function CostBenefitContainer() {
  const [potentialTimeframe, setPotentialTimeframe]: any = useState(1);
  const [inputValueTimeframe, setInputValueTimeframe]: any = useState(1);
  const { data: session } = useSession();
  const [costThreshold, setCostThreshold] = useState("");
  const [dataId, setDataId]: any = useState("");
  const [selectedLabel, setSelectedLabel]: any = useState("");

  const { data, error, mutate, isLoading, isValidating } =
    useGetDataCostBenefit(
      session?.user.access_token,
      costThreshold,
      dataId,
      potentialTimeframe
    );

  const {
    data: efficiencyData,
    error: errorEfficiencyData,
    mutate: mutateEfficiencyData,
    isLoading: isLoadingEfficiencyData,
    isValidating: isValidatingEfficiencyData,
  } = useGetData(session?.user.access_token, 0);

  const [costInitialThreshold, setInitialCostThreshold] = useState("");

  const costId = data?.id ?? null;
  const costName = data?.name ?? null;
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

  useEffect(() => {
    if (data?.id && data?.name) {
      setDataId(data.id);
      setSelectedLabel(data.name);
    }
  }, [data]);

  // Update potentialTimeframe when data changes
  useEffect(() => {
    if (data?.potential_timeframe) {
      setPotentialTimeframe(data.potential_timeframe);
      setInputValueTimeframe(data.potential_timeframe);
    }
  }, [data?.potential_timeframe]);

  // Function to filter efficiency data based on user input
  const filterEfficiencyData = (inputValue: string) => {
    return EfficiencyDataOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const debouncedSetTimeframe = useCallback(
    debounce((value) => {
      setPotentialTimeframe(value);
    }, 500), // 500ms delay
    [] // Empty dependency array since we don't want to recreate the debounced function
  );
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

  useEffect(() => {
    mutate();
  }, [mutate, potentialTimeframe]);
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
    <div className="flex flex-col gap-4 relative p-8 bg-white rounded-xl shadow-xl">
      <div className="flex flex-row justify-between w-full items-center gap-4">
        {isLoadingEfficiencyData ? (
          "Loading..."
        ) : (
          <div className="flex flex-row justify-between w-full items-center gap-4">
            <AsyncSelect
              className="z-50 w-1/4"
              classNamePrefix="select"
              isClearable={true}
              placeholder={`Select Data...`}
              isSearchable={true}
              loadOptions={loadOptions}
              defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
              defaultValue={
                dataId && selectedLabel
                  ? { value: dataId, label: selectedLabel }
                  : null
              }
              value={
                dataId && selectedLabel
                  ? { value: dataId, label: selectedLabel }
                  : null
              }
              cacheOptions // Caches the loaded options
              isLoading={isLoading || isLoadingEfficiencyData}
              onChange={(e) => {
                //@ts-ignore
                const newValue = e?.value ?? null;
                const newLabel = e?.label ?? "";
                setDataId(newValue);
                setSelectedLabel(newLabel);
              }}
              name="efficiencyData"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderRadius: 8,
                  height: 49,
                  borderColor: "rgb(229 229 229)",
                  borderWidth: 2,
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  width: "auto",
                  minWidth: "100%", // Ensures the menu is at least as wide as the control
                  // You can set a specific width like this:
                  // width: 250, // This will make the menu 250px wide
                }),
              }}
            />
            <Input
              type="number"
              size="sm"
              endContent="Jam"
              min={0}
              label="Potential Timeframe"
              onChange={(e) => {
                const newValue = e.target.value;
                setInputValueTimeframe(newValue);
                debouncedSetTimeframe(newValue);
              }}
              value={String(inputValueTimeframe)}
              variant="bordered"
              className="z-50 bg-white max-w-sm"
            />
          </div>
        )}
        <hr />
      </div>
      {isLoading || isValidating ? (
        <div className="w-full h-[100dvh] flex justify-center items-center">
          <Spinner label={`Loading...`} />
        </div>
      ) : (
        <div>
          <TableParetoHeatlossCost
            tableData={costData}
            potentialTimeframe={potentialTimeframe}
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
