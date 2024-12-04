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

  const { data, isLoading, isValidating } = useGetDataPerformance(
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
  } = useGetDataPerformanceTest(session?.user.access_token);

  const {
    data: dataPerformanceGroup,
    isLoading: isLoadingPerformanceGroup,
    isValidating: isValidatingPerfomanceGroup,
  } = useGetDataPerformanceGroup(session?.user.access_token, dataId);

  const selectPerformanceData = dataPerformance ?? [];
  const chartDataPerformance = dataPerformanceGroup ?? [];

  useEffect(() => {
    if (selectPerformanceData.length > 0) {
      setDataId(selectPerformanceData[0]?.id);
    }
  }, [selectPerformanceData]);

  const EfficiencyDataOptions = selectPerformanceData.map((item) => {
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

  return (
    <EfficiencyContentLayout title="Performance Test">
      <div className="flex flex-col gap-8">
        <AsyncSelect
          className="z-20 dark:text-black rounded-full"
          isClearable={true}
          placeholder={`Select Data...`}
          isSearchable={true}
          loadOptions={loadOptions}
          defaultValue={dataId ? { value: dataId, label: selectedLabel } : null}
          defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
          cacheOptions // Caches the loaded options
          isLoading={isLoadingPerformance}
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
              borderRadius: 10,
              height: 33,
              backgroundColor: "#f3f4f6",
            }),
          }}
        />
        <section>
          {isLoadingPerformanceGroup ? (
            <div className={`w-full flex justify-center items-center`}>
              <Spinner label={`Loading...`} />
            </div>
          ) : (
            <EChartsStackedBar
              data={dataPerformanceGroup}
              selectedLabel={selectedLabel}
            />
          )}
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
