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
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
  "Site: Ambient pressure": z.number().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  variable_2: z.string().min(2, {
    message: "Password.",
  }),
});

export default function VariableOutputForm({
  variables,
  units,
}: {
  variables: any;
  units: any;
}) {
  const [variableData, setVariableData] = useState(variables.data);
  const [unitsData, setUnitsData] = useState(units.data);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: variableData.base_case,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    alert(JSON.stringify(values));
  }

  return (
    <div className="flex flex-col gap-4 max-w-md items-center">
      <h1 className="font-bold text-lg sticky top-0 bg-white">
        Output Variables
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {variableData.map((v: any) => {
            if (v.variable_type == "output")
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
                          placeholder={`${v.base_case} ${v.units.name}`}
                          {...field}
                          type="number"
                          readOnly
                        />
                      </FormControl>
                      <FormDescription>{v.variable_type}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
          })}

          {/* <Button type="submit">Submit</Button> */}
        </form>
      </Form>
    </div>
  );
}
