"use client";

import {
  today,
  getLocalTimeZone,
  DateValue,
  parseDate,
} from "@internationalized/date";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateRangePicker } from "@nextui-org/date-picker";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Button,
  Accordion,
  AccordionItem,
  ModalFooter,
  RangeValue,
  Input,
} from "@nextui-org/react";
import { Fragment, useEffect, useRef, useState, useMemo } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import { useGetVariables, Variable } from "@/lib/APIs/useGetVariables";
import { useExcelStore } from "@/store/excels";
import { useStatusThermoflowStore } from "@/store/statusThermoflow";
import { useSession } from "next-auth/react";
import { useGetMasterData } from "@/lib/APIs/useGetMasterData";
import AsyncCreatableSelect from "react-select/async-creatable";

interface Option {
  readonly label: string;
  readonly value: string;
}

export default function ModalInputData({
  modalChoosePeriod,
  setModalChoosePeriod,
  showVariables,
  setShowVariables,
  selectedParameter,
  setSelectedParameter,
  loading,
  setLoading,
  confirmationModalOpen,
  setConfirmationModalOpen,
  periodValue,
  setPeriodValue,
  thermoStatusData,
  performanceTest,
  PerformanceDataOptions,
}: any) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // coal price ==================================================
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

  const [value, setValue] = useState<Option | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [beban, setBeban] = useState(`50`);
  const [coalPrice, setCoalPrice] = useState(`${coalPriceData?.nphr_value}`);

  useEffect(() => {
    setCoalPrice(`${coalPriceData?.nphr_value}`);
  }, [coalPriceData]);

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      // setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };

  const filterBeban = (inputValue: string = "") => {
    if (!PerformanceDataOptions || PerformanceDataOptions.length <= 0)
      return [];
    return PerformanceDataOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions: any = (inputValue: string) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterBeban(inputValue));
      }, 1000);
    });

  const [options, setOptions] = useState(promiseOptions);

  //form ==========================================================

  const formatNumber = (num: number | string) => {
    // If the input is not a valid number, return empty string or "0"
    if (num === "" || isNaN(Number(num))) {
      return "0";
    }

    // Convert the input number to a string to avoid rounding off decimals
    const parts = num.toString().split(".");
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
  const formInput = useForm({
    resolver: zodResolver(formSchemaInput),
    mode: "onChange",
    defaultValues: {
      name: "",
      inputs: defaultInputs,
    },
  });

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (filteredVariableData.length > 0) {
      formInput.reset(
        {
          name: formInput.getValues().name,
          inputs: Object.fromEntries(
            filteredVariableData.map((v: any) => [v.id, v.base_case.toString()])
          ),
        },
        {
          keepErrors: true, // Preserve any existing errors
          keepDirty: true, // Preserve dirty fields
          keepValues: false, // Don't keep existing values
        }
      );
    }
  }, [variables]);

  function onError(formError) {
    console.log(formInput);
    console.log(formError);
  }
  const formError = formInput.formState.errors;
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchemaInput>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // alert(JSON.stringify(values));
    // console.log(inputValues);
    setLoading(true);
    // console.log(values, "ini masuk");

    // Handle 'data_outputs' event

    const sendData = async () => {
      try {
        let payload: any = {
          name: values.name,
          jenis_parameter: "current",
          excel_id: excels[0].id,
          inputs: values.inputs,
          input_type: selectedParameter,
          periodic_start_date:
            selectedParameter === "periodic" ? periodValue?.start : null, // Add null fallback
          periodic_end_date:
            selectedParameter === "periodic" ? periodValue?.end : null, // Add null fallback
          coal_price: coalPrice,
        };

        if (performanceTest === true) {
          payload = {
            ...payload,
            is_performance_test: true,
            performance_test_weight: beban,
            group_name: value?.label,
          };
        }

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
        setConfirmationModalOpen(!confirmationModalOpen);
        setModalChoosePeriod(false);
        toast.success("Redirecting...");
        setTimeout(() => {
          if (pathname.includes("/performance-test")) {
            router.push(`/efficiency-app/performance-test`);
          } else if (pathname.includes("/all-data")) {
            router.push(`/efficiency-app/all-data`);
          } else {
            router.push(`/efficiency-app`);
          }
        }, 3000);
      } catch (error) {
        // @ts-ignore
        toast.error(`Error: ${error}`);
        setLoading(false);
        console.error("Error:", error);
      }
    };
    sendData();
  }

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
                className={`bg-[#1C9EB6] text-white`}
                // type="submit" // This submits the form
                isLoading={loading}
                onPress={() => {
                  formRef.current?.requestSubmit(); // Programmatically submit the form
                  // onClose(); // Close modal after submission
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
      size={showVariables ? "3xl" : "sm"}
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
                    <div
                      className={`grid ${
                        showVariables
                          ? "grid-cols-1 lg:grid-cols-3"
                          : "grid-cols-1"
                      } `}
                    >
                      <div className={`${showVariables ? "col-span-1" : ""}`}>
                        <DateRangePicker
                          label="Date period"
                          showMonthAndYearPickers={true}
                          calendarProps={{ showMonthAndYearPickers: true }}
                          visibleMonths={3}
                          pageBehavior="single"
                          className={`max-w-xs ${
                            selectedParameter === "current" ? "hidden" : ""
                          }`}
                          aria-label="Date (Show Month and Year Picker)"
                          maxValue={today(getLocalTimeZone())}
                          value={periodValue}
                          defaultValue={{
                            start: today(getLocalTimeZone()).subtract({
                              months: 1,
                            }),
                            end: today(getLocalTimeZone()),
                          }}
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
                                    className="max-w-xs border-b-1 pb-1"
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
                        {performanceTest === true ? (
                          <>
                            <Input
                              type={`text`}
                              label={`Beban*`}
                              value={formatNumber(beban)}
                              required
                              endContent={`%`}
                              className={`max-w-xs my-4`}
                              onChange={(e) => {
                                const unformattedValue = unformatNumber(
                                  e.target.value
                                );
                                setBeban(unformattedValue);
                              }}
                            />
                            <p>Group Data</p>
                            <small className={`text-xs text-neutral-400`}>
                              Create new group by typing new group name
                            </small>
                            <AsyncCreatableSelect
                              cacheOptions
                              defaultOptions
                              loadOptions={promiseOptions}
                              // options={options}
                              value={value}
                              onChange={(e) => {
                                const newValue = e?.value ?? null;
                                const newLabel = e?.label ?? "";
                                setValue(e);
                              }}
                              // onCreateOption={handleCreate}
                              className="z-50 mr-4"
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderRadius: 10,
                                  width: "100%",
                                  height: 43,
                                  backgroundColor: "#f3f4f6",
                                }),
                              }}
                            />
                          </>
                        ) : null}

                        <Input
                          type={`text`}
                          label={`Coal Price*`}
                          value={formatNumber(coalPrice)}
                          required
                          startContent={`Rp.`}
                          endContent={<p className={`text-xs`}>per KG</p>}
                          className={`max-w-xs my-4`}
                          onChange={(e) => {
                            const unformattedValue = unformatNumber(
                              e.target.value
                            );
                            setCoalPrice(unformattedValue);
                          }}
                        />
                        <Button
                          size={`sm`}
                          color={`secondary`}
                          onClick={() => {
                            setShowVariables(!showVariables);
                          }}
                        >
                          {showVariables ? "Close" : "Customize"} Input
                          Variables
                        </Button>
                      </div>
                      <div
                        className={`${
                          showVariables ? "col-span-2" : ""
                        } relative ${
                          performanceTest ? "max-h-[340px]" : "max-h-[200px]"
                        } overflow-y-auto px-8 py-2 mx-2 bg-default-100 rounded-xl ${
                          showVariables ? "" : "hidden"
                        }`}
                      >
                        <hr />
                        <h2 className="font-bold text-xs sticky top-0 bg-white p-1 rounded-md dark:bg-black">
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
                                                // Allow empty string force to fill value
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
                className="bg-[#1C9EB6] text-white"
                size="md"
                isDisabled={
                  thermoStatusData?.thermo_status ||
                  process.env.NEXT_PUBLIC_ENVIRONMENT == "development"
                }
                isLoading={loading}
                onClick={() => {
                  setConfirmationModalOpen(true);
                }}
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
      {ConfirmationModal}
      {choosePeriodicModal}
    </>
  );
}
