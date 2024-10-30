"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import router from "next/router";
import boiler from "../../../../../public/boiler-system.png";

export default function Page() {
  return (
    <PFIContentLayout title="Intelligent P-F Interval Equipments">
      <div className="w-full text-left">
        <Button
          as={Link}
          onPress={() => router.back()}
          color="primary"
          size="sm"
          className="mb-10"
        >
          <ChevronLeftIcon size={12} />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-800">Equipment Lists</h1>
        <p className="text-sm text-gray-600 mt-2">
          Manage your equipment efficiently by viewing the list below.
        </p>
      </div>

      <div className="flex flex-row items-center justify-center mt-24">
        {/* Content */}
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          <div className="container items-center justify-center text-left">
            <h3 className="text-black-500 mb-5">Overall Observation</h3>

            <Image src={boiler} alt="Boiler system" className="text-center" />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          {/* Table disini */}
        </div>
      </div>
    </PFIContentLayout>
  );
}
