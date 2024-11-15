"use client";

import Image from "next/image";
import EngineFlow from "../../../public/engine-flow-v2.jpg";
import { Tooltip, Button, Link, Spinner } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetDataEngineFlow } from "@/lib/APIs/useGetDataEngineFlow";
import { useSession } from "next-auth/react";
import { useGetDataPareto } from "@/lib/APIs/useGetDataPareto";
import { useGetData } from "@/lib/APIs/useGetData";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

export default function Page() {
  const { data: session, status } = useSession();
  const [dataId, setDataId] = useState("");

  const {
    data: efficiencyData,
    error: errorEfficiencyData,
    mutate: mutateEfficiencyData,
    isLoading: isLoadingEfficiencyData,
    isValidating: isValidatingEfficiencyData,
  } = useGetData(session?.user.access_token, 0);

  const selectedEfficiencyData = efficiencyData?.transactions ?? [];

  const {
    data: engineFlow,
    isLoading,
    error,
  } = useGetDataEngineFlow(session?.user.access_token, dataId);

  const {
    data,
    mutate,
    isLoading: isLoadingPareto,
    error: errorPareto,
    isValidating: isValidatingPareto,
  } = useGetDataPareto(session?.user.access_token, dataId, 100);

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

  const tableData = data?.pareto_result ?? [];
  const paretoTopData = data?.pareto_uncategorized_result ?? [];
  const paretoBottomData = tableData.filter((item) => item.category != null);

  const coalData = paretoTopData
    //@ts-ignore
    .filter((item) => item.variable.excel_variable_name === "Total Coal Flow")
    //@ts-ignore
    .map((item) => item.existing_data);

  const nphrData = paretoTopData
    .filter(
      //@ts-ignore
      (item) => item.variable.excel_variable_name === "Plant Net Heat Rate"
    )
    //@ts-ignore
    .map((item) => item.existing_data);

  const engineFlowData = engineFlow ?? {};

  const positions = {
    // Top row - turbines
    EG: { name: "Output Generator:", top: "14%", left: "91%", unit: "MW" },
    LPT: { name: "Efficiency:", top: "12%", left: "76%", unit: "%" },
    IPT: { name: "Efficiency:", top: "14%", left: "53%", unit: "%" },
    HPT: { name: "Efficiency:", top: "15%", left: "29.8%", unit: "%" },

    //Boiler
    Boiler: { name: "Boiler:", top: "74%", left: "8.7%", unit: "%" },

    // Bottom row - RH components
    RH7: { name: "TTD:", top: "74%", left: "28.7%", unit: "°C" },
    RH6: { name: "TTD:", top: "74%", left: "36.6%", unit: "°C" },
    RH5: { name: "TTD:", top: "74%", left: "45.5%", unit: "°C" },
    RH3: { name: "TTD:", top: "74%", left: "61.5%", unit: "°C" },
    RH2: { name: "TTD:", top: "74%", left: "70.5%", unit: "°C" },
    RH1: { name: "TTD:", top: "74%", left: "79.5%", unit: "°C" },

    // Condensor
    Condensor_Value: {
      name: "Pressure:",
      top: "80%",
      left: "90%",
      unit: "mbara",
    },
  };
  const formatIDNumber = (value: any) =>
    new Intl.NumberFormat("id-ID").format(value);

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return "-";
    return `${formatIDNumber(Number(value).toFixed(2))} ${unit}`;
  };

  return (
    <EfficiencyContentLayout title="Efficiency & Heat Loss App">
      <div className="w-full flex flex-col justify-center items-center bg-white rounded-xl shadow-xl pt-8">
        {/* {JSON.stringify(paretoTopData)} */}
        <div className={`w-full flex justify-between pl-12 `}>
          <h2 className={`text-3xl font-semibold`}>Engine Flow</h2>

        </div>
        <div className="grid grid-cols-4 gap-4 text-md md:text-lg">
          {isLoadingEfficiencyData || isValidatingEfficiencyData ? (
            "Loading..."
          ) : (
            <>
              <AsyncSelect
                className="z-[99] dark:text-black"
                classNamePrefix="select"
                isClearable={true}
                placeholder={`Select Data...`}
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
            </>
          )}
          <div className="text-center bg-blue-300 px-2 py-1 rounded-sm dark:text-black">
            <p className="font-bold">Coal Consumption</p>
            {isLoadingPareto ? (
              <Spinner />
            ) : (
              <p>
                {formatIDNumber(Number(coalData).toFixed(2)) ?? "No data"} Kg/h
              </p>
            )}
          </div>
          <div className="text-center bg-blue-300 px-2 py-1 rounded-sm dark:text-black">
            <p className="font-bold">Net Plant Heat Rate</p>
            {isLoadingPareto ? (
              <Spinner />
            ) : (
              <p>
                {formatIDNumber(Number(nphrData).toFixed(2)) ?? "No data"}{" "}
                kCal/kWh
              </p>
            )}
          </div>
          <div className="text-center bg-blue-300 px-2 py-1 rounded-sm dark:text-black">
            <p className="font-bold">Total Heat Loss</p>
            {isLoadingPareto ? (
              <Spinner />
            ) : (
              <p>
                {formatIDNumber(Number(data?.total_nilai).toFixed(2)) ??
                  "No data"}{" "}
                kCal/kWh
              </p>
            )}
          </div>
        </div>
        <div className="relative w-5/6">
          <Image src={EngineFlow} alt="engine-flow" className="w-full" />
          {Object.keys(positions).map((key) => (
            <div
              key={key}
              style={{
                top: positions[key].top,
                left: positions[key].left,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-10"
            >
              <div
                className="bg-blue-600 backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         md:text-[16px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-105 hover:bg-blue-500/80 hover:shadow-md
                         transition-all duration-200 ease-in-out
                         transform origin-center"
              >
                <div className="font-semibold text-neutral-200 pb-2">
                  {" "}
                  {positions[key].name}
                </div>
                <div className="text-slate-50">
                  {formatValue(engineFlowData[key], positions[key].unit)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
