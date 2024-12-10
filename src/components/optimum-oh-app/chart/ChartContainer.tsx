"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import OptimumOverhaulChart from "./OptimumOverhaulChart";
import { useGetTimeConstraintCalculation } from "../../../lib/APIs/useGetTimeConstraintCalculation";
import { Spinner } from "@nextui-org/react";
import CalculateOH from "../CalculateOH";
import { Checkbox, Link, cn, Button } from "@nextui-org/react";

export default function ChartContainer() {
  const [isSelected, setIsSelected] = useState(false);
  const { data: session } = useSession();

  const { data, isLoading, isValidating, mutate } =
    useGetTimeConstraintCalculation(session?.user.access_token);

  const chartData = data?.results ?? [];

  return (
    <section className="bg-white shadow-2xl w-full h-[80dvh] rounded-3xl grid grid-cols-1 xl:grid-cols-3 p-3">
      <div className={`col-span-2 w-full flex justify-center items-center`}>
        {isLoading ? (
          <Spinner />
        ) : (
          <OptimumOverhaulChart chartData={chartData} />
        )}
      </div>
      <div className={`col-span-1 flex flex-col gap-2 pr-12 py-6`}>
        <div className="flex justify-end ">
          <CalculateOH title={`Menu`} size={`md`} radius={`full`} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`bg-gray-100 rounded-xl p-4`}>
            <p className="font-semibold text-black mb-2">Scope</p>
            <p className="text-[#1C9EB6] text-5xl text-end font-semibold">B</p>
          </div>
          <div className={`bg-gray-100 rounded-xl p-4`}>
            <p className="font-semibold text-black mb-2">Number of Failure</p>
            <p className="text-[#1C9EB6] text-5xl text-end font-semibold">59</p>
          </div>
        </div>
        <div className={`bg-gray-100 rounded-xl w-full p-4`}>
          <p className="font-semibold text-black mb-2">Optimum OH Times</p>
          <p className="text-[#1C9EB6] text-5xl text-end font-semibold">
            90 Days
          </p>
        </div>
        <div className={`bg-gray-100 rounded-xl w-full p-4`}>
          <p className="font-semibold text-black mb-2">Optimum Total Cost</p>
          <p className="text-[#1C9EB6] text-3xl text-end font-semibold">
            Rp. 500.000.000,00
          </p>
        </div>
        <div className={`w-full p-4 flex flex-row justify-center gap-4`}>
          <Checkbox
            classNames={{
              base: cn(
                "inline-flex w-full bg-content1",
                "hover:bg-content2 items-center justify-start",
                "cursor-pointer rounded-lg border-2 border-transparent",
                "data-[selected=true]:border-primary !py-1"
              ),
              label: "w-full text-xs",
            }}
            isSelected={isSelected}
            onValueChange={setIsSelected}
          >
            Simulate Interval Inspection
          </Checkbox>
          <Button
            as={Link}
            variant={`solid`}
            size={`lg`}
            href={`#`}
            color={`primary`}
            radius={`sm`}
            className={`text-xs w-1/2`}
          >
            Simulate Each Equipment
          </Button>
        </div>
      </div>
    </section>
  );
}
