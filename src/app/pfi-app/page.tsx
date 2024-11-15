"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PowerPlant from "../../../public/i-PFI/bg.png";
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
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading ? "Loading..." : "Validating..."}
        />
      </div>
    );

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 px-3 rounded-3xl relative">
          <h1 className="text-sm  sm:text-2xl font-semibold text-[#303030] absolute z-10 mx-10 mt-5">i-PFI Health</h1>

          <div className="flex flex-col justify-center">
            {/* Container gambar responsif */}
            <div className="relative w-full h-[300px] md:h-auto rounded-xl overflow-hidden">
              <Image
                src={PowerPlant}
                alt="power-plant"
                className="rounded-xl"
              />
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
                    className={`${combinedEquipments[key].position.status === "Normal"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                      } backdrop-blur-sm 
         px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 
         rounded-sm text-xs sm:text-sm md:text-base lg:text-lg
         shadow-sm border border-gray-200/50 whitespace-nowrap
         hover:scale-105 hover:bg-blue-500/80 hover:shadow-md
         transition-all duration-200 ease-in-out
         transform origin-center`}
                    onClick={() => router.push(`/pfi-app/${combinedEquipments[key].id}`)}
                  >
                    <div className="font-semibold text-neutral-200">
                      {combinedEquipments[key].position.status}
                    </div>
                  </button>
                </div>
              ))}

            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 mx-4 border-1">
          Tes
        </div>
      </div>
    </PFIContentLayout>
  );
};

export default Page;
