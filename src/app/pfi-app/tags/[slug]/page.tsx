"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout"

type TagValue = {
  time_stamp: string,
  value: string;
};
import React from "react";
import { decrypt } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { isEmpty } from "lodash";
import { ChevronLeftIcon } from "lucide-react";
import dynamic from "next/dynamic";
import TimeDownChart from "@/components/pfi-app/tags/TimeDownChart";

const PredictChart = dynamic(
  () =>
    import(
      "@/components/pfi-app/tags/PredictChart"
    ),
  { ssr: false }
);

const Page = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const key = React.useMemo(() => {
    const decodedSlug = decodeURIComponent(params.slug)
    return decrypt(decodedSlug);
  }, [params.slug]);

  React.useEffect(() => {
    isEmpty(key) && router.push("/404");
  }, [key]);

  const tagValues: { name: string; values: TagValue[] }[] = [
    {
      name: "Tag 1 (Original)",
      values: [] // Data asli
    },
    {
      name: "Tag 1 (Predicted)",
      values: [] // Data prediksi
    }
  ];

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  for (let i = 0; i < 7; i++) {
    let newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + i);

    tagValues[0].values.push({
      time_stamp: newDate.toISOString(),
      value: getRandomValue(1, 100)
    });
  }

  let predictionStartDate = new Date(startDate);
  predictionStartDate.setDate(predictionStartDate.getDate() + 7);

  for (let i = 0; i < 7; i++) {
    let newDate = new Date(predictionStartDate);
    newDate.setDate(newDate.getDate() + i);

    tagValues[1].values.push({
      time_stamp: newDate.toISOString(),
      value: getRandomValue(5, 105)
    });
  }

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="bg-neutral-100 rounded-xl shadow-xl p-3 md:p-5">
        <div className="flex my-3">
          <button onClick={() => { router.back() }} className="me-5">
            <ChevronLeftIcon size={24} />
          </button>

          <h1 className="text-base md:text-xl font-semibold me-auto">
            Lorem Ipsum Dolor Sit Amet - 2 - Sensor A PFI
          </h1>

          <button onClick={() => { router.back() }} className="text-sm md:text-md font-medium text-[#1C9EB6] border-[1px] border-[#1C9EB6] bg-transparent px-3 rounded-lg hover:bg-[#1C9EB6] hover:text-white transition-colors duration-300">
            Download Result
          </button>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 md:p-5 lg:p-8 mt-5">
          <TimeDownChart />
          <PredictChart selectedKeys={key} tagValues={tagValues} />
        </div>

      </div>
    </PFIContentLayout>
  )
}

export default Page