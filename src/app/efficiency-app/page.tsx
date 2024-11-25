"use client";

import Image from "next/image";
import EngineFlow from "../../../public/engine-flow-v2.jpg";
import NewEngineFlow from "../../../public/efficiency-app/engine-flow-infografis.png";
import NewEngineFlow2 from "../../../public/efficiency-app/v2-engine-flow-infografis.png";
import {
  Tooltip,
  Button,
  Link,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  DateRangePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Accordion,
  AccordionItem,
  useDisclosure,
} from "@nextui-org/react";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetDataEngineFlow } from "@/lib/APIs/useGetDataEngineFlow";
import { useSession } from "next-auth/react";
import { useGetDataPareto } from "@/lib/APIs/useGetDataPareto";
import { useGetData } from "@/lib/APIs/useGetData";
import { Fragment, useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { ArrowUpIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { RangeValue } from "@react-types/shared";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { DateValue } from "@react-types/datepicker";
import { useRouter } from "next/navigation";
import { useGetDataCompare } from "@/lib/APIs/useGetDataCompare";
import { useGetDataActions } from "@/lib/APIs/useGetDataActions";
import { formattedNumber } from "@/lib/formattedNumber";
import { EFFICIENCY_API_URL } from "../../lib/api-url";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStatusThermoflowStore } from "../../store/statusThermoflow";
import { useGetThermoStatus } from "../../lib/APIs/useGetThermoStatus";
import { useSearchParams } from "next/navigation";
import { useGetVariables } from "../../lib/APIs/useGetVariables";
import { useExcelStore } from "../../store/excels";
import { useGetMasterData } from "../../lib/APIs/useGetMasterData";
import ActionsTable from "../../components/efficiency-app/ActionsTable";
import ModalInputData from "@/components/efficiency-app/ModalInputData";
import { formatUnderscoreToSpace } from "@/lib/format-text";

interface Variable {
  category: string;
  input_name: string;
  satuan: string;
  id: string;
  in_out: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dataId, setDataId]: any = useState("");
  const [selectedLabel, setSelectedLabel]: any = useState("");
  const [modalChoosePeriod, setModalChoosePeriod] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState("current");
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [periodValue, setPeriodValue] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
  });

  const {
    data: thermoStatusData,
    isLoading: isLoadingThermoStatus,
    isValidating: isValidatingThermoStatus,
  } = useGetThermoStatus();

  const {
    data: masterData,
    isLoading: isLoadingMasterData,
    isValidating: isValidatingMasterData,
    mutate: mutateMasterData,
    error: errorMasterData,
  } = useGetMasterData(session?.user.access_token);

  const coalPriceData = masterData?.find(
    (item: any) => item.name === "Coal Price"
  );

  const [coalPrice, setCoalPrice] = useState(`${coalPriceData?.nphr_value}`);

  useEffect(() => {
    setCoalPrice(`${coalPriceData?.nphr_value}`);
  }, [coalPriceData]);

  const {
    data: compareData,
    error: errorCompare,
    mutate: mutateCompare,
    isLoading: isLoadingCompare,
    isValidating: isValidatingCompare,
  } = useGetDataCompare(session?.user.access_token, dataId);

  const {
    data: efficiencyData,
    error: errorEfficiencyData,
    mutate: mutateEfficiencyData,
    isLoading: isLoadingEfficiencyData,
    isValidating: isValidatingEfficiencyData,
  } = useGetData(session?.user.access_token, 0);

  const selectedEfficiencyData = efficiencyData?.transactions ?? [];

  const {
    data: engineFlow,
    isLoading,
    error,
  } = useGetDataEngineFlow(session?.user.access_token, dataId);

  const {
    data: actionData,
    isLoading: isLoadingActionData,
    isValidating: isValidatingActionData,
    error: erroActionData,
  } = useGetDataActions(session?.user.access_token, engineFlow?.id);

  const {
    data,
    mutate,
    isLoading: isLoadingPareto,
    error: errorPareto,
    isValidating: isValidatingPareto,
  } = useGetDataPareto(session?.user.access_token, dataId, 100);

  const EfficiencyDataOptions = selectedEfficiencyData
    .filter(
      (item) => item.status === "Done" && item.jenis_parameter === "current"
    )
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });

  // Function to filter efficiency data based on user input
  const filterEfficiencyData = (inputValue: string) => {
    return EfficiencyDataOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Load options asynchronously
  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterEfficiencyData(inputValue));
    }, 1000); // Simulating a delay for async data fetching
  };

  const tableData = data?.pareto_result ?? [];
  const paretoTopData = data?.pareto_uncategorized_result ?? [];
  const paretoBottomData = tableData.filter((item) => item.category != null);
  const categoriesCompareData = compareData?.categories_data ?? [];
  const paretoCompareData = compareData?.pareto_data ?? [];
  const actionsData = actionData ?? [];

  const statusData = selectedEfficiencyData.find(
    (item: any) => item.id === engineFlow?.id
  );
  const engineFlowData = engineFlow ?? {};

  const positions = {
    // Top row - turbines
    EG: { name: "Output Generator", top: "14%", left: "91%", unit: "MW" },
    LPT: { name: "Efficiency", top: "12%", left: "76%", unit: "%" },
    IPT: { name: "Efficiency", top: "14%", left: "53%", unit: "%" },
    HPT: { name: "Efficiency", top: "15%", left: "29.8%", unit: "%" },

    //Boiler
    Boiler: { name: "Boiler", top: "65%", left: "7%", unit: "%" },

    // Bottom row - RH components
    RH7: { name: "TTD", top: "74%", left: "28%", unit: "°C" },
    RH6: { name: "TTD", top: "74%", left: "36%", unit: "°C" },
    RH5: { name: "TTD", top: "74%", left: "45.5%", unit: "°C" },
    RH3: { name: "TTD", top: "74%", left: "62.3%", unit: "°C" },
    RH2: { name: "TTD", top: "74%", left: "71.5%", unit: "°C" },
    RH1: { name: "TTD", top: "74%", left: "81%", unit: "°C" },

    // Condensor
    Condensor_Value: {
      name: "Pressure:",
      top: "65%",
      left: "92%",
      unit: "mbara",
    },
  };

  //form ==========================================================
  function onError(formError: any) {
    console.log(formError);
  }
  const formatNumber = (num: number | string) => {
    // Convert the input number to a string to avoid rounding off decimals
    const parts = num.toString().split("."); // Use '.' to handle decimals correctly
    const integerPart = new Intl.NumberFormat("id-ID").format(Number(parts[0]));

    // Return the formatted number with a decimal part if present
    return parts.length > 1 ? `${integerPart},${parts[1]}` : integerPart;
  };

  const unformatNumber = (formattedValue: string) => {
    // Remove thousands separators (commas) and replace decimal commas with periods
    return formattedValue.replace(/\./g, "").replace(",", ".");
  };

  const setStatusThermoflow = useStatusThermoflowStore(
    (state) => state.setStatusThermoflow
  );
  const excels = useExcelStore((state) => state.excels);

  const {
    data: variables,
    isLoading: isLoadingVariable,
    error: errorVariable,
  } = useGetVariables(
    session?.user.access_token,
    excels[0].id,
    "in",
    selectedParameter,
    selectedParameter === "current" ? undefined : String(periodValue.start),
    selectedParameter === "current" ? undefined : String(periodValue.end)
  );

  const variableData = variables ?? [];

  const filteredVariableData = variableData.filter(
    (v: any) => v.in_out === "in"
  );

  const formRef = useRef<HTMLFormElement>(null);
  const formSchemaInput = z.object({
    name: z.string({ message: "Name is required!" }), // Adjust validation as needed
    // date: z.string({ message: "Date is required!" }),
    inputs: z.object(
      Object.fromEntries(
        filteredVariableData.map((v: any) => [
          v.id, // This is the key for the schema
          z.string({ message: "Value is required!" }),
        ])
      )
    ),
  });

  const categorizedData = variableData.reduce((acc: any, variable: any) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);

  const defaultInputs = Object.fromEntries(
    filteredVariableData.map((v: any) => [v.id, v.base_case.toString()])
  );

  // 1. Define your form.
  const formInput = useForm<z.infer<typeof formSchemaInput>>({
    resolver: zodResolver(formSchemaInput),
    mode: "onChange",
    defaultValues: {
      name: "",
      inputs: defaultInputs,
    },
  });
  const formError = formInput.formState.errors;
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchemaInput>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // alert(JSON.stringify(values));
    // console.log(inputValues);
    setLoading(true);

    // Handle 'data_outputs' event

    const sendData = async () => {
      try {
        const payload = {
          name: values.name,
          jenis_parameter: "current",
          excel_id: excels[0].id,
          inputs: values.inputs,
          input_type: selectedParameter,
          periodic_start_date: periodValue.start ?? null,
          periodic_end_date: periodValue.end ?? null,
          coal_price: coalPrice,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.access_token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const response_data = await response.json();

        if (!response.ok) {
          toast.error(
            `${response_data.message}, check VPN or connection to PI server`
          );
          setLoading(false);
          return;
        }

        toast.success("Data input received, wait for the to be processed!");
        setStatusThermoflow(true);
        setLoading(false);
        // router.push(`/efficiency-app/${response_data.data.data_id}/output`);
        setTimeout(() => router.push(`/efficiency-app`), 3000);

        // if (response) {
        //   setLoading(false);
        //   toast.success("Data Sent!");
        //   router.push("/output");
        // }
        // setTimeout(() => {

        // }, 1000);
      } catch (error) {
        // @ts-ignore
        toast.error(`Error: ${error}`);
        setLoading(false);
        console.error("Error:", error);
      }
    };
    sendData();
  }

  const handlePeriod = () => {
    const url = `/efficiency-app/input?parameter=periodic&start_date=${periodValue.start}&end_date=${periodValue.end}`;
    router.push(url);
  };

  // Handler for date range changes
  const handleDateRangeChange = (range) => {
    if (!range.start || !range.end) return;

    const daysDifference = Math.abs(Number(range.end) - Number(range.start));

    if (daysDifference > 30) {
      // If selected range is more than 30 days, adjust the start date
      setPeriodValue({
        //@ts-ignore
        start: Number(range.end) - 30,
        end: range.end,
      });
    } else {
      setPeriodValue(range);
    }
  };

  const formatIDNumber = (value: any) =>
    new Intl.NumberFormat("id-ID").format(value);

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return "-";
    return `${formatIDNumber(Number(value).toFixed(2))} ${unit}`;
  };

  // Function to delete the selected row
  const handleDelete = async () => {
    if (!engineFlow?.id) return;
    // setLoadingEfficiency(isValidating);
    setIsDeleteLoading(true);
    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/data/${engineFlow?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );
      if (response.ok) {
        mutate();
        toast.success("Data deleted successfully!");
        setDeleteModalOpen(false); // Close the modal
      } else {
        console.error("Failed to delete");
        toast.error("Failed to delete data, try again later...");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error(`Error: ${error || "Unknown error occurred"}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingVariable && variables) {
      formInput.reset({
        name: "",
        inputs: defaultInputs,
      });
    }
  }, [variables, isLoadingVariable]);

  // The modal that shows up when attempting to delete an item
  const deleteConfirmationModal = (
    <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isDeleteLoading}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const actionTableModal = (
    <Modal
      isOpen={actionModalOpen}
      size="5xl"
      scrollBehavior="inside"
      onOpenChange={setActionModalOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Actions</ModalHeader>
            <ModalBody>
              <div className={`h-full overflow-y-auto`}>
                <ActionsTable data={actionsData} />
              </div>
            </ModalBody>
            <ModalFooter>
              {/* <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return (
    <>
      {deleteConfirmationModal}
      {actionTableModal}
      <ModalInputData
        modalChoosePeriod={modalChoosePeriod}
        setModalChoosePeriod={setModalChoosePeriod}
        showVariables={showVariables}
        setShowVariables={setShowVariables}
        selectedParameter={selectedParameter}
        setSelectedParameter={setSelectedParameter}
        loading={loading}
        setLoading={setLoading}
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        periodValue={periodValue}
        setPeriodValue={setPeriodValue}
        thermoStatusData={thermoStatusData}
      />
      <EfficiencyContentLayout title="Efficiency & Heat Loss App">
        <div className="w-full flex flex-col justify-center items-center bg-white rounded-xl shadow-xl pt-8">
          {/* {JSON.stringify(dataCompare)}{" "} */}
          <div className={`w-full flex justify-between px-8 items-center`}>
            <div className={`min-w-fit flex justify-start items-center gap-4`}>
              <h2 className={`text-2xl font-semibold mr-1`}>Engine Flow</h2>
              <Button
                size="sm"
                variant="flat"
                isDisabled={true}
                className={`bg-[#1C9EB6] text-white dark:text-white !px-3 !py-2 !opacity-100`}
              >
                {statusData ? statusData.status : "-"}
              </Button>
              {isLoadingEfficiencyData || isValidatingEfficiencyData ? (
                "Loading..."
              ) : (
                <>
                  <AsyncSelect
                    className="z-20 dark:text-black rounded-full"
                    isClearable={true}
                    placeholder={`Select Data...`}
                    isSearchable={true}
                    loadOptions={loadOptions}
                    defaultValue={
                      dataId ? { value: dataId, label: selectedLabel } : null
                    }
                    defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
                    cacheOptions // Caches the loaded options
                    isLoading={isLoadingEfficiencyData}
                    onChange={(e) => {
                      //@ts-ignore
                      const newValue = e?.value ?? null;
                      const newLabel = e?.label ?? "";
                      setDataId(newValue);
                      setSelectedLabel(newLabel);
                    }}
                    name="efficiencyData"
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: 10,
                        width: 175,
                        height: 33,
                        backgroundColor: "#f3f4f6",
                      }),
                    }}
                  />
                </>
              )}
              <Tooltip content={`Delete Data`}>
                <Button
                  className="bg-gray-100 px-0 !min-w-12"
                  onPress={() => {
                    setDeleteModalOpen(true);
                  }}
                >
                  <img src={`/icons/trash.png`} alt={`Delete Icon`} />
                </Button>
              </Tooltip>
              <Tooltip content={`Pareto Details`}>
                <Button
                  className="bg-gray-100 px-0 !min-w-12"
                  as={Link}
                  href={`/efficiency-app/${engineFlow?.id}/pareto?percent-threshold=${statusData?.persen_threshold}&potential-timeframe=${statusData?.potential_timeframe}`}
                >
                  <img src={`/icons/eye.png`} alt={`Show Icon`} />
                </Button>
              </Tooltip>
              <Button
                as={Link}
                href={`/efficiency-app/all-data`}
                className="bg-gray-100 px-4 !min-w-12"
              >
                All Simulation
              </Button>
              {/* <Button
                as={Link}
                href={`/efficiency-app/${engineFlow?.id}/pareto?percent-threshold=${statusData?.persen_threshold}&potential-timeframe=${statusData?.potential_timeframe}`}
                className="bg-gray-100 px-4 !min-w-12"
              >
                Pareto
              </Button> */}
              <Button
                className="bg-gray-100 px-4 !min-w-12"
                onClick={() => {
                  setActionModalOpen(true);
                }}
              >
                Actions
              </Button>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    as={Link}
                    // isDisabled={thermoStatus ?? false}
                    // isLoading={thermoStatus ?? false}
                    endContent={
                      // <PlusIcon className={`${thermoStatus ? "hidden" : ""}`} />
                      <CaretDownIcon />
                    }
                    className={`${
                      session?.user.user.role === "Management" ? "hidden" : ""
                    } bg-gray-100 `}
                  >
                    Add New
                    {/* {!thermoStatus ? "Add New" : "Processing Data..."} */}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Actions">
                  <DropdownItem
                    key="current"
                    // href={`/efficiency-app/input?parameter=current`}
                    onClick={() => {
                      setModalChoosePeriod(true);
                      setSelectedParameter("current");
                    }}
                  >
                    Current
                  </DropdownItem>
                  <DropdownItem
                    key="period"
                    onClick={() => {
                      setModalChoosePeriod(true);
                      setSelectedParameter("periodic");
                    }}
                  >
                    Periodic
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className={`flex justify-start items-center gap-4`}>
              <Button
                as={Link}
                href={`/efficiency-app/cost-benefit-analysis`}
                className={`
                  bg-gray-100
                  `}
              >
                Cost Benefit Analysis
              </Button>
              <Button
                as={Link}
                href={`/efficiency-app/nett-plant-heat-rate`}
                className={`
                  bg-gray-100
                  `}
              >
                Nett Plant Heat Rate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-md md:text-lg">
            <div
              className={`flex flex-col gap-4 col-span-1 my-4 px-6 py-3 h-[70dvh] overflow-y-auto`}
            >
              {Object.keys(paretoCompareData)
                .filter(
                  (key) =>
                    String(key) == "Plant Net Heat Rate" ||
                    String(key) == "Total Coal Flow" ||
                    String(key) == "total_nilai" ||
                    String(key) == "total_persen"
                )
                .map((key) => {
                  switch (String(key)) {
                    case "total_persen":
                      return (
                        <Popover
                          key={key}
                          placement="right-end"
                          showArrow={true}
                          isOpen={false}
                        >
                          <PopoverTrigger>
                            <Button
                              isDisabled={true}
                              className="text-center bg-gray-100 px-2 py-7 inline-flex items-center justify-between rounded-xl dark:text-black !opacity-100"
                            >
                              <div className="flex flex-col gap-1 justify-start items-start">
                                <p className="font-bold text-base">
                                  Total Persen Loss
                                </p>
                                <p className={`text-sm text-gray-500`}>
                                  {formattedNumber(
                                    Number(paretoCompareData[key]).toFixed(2)
                                  )}{" "}
                                  %
                                </p>
                              </div>
                              {isLoadingCompare ? (
                                <Spinner />
                              ) : (
                                <p
                                  className={`inline-flex items-center text-7xl`}
                                >
                                  <ArrowUpIcon
                                    className={`${
                                      Number(paretoCompareData[key]) > 0
                                        ? "text-green-500"
                                        : Number(paretoCompareData[key]) == 0
                                        ? "hidden"
                                        : "text-[#D93832] rotate-180"
                                    }`}
                                    width={36}
                                    height={36}
                                  />
                                </p>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className={`bg-gray-100`}>
                            <div className="px-1 py-2 flex flex-col divide-y-1 divide-black">
                              {Object.keys(categoriesCompareData).map((key) => {
                                return (
                                  <div
                                    key={key}
                                    className="text-center bg-gray-100 px-2 py-2 flex items-center justify-between dark:text-black"
                                  >
                                    <div className="flex flex-col gap-1 justify-start items-start">
                                      <p className="font-bold text-sm">{key}</p>
                                      <p className={`text-xs text-gray-500`}>
                                        {formattedNumber(
                                          Number(
                                            categoriesCompareData[key]
                                          ).toFixed(2)
                                        )}{" "}
                                      </p>
                                    </div>
                                    {isLoadingCompare ? (
                                      <Spinner />
                                    ) : (
                                      <p
                                        className={`inline-flex items-center text-xl`}
                                      >
                                        <ArrowUpIcon
                                          className={`${
                                            Number(categoriesCompareData[key]) >
                                            0
                                              ? "text-green-500"
                                              : Number(
                                                  categoriesCompareData[key]
                                                ) == 0
                                              ? "hidden"
                                              : "text-[#D93832] rotate-180"
                                          }`}
                                          width={24}
                                          height={24}
                                        />
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    case "total_nilai":
                      return (
                        <Popover
                          key={key}
                          placement="right-end"
                          showArrow={true}
                        >
                          <PopoverTrigger>
                            <Button className="text-center bg-gray-100 px-2 py-7 inline-flex items-center justify-between rounded-xl dark:text-black">
                              <div className="flex flex-col gap-1 justify-start items-start">
                                <p className="font-bold text-base">
                                  Total Heat Loss
                                </p>
                                <p className={`text-sm text-gray-500`}>
                                  {formattedNumber(
                                    Number(paretoCompareData[key]).toFixed(2)
                                  )}{" "}
                                  kCal/kWh
                                </p>
                              </div>
                              {isLoadingCompare ? (
                                <Spinner />
                              ) : (
                                <p
                                  className={`inline-flex items-center text-7xl`}
                                >
                                  <ArrowUpIcon
                                    className={`${
                                      Number(paretoCompareData[key]) > 0
                                        ? "text-green-500"
                                        : Number(paretoCompareData[key]) == 0
                                        ? "hidden"
                                        : "text-[#D93832] rotate-180"
                                    }`}
                                    width={36}
                                    height={36}
                                  />
                                </p>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className={`bg-gray-100`}>
                            <div className="px-1 py-2 flex flex-col divide-y-1 divide-black">
                              {Object.keys(categoriesCompareData).map((key) => {
                                return (
                                  <div
                                    key={key}
                                    className="text-center bg-gray-100 px-2 py-2 flex items-center justify-between dark:text-black"
                                  >
                                    <div className="flex flex-col gap-1 justify-start items-start">
                                      <p className="font-bold text-sm">{key}</p>
                                      <p className={`text-xs text-gray-500`}>
                                        {formattedNumber(
                                          Number(
                                            categoriesCompareData[key]
                                          ).toFixed(2)
                                        )}{" "}
                                      </p>
                                    </div>
                                    {isLoadingCompare ? (
                                      <Spinner />
                                    ) : (
                                      <p
                                        className={`inline-flex items-center text-xl`}
                                      >
                                        <ArrowUpIcon
                                          className={`${
                                            Number(categoriesCompareData[key]) >
                                            0
                                              ? "text-green-500"
                                              : Number(
                                                  categoriesCompareData[key]
                                                ) == 0
                                              ? "hidden"
                                              : "text-[#D93832] rotate-180"
                                          }`}
                                          width={24}
                                          height={24}
                                        />
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    default:
                      return (
                        <div
                          key={key}
                          className="text-center bg-gray-100 px-2 py-2 flex items-center justify-between rounded-xl dark:text-black"
                        >
                          <div className="flex flex-col gap-1 justify-start items-start">
                            <p className="font-bold text-base">{key}</p>
                            <p className={`text-sm text-gray-500`}>
                              {formattedNumber(
                                Number(paretoCompareData[key]).toFixed(2)
                              )}{" "}
                              {String(key) === "Total Coal Flow"
                                ? "Kg/h"
                                : "kCal/kWh"}
                            </p>
                          </div>
                          {isLoadingCompare ? (
                            <Spinner />
                          ) : (
                            <p className={`inline-flex items-center text-7xl`}>
                              <ArrowUpIcon
                                className={`${
                                  Number(paretoCompareData[key]) > 0
                                    ? "text-green-500"
                                    : Number(paretoCompareData[key]) == 0
                                    ? "hidden"
                                    : "text-[#D93832] rotate-180"
                                }`}
                                width={36}
                                height={36}
                              />
                            </p>
                          )}
                        </div>
                      );
                  }
                })}
            </div>
            <div className="relative w-full col-span-3">
              <Image
                src={NewEngineFlow2}
                alt="engine-flow"
                className="h-[75dvh]"
              />
              {Object.keys(positions).map((key) => (
                <div
                  key={key}
                  style={{
                    top: positions[key].top,
                    left: positions[key].left,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute z-10"
                >
                  <div className={`relative `}>
                    <div
                      className={`${
                        engineFlowData[key]?.diff > 0
                          ? "bg-green-500"
                          : engineFlowData[key]?.diff == 0
                          ? "bg-gray-400 "
                          : "bg-[#D93832]"
                      } backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         md:text-[14px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-105  hover:shadow-md
                         transition-all ease-in-out
                         transform origin-center text-center ${
                           engineFlowData[key]?.diff >= 0 ? "" : "animate-pulse"
                         }`}
                    >
                      <div
                        className={`font-semibold ${
                          engineFlowData[key]?.diff == 0
                            ? "text-white"
                            : "text-neutral-200"
                        } pb-2`}
                      >
                        {" "}
                        {positions[key].name}
                      </div>
                      <div
                        className={`font-bold text-lg
                      ${
                        engineFlowData[key]?.diff == 0
                          ? "text-white"
                          : "text-neutral-200"
                      }
                      `}
                      >
                        {formatValue(
                          engineFlowData[key]?.value,
                          positions[key].unit
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-0 right-0 mx-auto w-full">
                      <div className={`relative`}>
                        <div
                          className={`rounded-full w-5 h-5 absolute left-0 right-0 mx-auto border-2 ${
                            engineFlowData[key]?.diff >= 0
                              ? ""
                              : "animate-pulse"
                          }  ${
                            engineFlowData[key]?.diff > 0
                              ? "bg-green-500 border-[#75eaff]"
                              : engineFlowData[key]?.diff == 0
                              ? "bg-gray-400 border-white/30"
                              : "bg-[#D93832] border-[#ffb5b3]"
                          }`}
                        ></div>
                        <div className="w-6 overflow-hidden inline-block absolute bottom-0 right-0 left-0 m-auto">
                          <div
                            className={`h-4 w-4 ${
                              engineFlowData[key]?.diff > 0
                                ? "bg-green-500"
                                : engineFlowData[key]?.diff == 0
                                ? "bg-gray-400 "
                                : "bg-[#D93832]"
                            } -rotate-45 transform origin-top-left ${
                              engineFlowData[key]?.diff >= 0
                                ? ""
                                : "animate-pulse"
                            }`}
                          ></div>
                        </div>
                        <p className="bg-[#1C9EB6] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] inline-flex font-semibold text-center rounded-md absolute -bottom-16 right-0 left-0 m-auto max-w-fit px-1.5 py-0.5 !animate-none">
                          {formatUnderscoreToSpace(key) === "Condensor Value"
                            ? "Condensor"
                            : formatUnderscoreToSpace(key)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EfficiencyContentLayout>
    </>
  );
}
