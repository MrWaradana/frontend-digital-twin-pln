import { use, useState } from "react";
import { CircleAlert, CircleCheck, Loader } from "lucide-react";
import PredictionCalendar from "./PredictionCalendar";
import {
  useGetCalculateFailureRate,
  useGetCalculateFailures,
  useGetCalculateMDT,
  useGetCalculateMTBF,
  useGetCalculateMTTR,
  useGetCalculateProbability,
  useGetCalculateReliability,
} from "@/lib/APIs/reliability-predict/useGetCalculate";
import { CircularProgress } from "@nextui-org/react";
type PredictionCalculatorProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  location: string;
  session: any;
};

export function PredictionCalculator({
  isModalOpen,
  setIsModalOpen,
  location,
  session,
}: PredictionCalculatorProps) {
  const closeModal = () => setIsModalOpen(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formattedTime, setFormattedTime] = useState<string | undefined>(
    undefined
  );
  const { data: failuresvalue, isLoading: failuresLoading } =
    useGetCalculateFailures(
      session?.access_token,
      location,
      formattedTime,
      formattedTime === undefined
    );
  const { data: failureratevalue, isLoading: failurerateLoading } =
    useGetCalculateFailureRate(
      session?.access_token,
      location,
      formattedTime,
      formattedTime === undefined
    );
  const { data: mdtvalue, isLoading: mdtloading } = useGetCalculateMDT(
    session?.access_token,
    location,
    formattedTime,
    formattedTime === undefined
  );
  const { data: mttrvalue, isLoading: mttrloading } = useGetCalculateMTTR(
    session?.access_token,
    location,
    formattedTime,
    formattedTime === undefined
  );
  const { data: mtbfvalue, isLoading: mtbfloading } = useGetCalculateMTBF(
    session?.access_token,
    location,
    formattedTime,
    formattedTime === undefined
  );
  const { data: reliabilityvalue, isLoading: reliabilityloading } =
    useGetCalculateReliability(
      session?.access_token,
      location,
      formattedTime,
      formattedTime === undefined
    );
  const { data: probabilityvalue, isLoading: probabilityloading } =
    useGetCalculateProbability(
      session?.access_token,
      location,
      formattedTime,
      formattedTime === undefined
    );
  const failures = failuresvalue?.value ?? "";
  const reliability =
    reliabilityvalue?.value !== undefined && reliabilityvalue?.value !== null
      ? reliabilityvalue.value === 0
        ? "0"
        : Math.abs(reliabilityvalue.value * 100) < 0.01
        ? `${(reliabilityvalue.value * 100).toExponential(2)}`
        : `${(reliabilityvalue.value * 100).toFixed(2)}`
      : "";
  console.log(reliability, "reliabilityvalue");
  const probability =
    probabilityvalue?.value !== undefined && probabilityvalue?.value !== null
      ? probabilityvalue?.value === 0
        ? "0"
        : Math.abs(probabilityvalue?.value) < 0.01
        ? `${(probabilityvalue?.value).toExponential(2)}`
        : `${(probabilityvalue?.value).toFixed(2)}`
      : "";
  console.log(probabilityvalue, "probabilityvalue");
  const failureRate =
    failureratevalue?.value !== undefined && failureratevalue?.value !== null
      ? failureratevalue?.value === 0
        ? "0"
        : Math.abs(failureratevalue?.value) < 0.01
        ? `${(failureratevalue?.value).toExponential(2)}`
        : `${(failureratevalue?.value).toFixed(2)}`
      : "";
  console.log(failureratevalue, "failureratevalue");
  const mttr = mttrvalue?.value ?? "";
  const mdt = mdtvalue?.value ?? "";
  const mtbf = mtbfvalue?.value ?? "";

  // Function to handle selected date from PredictionCalendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  const formattedDay =
    selectedDate && !isNaN(selectedDate.getDate())
      ? selectedDate.getDate()
      : "";
  const formattedMonth =
    selectedDate && !isNaN(selectedDate.getMonth())
      ? selectedDate.getMonth() + 1
      : "";
  const formattedYear =
    selectedDate && !isNaN(selectedDate.getFullYear())
      ? selectedDate.getFullYear()
      : "";
  const [hour, setHour] = useState<string>("");

  // Fungsi untuk mengonversi hour ke format 12 jam dengan AM/PM
  const formatTime = (hourValue: string): string => {
    if (!hourValue && selectedDate) {
      return "Now";
    }
    const cleanedValue = hourValue.replace(",", ":");
    const [hourPart, minutePart] = cleanedValue
      .split(":")
      .map((part) => parseInt(part, 10));

    // Validasi jam dan menit
    if (
      hourPart < 0 ||
      hourPart > 23 ||
      (minutePart !== undefined &&
        (isNaN(minutePart) || minutePart < 0 || minutePart > 59))
    ) {
      return "Invalid hour";
    }
    if (isNaN(hourPart)) return "";
    // Konversi ke format 12 jam
    const period = hourPart >= 12 ? "PM" : "AM";
    const formattedHour = hourPart % 12 === 0 ? 12 : hourPart % 12;
    const formattedMinute =
      minutePart !== undefined ? minutePart.toString().padStart(2, "0") : "00";

    return `${formattedHour
      .toString()
      .padStart(2, "0")}:${formattedMinute} ${period}`;
  };

  // Event handler untuk input hour
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(",", ":"); // Ganti koma dengan titik dua
    setHour(cleanedValue);
  };

  if (!isModalOpen) return null;
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "day" | "month" | "year"
  ) => {
    const value = e.target.value;
    let newDate = selectedDate ? new Date(selectedDate) : new Date();
    if (value === "") {
      setSelectedDate(undefined); // Reset the selected date when input is empty
      return;
    }
    if (type === "day") {
      newDate.setDate(Number(value));
    } else if (type === "month") {
      newDate.setMonth(Number(value) - 1); // Set month correctly (0-11 range)
    } else if (type === "year") {
      newDate.setFullYear(Number(value));
    }

    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
    }
  };
  const formatISOWithMicroseconds = (date: Date) => {
    const pad = (n: number, digits = 2) => n.toString().padStart(digits, "0");
    const microseconds = `${pad(date.getMilliseconds(), 3)}656`; // Mocked microseconds
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}.${microseconds}`;
  };
  const handleCalculate = () => {
    if (!selectedDate) {
      alert("Please enter a date");
      return;
    }

    let inputHour = 0;
    let inputMinute = 0;

    if (hour.trim() === "") {
      // If hour is empty, use the current time
      const now = new Date();
      inputHour = now.getHours();
      inputMinute = now.getMinutes();
    } else {
      // If hour is available, use the input value
      [inputHour, inputMinute] = hour.split(":").map(Number);
    }

    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(inputHour || 0, inputMinute || 0, 0, 0);

    // Set the formatted time state
    const newFormattedTime = String(formatISOWithMicroseconds(updatedDate));
    setFormattedTime(newFormattedTime);

    // Simulate API call
    // console.log("Sending to API:", newFormattedTime);
    // alert(`Formatted Time: ${newFormattedTime}`);
  };
  const isLoading =
    failurerateLoading ||
    mttrloading ||
    mtbfloading ||
    mdtloading ||
    reliabilityloading ||
    failuresLoading ||
    probabilityloading;

  return (
    <div>
      {/* Overlay Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white rounded-[40px] shadow-lg sm:p-10 p-7 sm:w-[85%] w-[90%]">
          {isLoading && (
            <div className="">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <p className="text-white mt-4">Loading...</p>
              </div>
            </div>
          )}
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold absolute top-4 right-6"
          >
            ×
          </button>

          <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="bg-[#1C9EB6] rounded-xl py-[0.5px] px-4 text-white text-[10px] w-fit">
                Equipment Level 3.7
              </div>
              <h2 className="text-2xl font-semibold">Prediction Calculator</h2>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex lg:flex-row flex-col justify-center mt-10 gap-8">
            <div className="max-w-md">
              <div className="flex flex-row justify-center gap-2 flex-wrap">
                <div className="flex-1">
                  <label className="text-[10px] text-[#918E8E]" htmlFor="hour">
                    Hour
                  </label>
                  <input
                    id="hour"
                    name="hour"
                    type="text"
                    value={hour}
                    onChange={handleHourChange}
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-[#918E8E]" htmlFor="day">
                    Day
                  </label>
                  <input
                    id="day"
                    name="day"
                    type="text"
                    value={formattedDay} // Set the value to the selected day
                    onChange={(e) => handleInputChange(e, "day")} // Handle input change
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-[#918E8E]" htmlFor="month">
                    Month
                  </label>
                  <input
                    id="month"
                    name="month"
                    type="text"
                    value={formattedMonth} // Set the value to the selected month
                    onChange={(e) => handleInputChange(e, "month")} // Handle input change
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-[#918E8E]" htmlFor="year">
                    Year
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    value={formattedYear} // Set the value to the selected year
                    onChange={(e) => handleInputChange(e, "year")} // Handle input change
                    className="mt-1 block w-full px-3 py-2 bg-[#F4F4F4] rounded-[8px] shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
              <div className="py-6">
                <PredictionCalendar
                  onDateSelect={handleDateSelect}
                  selected={selectedDate}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-center gap-2">
                  <div className="flex flex-row md:items-center gap-4 items-start justify-between flex-wrap shadow-xl bg-white rounded-3xl p-5 w-full">
                    <div className="text-[10px] text-[#918E8E]">
                      Prediction Date Result
                    </div>
                    <div className="flex flex-row md:gap-12 gap-2 md:items-center">
                      <div className=" flex flex-col justify-center">
                        <div className="text-[10px] text-[#1C9EB6]">Time</div>
                        <div
                          className={`text-[12px] font-semibold ${
                            formattedTime ? "text-black" : "text-[#B2B2B2]"
                          }`}
                        >
                          {formatTime(hour)}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-[10px] text-[#1C9EB6]">Day</div>
                        <div
                          className={`text-[12px] font-semibold ${
                            formattedTime ? "text-black" : "text-[#B2B2B2]"
                          }`}
                        >
                          {selectedDate
                            ? selectedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                              })
                            : ""}
                        </div>
                      </div>
                      <div className=" flex flex-col justify-center">
                        <div className="text-[10px] text-[#1C9EB6]">Date</div>
                        <div
                          className={`text-[12px] font-semibold ${
                            formattedTime ? "text-black" : "text-[#B2B2B2]"
                          }`}
                        >
                          {selectedDate
                            ? selectedDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-center items-center hover:text-white text-[#1C9EB6] border border-[#1C9EB6] hover:bg-[#14788E] rounded-[100px] py-1 px-6 text-sm w-fit h-fit text-[13px] cursor-pointer">
                      <div className="text-[12px]  ">Download Result</div>
                    </div>
                    <button
                      onClick={handleCalculate}
                      className="flex flex-row justify-center items-center bg-[#1C9EB6] hover:bg-[#14788E] rounded-[100px] py-3 px-12 text-white text-sm h-fit text-[13px] cursor-pointer"
                    >
                      <div className="text-[12px] ">Calculate</div>
                    </button>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap justify-center gap-6">
                  <div
                    className={`flex flex-col shadow-lg ${
                      formattedTime ? "bg-[#1C9EB6]" : "bg-[#2b2d2d40]"
                    } text-white text-[14px] rounded-[40px] justify-start items-start w-40 h-40 p-5`}
                  >
                    <div>Calculation</div>
                    <div>Result</div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>Failure</p>
                        <CircleAlert
                          fill="#D93832"
                          color="#ffffff"
                          absoluteStrokeWidth
                        />
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {failures ? (
                            failures.toLocaleString()
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {" "}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B2B2B2]">
                          Failures
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>Reliability</p>
                        <CircleCheck
                          fill="#28C840"
                          color="#ffffff"
                          absoluteStrokeWidth
                        />
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {reliability && reliability.includes("e") ? (
                            <span>
                              {reliability.split("e")[0]}e
                              <sup>{reliability.split("e")[1]}</sup>
                            </span>
                          ) : reliability === "0" ? (
                            <span>0</span>
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {reliability}
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-[#B2B2B2]">%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>MTBF</p>
                        <CircleAlert
                          fill="#D93832"
                          color="#ffffff"
                          absoluteStrokeWidth
                        />
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {mtbf ? (
                            mtbf.toLocaleString()
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {" "}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B2B2B2]">Jam</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>MDT</p>
                        <div className="rounded-full bg-[#F49C38] p-[5px]">
                          <Loader
                            className="w-[10px] h-[10px]"
                            fill="white"
                            color="white"
                            absoluteStrokeWidth
                          />
                        </div>
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {mdt ? (
                            mdt.toLocaleString()
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {" "}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B2B2B2]">Jam</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>MTTR</p>
                        <CircleCheck
                          fill="#28C840"
                          color="#ffffff"
                          absoluteStrokeWidth
                        />
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {mttr ? (
                            mttr.toLocaleString()
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {" "}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B2B2B2]">Jam</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>Failure Rate</p>
                        <CircleCheck
                          fill="#28C840"
                          color="#ffffff"
                          absoluteStrokeWidth
                        />
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {failureRate && failureRate.includes("e") ? (
                            <span>
                              {failureRate.split("e")[0]}e
                              <sup>{failureRate.split("e")[1]}</sup>
                            </span>
                          ) : failureRate === "0" ? (
                            <span>0</span>
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {failureRate}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B2B2B2]">
                          Failures / hour
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shadow-lg bg-white font-semibold text-[14px] rounded-[40px] justify-between items-start w-40 h-40 p-5">
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex flex-row items-center justify-between w-full ${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        <p>Probability</p>
                        <CircleCheck
                          fill="#28C840"
                          color="#ffffff"
                          absoluteStrokeWidth
                        />
                      </div>
                      <p
                        className={`${
                          formattedTime ? "text-black" : "text-[#7B7A7A]"
                        }`}
                      >
                        Prediction
                      </p>
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={`h-full w-[3px] bg-gradient-to-b ${
                          formattedTime ? "from-[#1C9EB6]" : "from-[#7B7A7A]"
                        } to-white mr-3`}
                      ></div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="text-3xl font-bold">
                          {probability && probability.includes("e") ? (
                            <span>
                              {probability.split("e")[0]}e
                              <sup>{probability.split("e")[1]}</sup>
                            </span>
                          ) : probability === "0" ? (
                            <span>0</span>
                          ) : (
                            <div className="h-[6px] w-[15px] bg-[#D9D9D9] my-4">
                              {probability}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B2B2B2]">Unit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
