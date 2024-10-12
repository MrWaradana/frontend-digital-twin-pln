"use client";

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
import { Accordion, AccordionItem, Input, Button } from "@nextui-org/react";
import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStatusThermoflowStore } from "../../store/statusThermoflow";
import { useGetThermoStatus } from "../../lib/APIs/useGetThermoStatus";
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
}: {
  excel: any;
  variables: any;
  selectedMasterData: string;
}) {
  const router = useRouter();
  const session = useSession();
  const [variableData, setVariableData] = useState(variables);
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
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);

  const [loading, setLoading] = useState(false);

  const filteredVariableData = variableData.filter(
    (v: any) => v.in_out === "in"
  );

  const formSchemaInput = z.object({
    name: z.string({ message: "Name is required!" }), // Adjust validation as needed
    inputs: z.object(
      Object.fromEntries(
        filteredVariableData.map((v: any) => [
          v.id, // This is the key for the schema
          z.string({ message: "Value is required!" }),
        ])
      )
    ),
  });

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

  const setStatusThermoflow = useStatusThermoflowStore(
    (state) => state.setStatusThermoflow
  );

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
        const payload = {
          name: values.name,
          jenis_parameter: selectedMasterData,
          excel_id: excel[0].id,
          inputs: values.inputs,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/data`,
          {
            method: "POST",
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

  return (
    <div className="flex flex-col gap-4 mx-2 min-w-full">
      <Toaster />
      {/* {JSON.stringify(categorizedData)} */}

      <Form {...formInput}>
        <form
          onSubmit={formInput.handleSubmit(onSubmit, onError)}
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
          <h2 className="font-bold text-lg sticky top-16 bg-white p-1 rounded-md dark:bg-black z-50">
            Input Variables
          </h2>

          <Accordion className="min-w-full" selectionMode="multiple" isCompact>
            {Object.entries(categorizedData).map(
              ([category, variables]: any) => (
                <AccordionItem
                  key={category}
                  title={category == "null" ? "Tidak Ada Kategori" : category}
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
                                label={v.input_name}
                                size="md"
                                className={`justify-between max-w-xs lg:max-w-full  border-b-1 pb-1 pt-4`}
                                labelPlacement="outside"
                                type="text"
                                required
                                {...field}
                                // value={inputValues[v.id]} // Controlled input
                                onChange={async ({ target: { value } }) => {
                                  field.onChange(value.toString());
                                  await formInput.trigger(`inputs.${v.id}`);
                                }}
                                endContent={
                                  <p className="text-sm">
                                    {" "}
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
          {/* {variableData.map((v: any) => {
            if (v.in_out == "in")
              return (
                <Fragment key={v.id}>
                  <FormField
                    control={formInput.control}
                    name={v.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`${""}`}
                            label={v.input_name}
                            size="md"
                            className={`justify-between max-w-xs lg:max-w-full  border-b-1 pb-1`}
                            labelPlacement="outside"
                            type="number"
                            required
                            {...field}
                            value={inputValues[v.id]} // Controlled input
                            onChange={(e) =>
                              handleInputChange(v.id, Number(e.target.value))
                            }
                            endContent={
                              <p className="text-sm">
                                {" "}
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
              );
          })} */}
          <Button
            type="submit"
            color="primary"
            size="md"
            //@ts-ignore
            isDisabled={thermoStatusData}
            isLoading={loading}
            className="flex min-w-full translate-y-4"
          >
            {thermoStatusData
              ? "Thermolink is processing data, please wait..."
              : "Submit Data"}
            {/* Submit Data */}
          </Button>
        </form>
      </Form>
    </div>
  );
}
