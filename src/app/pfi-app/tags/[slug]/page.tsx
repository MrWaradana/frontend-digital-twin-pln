"use client";

import TimeDownChart from "@/components/pfi-app/tags/TimeDownChart";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useSingleDataTag } from "@/lib/APIs/useGetDataTag";
import { useGetEquipmentValues } from "@/lib/APIs/i-PFI/useGetEquipmentValues";
import { CircularProgress } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PredictChart2 from "@/components/pfi-app/tags/PredictChart2";

import { Card, CardHeader, CardBody } from "@nextui-org/react";

const Page = ({ params }: { params: { slug: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const features_id = searchParams.get("features_id");
  const sensor_id = searchParams.get("sensor_id");

  const {
    data: tagData,
    isLoading,
  } = useSingleDataTag(session?.user?.access_token, params.slug);

  const {
    data: equipmentValues,
    isLoading: isLoadingEquipment,
  } = useGetEquipmentValues(session?.user?.access_token, sensor_id ?? '', features_id ?? '');

  const information = [
    {
      name: "Predicted Time to Failure",
      value: "19",
      satuan: "hours"
    },
    {
      name: "Current Condition",
      value: "12",
      satuan: "%"
    },
    {
      name: "Current Value",
      value: "23",
      satuan: "um"
    },
    {
      name: "Biaya Untuk Perbaikan",
      value: "1.4",
      satuan: "Rp. (milyar)"
    },
    {
      name: "Mean Time to Repair",
      value: "30",
      satuan: "hours"
    }
  ]

  // const equipment = React.useMemo(() => {
  //   return tagData?.equipments ?? ({} as { name?: string });
  // }, [tagData]);

  // React.useEffect(() => {
  //   if (isEmpty(tagData)) return router.push("/404");
  // }, [tagData]);

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading ? "Loading..." : "Validating..."}
        />
      </div>
    );

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="bg-neutral-100 rounded-xl shadow-xl p-3 md:p-5">
        <div className="flex my-3 items-center">
          <button onClick={() => { router.back() }} className="me-5">
            <ChevronLeftIcon size={24} />
          </button>

          <h1 className="text-base md:text-xl font-semibold me-auto flex items-center">
            {sensor_id} - {features_id}
          </h1>

          <button
            onClick={() => { router.back() }}
            className="text-sm md:text-md font-medium text-[#1C9EB6] border border-[#1C9EB6] bg-transparent px-3 py-1 rounded-lg hover:bg-[#1C9EB6] hover:text-white transition-colors duration-300"
          >
            Download Result
          </button>
        </div>

        {/* Responsive Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-5 lg:p-8 my-5">
          <TimeDownChart />
          <PredictChart2 dataRow={equipmentValues} />
        </div>


        <div className="w-full grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 md:p-5 lg:p-8 my-5">
          {
            information.map((item, index) => (
              <Card className="py-4" key={index}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-sm sm:text-base md:text-md lg:text-lg">{item.name}</h4>
                </CardHeader>
                <CardBody className="overflow-visible">
                  <p className="font-normal text-sm sm:text-base md:text-md lg:text-lg">{item.value}</p>
                </CardBody>
              </Card>
            ))
          }
        </div>
      </div>
    </PFIContentLayout>
  )
}

export default Page