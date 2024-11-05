"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { Button, CircularProgress, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import boiler from "../../../../../public/boiler-system.png";
import CanvasJSReact from "@canvasjs/react-charts";
import { useGetDataPSD } from "@/lib/APIs/useGetDataPSD";
import { useSession } from "next-auth/react";

const Page = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const id = params.id;

  const { data: session } = useSession();
  const {
    data: psd_data,
    isLoading,
  } = useGetDataPSD(session?.user?.access_token, id);

  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress color="primary" />
        Loading ...
      </div>
    );
  }

  const values = psd_data?.psd_values ?? []

  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  // Setup chart data
  const dataPoints = values.map(({ timestamp, value }) => ({
    x: new Date(timestamp),
    y: value,
  }));

  const options = {
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: `PSD Values for ${psd_data?.tag.name || 'Unknown Tag'}`,
    },
    axisX: {
      title: "Date",
      valueFormatString: "DD MMM YYYY",
      labelAngle: -45,
    },
    data: [{
      type: "line",
      dataPoints: dataPoints,
    }],
  };

  return (
    <PFIContentLayout title="Intelligent P-F Interval Equipments">
      <div className="container w-full text-left">
        <Button
          as={Link}
          onPress={() => router.back()}
          color="primary"
          size="sm"
          className="mb-10"
        >
          <ChevronLeftIcon size={12} />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-800">Equipment Lists</h1>
        <p className="text-sm text-gray-600 mt-2">
          Manage your equipment efficiently by viewing the list below.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-[50px] md:grid-cols-3 sm:grid-cols-1">
        <div className="container items-center justify-center text-left">
          <h3 className="text-black-500 mb-5">Overall Observation</h3>
          <Image src={boiler} alt="Boiler system" className="text-center" />
        </div>
        <div className="col-span-2 md:col-span-2 sm:col">
          <CanvasJSChart options={options} />
        </div>
      </div>

      <div className="container mt-5 text-wrap">
        <h6 className="text-bold">Possible cause :</h6>
        <p>
          Insufficient Cooling: If the oil cooling system is not functioning properly, the oil temperature may rise. This could be due to a malfunction in the cooling water circuit, fan, or heat exchanger.
        </p>
        <p>
          Oil Pump Failure: A failure in the oil pump could reduce the flow rate, leading to poor oil circulation and overheating.
        </p>
        <p>
          High Ambient Temperature: Excessively high temperatures in the surrounding environment could contribute to elevated oil temperatures.
        </p>
      </div>
    </PFIContentLayout>
  );
};

export default Page;
