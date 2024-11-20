"use client";

import { RPContentLayout } from "@/containers/RPContentLayout";

const Page = () => {
  const items = [
    { id: 1, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
    { id: 2, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
    { id: 3, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "100 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "1020 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "232 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
    { id: 4, text: "Lorem ipsum dolor sit amet", unit: "1000 unit" },
  ];
  const WorstReliability = [
    { id: 1, text: "Lorem ipsum dolor sit amet", percent: "90%" },
    { id: 2, text: "Lorem ipsum dolor sit amet", percent: "90%" },
    { id: 3, text: "Lorem ipsum dolor sit amet", percent: "20%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "10%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "40%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "90%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "90%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "90%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "90%" },
    { id: 4, text: "Lorem ipsum dolor sit amet", percent: "90%" },
  ];
  const mttr = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
  ];
  const mdt = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet",
      hour: "10 jam",
      day: "10 hari",
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet",
      hour: "100 jam",
      day: "10 hari",
    },
  ];
  return (
    <RPContentLayout title="Reliability Predicts App">
      <div className="gap-4 flex flex-row flex-wrap">
        <div className="bg-white rounded-3xl p-3 sm:px-12 sm:py-9 border border-gray-200 shadow-[5px_5px_10px_0_rgba(0,0,0,0.25)] w-full md:w-fit">
          <p className="text-[10px] text-gray-400">Dashboard One</p>
          <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
            Potential Failure
          </h1>
          <ul className="flex gap-2 flex-col">
            {items.map((item, index) => (
              <li key={item.id} className="flex flex-row items-center">
                <div className="w-full grid gap-2 grid-cols-4">
                  <div className="col-span-3 text-[10px] text-gray-500">
                    <span className="w-4">{index + 1}. </span>
                    {item.text}
                  </div>
                  <div className="col-span-1 bg-red-600 text-white rounded-[100px] flex justify-center items-center text-[9px] px-3 py-1">
                    {item.unit}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-3xl p-3 sm:px-12 sm:py-9 border border-gray-200 shadow-[5px_5px_10px_0_rgba(0,0,0,0.25)] w-full md:w-fit">
          <p className="text-[10px] text-gray-400">Dashboard Two</p>
          <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
            Worst Reliability
          </h1>
          <ul className="flex gap-2 flex-col">
            {WorstReliability.map((reliability, index) => (
              <li key={reliability.id} className="flex flex-row items-center">
                <div className="w-full grid gap-4 grid-cols-4">
                  <div className="col-span-3 text-[10px] text-gray-500">
                    <span className="w-4">{index + 1}. </span>
                    {reliability.text}
                  </div>
                  <div className="col-span-1 bg-red-600 text-white rounded-[100px] flex justify-center items-center text-[9px] px-3 py-1">
                    {reliability.percent}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-3 sm:px-12 sm:py-9 border border-gray-200 shadow-[5px_5px_10px_0_rgba(0,0,0,0.25)]">
            <p className="text-[10px] text-gray-400">Dashboard Three</p>
            <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
              Mean Time to Repair
            </h1>
            <ul className="flex gap-2 flex-col">
              {mttr.map((mttr, index) => (
                <li key={mttr.id} className="flex flex-row items-center">
                  <div className="w-full grid gap-4 grid-cols-4">
                    <div className="md:col-span-2 col-span-3 text-[10px] text-gray-500">
                      <span className="w-4">{index + 1}. </span>
                      {mttr.text}
                    </div>
                    <div className="md:col-span-2 col-span-1 flex flex-row gap-1">
                      <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-3 py-1">
                        {mttr.hour}
                      </div>
                      <div className="text-sm text-gray-300">|</div>
                      <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-3 py-1">
                        {mttr.day}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-3 sm:px-12 sm:py-9 border border-gray-200 shadow-[5px_5px_10px_0_rgba(0,0,0,0.25)]">
            <p className="text-[10px] text-gray-400">Dashboard Four</p>
            <h1 className="text-xs sm:text-sm font-semibold text-[#303030] mb-6">
              Mean Down Time
            </h1>
            <ul className="flex gap-2 flex-col">
              {mdt.map((mdt, index) => (
                <li key={mdt.id} className="flex flex-row items-center">
                  <div className="w-full grid gap-4 grid-cols-4">
                    <div className="md:col-span-2 col-span-3 text-[10px] text-gray-500">
                      <span className="w-4">{index + 1}. </span>
                      {mdt.text}
                    </div>
                    <div className="md:col-span-2 col-span-1 flex flex-row gap-1">
                      <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-3 py-1">
                        {mdt.hour}
                      </div>
                      <div className="text-sm text-gray-300">|</div>
                      <div className="rounded-[100px] bg-red-600 text-white flex justify-center items-center text-[9px] px-3 py-1">
                        {mdt.day}
                      </div>
                    </div>
                  </div>
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
