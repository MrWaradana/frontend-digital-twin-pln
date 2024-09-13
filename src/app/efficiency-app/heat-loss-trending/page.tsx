"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { HeatLossTrendingChart } from "@/components/efficiency-app/HeatLossTrendingChart";
// import { PeriodeDatePicker } from "@/components/efficiency-app/PeriodeDatePicker";
import { useGetVariables } from "@/lib/APIs/useGetVariables";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";

/** LATER IT WILL BE SEPARATE COMPONENT */
import {
  DatePicker,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { compareAsc, format, isAfter, isBefore, isValid } from "date-fns";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import PeriodeDatePicker from "@/components/efficiency-app/PeriodeDatePicker";
/** LATER IT WILL BE SEPARATE COMPONENT */

// import { HeatLossTrendingCheckBox } from "@/components/efficiency-app/HeatLossTrendingCheckBox"

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
  "Item 11",
  "Item 12",
  "Item 13",
  "Item 14",
  "Item 15",
  "Item 16",
  "Item 17",
  "Item 18",
  "Item 19",
  "Item 20",
];

const excelId = "add1cefb-1231-423c-8942-6bcd56998106";
const type = "out";

export default function Page() {
  const session = useSession();
  const {
    data: trendingData,
    isLoading,
    mutate,
  } = useGetVariables(session?.data?.user.accessToken, excelId, type);
  const [checkedItems, setCheckedItems] = useState<any[]>([]);

  console.log(`ini tokennya: ${session?.data?.user.accessToken}`);

  const handleCheckboxChange = (item: any) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  /** PeriodeDatePicker */

  const [startDateValue, setStartDateValue] = useState<Date | null>(new Date());

  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date());

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (isValid(date)) {
      setStartDateValue(date);
      if (endDateValue && isAfter(date, endDateValue)) {
        setEndDateValue(null);
      }
    }
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (isValid(date) && startDateValue && !isBefore(date, startDateValue)) {
      setEndDateValue(date);
    }
  };

  const formatDate = (date: Date | null) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  useEffect(() => {
    console.log(startDateValue);
    console.log(formatDate(startDateValue));
    console.log(typeof startDateValue);
    console.log(`tanggal akhir: ${endDateValue}`);
  });

  /** PeriodeDatePicker */

  // Change graphic based on checkbox
  // useEffect(() => {
  //   mutate();
  // }, [mutate, checkedItems]);

  // const [heatLossTrendingData, setHeatLossTrendingData] = useState([]);
  // useEffect(() => {

  // }, []);
  // const heatLossTrendingData = await fetch()

  // if (isLoading && efficiencyLoading)
  //   return (
  //     <div className="w-full mt-24 flex justify-center items-center">
  //       <CircularProgress color="primary" />
  //     </div>
  //   );
  // if (!excel)
  //   return (
  //     <div className="w-full mt-24 flex flex-col gap-6 justify-center items-center">
  //       <Button as={Link} href="/" color="primary">
  //         Back to All Apps
  //       </Button>
  //       <p>No Excel Data!</p>
  //     </div>
  //   );

  return (
    <EfficiencyContentLayout title="Heat Loss Trending">
      <h1 className="bg-gray-950">Heat Loss Trending Page</h1>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <div className="flex-1 overflow-y-auto p-6">
          {/* PeriodeDatePicker */}
          <Input
            type="date"
            label="Tanggal Awal Periode"
            placeholder="Select start date"
            value={formatDate(startDateValue)}
            onChange={handleStartDateChange}
            // startContent={<CalendarIcon className="text-gray-400" size={20} />}
          />
          <Input
            type="date"
            label="Tanggal Akhir Periode"
            placeholder="Select end date"
            value={formatDate(endDateValue)}
            onChange={handleEndDateChange}
            // startContent={<CalendarIcon className="text-gray-400" size={20} />}
            isDisabled={!startDateValue}
          />
          {/* PeriodeDatePicker */}

          <HeatLossTrendingChart
            dataLineChart={checkedItems}
          ></HeatLossTrendingChart>
        </div>

        {/* Aside on the right */}
        <Card className="w-64 bg-muted/50 p-4 overflow-hidden flex flex-col border-l">
          <h2 className="text-lg font-semibold mb-4">Select Items</h2>
          <ScrollArea className="flex-1 rounded-md border">
            <div className="p-4 space-y-4">
              {trendingData?.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.includes(item)}
                    onCheckedChange={() => handleCheckboxChange(item)}
                  />
                  <Label
                    htmlFor={item.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.short_name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Selected: {checkedItems.length} item(s)
          </p>
        </Card>
      </div>
    </EfficiencyContentLayout>
  );
}
