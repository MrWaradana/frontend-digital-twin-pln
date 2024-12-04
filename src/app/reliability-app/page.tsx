"use client";

import { RPContentLayout } from "@/containers/RPContentLayout";
import { useGetWorstFailures } from "@/lib/APIs/reliability-predict/useGetWorstFailures";
import { useGetWorstMDT } from "@/lib/APIs/reliability-predict/useGetWorstMDT";
import { useGetWorstMTTR } from "@/lib/APIs/reliability-predict/useGetWorstMTTR";
import { useGetWorstReliability } from "@/lib/APIs/reliability-predict/useGetWorstReliability";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const { data: assetsFailuresData, isLoading: assetsFailuresLoading } =
    useGetWorstFailures(session?.user.access_token);
  const { data: assetsMTTRData, isLoading: mttrloading } = useGetWorstMTTR(
    session?.user.access_token
  );
  const { data: assetsMDTData, isLoading: mdtloading } = useGetWorstMDT(
    session?.user.access_token
  );
  const { data: assetsReliabilityData, isLoading: reliabilityloading } =
    useGetWorstReliability(session?.user.access_token);
  const assetsFailures = assetsFailuresData?.equipment ?? [];
  const assetsMTTR = assetsMTTRData?.equipment ?? [];
  const assetsMDT = assetsMDTData?.equipment ?? [];
  const assetsReliability = assetsReliabilityData?.equipment ?? [];

  if (
    assetsFailuresLoading ||
    mttrloading ||
    mdtloading ||
    reliabilityloading
  ) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress color="secondary" />
        Loading ...
      </div>
    );
  }
  return (
    <RPContentLayout title="Reliability Predicts App">
      <div className="w-full gap-4 flex flex-row flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full lg:w-1/3">
          <p className="text-[10px] text-gray-400">Dashboard One</p>
          <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
            Potential Failure
          </h1>
          <ul className="flex gap-2 flex-col">
            {assetsFailures.map((item, index) => (
              <li key={index}>
                <a
                  href={`/reliability-app/${item.assetnum}`}
                  className="flex flex-row items-center"
                >
                  <div className="w-full flex flex-row gap-2 justify-between">
                    <div className="text-[12px] text-gray-500">
                      <span className="w-4">{index + 1}. </span>
                      {item.name}
                    </div>
                    <div className="bg-red-600 text-white rounded-[100px] flex justify-end items-center text-[9px] px-2 py-1">
                      {item.failure_count} unit
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full lg:w-1/3">
          <p className="text-[10px] text-gray-400">Dashboard Two</p>
          <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
            Worst Reliability
          </h1>
          <ul className="flex gap-2 flex-col">
            {assetsReliability.map((reliability, index) => (
              <li key={reliability.id}>
                <a
                  href={`/reliability-app/${reliability.assetnum}`}
                  className="flex flex-row items-center"
                >
                  <div className="w-full flex flex-row gap-2 justify-between">
                    <div className="text-[12px] text-gray-500">
                      <span className="w-4">{index + 1}. </span>
                      {reliability.equipment_name}
                    </div>
                    <div className=" bg-red-600 text-white rounded-[100px] flex justify-end items-center text-[9px] px-2 py-1">
                      {`${(reliability.reliability * 100).toFixed(2)}%`}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full">
            <p className="text-[10px] text-gray-400">Dashboard Three</p>
            <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
              Mean Time to Repair
            </h1>
            <ul className="flex gap-2 flex-col">
              {assetsMTTR.map((mttr, index) => (
                <li key={index}>
                  <a
                    href={`/reliability-app/${mttr.assetnum}`}
                    className="flex flex-row items-center"
                  >
                    <div className="w-full flex flex-row gap-2 justify-between">
                      <div className=" text-[12px] text-gray-500">
                        <span className="w-4">{index + 1}. </span>
                        {mttr.equipment_name}
                      </div>
                      <div className=" flex flex-row gap-1 justify-end">
                        {/* <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                        {mttr.mttr_days} hours
                      </div>
                      <div className="text-sm text-gray-300">|</div> */}
                        <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                          {mttr.mttr_hours} hours
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full">
            <p className="text-[10px] text-gray-400">Dashboard Four</p>
            <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
              Mean Down Time
            </h1>
            <ul className="flex gap-2 flex-col">
              {assetsMDT.map((mdt, index) => (
                <li key={index}>
                  <a
                    href={`/reliability-app/${mdt.assetnum}`}
                    className="flex flex-row items-center"
                  >
                    <div className="w-full flex flex-row gap-2 justify-between">
                      <div className=" text-[12px] text-gray-500">
                        <span className="w-4">{index + 1}. </span>
                        {mdt.equipment_name}
                      </div>
                      <div className=" flex flex-row gap-1 justify-end">
                        {/* <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                        {mdt.MDT_days} days
                      </div>
                      <div className="text-sm text-gray-300">|</div> */}
                        <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                          {mdt.mdt_hours} hours
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </RPContentLayout>
  );
};

export default Page;
