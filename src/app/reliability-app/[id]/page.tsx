// pages/your-page.js
"use client";
import { useState } from "react";
import { RPContentLayout } from "@/containers/RPContentLayout";
import DropdownEquipmentLevel from "@/components/reliability-app/DropdownEquipmentLevel";
import { Calculator, CircleAlert, CircleCheck, Loader } from "lucide-react";

const Page = () => {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");

  const options = ["Option 1", "Option 2", "Option 3"];

  return (
    <RPContentLayout title="Reliability Predicts App">
      <div className="flex flex-col h-[calc(100vh-135px)] ">
        <div className="flex justify-center items-center gap-4 pb-4 sm:flex-row flex-col">
          <DropdownEquipmentLevel
            selectedOption={selectedOption1}
            onSelect={setSelectedOption1}
            options={options}
          />
          <DropdownEquipmentLevel
            selectedOption={selectedOption2}
            onSelect={setSelectedOption2}
            options={options}
          />
          <DropdownEquipmentLevel
            selectedOption={selectedOption3}
            onSelect={setSelectedOption3}
            options={options}
          />
        </div>
        <div className="flex-grow w-full shadow-xl bg-white rounded-3xl px-10 py-5">
          <div className="flex flex-row gap-2 text-white text-[10px] justify-end">
            <div className="bg-[#F49C38] rounded-[100px] py-[0.5px] px-4">
              LV.1
            </div>
            <div className="bg-[#F49C38] rounded-[100px] py-[0.5px] px-4">
              LV.2
            </div>
            <div className="bg-[#F49C38] rounded-[100px] py-[0.5px] px-4">
              LV.3
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center flex-row w-full mt-4 flex-wrap md:gap-0 gap-5">
              <div className="flex-1 flex flex-col gap-20 w-full h-full">
                <div className="flex flex-col pr-4 mt-2">
                  <div className="text-2xl font-bold">Equipment Level 3-7</div>
                  <p className="text-[11px] text-[#918E8E] sm:max-w-[20dvw] mt-4 w-full">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis.
                  </p>
                </div>
                <div className="flex flex-row gap-2 justify-center items-center bg-[#F49C38] rounded-[100px] py-2 px-8 text-white text-sm w-fit text-[13px]">
                  <div>
                    <Calculator className="text-white w-4 h-4" />
                  </div>
                  <div>Prediction Calculator</div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-start w-full">
                <div className="text-2xl font-bold">Distribution Profile</div>
              </div>
              <div className="flex-1 flex flex-col justify-start w-full">
                <div className="text-2xl font-bold">Reliability Profile</div>
              </div>
            </div>

            <div className="flex flex-row w-full gap-4 flex-wrap">
              <div className="flex-1 flex flex-col gap-4 justify-between  shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Lorem ipsum</p>
                    <CircleAlert
                      fill="red"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Mean Down Time</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">12</div>
                    <div className="text-[10px] text-[#918E8E]">jam</div>
                  </div>
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">120</div>
                    <div className="text-[10px] text-[#918E8E]">Hari</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 justify-between  shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Lorem ipsum</p>
                    <CircleCheck
                      fill="#009EB5"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Mean Time to Repair</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">12</div>
                    <div className="text-[10px] text-[#918E8E]">jam</div>
                  </div>
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">120</div>
                    <div className="text-[10px] text-[#918E8E]">Hari</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 justify-between  shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Lorem ipsum</p>
                    <div className="rounded-full bg-[#FFF24A] p-[5px]">
                      <Loader
                        className="w-[10px] h-[10px]"
                        fill="red"
                        color="black"
                        absoluteStrokeWidth
                      />
                    </div>
                  </div>
                  <div className="text-md font-bold">Failure Value</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">12</div>
                    <div className="text-[10px] text-[#918E8E]">jam</div>
                  </div>
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">120</div>
                    <div className="text-[10px] text-[#918E8E]">Hari</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 justify-between shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Lorem ipsum</p>
                    <CircleAlert
                      fill="red"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Reliability Value</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">12</div>
                    <div className="text-[10px] text-[#918E8E]">jam</div>
                  </div>
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">120</div>
                    <div className="text-[10px] text-[#918E8E]">Hari</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 justify-between shadow-xl bg-white rounded-3xl p-6">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-[10px] text-[#918E8E]">Lorem ipsum</p>
                    <CircleAlert
                      fill="red"
                      color="#ffffff"
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="text-md font-bold">Reliability Function</div>
                </div>
                <div className="flex flex-row">
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">12</div>
                    <div className="text-[10px] text-[#918E8E]">jam</div>
                  </div>
                  <div className="h-full w-[3px] bg-gradient-to-b from-[#F49C38] to-white mr-2"></div>
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="text-4xl font-bold">120</div>
                    <div className="text-[10px] text-[#918E8E]">Hari</div>
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
