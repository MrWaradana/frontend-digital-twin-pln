import RadarChart from "@/components/pfi-app/tags/RadarChart";
import { useSingleDataTag } from "@/lib/APIs/useGetDataTag";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import { encrypt } from "@/lib/utils";

const ShowPredict = dynamic(
  () =>
    import(
      "@/components/pfi-app/tags/PredictChart"
    ),
  { ssr: false }
);

const Analytics = ({ selectedKeys }: { selectedKeys: any, }) => {
  const { data: session } = useSession();

  const {
    data: tagData,
    isLoading,
  } = useSingleDataTag(session?.user?.access_token, selectedKeys?.anchorKey ?? null);

  const tag = React.useMemo(() => {
    return tagData?.equipments ?? ({} as { name?: string });
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

  const radarChartData: { id: string; subject: string; A: number; B: number; fullMark: number }[] = [
    {
      id: "5765a11a-2f89-45dc-a37b-46d384a1ff9e",
      subject: 'Feature 1', A: 120, B: 110, fullMark: 150
    },
    {
      id: "8baab334-6e63-487d-91ea-cf8cd7f8b88d",
      subject: 'Feature 2', A: 98, B: 130, fullMark: 150
    },
    {
      id: "9b0b9845-e59b-4b85-9ba3-66ff9cb826b8",
      subject: 'Feature 3', A: 86, B: 130, fullMark: 150
    },
    {
      id: "a94a2f9a-d798-4e54-8373-ff68f486f266",
      subject: 'Feature 4', A: 86, B: 130, fullMark: 150
    },
    {
      id: "88a07a75-1f84-4436-bcf0-12739900bf4a",
      subject: 'Feature 5', A: 86, B: 130, fullMark: 150
    },
    {
      id: "c0e9494d-443e-4515-ba2a-34a15400c551",
      subject: 'Feature 6', A: 86, B: 130, fullMark: 150
    },
    {
      id: "5cf62522-a140-4b26-bbfb-d76e4ae10a81",
      subject: 'Feature 7', A: 86, B: 130, fullMark: 150
    },
  ]

  return (
    <div className="bg-white rounded-3xl p-3 pt-6 sm:p-5 sm:px-12 mx-2 sm:mx-4 border border-gray-200 shadow-xl col-span-1 md:col-span-2">
      <div className="flex flex-wrap items-center mb-5">
        <h5 className="me-auto font-semibold break-words w-[300px] sm:w-[500px]">
          {tag.name}
        </h5>
        <div className="bg-[#D93832] py-2 px-3 sm:px-5 rounded-lg text-white ms-auto text-sm sm:text-base">
          Predicted Failed
        </div>
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
        <div className="p-4 rounded-lg">
          {/* <div className="absolute z-20 top-20 right-0 left-92 m-auto bg-[#1C9EB6] rounded-lg w-60 py-4 sm:top-8 md:top-14 px-3">
            <div className="flex">
              <span className="text-white text-sm me-auto">Sensor A</span>
              <span className="text-white text-sm">12.021</span>
            </div>
            <Link href={`/pfi-app/tags/${encodeURIComponent(encryptedKey)}`} className="text-sm text-neutral-200 pt-5 ">
              see details {">"}</Link>
          </div> */}
          <RadarChart dataRow={radarChartData} selectedKeys={selectedKeys?.anchorKey} />
        </div>
      </div>
    </div>

  )
}

export default Analytics
