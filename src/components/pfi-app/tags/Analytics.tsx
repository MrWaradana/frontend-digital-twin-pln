import RadarChart from "@/components/pfi-app/tags/RadarChart";
import { useSingleDataTag } from "@/lib/APIs/useGetDataTag";
import { useGetFeatures } from "@/lib/APIs/i-PFI/useGetFeature";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";

const ShowPredict = dynamic(
  () =>
    import(
      "@/components/pfi-app/tags/PredictChart"
    ),
  { ssr: false }
);

const Analytics = ({ selectedKeys }: { selectedKeys: any }) => {
  const { data: session } = useSession();

  const {
    data: tagData,
    isLoading,
  } = useSingleDataTag(session?.user?.access_token, selectedKeys?.anchorKey ?? null);

  const {
    data: featureData,
  } = useGetFeatures(session?.user?.access_token);

  const tag = React.useMemo(() => {
    return tagData?.equipments ?? ({} as { name?: string });
  }, [tagData]);

  const indicators = React.useMemo(() => {
    if (!featureData?.features) return [];

    return featureData.features.map((feature, index) => ({
      index: index,
      id: feature.id,
      name: feature.name,
      max: 100, // atau nilai maksimum yang sesuai
    }));
  }, [featureData]);

  const radarChartData = React.useMemo(() => {
    if (!tagData?.equipments?.parts) return [];
    if (!indicators.length) return [];

    console.log('Parts:', tagData.equipments.parts);
    console.log('Indicators:', indicators);

    const defaultValues = new Array(indicators.length).fill(0);

    const result = tagData.equipments.parts.map(part => {
      const values = [...defaultValues];
      const indicatorIndex = indicators.findIndex(ind => ind.id === part.feature_id);

      console.log('Processing part:', {
        partName: part.part_name,
        featureId: part.feature_id,
        value: part.values,
        indicatorIndex
      });

      if (indicatorIndex !== -1) {
        values[indicatorIndex] = part.values || 0;
      }

      return {
        value: values,
        name: part.part_name
      };
    });

    console.log('Final result:', result);
    return result;
  }, [tagData, indicators]);

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
          {/* <RadarChart
            indicators={indicators}
            data={radarChartData}
            legendData={['Current Value']}
            height='400px'
            className='w-full'
            selectedKeys={selectedKeys}
          /> */}
        </div>
      </div>
    </div>

  )
};

export default Analytics
