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

interface Variable {
  category: string;
  input_name: string;
  satuan: string;
  id: string;
  in_out: string;
}

export default function VariableInputForm({ variables }: { variables: any }) {
  const router = useRouter();

  const [variableData, setVariableData] = useState(variables);
  // const [unitsData, setUnitsData] = useState(units.data);
  // State to store input values
  const [inputValues, setInputValues] = useState(
    Object.fromEntries(
      variableData.map((v: any) => [
        v.id,
        v.base_case == "NaN" ? 0 : Number(v.base_case),
      ])
    )
  );

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

  const formSchemaInput = z.object(
    Object.fromEntries(
      filteredVariableData.map((v: any) => [
        v.id, // This is the key for the schema
        z.number({ message: "Value is not a number!" }),
      ])
    )
  );

  const defaultValues = Object.fromEntries(
    filteredVariableData.map((v: any) => [
      v.id,
      v.base_case == "NaN" ? 0 : Number(v.base_case),
    ])
  );

  // 1. Define your form.
  const formInput = useForm<z.infer<typeof formSchemaInput>>({
    resolver: zodResolver(formSchemaInput),
    mode: "onChange",
    // defaultValues: defaultValues,
  });

  const formError = formInput.formState.errors;

  // Handle input change to update state
  const handleInputChange = (id: string, value: number) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    formInput.setValue(id, value); // Update react-hook-form value as well
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchemaInput>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // alert(JSON.stringify(values));
    // console.log(inputValues);
    setLoading(true);
    const sendData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/case-inputs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        if (response) {
          setLoading(false);
          toast.success("Data Sent!");
        }
        setTimeout(() => {
          router.push("/output");
        }, 1000);
      } catch (error) {
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
  return (
    <div className="flex flex-col gap-4 mx-2 min-w-full">
      <Toaster />
      {/* {JSON.stringify(categorizedData)} */}
      <h1 className="font-bold text-lg sticky top-16 bg-white z-50">
        Input Variables
      </h1>
      <Form {...formInput}>
        <form
          onSubmit={formInput.handleSubmit(onSubmit, onError)}
          className="space-y-1"
        >
          <Accordion className="min-w-full" selectionMode="multiple" isCompact>
            {Object.entries(categorizedData).map(
              ([category, variables]: any) => (
                <AccordionItem
                  key={category}
                  title={category == "null" ? "Tidak Ada Kategori" : category}
                >
                  {variables.map((variable: any) => (
                    <FormItem key={variable.id}>
                      <FormLabel>
                        {variable.input_name} ({variable.satuan})
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={`Enter ${variable.input_name}`}
                          name={variable.id}
                          // Add more input attributes here as needed
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </AccordionItem>
              )
            )}
          </Accordion>
          {variableData.map((v: any) => {
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
          })}
          <Button
            type="submit"
            color="primary"
            size="md"
            isLoading={loading}
            className="flex min-w-full translate-y-4"
          >
            Submit Data
          </Button>
        </form>
      </Form>
    </div>
  );
}