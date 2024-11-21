import RadarChart from "@/components/pfi-app/tags/RadarChart";
import { useSingleDataTag } from "@/lib/APIs/useGetDataTag";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

interface TagValue {
  time_stamp: string;
  value: number;
}

const ShowPredict = dynamic(
  () =>
    import(
      "@/components/pfi-app/tags/ShowPredict"
    ),
  { ssr: false }
);

const Analytics = ({ selectedKeys }: { selectedKeys: any, }) => {
  const { data: session } = useSession();

  const {
    data: tagData,
    isLoading,
    mutate,
  } = useSingleDataTag(session?.user?.access_token, selectedKeys?.anchorKey ?? "1");

  const tag = React.useMemo(() => {
    return tagData?.tag ?? ({} as { name?: string });
  }, [tagData]);

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading ? "Loading..." : "Validating..."}
        />
      </div>
    );


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

  const radarChartData: { name: string; value: number[] }[] = [
    {
      name: "Tag 1 (Radarchart Original)",
      value: []
    },
    {
      name: "Tag 1 (Radarchart Predicted)",
      value: []
    }
  ]

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

    radarChartData[0].value.push(getRandomValue(500, 10000));
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

    radarChartData[1].value.push(getRandomValue(500, 10000));
  }

  return (
    <div className="bg-white rounded-3xl p-3 pt-6 sm:p-5 sm:px-12 mx-2 sm:mx-4 border border-gray-200 shadow-xl col-span-1 md:col-span-2">
      <div className="flex flex-wrap items-center mb-5">
        <h5 className="me-auto text-lg sm:text-xl font-semibold">
          {tag?.name ?? "Belum ada data"}
        </h5>
        <button className="bg-[#D93832] py-2 px-3 sm:px-5 rounded-lg text-white ms-auto text-sm sm:text-base">
          Predicted Failed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        {/* Left Section */}
        <div className="flex flex-col gap-4 p-4 rounded-lg">
          {/* Gambar Equipment */}
          <div className="p-6 rounded-2xl text-center flex flex-col items-center justify-center">
            <div className="w-full h-40 sm:h-56 bg-neutral-300 rounded-xl flex items-center justify-center">
              <span className="text-sm sm:text-base font-medium">Gambar Equipment</span>
            </div>
            <p className="text-sm font-light text-[#918E8E] mt-3">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <hr className="border-t border-neutral-300 mt-5" />
          </div>

          {/* Possible Cause Section */}
          <div className="grid gap-3">
            <h5 className="text-xl sm:text-2xl font-bold">Possible Cause</h5>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h5 className="text-lg sm:text-xl font-bold">
                  Lorem ipsum Dolor Sit Amet
                </h5>
                <p className="text-sm text-[#918E8E] mt-2 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-4 rounded-lg relative">
          <div className="absolute z-20 top-20 right-0 left-92 m-auto bg-[#1C9EB6] rounded-lg w-60 py-4 sm:top-8 md:top-14 px-3">
            <div className="flex">
              <span className="text-white text-sm me-auto">Sensor A</span>
              <span className="text-white text-sm">12.021</span>
            </div>
            <Link href="#" className="text-sm text-neutral-200 pt-5 ">
              see details {">"}</Link>
          </div>
          <RadarChart dataRow={radarChartData} />
        </div>
      </div>
    </div>

  )
}

export default Analytics
