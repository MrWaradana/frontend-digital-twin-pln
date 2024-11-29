"use client";

import TimeDownChart from "@/components/pfi-app/tags/TimeDownChart";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useSingleDataTag } from "@/lib/APIs/useGetDataTag";
import { useGetEquipmentValues } from "@/lib/APIs/i-PFI/useGetEquipmentValues";
import { CircularProgress } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import PredictChart2 from "@/components/pfi-app/tags/PredictChart2";

const PredictChart = dynamic(
  () =>
    import(
      "@/components/pfi-app/tags/PredictChart"
    ),
  { ssr: false }
);

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
        <div className="flex my-3">
          <button onClick={() => { router.back() }} className="me-5">
            <ChevronLeftIcon size={24} />
          </button>

          <h1 className="text-base md:text-xl font-semibold me-auto flex">
            {sensor_id} - {features_id}
          </h1>

          <button onClick={() => { router.back() }} className="text-sm md:text-md font-medium text-[#1C9EB6] border-[1px] border-[#1C9EB6] bg-transparent px-3 rounded-lg hover:bg-[#1C9EB6] hover:text-white transition-colors duration-300">
            Download Result
          </button>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 md:p-5 lg:p-8 mt-5">
          {/* <TimeDownChart /> */}
          <PredictChart2 dataRow={equipmentValues} />
          {/* <PredictChart equipmentValues={equipmentValues} /> */}
        </div>

      </div>
    </PFIContentLayout>
  )
}

export default Page