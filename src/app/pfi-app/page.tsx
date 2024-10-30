"use client";

import React from "react";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import Image from "next/image";
import PowerPlant from "../../../public/power-plant.png";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const positions = [
  {
    name: "Stream Line",
    top: "29%",
    left: "48%",
    status: "Normal",
    uuid: "1",
  },
  {
    name: "Turbine",
    top: "29%",
    left: "63%",
    status: "Warning",
  },
  {
    name: "Generator",
    top: "37%",
    left: "73%",
    status: "Normal",
    uuid: "1",
  },
  {
    name: "Transmission Lines",
    top: "37%",
    left: "87%",
    status: "Normal",
    uuid: "1",
  },
  {
    name: "Transformer",
    top: "100%",
    left: "87%",
    status: "Normal",
    uuid: "1",
  },
  {
    name: "Condenser",
    top: "92%",
    left: "76%",
    status: "Warning",
  },
  {
    name: "Boiler",
    top: "90%",
    left: "46%",
    status: "Normal",
    uuid: "1",
  },
];

const Page = () => {
  const router = useRouter();

  return (
    <PFIContentLayout title="Intelligent P-F Interval Analytics">
      <div className="flex flex-col items-center justify-center mt-24">
        {/* Content */}
        <div className="relative w-5/6">
          <Image src={PowerPlant} alt="engine-flow" className="w-full" />
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
              <button
                className={`${
                  positions[key].status == "Normal"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                } backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         md:text-[16px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-105 hover:bg-blue-500/80 hover:shadow-md
                         transition-all duration-200 ease-in-out
                         transform origin-center`}
                onClick={() => router.push(`/pfi-app/${positions[key].uuid}`)}
              >
                <div className="font-semibold text-neutral-200 px-2 py-1">
                  {positions[key].status}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </PFIContentLayout>
  );
};

export default Page;
