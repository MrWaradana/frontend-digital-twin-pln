"use client";

import Image from "next/image";
import NewEngineFlow2 from "../../../public/efficiency-app/v2-engine-flow-infografis.png";
import { useGetDataEngineFlow } from "../../lib/APIs/useGetDataEngineFlow";
import { formatUnderscoreToSpace } from "../../lib/format-text";
import { formattedNumber } from "../../lib/formattedNumber";
import { useSession } from "next-auth/react";
import { Tooltip } from "@nextui-org/react";
import { useGetOptimumOH } from "../../lib/APIs/useGetOptimumOH";

export default function Engine({ engineData, isLoading }: any) {
  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return "-";
    return `${value}`;
  };

  const positions = {
    // Top row - turbines
    EG: { top: "14%", left: "93%" },
    LPT: { top: "12%", left: "76%" },
    IPT: { top: "14%", left: "53%" },
    HPT: { top: "15%", left: "29.8%" },

    //Boiler
    boiler: { top: "65%", left: "7%" },

    // Bottom row - RH components
    HPH7: { top: "74%", left: "28%" },
    HPH6: { top: "74%", left: "36%" },
    HPH5: { top: "74%", left: "45.5%" },
    HPH3: { top: "74%", left: "62.3%" },
    HPH2: { top: "74%", left: "71.5%" },
    HPH1: { top: "74%", left: "81%" },

    // Condensor
    Condensor_Value: {
      top: "65%",
      left: "92%",
    },
    Denerator: {
      top: "65%",
      left: "52%",
    },
  };

  if (isLoading) {
    return (
      <div
        className={`animate-pulse w-full flex items-center text-center justify-center h-full`}
      >
        Loading...
      </div>
    );
  }

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
                      <p className={`font-semibold text-white mb-2 capitalize`}>
                        {" "}
                        {formatUnderscoreToSpace(key) === "Condensor Value"
                          ? "Condensor"
                          : formatUnderscoreToSpace(key)}
                      </p>
                      <div>
                        <p className={`text-white`}>
                          Efficiency :{" "}
                          {formatValue(
                            engineData[key]?.efficiency,
                            positions[key].unit
                          )}
                        </p>
                        <p className={`text-white`}>
                          Work Hours :{" "}
                          {formatValue(
                            engineData[key]?.work_hours,
                            positions[key].unit
                          )}{" "}
                          {engineData[key]?.work_hours != undefined
                            ? engineData[key]?.work_hours > 1
                              ? "Hours"
                              : "Hour"
                            : ""}
                        </p>
                        <p className={`text-white`}>
                          Reliability :{" "}
                          {formatValue(
                            engineData[key]?.reliability,
                            positions[key].unit
                          )}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <p className="bg-[#1C9EB6] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] inline-flex font-semibold text-center rounded-md absolute -bottom-16 right-0 left-0 m-auto min-w-fit px-1.5 py-0.5 !animate-none capitalize">
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
