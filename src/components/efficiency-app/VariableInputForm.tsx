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
import { Input, Button } from "@nextui-org/react";
import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VariableInputForm({
  variables,
  units,
}: {
  variables: any;
  units: any;
}) {
  const router = useRouter();

  const [variableData, setVariableData] = useState(variables.data);
  const [unitsData, setUnitsData] = useState(units.data);
  // State to store input values
  const [inputValues, setInputValues] = useState(
    Object.fromEntries(
      variableData.map((v: any) => [
        v.id,
        v.base_case == "NaN" ? 0 : Number(v.base_case),
      ])
    )
  );
  const [loading, setLoading] = useState(false);

  const filteredVariableData = variableData.filter(
    (v: any) => v.variable_type === "input"
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
    defaultValues: defaultValues,
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
          `${process.env.NEXT_PUBLIC_API_URL}/case-inputs`,
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

  return (
    <div className="flex flex-col gap-4 max-w-md mx-2">
      <Toaster />
      <h1 className="font-bold text-lg sticky top-16 bg-white z-50">
        Input Variables
      </h1>
      <Form {...formInput}>
        <form
          onSubmit={formInput.handleSubmit(onSubmit, onError)}
          className="space-y-1"
        >
          {variableData.map((v: any) => {
            if (v.variable_type == "input")
              return (
                <Fragment key={v.id}>
                  <FormField
                    control={formInput.control}
                    name={v.id}
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>{v.variable}</FormLabel> */}
                        <FormControl>
                          <Input
                            placeholder={`${
                              v.base_case == "NaN" ? "" : v.base_case
                            }`}
                            label={v.variable}
                            size="sm"
                            className={`justify-between max-w-xs lg:max-w-full  border-b-1 pb-1`}
                            labelPlacement="outside-left"
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
                                {v.units.name == "NaN" ? "" : v.units.name}
                              </p>
                            }
                          />
                        </FormControl>
                        {/* <FormDescription>{v.variable_type}</FormDescription> */}
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
          {/* <Button>
            <Link href="/output">Submit</Link>
          </Button> */}
        </form>
      </Form>
    </div>
  );
}
