import { useState } from "react";
import DropdownEquipmentLevel from "./DropdownEquipmentLevel";
import DropdownPredictionType from "./DropdownPredictionType";

type PredictionCalculatorProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

export function PredictionCalculator({
  isModalOpen,
  setIsModalOpen,
}: PredictionCalculatorProps) {
  const closeModal = () => setIsModalOpen(false);
  const [selectedOption, setSelectedOption] = useState("");

  const openModal = () => setIsModalOpen(true);

  const options = ["Option 1", "Option 2", "Option 3"];

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-[40px] shadow-lg sm:p-10 p-7 sm:w-[70%] w-[90%]">
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700 text-lg font-bold absolute top-4 right-6"
        >
          ×
        </button>
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
          <div className="flex flex-col gap-2 w-full">
            <div className="bg-[#F49C38] rounded-xl py-[0.5px] px-4 text-white text-[10px] w-fit">
              Equipment Level 3.7
            </div>
            <h2 className="text-2xl font-semibold">Prediction Calculator</h2>
          </div>
          <DropdownPredictionType
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            options={options}
          />
        </div>

        {/* Modal Content */}
        <div className="flex lg:flex-row flex-col justify-center mt-10">
          <div className="w-full">tes aja</div>
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-center gap-2 flex-wrap">
                <div className="flex-1">
                  <label
                    className="text-[10px] text-[#918E8E]"
                    htmlFor="first-name"
                  >
                    Hour
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="text-[10px] text-[#918E8E]"
                    htmlFor="first-name"
                  >
                    Day
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="text-[10px] text-[#918E8E]"
                    htmlFor="first-name"
                  >
                    Month
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="text-[10px] text-[#918E8E]"
                    htmlFor="first-name"
                  >
                    Year
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[10px] text-[#918E8E]">
                  Prediction Rate Result
                </div>
                <div className="flex-1 flex flex-row md:gap-12 gap-4 md:items-center items-start justify-start flex-wrap shadow-xl bg-white rounded-3xl p-5">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] text-[#F49C38]">Time</div>
                    <div className="text-[12px] font-semibold">00.00 AM</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] text-[#F49C38]">Day</div>
                    <div className="text-[12px] font-semibold">Sunday</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] text-[#F49C38]">Date</div>
                    <div className="text-[12px] font-semibold">
                      January 24, 2027
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-start gap-4">
                <div className="flex flex-row justify-center items-center bg-[#F49C38] hover:bg-[#e58c2d] rounded-[100px] py-2 px-5 text-white text-sm w-fit text-[13px] cursor-pointer">
                  <div className="text-[12px] ">Calculate</div>
                </div>
                <div className="flex flex-row justify-center items-center hover:text-white text-[#F49C38] border border-[#F49C38] hover:bg-[#e58c2d] rounded-[100px] py-2 px-5 text-sm w-fit text-[13px] cursor-pointer">
                  <div className="text-[12px]  ">Download Result</div>
                </div>
              </div>
              <div className="flex flex-col w-full bg-[#D93832] rounded-[15px] shadow-xl text-white p-7 gap-4">
                <div>Failure Rate Prediction Result</div>
                <div className="flex flex-row justify-between items-end">
                  <div className="font-bold text-6xl">1.287</div>
                  <div>Unit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
