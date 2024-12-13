// pages/your-page.js
"use client";
import { useState } from "react";
import { RPContentLayout } from "@/containers/RPContentLayout";
import DropdownEquipmentLevel from "@/components/reliability-app/DropdownEquipmentLevel";
import { Calculator, CircleAlert, CircleCheck, Loader } from "lucide-react";
import { PredictionCalculator } from "@/components/reliability-app/PredictionCalculator";
import { useSession } from "next-auth/react";
import { useGetMDT } from "@/lib/APIs/reliability-predict/useGetMDT";
import { CircularProgress } from "@nextui-org/react";
import { useGetMTTR } from "@/lib/APIs/reliability-predict/useGetMTTR";
import { useGetFailureRate } from "@/lib/APIs/reliability-predict/useGetFailureRate";
import {
  useGetReliabilityCurrent,
  useGetReliabilityPlot,
} from "@/lib/APIs/reliability-predict/useGetReliability";
import {
  useGetEquipmentAll,
  useGetEquipmentRP,
} from "@/lib/APIs/reliability-predict/useGetEquipmentRP";
import { useGetMTBF } from "@/lib/APIs/reliability-predict/useGetMTBF";
import { useGetDistribution } from "@/lib/APIs/reliability-predict/useGetDistributions";
import DistributionChart from "@/components/reliability-app/DistributionChart";
const Page = ({ params }: { params: { id: string } }) => {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = params.id;
  const openModal = () => setIsModalOpen(true);

  const { data: session } = useSession();
  const { data: equipmentList, isLoading: equipmentLoading } =
    useGetEquipmentAll(session?.user.access_token);
  const options = equipmentList?.equipment
    .map((item: any) => ({
      name: item.name,
      location_tag: item.location_tag,
    }))
    .filter((item: any) => item.location_tag != null);
  const { data: mdtvalue, isLoading: mdtloading } = useGetMDT(
    id,
    session?.user.access_token
  );
  const { data: mttrvalue, isLoading: mttrloading } = useGetMTTR(
    id,
    session?.user.access_token
  );
  const { data: mtbfvalue, isLoading: mtbfloading } = useGetMTBF(
    id,
    session?.user.access_token
  );
  const { data: failureRatevalue, isLoading: failureRateloading } =
    useGetFailureRate(id, session?.user.access_token);
  const { data: reliabilityCurrentvalue, isLoading: reliabilityloading } =
    useGetReliabilityCurrent(id, session?.user.access_token);
  const { data: equipmentData, isLoading: equipmentloading } =
    useGetEquipmentRP(id, session?.user.access_token);
  const { data: distributionData, isLoading: distributionloading } =
    useGetDistribution(id, session?.user.access_token);
  const { data: reliabilityData, isLoading: reliabilityPlotloading } =
    useGetReliabilityPlot(id, session?.user.access_token);
  const failureRate = failureRatevalue?.failure_rate
    ? `${failureRatevalue.failure_rate.toFixed(2)}`
    : "None";
  const reliabilityCurrent = reliabilityCurrentvalue?.reliability_value
    ? `${(reliabilityCurrentvalue.reliability_value * 100).toFixed(2)}`
    : "None";
  const mttr = mttrvalue?.hours ?? "None";
  const mdt = mdtvalue?.hours ?? "None";
  const mtbf = mtbfvalue?.hours ?? "None";
  const equipment = equipmentData?.equipment;
  const parameters = equipment?.params;
  const paramLabels = {
    AICc: "AICc",
    alpha: "Alpha",
    beta: "Beta",
    gamma: "Gamma",
    lambda: "Lambda",
    sigma: "Sigma",
    mu: "mu",
  };

  if (
    mdtloading ||
    mttrloading ||
    mtbfloading ||
    failureRateloading ||
    reliabilityloading ||
    equipmentloading ||
    distributionloading ||
    reliabilityPlotloading
  ) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <CircularProgress color="primary" /> <div>Loading ...</div>
      </div>
    );
  }
  return (
    <RPContentLayout title="Reliability Predicts App">
      <div className="flex flex-col h-[calc(100vh-135px)] ">
        <div className="flex-grow w-full shadow-xl bg-white rounded-3xl px-10 pb-2 pt-3">
          <div className="flex justify-start items-center gap-4 sm:flex-row flex-col py-3">
            <DropdownEquipmentLevel
              selectedOption={selectedOption1}
              onSelect={setSelectedOption1}
              options={options}
            />
          </div>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-center flex-row w-full flex-wrap md:gap-0 gap-5">
              <div className="flex-1 flex flex-col gap-5 w-full h-full">
                <div className="flex flex-col pr-4 mt-2">
                  <div className="text-xl font-bold">
                    {equipment?.name ?? "No equipment available"}
                  </div>
                  <div className="flex flex-row gap-2 pt-2">
                    <div className="flex flex-row gap-2 justify-center items-center bg-[#1C9EB6] hover:bg-[#14788E] rounded-[10px] py-2 px-3 text-white w-fit text-[11px]">
                      <div>{equipment?.equipment_tree?.name}</div>
                    </div>
                    <div className="flex flex-row gap-2 justify-center items-center bg-[#1C9EB6] hover:bg-[#14788E] rounded-[10px] py-2 px-3 text-white w-fit text-[11px]">
                      <div>{equipment?.parent?.name}</div>
                    </div>
                    <div className="flex flex-row gap-2 justify-center items-center bg-[#1C9EB6] hover:bg-[#14788E] rounded-[10px] py-2 px-3 text-white w-fit text-[11px]">
                      <div>
                        {equipment?.status === "R"
                          ? "Repairable"
                          : equipment?.status === "NR"
                          ? "Non-Repairable"
                          : "Status Unknown"}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#393333] sm:max-w-[22dvw] mt-4 w-full">
                    Current dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore
                  </p>
                  <div className="flex flex-col gap-[0.5px] pt-2 text-xs text-[#918E8E]">
                    <div className="flex flex-row gap-2">
                      <div className="font-bold ">Distribution Profile : </div>
                      <div>{equipment?.distribution}</div>
                    </div>
                    {Object.entries(paramLabels).map(([key, label]) => {
                      const paramValue = parameters?.[key];
                      if (paramValue) {
                        return (
                          <div key={key} className="flex flex-row gap-2">
                            <div className="font-bold">{label} :</div>
                            <div>{paramValue.toFixed(2)}</div>
                          </div>
                        );
                      }
                      return null; // Do nothing if no value exists for the param
                    })}
                    <div className="flex flex-row gap-2">
                      <div className="font-bold ">Age : </div>
                      <div>{equipment?.age.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Prediction Calculator Button */}
                <div
                  onClick={openModal}
                  className="flex flex-row gap-2 justify-center items-center bg-[#1C9EB6] hover:bg-[#14788E] rounded-[100px] py-2 px-6 text-white text-sm w-fit text-[10px] cursor-pointer"
                >
                  <div>
                    <Calculator className="text-white w-4 h-4" />
                  </div>
                  <div>Prediction Calculator</div>
                </div>

                {/* Modal Container */}
                <PredictionCalculator
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>
              <div className="flex-1 flex flex-col justify-start w-full">
                <div className="text-medium font-bold">
                  Distribution Profile
                </div>
                <div className="flex justify-center items-center h-full text-sm text-[#918E8E]">
                  {distributionData?.message ? (
                    <div>{distributionData.message}</div>
                  ) : (
                    <DistributionChart
                      X={distributionData?.results.x}
                      Y={distributionData?.results.y}
                      current={distributionData?.current_day}
                      yCurrent={distributionData?.yCurrent}
                    ></DistributionChart>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start w-full">
                <div className="text-medium font-bold">Reliability Profile</div>
                <div className="flex justify-center items-center h-full text-sm text-[#918E8E]">
                  {reliabilityData?.message ? (
                    <div>{reliabilityData.message}</div>
                  ) : (
                    <DistributionChart
                      X={reliabilityData?.results.x}
                      Y={reliabilityData?.results.y}
                      current={reliabilityData?.current_day}
                      yCurrent={reliabilityData?.yCurrent}
                    ></DistributionChart>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row w-full gap-4 flex-wrap">
              <div className="flex-1 flex flex-col gap-1 justify-between  shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Current</p>
                    <CircleAlert
                      fill="red"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Mean Down Time</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#1C9EB6] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">
                      {mdt.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#918E8E]">Jam</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1 justify-between  shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Current</p>
                    <CircleCheck
                      fill="#009EB5"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Mean Time to Repair</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#1C9EB6] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">
                      {mttr.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#918E8E]">Jam</div>
                  </div>
                  {/* <div className="h-full w-[3px] bg-gradient-to-b from-[#1C9EB6] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">147</div>
                    <div className="text-[10px] text-[#918E8E]">Hari</div>
                  </div> */}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1 justify-between  shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Current</p>
                    <div className="rounded-full bg-[#FFF24A] p-[5px]">
                      <Loader
                        className="w-[10px] h-[10px]"
                        fill="red"
                        color="black"
                        absoluteStrokeWidth
                      />
                    </div>
                  </div>
                  <div className="text-md font-bold">
                    Mean Time between Failure
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#1C9EB6] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">
                      {mtbf.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#918E8E]">Jam</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1 justify-between shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Current</p>
                    <CircleAlert
                      fill="red"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Failure Rate</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#1C9EB6] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">
                      {failureRate.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#918E8E]">
                      Failures/year
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1 justify-between shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Current</p>
                    <CircleAlert
                      fill="red"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Reliability</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#1C9EB6] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">
                      {reliabilityCurrent.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#918E8E]">%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RPContentLayout>
  );
};

export default Page;
