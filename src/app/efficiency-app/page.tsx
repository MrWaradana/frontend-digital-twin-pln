"use client";

import Image from "next/image";
import EngineFlow from "../../../public/engine-flow-v2.jpg";
import NewEngineFlow from "../../../public/efficiency-app/engine-flow-infografis.png";
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
  const [selectedParameter, setSelectedParameter] = useState("current");
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [periodValue, setPeriodValue] = useState<RangeValue<DateValue>>({
    start: parseDate("2024-09-18"),
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

  const statusData = selectedEfficiencyData.find(
    (item: any) => item.id === engineFlow?.id
  );
  const engineFlowData = engineFlow ?? {};

  const positions = {
    // Top row - turbines
    EG: { name: "Output Generator:", top: "14%", left: "91%", unit: "MW" },
    LPT: { name: "Efficiency:", top: "12%", left: "76%", unit: "%" },
    IPT: { name: "Efficiency:", top: "14%", left: "53%", unit: "%" },
    HPT: { name: "Efficiency:", top: "15%", left: "29.8%", unit: "%" },

    //Boiler
    Boiler: { name: "Boiler:", top: "74%", left: "8.7%", unit: "%" },

    // Bottom row - RH components
    RH7: { name: "TTD:", top: "74%", left: "28.7%", unit: "°C" },
    RH6: { name: "TTD:", top: "74%", left: "36.6%", unit: "°C" },
    RH5: { name: "TTD:", top: "74%", left: "45.5%", unit: "°C" },
    RH3: { name: "TTD:", top: "74%", left: "61.5%", unit: "°C" },
    RH2: { name: "TTD:", top: "74%", left: "70.5%", unit: "°C" },
    RH1: { name: "TTD:", top: "74%", left: "79.5%", unit: "°C" },

    // Condensor
    Condensor_Value: {
      name: "Pressure:",
      top: "80%",
      left: "90%",
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

  // The modal that shows up when attempting to input new Data
  const ConfirmationModal = (
    <Modal
      isOpen={confirmationModalOpen}
      onOpenChange={setConfirmationModalOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirm Submission</ModalHeader>
            <ModalBody>Are you sure you want to submit this data?</ModalBody>
            <ModalFooter>
              <Button variant="light" color="danger" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="success"
                // type="submit" // This submits the form
                isLoading={loading}
                onPress={() => {
                  formRef.current?.requestSubmit(); // Programmatically submit the form
                  onClose(); // Close modal after submission
                }}
              >
                Confirm Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const choosePeriodicModal = (
    <Modal
      isOpen={modalChoosePeriod}
      onOpenChange={setModalChoosePeriod}
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {selectedParameter === "current" ? (
                <>Add new current data</>
              ) : (
                <>Add new periodic data with max 30 days</>
              )}
            </ModalHeader>
            <ModalBody>
              {isLoadingVariable || isLoadingMasterData ? (
                <Spinner label={`Loading...`} />
              ) : (
                <Form {...formInput}>
                  <form
                    ref={formRef}
                    onSubmit={formInput.handleSubmit(onSubmit, onError)} // Handles form submission
                    className="space-y-1 "
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-3 `}>
                      <div className={`col-span-1 `}>
                        <DateRangePicker
                          label="Date period"
                          className={`max-w-[284px] ${
                            selectedParameter === "current" ? "hidden" : ""
                          }`}
                          maxValue={today(getLocalTimeZone())}
                          value={periodValue}
                          defaultValue={{
                            start: today(getLocalTimeZone()),
                            end: today(getLocalTimeZone()),
                          }}
                          showMonthAndYearPickers
                          description="Select a date range (maximum 30 days)"
                          onChange={handleDateRangeChange}
                        />
                        {/* Name Input Field */}
                        <div className="mb-4">
                          <FormField
                            control={formInput.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Enter name"
                                    label="Name*"
                                    size="md"
                                    className="max-w-xs lg:max-w-full border-b-1 pb-1"
                                    labelPlacement="inside"
                                    type="text"
                                    required
                                    {...field}
                                    onChange={async ({ target: { value } }) => {
                                      field.onChange(value);
                                      await formInput.trigger("name");
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Input
                          type={`text`}
                          label={`Coal Price*`}
                          value={formatNumber(coalPrice)}
                          required
                          startContent={`Rp.`}
                          endContent={<p className={`text-xs`}>per KG</p>}
                          className={`max-w-xs mt-4`}
                          onChange={(e) => {
                            const unformattedValue = unformatNumber(
                              e.target.value
                            );
                            setCoalPrice(unformattedValue);
                          }}
                        />
                      </div>
                      <div
                        className={`col-span-2 relative max-h-[200px] overflow-y-auto px-8 py-2 mx-2 bg-default-100 rounded-xl`}
                      >
                        <hr />
                        <h2 className="font-bold text-xs sticky top-0 bg-white p-1 rounded-md dark:bg-black ">
                          Input Variables
                        </h2>
                        <Accordion
                          className="min-w-full"
                          selectionMode="multiple"
                          isCompact
                        >
                          {Object.entries(categorizedData).map(
                            ([category, variables]: any) => (
                              <AccordionItem
                                key={category}
                                textValue={
                                  category === "null"
                                    ? "Tidak Ada Kategori"
                                    : `${category}${
                                        variables.some((v: any) => v.web_id)
                                          ? " => PI SERVER"
                                          : ""
                                      }`
                                }
                                title={
                                  <span
                                    style={{
                                      color: variables.some(
                                        (v: any) => v.web_id
                                      )
                                        ? "black"
                                        : "inherit",
                                      backgroundColor: variables.some(
                                        (v: any) => v.web_id
                                      )
                                        ? "rgba(205, 254, 194,0.8)"
                                        : "inherit",
                                      padding: "2px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    {category === "null"
                                      ? "Tidak Ada Kategori"
                                      : variables.some((v: any) => v.web_id)
                                      ? `${category} => PI SERVER`
                                      : `${category}`}
                                  </span>
                                }
                              >
                                {variables.map((v: any) => (
                                  <Fragment key={v.id}>
                                    <FormField
                                      control={formInput.control}
                                      name={`inputs.${v.id}`} // Ensure correct nesting in form data
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input
                                              placeholder={`${""}`}
                                              label={
                                                v.web_id
                                                  ? `${v.input_name} => PI Server`
                                                  : v.input_name
                                              }
                                              color={`${
                                                v.web_id ? "success" : "default"
                                              }`}
                                              defaultValue={v.base_case.toString()}
                                              size="md"
                                              className={`justify-between max-w-xs lg:max-w-full  border-b-1 pb-1 pt-4`}
                                              labelPlacement="outside"
                                              type={
                                                v.base_case.toString() === "N/A"
                                                  ? "hidden"
                                                  : "text"
                                                // "text"
                                              }
                                              required
                                              {...field}
                                              onChange={async ({
                                                target: { value },
                                              }) => {
                                                // Allow empty string
                                                if (value === "") {
                                                  field.onChange("");
                                                }
                                                // Allow "N/A"
                                                else if (
                                                  value.toUpperCase() === "N/A"
                                                ) {
                                                  field.onChange("N/A");
                                                }
                                                // Allow numbers (including decimals, negative numbers, and standalone decimal points)
                                                else if (
                                                  /^-?\.?\d*\.?\d*$/.test(value)
                                                ) {
                                                  field.onChange(value);
                                                }
                                                // If the input is invalid, don't update the field
                                                await formInput.trigger(
                                                  `inputs.${v.id}`
                                                );
                                              }}
                                              endContent={
                                                <p className="text-sm">
                                                  {v.satuan == "NaN"
                                                    ? ""
                                                    : v.satuan}
                                                </p>
                                              }
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </Fragment>
                                ))}
                              </AccordionItem>
                            )
                          )}
                        </Accordion>
                        {/* Submit Button */}
                        {/* <Button
                          type="button"
                          color="primary"
                          size="md"
                          //@ts-ignore
                          isDisabled={thermoStatusData?.thermo_status}
                          isLoading={loading}
                          onClick={() => {
                            setConfirmationModalOpen(true); // Open modal to confirm submission
                          }}
                          className="flex min-w-full translate-y-4"
                        >
                          {thermoStatusData?.thermo_status
                            ? "Thermolink is processing data, please wait..."
                            : "Submit Data"}
                        </Button> */}
                        {/* Confirmation Modal */}
                        {ConfirmationModal}{" "}
                        {/* Modal should be part of the form */}
                      </div>
                    </div>

                    {/* <ModalHeader>Select Max Date for 30 Days Period</ModalHeader>
            <ModalBody>
              <DatePicker
                label="Max Date"
                className="max-w-[284px]"
                maxValue={today(getLocalTimeZone())}
                defaultValue={today(getLocalTimeZone())}
                // formatOptions={dateFormat}
                showMonthAndYearPickers
                description={
                  "This date will serve as the end point for calculating the average over those 30 days."
                }
                //@ts-ignore
                onChange={setPeriodValue}
              /> */}
                    {/* <input type={`date`} /> */}
                    {/* <MomentInput
                // max={moment().add(5, "days")}
                // min={moment()}
                format="YYYY-MM-DD"
                options={true}
                readOnly={false}
                icon={false}
                onChange={(date) => {
                  console.log(date);
                }}
              /> */}
                  </form>
                </Form>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                className={`bg-[#D4CA2F] text-white`}
                size="md"
                //@ts-ignore
                isDisabled={thermoStatusData?.thermo_status}
                isLoading={loading}
                onClick={() => {
                  setConfirmationModalOpen(true); // Open modal to confirm submission
                }}
                // onPress={handlePeriod}
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return (
    <>
      {deleteConfirmationModal}
      {choosePeriodicModal}
      <EfficiencyContentLayout title="Efficiency & Heat Loss App">
        <div className="w-full flex flex-col justify-center items-center bg-white rounded-xl shadow-xl pt-8">
          {/* {JSON.stringify(dataCompare)}{" "} */}
          <div className={`w-full flex justify-between px-12 items-center`}>
            <div className={`min-w-fit flex justify-start items-center gap-4`}>
              <h2 className={`text-2xl font-semibold mr-4`}>Engine Flow</h2>
              <Button
                className={`bg-[#1C9EB6] text-white dark:text-white !px-4 !py-2`}
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
              <Button
                className="bg-gray-100 px-0 !min-w-12"
                onPress={() => {
                  setDeleteModalOpen(true);
                }}
              >
                <img src={`/icons/trash.png`} alt={`Delete Icon`} />
              </Button>
              <Button
                className="bg-gray-100 px-0 !min-w-12"
                as={Link}
                href={`/efficiency-app/${engineFlow?.id}/pareto?percent-threshold=${statusData?.persen_threshold}&potential-timeframe=${statusData?.potential_timeframe}`}
              >
                <img src={`/icons/eye.png`} alt={`Show Icon`} />
              </Button>
              <Button
                as={Link}
                href={`/efficiency-app/all-data`}
                className="bg-gray-100 px-4 !min-w-12"
              >
                All Simulation
              </Button>
              <Button
                as={Link}
                href={`/efficiency-app/${engineFlow?.id}/pareto?percent-threshold=${statusData?.persen_threshold}&potential-timeframe=${statusData?.potential_timeframe}`}
                className="bg-gray-100 px-4 !min-w-12"
              >
                Pareto
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
                            <Button className="text-center bg-gray-100 px-2 py-7 inline-flex items-center justify-between rounded-xl dark:text-black">
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
                                        ? "text-[#1C9EB6]"
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
                                              ? "text-[#1C9EB6]"
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
                                        ? "text-[#1C9EB6]"
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
                                              ? "text-[#1C9EB6]"
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
                                    ? "text-[#1C9EB6]"
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
              <Image src={NewEngineFlow} alt="engine-flow" className="w-full" />
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
                  <div
                    className={`${
                      engineFlowData[key]?.diff > 0
                        ? "bg-[#1C9EB6]"
                        : "bg-[#D93832] animate-pulse"
                    } backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         md:text-[14px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-105  hover:shadow-md
                         transition-all ease-in-out
                         transform origin-center`}
                  >
                    <div className="font-semibold text-neutral-200 pb-2">
                      {" "}
                      {positions[key].name}
                    </div>
                    <div className="text-slate-50">
                      {formatValue(
                        engineFlowData[key]?.value,
                        positions[key].unit
                      )}
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
