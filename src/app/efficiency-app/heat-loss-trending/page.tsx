"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  ChangeEvent,
} from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
// import { HeatLossTrendingChart } from "@/components/efficiency-app/HeatLossTrendingChart";
// import { HeatLossTrendingChartNew } from "@/components/efficiency-app/HeatLossTrendingChartNew";

// import { TagValueChart } from "@/components/efficiency-app/TagValueChart";

import { useGetVariables } from "@/lib/APIs/useGetVariables";
import {
  // DataTrending,
  useGetDataTrending,
} from "@/lib/APIs/useGetDataTrending";

import { useGetTags } from "@/lib/APIs/useGetTags";
import { useGetTagValue } from "@/lib/APIs/useGetTagValue";
import { useSession } from "next-auth/react";

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
// import { API_V1_LIVE_URL } from "@/lib/api-url";
import { useExcelStore } from "@/store/excels";
import dynamic from "next/dynamic";
/** LATER IT WILL BE SEPARATE COMPONENT */

// const excelId = "add1cefb-1231-423c-8942-6bcd56998106";
// const excelId = "5c220f24-b7e4-410a-b52e-8ffe25047fb6";
const type = "out";
const HeatLossTrendingChartNew = dynamic(
  () =>
    import("@/components/efficiency-app/HeatLossTrendingChartNew").then(
      (mod) => mod.HeatLossTrendingChartNew
    ),
  { ssr: false }
);
const TagValueChart = dynamic(
  () =>
    import("@/components/efficiency-app/TagValueChart").then(
      (mod) => mod.TagValueChart
    ),
  { ssr: false }
);
export default function Page() {
  const session = useSession();
  const excels = useExcelStore((state) => state.excels);
  const excelId = excels[0].id;

  const formatDate = (date: Date | null) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  /** Start & end date state */
  const [startDateValue, setStartDateValue] = useState<Date | null>(new Date());
  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date());
  /** Start & end date state */

  // variables checked state
  const [checkedVariables, setCheckedVariables] = useState<any[]>([]);
  // Tags checked state (WIP)
  // const [checkedTags, setCheckedTags] = useState<any[]>([]);

  const [variableRawData, setVariableRawData] = useState<any[]>([]);

  // (WIP)
  // const [tagRawData, setTagRawData] = useState<any[]>([]);

  // GET LIST VARIABLE
  const {
    data: variableData,
    isLoading: isLoadingVariableData,
    mutate: mutateVariableData,
  } = useGetVariables(session?.data?.user.access_token, excelId, type);

  // GET LIST TAGS (WIP)
  // const {
  //   data: tagData,
  //   isLoading: isLoadingTagData,
  //   mutate: mutateTagData,
  // } = useGetTags(session?.data?.user.access_token);

  // console.log(`ini tokennya: ${session?.data?.user.access_token}`);
  // console.log("WOWO");
  // console.log(variableRawData);

  // GET DATA TRENDING BY VARIABLES
  const {
    data: trendingDatas,
    isLoading: isLoadingTrendingDatas,
    mutate: mutateTrendingDatas,
    error: errorTrendingDatas,
  } = useGetDataTrending(
    session?.data?.user.access_token,
    checkedVariables,
    startDateValue,
    endDateValue
  );

  // GET TAG VALUE DATA BY TAG (WIP)
  // const {
  //   data: tagValueDatas,
  //   isLoading: isLoadingTagValueDatas,
  //   mutate: mutateTagValueDatas,
  //   error: errorTagValueDatas,
  // } = useGetTagValue(
  //   session?.data?.user.access_token,
  //   checkedTags,
  //   startDateValue,
  //   endDateValue
  // );

  const handleVariableCheckboxChange = useCallback(
    (item: any, isChecked: any) => {
      setCheckedVariables((prev) =>
        isChecked ? [...prev, item] : prev.filter((i) => i !== item)
      );
    },
    []
  );

  // (WIP)
  // const handleTagCheckboxChange = useCallback((item: any, isChecked: any) => {
  //   setCheckedTags((prev) =>
  //     isChecked ? [...prev, item] : prev.filter((i) => i !== item)
  //   );
  // }, []);

  // console.log("CHECKED VARIABLES");
  // console.log(checkedVariables);

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

  useEffect(() => {
    mutateTrendingDatas();
    // (WIP)
    // mutateTagValueDatas();
    // console.log("HARUSNYA SEH MUTATE YGY?!?!");
  }, [
    startDateValue,
    endDateValue,
    checkedVariables,

    mutateTrendingDatas,
    // mutateTagValueDatas,
  ]);

  useEffect(() => {
    if (variableData) {
      setVariableRawData(variableData);
    }

    // (WIP)
    // if (tagData) {
    //   setTagRawData(tagData);
    // }
    // console.log(variableRawData, "variable raw state");
  }, [variableData]);

  return (
    <EfficiencyContentLayout title="Heat Loss Trending">
      <h1>Heat Loss Trending Page</h1>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <div className="flex-1 overflow-y-auto p-6">
          {/* PeriodeDatePicker */}
          <div className={cn("flex mb-3 gap-x-3 space-2")}>
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
          </div>
          {/* PeriodeDatePicker */}

          {/* <HeatLossTrendingChart
            session={session}
            isLoadingTrendingDatas={isLoadingTrendingDatas}
            errorTrendingDatas={errorTrendingDatas}
            trendingDatas={trendingDatas || []}
            checkedVariables={checkedVariables}
            startDate={formatDate(startDateValue)}
            endDate={formatDate(endDateValue)}
            variableRawData={variableRawData}
          ></HeatLossTrendingChart> */}

          {/* (WIP)
          <TagValueChart
            session={session}
            checkedTags={checkedTags}
            startDate={formatDate(startDateValue)}
            endDate={formatDate(endDateValue)}
            isLoadingTagValueDatas={isLoadingTagValueDatas}
            errorTagValueDatas={errorTagValueDatas}
            tagValueDatas={tagValueDatas}
            tagRawData={tagRawData}
          ></TagValueChart> */}
        </div>

        {/* Aside on the right: (variable checkbox component) */}
        <div className="w-64 bg-muted/50 p-4 overflow-hidden flex items-center flex-col gap-y-3 border-l ">
          <Card className="w-64 bg-muted/50 p-4 overflow-hidden flex flex-1 flex-col border-l">
            <h2 className="text-lg font-semibold mb-4">Select Variables</h2>
            <ScrollArea className="flex-1 rounded-md border">
              <div className="p-4 space-y-4">
                {variableRawData?.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedVariables.includes(item.id)}
                      onCheckedChange={(isChecked) =>
                        handleVariableCheckboxChange(item.id, isChecked)
                      }
                    />
                    <Label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.excel_variable_name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Selected: {checkedVariables.length} variable(s)
            </p>
          </Card>

          {/* (WIP)
          <Card className="w-64 bg-muted/50 p-4 overflow-hidden flex flex-1 flex-col border-l">
            <h2 className="text-lg font-semibold mb-4">Select Tags</h2>
            <ScrollArea className="flex-1 rounded-md border">
              <div className="p-4 space-y-4">
                {tagRawData?.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={checkedTags.includes(item.id)}
                      onCheckedChange={(isChecked) =>
                        handleTagCheckboxChange(item.id, isChecked)
                      }
                    />
                    <Label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >

                      {item.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Selected: {checkedTags.length} tag(s)
            </p>
          </Card> */}
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
