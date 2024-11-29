"use client";

import Image from "next/image";
import NewEngineFlow2 from "../../../public/efficiency-app/v2-engine-flow-infografis.png";
import { useGetDataEngineFlow } from "../../lib/APIs/useGetDataEngineFlow";
import { formatUnderscoreToSpace } from "../../lib/format-text";
import { formattedNumber } from "../../lib/formattedNumber";
import { useSession } from "next-auth/react";
import { Tooltip } from "@nextui-org/react";

export default function Engine() {
  const { data: session } = useSession();
  const {
    data: engineFlow,
    isLoading,
    error,
  } = useGetDataEngineFlow(session?.user.access_token, undefined);

  const engineFlowData = engineFlow ?? {};

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return "-";
    return `${formattedNumber(Number(value).toFixed(2))} ${unit}`;
  };

  const positions = {
    // Top row - turbines
    EG: { name: "Output Generator", top: "14%", left: "93%", unit: "MW" },
    LPT: { name: "Efficiency", top: "12%", left: "76%", unit: "%" },
    IPT: { name: "Efficiency", top: "14%", left: "53%", unit: "%" },
    HPT: { name: "Efficiency", top: "15%", left: "29.8%", unit: "%" },

    //Boiler
    Boiler: { name: "Boiler", top: "65%", left: "7%", unit: "%" },

    // Bottom row - RH components
    RH7: { name: "TTD", top: "74%", left: "28%", unit: "°C" },
    RH6: { name: "TTD", top: "74%", left: "36%", unit: "°C" },
    RH5: { name: "TTD", top: "74%", left: "45.5%", unit: "°C" },
    RH3: { name: "TTD", top: "74%", left: "62.3%", unit: "°C" },
    RH2: { name: "TTD", top: "74%", left: "71.5%", unit: "°C" },
    RH1: { name: "TTD", top: "74%", left: "81%", unit: "°C" },

    // Condensor
    Condensor_Value: {
      name: "Pressure:",
      top: "65%",
      left: "92%",
      unit: "mbara",
    },
  };
  return (
    <>
      <Image src={NewEngineFlow2} alt="engine-flow" className="h-full" />
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
          <div className={`relative`}>
            <div className="absolute -bottom-3 left-0 right-0 mx-auto w-full">
              <div className={`relative`}>
                <Tooltip
                  className={`bg-[#1C9EB6D9]/85`}
                  content={
                    <div className={`flex flex-col gap-3 p-2`}>
                      <p className={`font-semibold text-white mb-2`}>
                        {" "}
                        {formatUnderscoreToSpace(key) === "Condensor Value"
                          ? "Condensor"
                          : formatUnderscoreToSpace(key)}
                      </p>
                      <div>
                        <p className={`text-white`}>
                          Efficiency :{" "}
                          {formatValue(
                            engineFlowData[key]?.value,
                            positions[key].unit
                          )}
                        </p>
                        <p className={`text-white`}>
                          Work Hours :{" "}
                          {formatValue(
                            engineFlowData[key]?.value,
                            positions[key].unit
                          )}
                        </p>
                        <p className={`text-white`}>
                          Reliability :{" "}
                          {formatValue(
                            engineFlowData[key]?.value,
                            positions[key].unit
                          )}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <p className="bg-[#1C9EB6] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] inline-flex font-semibold text-center rounded-md absolute -bottom-16 right-0 left-0 m-auto min-w-fit px-1.5 py-0.5 !animate-none">
                    {formatUnderscoreToSpace(key) === "Condensor Value"
                      ? "Condensor"
                      : formatUnderscoreToSpace(key)}
                  </p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
