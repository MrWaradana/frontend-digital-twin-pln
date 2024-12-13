"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

// import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionItem,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Badge,
  Spinner,
} from "@nextui-org/react";
import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStatusThermoflowStore } from "../../store/statusThermoflow";
import AsyncSelect from "react-select/async";
import { useGetThermoStatus } from "../../lib/APIs/useGetThermoStatus";
import { useSearchParams } from "next/navigation";
import { useGetDataDetail } from "@/lib/APIs/useGetDataDetail";
interface Variable {
  category: string;
  input_name: string;
  satuan: string;
  id: string;
  in_out: string;
}

export default function VariableInputForm({
  excel,
  variables,
  selectedMasterData,
  isEditing = false,
}: {
  excel: any;
  variables: any;
  selectedMasterData: string;
  isEditing?: boolean;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const [variableData, setVariableData] = useState(variables);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  // const [unitsData, setUnitsData] = useState(units.data);
  // State to store input values
  const [inputValues, setInputValues] = useState(
    Object.fromEntries(variableData.map((v: any) => [v.id, v.base_case]))
  );


  const {
    data: thermoStatusData,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useGetThermoStatus();

  const categorizedData = variableData.reduce((acc: any, variable: any) => {
    if (!acc["Pareto"]) {
      acc["Pareto"] = [];
    }
    if (!acc[variable.category] && variable.category) {
      acc[variable.category] = [];
    }
    if (variable.category) {
      acc[variable.category].push(variable);
    }
    if (variable.is_pareto) {
      acc["Pareto"].push(variable);
    }
    return acc;
  }, {} as Record<string, Variable[]>);

  const [loading, setLoading] = useState(false);

  const filteredVariableData = variableData.filter(
    (v: any) => v.in_out === "out" && (v.category || v.is_pareto)
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

  // Move the hook outside of conditions
  const { data: dataDetail, isLoading: isLoadingDataDetail } = useGetDataDetail(
    session.data?.user.access_token,
    params.get("data_id"),
    // Only fetch if we're editing
    isEditing
  );

  // Create initial default values
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    inputs: Object.fromEntries(
      filteredVariableData.map((v: any) => [v.id, String(0)])
    ),
  });

  // 1. Define your form.
  const formInput = useForm<z.infer<typeof formSchemaInput>>({
    resolver: zodResolver(formSchemaInput),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // Update form values when editing data is loaded
  useEffect(() => {
    if (isEditing && dataDetail) {
      const editValues = {
        name: dataDetail.name,
        inputs: Object.fromEntries(
          filteredVariableData.map((v: any) => [
            v.id,
            String(dataDetail?.details.find((d: any) => d.variable_id === v.id)?.nilai) ?? String(0),
          ])
        ),
      };

      setDefaultValues(editValues);
      // Reset form with new values
      formInput.reset(editValues);
    }
  }, [dataDetail, isEditing, formInput]);

  // Show loading state while fetching edit data
  if (isEditing && isLoadingDataDetail) {
    return <Spinner label="Loading..." />
  }

  const formError = formInput.formState.errors;

  // const setStatusThermoflow = useStatusThermoflowStore(
  //   (state) => state.setStatusThermoflow
  // );

  // Handle input change to update state
  // const handleInputChange = (id: string, value: number) => {
  //   setInputValues((prevValues) => ({
  //     ...prevValues,
  //     [id]: value,
  //   }));
  //   formInput.setValue(id, value); // Update react-hook-form value as well
  // };

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

        let payload = {};
        let url = "";
        let method = "";

        if (isEditing) {
          payload = {
            name: values.name,
            inputs: values.inputs,
          }
          url = `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/data/${params.get("data_id")}`;
          method = "PUT";
        } else {
          payload = {
            name: `${values.name}_commision`,
            jenis_parameter: selectedMasterData,
            excel_id: excel[0].id,
            inputs: values.inputs,
            input_type: "commision",
            periodic_start_date: params.get("start_date") ?? null,
            periodic_end_date: params.get("end_date") ?? null,
          };
          url = `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/data`;
          method = "POST";
        }

        const response = await fetch(
          url,
          {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.data?.user.access_token}`,
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

        toast.success("Data input received");
        // setStatusThermoflow(true);
        // router.push(`/efficiency-app/${response_data.data.data_id}/output`);
        setTimeout(() => {
          setLoading(false);
          router.push(`/admin/commision`)
        }, 3000);

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

  // Date Select for PI data

  const DateOptions = [
    { value: "12-12-2024", label: "12-12-2024", date: "12-12-2024" },
    { value: "13-12-2024", label: "13-12-2024", date: "13-12-2024" },
    { value: "14-12-2024", label: "14-12-2024", date: "14-12-2024" },
  ];

  const filterDates = (inputValue: string) => {
    return DateOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue: string, callback: (options) => void) => {
    setTimeout(() => {
      callback(filterDates(inputValue));
    }, 1000);
  };

  function onError(formError: any) {
    console.log(formError);
  }
  // console.log(categorizedData);

  // if (isLoading) {
  //   return (
  //     <div>
  //       <Spinner color="primary" label="Loading..." />
  //     </div>
  //   );
  // }

  // The modal that shows up when attempting to delete an item
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

  return (
    <>
      <div className="flex flex-col gap-4 mx-2 min-w-full">
        <Toaster />
        <Form {...formInput}>
          <form
            ref={formRef}
            onSubmit={formInput.handleSubmit(onSubmit, onError)} // Handles form submission
            className="space-y-1"
          >
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
                        label="Name"
                        size="md"
                        className="max-w-xs lg:max-w-full border-b-1 pb-1"
                        labelPlacement="outside"
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
            <hr />

            <h2 className="font-bold text-lg sticky top-16 bg-white p-1 rounded-md dark:bg-black ">
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
                        : `${category}${variables.some((v: any) => v.web_id)
                          ? " => PI SERVER"
                          : ""
                        }`
                    }
                    title={
                      <span
                        style={{
                          color: variables.some((v: any) => v.web_id)
                            ? "black"
                            : "inherit",
                          backgroundColor: variables.some((v: any) => v.web_id)
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
                                  color={`${v.web_id ? "success" : "default"}`}
                                  size="md"
                                  className={`justify-between max-w-xs lg:max-w-full  border-b-1 pb-1 pt-4`}
                                  labelPlacement="outside"
                                  type={
                                    "text"
                                    // "text"
                                  }
                                  required
                                  {...field}
                                  onChange={async ({ target: { value } }) => {
                                    // Allow empty string
                                    if (value === "") {
                                      field.onChange("");
                                    }
                                    // Allow "N/A"
                                    else if (value.toUpperCase() === "N/A") {
                                      field.onChange("N/A");
                                    }
                                    // Allow numbers (including decimals, negative numbers, and standalone decimal points)
                                    else if (/^-?\.?\d*\.?\d*$/.test(value)) {
                                      field.onChange(value);
                                    }
                                    // If the input is invalid, don't update the field
                                    await formInput.trigger(`inputs.${v.id}`);
                                  }}
                                  endContent={
                                    <p className="text-sm">
                                      {v.satuan == "NaN" ? "" : v.satuan}
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
            <Button
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
            </Button>
            {/* Confirmation Modal */}
            {ConfirmationModal} {/* Modal should be part of the form */}
          </form>
        </Form>
      </div>
    </>
  );
}
