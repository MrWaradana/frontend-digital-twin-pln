"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import OptimumOverhaulChart from "./OptimumOverhaulChart";
import { useGetTimeConstraintCalculation } from "@/lib/APIs/useGetTimeConstraintCalculation";
import { formatCurrency } from "@/lib/formattedNumber";
import { Spinner } from "@nextui-org/react";
import CalculateOH from "../CalculateOH";
import { Checkbox, Link, cn, Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

export default function ChartContainer() {
  const [isSelected, setIsSelected] = useState(false);
  const { data: session } = useSession();
  const query = useSearchParams();
  let calculation_id: any = query.get("calculation_id") || undefined;

  const { data, isLoading, isValidating, mutate } =
    useGetTimeConstraintCalculation(session?.user.access_token, calculation_id);

  const optimumData = data?.optimumOh ?? [];
  const scope = data?.reference ?? "";
  const chartData = data?.results ?? [];
  const totalCost = optimumData.overhaulCost + optimumData.correctiveCost;

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
            <p className="text-[#1C9EB6] text-5xl text-end font-semibold">
              {scope}
            </p>
          </div>
          <div className={`bg-gray-100 rounded-xl p-4`}>
            <p className="font-semibold text-black mb-2">Number of Failure</p>
            <p className="text-[#1C9EB6] text-5xl text-end font-semibold">
              {optimumData.numOfFailures}
            </p>
          </div>
        </div>
        <div className={`bg-gray-100 rounded-xl w-full p-4`}>
          <p className="font-semibold text-black mb-2">Optimum OH Times</p>
          <p className="text-[#1C9EB6] text-5xl text-end font-semibold">
            {optimumData.days} Days
          </p>
        </div>
        <div className={`bg-gray-100 rounded-xl w-full p-4`}>
          <p className="font-semibold text-black mb-2">Optimum Total Cost</p>
          <p className="text-[#1C9EB6] text-3xl text-end font-semibold">
            Rp. {formatCurrency(totalCost)} Jt
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
            href={`/optimum-oh-app/simulate-each-equipment?scope=${scope}`}
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
