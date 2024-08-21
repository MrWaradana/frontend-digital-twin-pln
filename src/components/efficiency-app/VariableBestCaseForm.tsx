"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function VariableBestCaseForm({
  variables,
  units,
}: {
  variables: any;
  units: any;
}) {
  const [variableData, setVariableData] = useState(variables.data);
  const [unitsData, setUnitsData] = useState(units.data);

  const formSchema = z.object(
    Object.fromEntries(
      variableData.map((v: any) => [
        v.variable, // This is the key for the schema
        z.number().min(1, {
          message: `${v.variable} must have at least 1 character.`,
        }),
      ])
    )
  );

  const defaultValues = Object.fromEntries(
    variableData.map((v: any) => [v.variable, v.base_case])
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    alert(JSON.stringify(values));
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <h1 className="font-bold text-lg sticky top-16 bg-white z-50">
        Variables Base Case
      </h1>
      {/* {JSON.stringify(variableData)} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {variableData.map((v: any) => {
            if (v.variable_type == "input")
              return (
                <FormField
                  key={v.id}
                  control={form.control}
                  name={v.variable}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{v.variable}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`${
                            v.base_case == "NaN" ? "" : v.base_case
                          }`}
                          readOnly
                          {...field}
                          endContent={
                            <p className="text-sm">
                              {v.units.name == "NaN" ? "" : v.units.name}
                            </p>
                          }
                        />
                      </FormControl>
                      <FormDescription>{"Read only"}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
          })}
          {/* {JSON.stringify(variableData)} */}

          {/* <Button type="submit">Submit</Button> */}
        </form>
      </Form>
    </div>
  );
}
