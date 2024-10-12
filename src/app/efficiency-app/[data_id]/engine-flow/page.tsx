"use client";

import Image from "next/image";
import EngineFlow from "../../../../../public/engine-flow-v2.jpg";
import { Tooltip, Button, Link, CircularProgress } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { EfficiencyContentLayout } from "../../../../containers/EfficiencyContentLayout";
import { useGetDataEngineFlow } from "@/lib/APIs/useGetDataEngineFlow";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { data_id: string } }) {
  const { data: session, status } = useSession();

  const {
    data: engineFlow,
    isLoading,
    error,
  } = useGetDataEngineFlow(session?.user.access_token, params.data_id);

  const engineFlowData = engineFlow ?? {};

  const positions = {
    // Top row - turbines
    EG: { name: "Output Generator:", top: "15%", left: "92%", unit: "MW" },
    LPT: { name: "Efficiency:", top: "19%", left: "76%", unit: "%" },
    IPT: { name: "Efficiency:", top: "18%", left: "53%", unit: "%" },
    HPT: { name: "Efficiency:", top: "19%", left: "29.8%", unit: "%" },

    // Bottom row - RH components
    RH7: { name: "TTD:", top: "75%", left: "28.7%", unit: "°C" },
    RH6: { name: "TTD:", top: "75%", left: "36.6%", unit: "°C" },
    RH5: { name: "TTD:", top: "75%", left: "45.5%", unit: "°C" },
    RH3: { name: "TTD:", top: "75%", left: "61.5%", unit: "°C" },
    RH2: { name: "TTD:", top: "75%", left: "70.5%", unit: "°C" },
    RH1: { name: "TTD:", top: "75%", left: "79.5%", unit: "°C" },
  };
  const formatIDNumber = (value: any) =>
    new Intl.NumberFormat("id-ID").format(value);

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return "-";
    return `${formatIDNumber(Number(value).toFixed(2))} ${unit}`;
  };

  if (isLoading)
    return (
      <EfficiencyContentLayout title="Input Form">
        <div className="flex justify-center mt-12">
          <CircularProgress color="primary" />
        </div>
      </EfficiencyContentLayout>
    );

  return (
    <EfficiencyContentLayout title="Engine Flow">
      <div className="w-full flex flex-col gap-6 justify-center items-center m-2">
        <div>
          <Button
            as={Link}
            href={`/efficiency-app`}
            className="mb-4"
            color="primary"
            size="sm"
            startContent={<ChevronLeftIcon size={16} />}
          >
            Back to all
          </Button>
        </div>
        <div className="relative min-w-full">
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
                         md:text-[18px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
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
