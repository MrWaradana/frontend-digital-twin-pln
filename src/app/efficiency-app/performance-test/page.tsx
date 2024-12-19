"use client";

import TablePerformanceTest from "@/components/efficiency-app/nett-plant-heat-rate/TablePerformanceTest";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetDataPerformance } from "@/lib/APIs/useGetDataPerformance";
import { useSession } from "next-auth/react";
import EChartsStackedBar from "@/components/efficiency-app/performance-test/EChartsBar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import AsyncSelect from "react-select/async";
import { useGetDataPerformanceTest } from "@/lib/APIs/useGetDataPerformanceTest";
import { useGetDataPerformanceGroup } from "@/lib/APIs/useGetDataPerformanceGroup";
import { Spinner } from "@nextui-org/react";

export default function Page() {
  const { data: session } = useSession();
  const [dataId, setDataId]: any = useState("");
  const [selectedLabel, setSelectedLabel]: any = useState("");

  const { data, isLoading, isValidating, mutate } = useGetDataPerformance(
    session?.user.access_token,
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    dataId
  );

  const thermoStatus = data?.thermo_status ?? false;
  const performanceData = data?.transactions ?? [];

  const {
    data: dataPerformance,
    isLoading: isLoadingPerformance,
    isValidating: isValidatingPerfomance,
    mutate: mutatePerformance,
  } = useGetDataPerformanceTest(session?.user.access_token);

  const {
    data: dataPerformanceGroup,
    isLoading: isLoadingPerformanceGroup,
    isValidating: isValidatingPerfomanceGroup,
  } = useGetDataPerformanceGroup(session?.user.access_token, dataId);

  const selectPerformanceData = dataPerformance ?? [];
  const chartDataPerformance = dataPerformanceGroup ?? [];

  // useEffect(() => {
  //   if (selectPerformanceData.length > 0) {
  //     setDataId(selectPerformanceData[0]?.id);
  //   }
  // }, [selectPerformanceData]);

  const PerformanceDataOptions = selectPerformanceData.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  // Function to filter efficiency data based on user input
  const filterEfficiencyData = (inputValue: string) => {
    return PerformanceDataOptions.filter((i) =>
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

  return (
    <EfficiencyContentLayout title="Performance Test">
      <div className="flex flex-col xl:flex-row gap-8">
        <section className="w-full xl:w-1/2 bg-white shadow-xl rounded-2xl p-6">
          <AsyncSelect
            className="z-20 dark:text-black rounded-full max-w-xs pb-4"
            isClearable={true}
            placeholder={`Select Group Data...`}
            isSearchable={true}
            loadOptions={loadOptions}
            defaultValue={
              dataId ? { value: dataId, label: selectedLabel } : null
            }
            defaultOptions={PerformanceDataOptions} // Optional: Show default options initially
            cacheOptions // Caches the loaded options
            isLoading={isLoadingPerformance}
            onChange={(e) => {
              //@ts-ignore
              const newValue = e?.value ?? "";
              const newLabel = e?.label ?? "";
              setDataId(newValue);
              setSelectedLabel(newLabel);
            }}
            name="efficiencyData"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: 10,
                height: 33,
                backgroundColor: "#f3f4f6",
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
          {/* {chartDataPerformance && chartDataPerformance.length === 0 ? (
            <div className={` text-center text-neutral-400`}>No data found</div>
          ) : isLoadingPerformanceGroup ? (
            <div className={`w-full flex justify-center items-center`}>
              <Spinner label={`Loading...`} />
            </div>
          ) : ( */}
          <EChartsStackedBar
            data={chartDataPerformance}
            selectedLabel={selectedLabel}
            isLoadingPerformanceGroup={isLoadingPerformanceGroup}
          />
          {/* )} */}
        </section>
        {/* <section>
          <MultipleLineChart data={chartData} />
        </section> */}
        <section className={`w-full xl:w-1/2 h-full overflow-x-auto`}>
          <TablePerformanceTest
            tableData={performanceData}
            isLoading={isLoading}
            isValidating={isValidating}
            thermoStatus={thermoStatus}
            PerformanceDataOptions={PerformanceDataOptions}
            mutate={mutate}
          />
        </section>
      </div>
    </EfficiencyContentLayout>
  );
}
