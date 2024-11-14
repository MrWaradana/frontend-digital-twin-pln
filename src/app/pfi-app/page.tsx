"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PowerPlant from "../../../public/power-plant.png";
import { useGetEquipmentByParams, useGetEquipments } from "@/lib/APIs/useGetEquipments";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@nextui-org/react";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: equipmentsData,
    isLoading,
    isValidating,
    mutate
  } = useGetEquipmentByParams(session?.user.access_token, "TJB 3");


  const positions = [
    {
      top: "29%",
      left: "48%",
      status: "Normal",
    },
    {
      top: "29%",
      left: "63%",
      status: "Warning",
    },
    {
      top: "37%",
      left: "73%",
      status: "Normal",
    },
    {
      top: "37%",
      left: "87%",
      status: "Normal",
    },
    {
      top: "100%",
      left: "87%",
      status: "Normal",
    },
    {
      top: "92%",
      left: "76%",
      status: "Warning",
    },
    {
      top: "90%",
      left: "46%",
      status: "Normal",
    },
  ];

  const equipments = equipmentsData?.equipments ?? [];

  const combinedEquipments = equipments.map((equipment, index) => {
    const position = positions[index] || { top: "0%", left: "0%" };
    return {
      ...equipment,
      position,
    };
  });

  if (isLoading || isValidating)
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading ? "Loading..." : "Validating..."}
        />
      </div>
    );

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="container mx-auto">
        <div className="text-wrap">
          <h1 className="text-3xl font-bold text-gray-800">TJB 3 Power Plant Systems</h1>
          <p className="text-sm text-gray-600 mt-2">
            i PFI to support asset health management for Power Plant
          </p>
        </div>
        <div className="flex flex-col justify-center mt-14">
          {/* Content */}
          <div className="relative w-5/6">
            <Image src={PowerPlant} alt="power-plant" className="w-full" />
            {Object.keys(combinedEquipments).map((key) => (
              <div
                key={key}
                style={{
                  top: combinedEquipments[key].position.top,
                  left: combinedEquipments[key].position.left,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-10"
              >
                <button
                  className={`${combinedEquipments[key].position.status == "Normal"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                    } backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         md:text-[16px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-105 hover:bg-blue-500/80 hover:shadow-md
                         transition-all duration-200 ease-in-out
                         transform origin-center`}
                  onClick={() => router.push(`/pfi-app/${combinedEquipments[key].id}`)}
                >
                  <div className="font-semibold text-neutral-200 px-2 py-1">
                    {combinedEquipments[key].position.status}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PFIContentLayout>
  );
};

export default Page;
