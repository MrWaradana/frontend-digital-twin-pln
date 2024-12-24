"use client";

import { Cog, Calendar } from "lucide-react";
import { Button, Spinner } from "@nextui-org/react";
import Engine from "@/components/optimum-oh-app/Engine";
import ScopeOH from "@/components/optimum-oh-app/ScopeOH";
import CalculateOH from "@/components/optimum-oh-app/CalculateOH";
import { useGetOptimumOH } from "@/lib/APIs/useGetOptimumOH";
import { useSession } from "next-auth/react";
import ScheduleOH from "./ScheduleOH";
import { ModalAddSchedule } from "./ModalAddScheduleOh";

export default function HomeContainer() {
  const { data: session } = useSession();

  const {
    data,
    isLoading: isLoadingOptimumOH,
    isValidating,
    mutate,
  } = useGetOptimumOH(session?.user.access_token);

  const engineData = data?.systemComponents ?? [];
  const criticalParts = data?.criticalParts ?? [];
  const overviewData = data?.overview.nextSchedule ?? [];
  const scheduleData = data?.schedules ?? [];

  const findUpcomingSchedule = (scheduleData) => {
    const today = new Date();

    // Find the first upcoming date that hasn't passed
    const upcomingSchedule = scheduleData
      .filter((schedule) => new Date(schedule.date) > today)
      //@ts-expect-error
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    return upcomingSchedule?.Overhaul || null;
  };

  let nextSchedule = findUpcomingSchedule(scheduleData);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-3 bg-white rounded-3xl shadow-xl h-[80dvh] w-full p-8">
        {/* above image */}
        <div className={`flex flex-row justify-between`}>
          <div className="flex flex-row gap-12">
            <div className="flex flex-col gap-2 justify-center h-[7dvh] w-fit ">
              <p className="text-neutral-400">
                Number of equipment needs to OH:
              </p>
              <p className={`text-2xl font-semibold text-black`}>
                {overviewData.equipmentCount ?? "-"}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center h-[7dvh] w-fit p-4">
              <p className="text-neutral-400">Nearest OH Schedule:</p>
              <p className={`text-2xl font-semibold text-black`}>
                {overviewData.start_date
                  ? new Date(overviewData.start_date).toLocaleDateString("id", {
                    dateStyle: "long",
                  })
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <ModalAddSchedule mutate={mutate}/>
            <ScopeOH />
            <CalculateOH />
          </div>
        </div>
        {/* Image Engine */}
        <div className="h-[65dvh] relative">
          <Engine engineData={engineData} isLoading={isLoadingOptimumOH} />
        </div>
      </div>
      <div className="col-span-1 h-[80dvh] w-full flex flex-col gap-6">
        <div className={`bg-white rounded-3xl shadow-xl w-full h-1/2 p-8`}>
          <p className={`text-xl font-semibold mb-4`}>Top 5 Critical Part:</p>
          <ol className="list-decimal list-inside text-neutral-500 text-sm">
            {criticalParts.map((item: any) => {
              return (
                <li className={`mb-2`} key={item}>
                  {item}
                </li>
              );
            })}
          </ol>
        </div>
        <div
          className={`bg-white rounded-3xl shadow-xl w-full h-1/2 p-12 flex flex-col justify-between`}
        >
          <div className={`flex flex-row items-center gap-3`}>
            <p className={`text-xl font-semibold mb-4`}>
              Upcoming OH Schedules:
            </p>

            {isLoadingOptimumOH ? (
              <Spinner />
            ) : (
              <>

                <ScheduleOH
                  scheduleData={scheduleData}
                  overviewData={overviewData}
                />
              </>

            )}
          </div>
          <div className="flex flex-row justify-between items-end">
            <p className="text-neutral-400">Scope</p>
            <p
              className={`text-[7rem] ${overviewData.Overhaul === "B" ? "text-[#1C9EB6]" : "text-[#F49C38]"
                } font-semibold mb-0 leading-tight`}
            >
              {overviewData.Overhaul}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
