"use client";

import TimeDownChart from "@/components/pfi-app/tags/TimeDownChart";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useSingleDataTag } from "@/lib/APIs/useGetDataTag";
import { useGetEquipmentValues } from "@/lib/APIs/i-PFI/useGetEquipmentValues";
import { CircularProgress, Divider } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PredictChart2 from "@/components/pfi-app/tags/PredictChart2";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import TemporalSelect from "@/components/pfi-app/tags/TemporalSelect";
import { useGetFeature, useGetFeatures } from "@/lib/APIs/i-PFI/useGetFeature";

const Page = ({ params }: { params: { slug: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const equipments = [
    {
      id: "b538d5d4-7e3c-46ac-b3f0-c35136317557",
      name: "TJB3.PAF B BRG VIB MONITOR(MOTOR SIDE)",
    },
    {
      id: "990fb37b-33c4-44f4-b6a8-cf4b9d3b9c74",
      name: "TJB3.PAF A BRG VIB MONITOR(FREE SIDE)",
    },
    {
      id: "2462c395-95ee-49b3-8abb-dc8dd67276bc",
      name: "TJB3.PAF A BRG VIB MONITOR(MOTOR SIDE)",
    },
    {
      id: "8294f761-cfd1-44d9-966a-613ab1b89fe9",
      name: "TJB3.PAF B BRG VIB MONITOR(FREE SIDE)",
    }
  ]

  const features_id = searchParams.get("features_id");
  const sensor_id = searchParams.get("sensor_id");

  const [sensor, setSensor] = React.useState(sensor_id);
  const [feature, setFeature] = React.useState(features_id);

  const {
    data: tagData,
    isLoading,
  } = useSingleDataTag(session?.user?.access_token, params.slug);

  const {
    data: featureData,
  } = useGetFeature(session?.user?.access_token, features_id ?? '');

  const {
    data: featuresData,
  } = useGetFeatures(session?.user?.access_token);

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

  if (isLoading || isLoadingEquipment)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading || isLoadingEquipment ? "Loading..." : "Validating..."}
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
            {/* {sensorData.name} - {featureData?.feature.name} */}
          </h1>

          <button
            onClick={() => { router.back() }}
            className="text-sm md:text-md font-medium text-[#1C9EB6] border border-[#1C9EB6] bg-transparent px-3 py-1 rounded-lg hover:bg-[#1C9EB6] hover:text-white transition-colors duration-300"
          >
            Download Result
          </button>
        </div>

        {sensor} {feature}
        <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-3 p-3 md:p-5 lg:p-8 my-5">
          <TemporalSelect selectItems={equipments} title={"Select Sensor"} setSelectedKey={setSensor} selectedKey={sensor_id} />
          <TemporalSelect selectItems={featuresData?.features} title={"Select Feature"} setSelectedKey={setFeature} selectedKey={features_id} />
        </div>



        {/* Responsive Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-5 lg:p-8 my-5">
          <TimeDownChart />
          <PredictChart2 dataRow={equipmentValues} />
        </div>


        <div className="w-full grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 md:p-5 lg:p-8 my-5">
          {
            information.map((item, index) => (
              <Card className="p-5" key={index}>
                <h4 className="font-bold text-sm sm:text-base md:text-md lg:text-lg mb-2">
                  {item.name}
                </h4>
                <div className="flex flex-row mt-auto">
                  <Divider orientation="vertical" className="px-[1px] py-6 me-3 bg-gradient-to-b from-[#1C9EB6] to-[#FFFFFF]" />

                  <div className="flex flex-col">
                    <p className="font-bold text-2xl sm:text-base md:text-md lg:text-lg">
                      {item.value}
                    </p>
                    <span className="text-neutral-400 text-sm">{item.satuan}</span>
                  </div>
                </div>
              </Card>
            ))
          }
        </div>
      </div>
    </PFIContentLayout>
  )
}

export default Page