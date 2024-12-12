"use client";

import { RPContentLayout } from "@/containers/RPContentLayout";
import { useGetWorstFailures } from "@/lib/APIs/reliability-predict/useGetWorstFailures";
import { useGetWorstMDT } from "@/lib/APIs/reliability-predict/useGetWorstMDT";
import { useGetWorstMTTR } from "@/lib/APIs/reliability-predict/useGetWorstMTTR";
import { useGetWorstReliability } from "@/lib/APIs/reliability-predict/useGetWorstReliability";
import { setDashboard } from "@/store/reliability-predict/setDashboard";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  const { data: session } = useSession();

  // Get assets state from the Zustand store
  const AssetsFailures = setDashboard((state) => state.assetsFailures || []);
  const AssetsMTTR = setDashboard((state) => state.assetsMTTR || []);
  const AssetsMDT = setDashboard((state) => state.assetsMDT || []);
  const AssetsReliability = setDashboard(
    (state) => state.assetsReliability || []
  );

  // Fetch data
  const { data: assetsFailuresData, isValidating: assetsFailuresLoading } =
    useGetWorstFailures(session?.user.access_token, AssetsFailures.length > 0);

  const { data: assetsMTTRData, isValidating: mttrLoading } = useGetWorstMTTR(
    session?.user.access_token,
    AssetsMTTR.length > 0
  );
  const { data: assetsMDTData, isValidating: mdtLoading } = useGetWorstMDT(
    session?.user.access_token,
    AssetsMDT.length > 0
  );
  const { data: assetsReliabilityData, isValidating: reliabilityLoading } =
    useGetWorstReliability(
      session?.user.access_token,
      AssetsReliability.length > 0
    );

  // Convert fetched data into assets
  const assetsFailures = assetsFailuresData?.equipment ?? [];
  const assetsMTTR = assetsMTTRData?.equipment ?? [];
  const assetsMDT = assetsMDTData?.equipment ?? [];
  const assetsReliability = assetsReliabilityData?.equipment ?? [];

  // Update Zustand store when data is fetched
  useEffect(() => {
    if (AssetsFailures.length === 0 && assetsFailures.length > 0) {
      setDashboard.getState().setFailures(assetsFailures);
    }
  }, [assetsFailures, AssetsFailures.length]);

  useEffect(() => {
    if (AssetsMTTR.length === 0 && assetsMTTR.length > 0) {
      setDashboard.getState().setMTTR(assetsMTTR);
    }
  }, [assetsMTTR, AssetsMTTR.length]);

  useEffect(() => {
    if (AssetsMDT.length === 0 && assetsMDT.length > 0) {
      setDashboard.getState().setMDT(assetsMDT);
    }
  }, [assetsMDT, AssetsMDT.length]);

  useEffect(() => {
    if (AssetsReliability.length === 0 && assetsReliability.length > 0) {
      setDashboard.getState().setReliability(assetsReliability);
    }
  }, [assetsReliability, AssetsReliability.length]);

  if (
    AssetsFailures.length == 0 &&
    AssetsMDT.length == 0 &&
    AssetsMTTR.length == 0 &&
    AssetsReliability.length == 0
  ) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress color="primary" /> Loading ...
      </div>
    );
  }
  return (
    <RPContentLayout title="Reliability Predicts App">
      <div className="w-full gap-2 flex flex-row flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full lg:w-1/3">
          <p className="text-[10px] text-gray-400">Unit TJB #3</p>
          <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
            Number of Failure
          </h1>
          <ul className="flex gap-3 flex-col">
            {AssetsFailures.map((item, index) => (
              <li key={index}>
                <a
                  href={`/reliability-app/${item.location_tag}`}
                  className="flex flex-row items-center"
                >
                  <div className="w-full flex flex-row gap-2 justify-between">
                    <div className="text-[12px] text-gray-500 relative group">
                      <span className="w-4">{index + 1}. </span>
                      <span
                        className="md:truncate md:max-w-[200px] inline-block align-middle"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <div className="absolute left-0 top-full mt-1 hidden group-hover:flex bg-gray-500 text-white text-xs rounded py-1 px-2 z-10 shadow-lg w-auto">
                        <span className="whitespace-nowrap">{item.name}</span>
                      </div>
                    </div>
                    <div className="bg-red-600 text-white rounded-[100px] flex justify-end items-center text-[9px] px-2 py-1">
                      {item.failure_count.toLocaleString()} unit
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full lg:w-1/3">
          <p className="text-[10px] text-gray-400">Unit TJB #3</p>
          <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
            Top 10 Worst Reliability
          </h1>
          <ul className="flex gap-3 flex-col">
            {AssetsReliability.map((reliability, index) => (
              <li key={reliability.id}>
                <a
                  href={`/reliability-app/${reliability.location_tag}`}
                  className="flex flex-row items-center"
                >
                  <div className="w-full flex flex-row gap-2 justify-between">
                    <div className="text-[12px] text-gray-500 relative group">
                      <span className="w-4">{index + 1}. </span>
                      <span
                        className="md:truncate md:max-w-[200px] inline-block align-middle"
                        title={reliability.equipment_name}
                      >
                        {reliability.equipment_name}
                      </span>
                      <div className="absolute left-0 top-full mt-1 hidden group-hover:flex bg-gray-500 text-white text-xs rounded py-1 px-2 z-10 shadow-lg w-auto">
                        <span className="whitespace-nowrap">
                          {reliability.equipment_name}
                        </span>
                      </div>
                    </div>
                    <div className="bg-red-600 text-white rounded-[100px] flex justify-end items-center text-[9px] px-2 py-1">
                      {`${(reliability.reliability * 100).toExponential(2)}%`}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full">
            <p className="text-[10px] text-gray-400">Unit TJB #3</p>
            <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
              Mean Time to Repair
            </h1>
            <ul className="flex gap-3 flex-col">
              {AssetsMTTR.map((mttr, index) => (
                <li key={index}>
                  <a
                    href={`/reliability-app/${mttr.location_tag}`}
                    className="flex flex-row items-center"
                  >
                    <div className="w-full flex flex-row gap-2 justify-between">
                      <div className="text-[12px] text-gray-500 relative group">
                        <span className="w-4">{index + 1}. </span>
                        <span
                          className="md:truncate md:max-w-[350px] inline-block align-middle"
                          title={mttr.equipment_name}
                        >
                          {mttr.equipment_name}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:flex bg-gray-500 text-white text-xs rounded py-1 px-2 z-10 shadow-lg w-auto">
                          <span className="whitespace-nowrap">
                            {mttr.equipment_name}
                          </span>
                        </div>
                      </div>
                      <div className=" flex flex-row gap-1 justify-end">
                        <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                          {mttr.mttr_hours.toLocaleString()} hours
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:px-12 sm:py-9 border border-gray-200 shadow-xl w-full">
            <p className="text-[10px] text-gray-400">Unit TJB #3</p>
            <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
              Mean Down Time
            </h1>
            <ul className="flex gap-3 flex-col">
              {AssetsMDT.map((mdt, index) => (
                <li key={index}>
                  <a
                    href={`/reliability-app/${mdt.location_tag}`}
                    className="flex flex-row items-center"
                  >
                    <div className="w-full flex flex-row gap-2 justify-between">
                      <div className="text-[12px] text-gray-500 relative group">
                        <span className="w-4">{index + 1}. </span>
                        <span
                          className="md:truncate md:max-w-[350px] inline-block align-middle"
                          title={mdt.equipment_name}
                        >
                          {mdt.equipment_name}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:flex bg-gray-500 text-white text-xs rounded py-1 px-2 z-10 shadow-lg w-auto">
                          <span className="whitespace-nowrap">
                            {mdt.equipment_name}
                          </span>
                        </div>
                      </div>
                      <div className=" flex flex-row gap-1 justify-end">
                        {/* <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                        {mdt.MDT_days} days
                      </div>
                      <div className="text-sm text-gray-300">|</div> */}
                        <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-2 py-1">
                          {mdt.mdt_hours.toLocaleString()} hours
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
