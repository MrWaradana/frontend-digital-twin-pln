"use client";

import {
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Legend,
  ComposedChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Button,
  Divider,
  Slider,
  SliderValue,
  Spinner,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import Link from "next/link";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { formattedNumber, formatCurrency } from "@/lib/formattedNumber";

const scopeOptions = [
  { name: "A", uid: "A" },
  { name: "B", uid: "B" },
];

const chartConfig = {
  category: {
    label: "category",
    color: "hsl(var(--chart-1))",
  },
  cum_frequency: {
    label: "cum_frequency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MultipleLineChart({
  data,
  setOpenDetails,
  onThresholdChange,
  thresholdNumber,
  onBarClick,
  totalPersen,
  efficiencyData,
  openDetails,
  summaryData,
  isValidating,
  isLoading,
}: any) {
  const [sliderValue, setSliderValue] = useState<SliderValue>(thresholdNumber);
  const [filterScope, setFilterScope] = useState("A");
  const [scopeFilter, setScopeFilter]: any = useState<Selection>(
    new Set([])
    // "all"
  );
  const [internalSliderValue, setInternalSliderValue] =
    useState<SliderValue>(thresholdNumber); // Holds the immediate value

  // Debounce the onThresholdChange call
  // const debouncedThresholdChange = debounce((value) => {
  //   onThresholdChange(value);
  // }, 500); // 300ms delay

  // useEffect(() => {
  //   debouncedThresholdChange(internalSliderValue);
  //   return () => debouncedThresholdChange.cancel(); // Clean up on unmount
  // }, [internalSliderValue]);

  return (
    <Card className=" border-none h-[75dvh]">
      <CardHeader className={`flex flex-row pb-0 justify-between`}>
        <div className={`flex flex-col items-center gap-4`}>
          <CardTitle>
            {" "}
            <span className={`px-1`}>
              Target Reliability {efficiencyData.name}
            </span>{" "}
          </CardTitle>
          <Select
            labelPlacement={`outside-left`}
            disallowEmptySelection
            size="sm"
            label="Scope"
            className="max-w-xs items-center"
            onChange={(e) => {
              const newValue = e.target.value;
              setScopeFilter(newValue);
              setFilterScope(newValue);
            }}
            defaultSelectedKeys={["A"]}
          >
            {scopeOptions.map((scope) => (
              <SelectItem key={scope.uid}>{scope.name}</SelectItem>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-12 mt-12 relative">
        <div className={`w-full col-span-11 flex flex-col `}>
          <ChartContainer config={chartConfig} className="w-full h-[52dvh]">
            <ComposedChart
              accessibilityLayer
              data={data}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  value ? value.slice(0, 4) : "Pareto"
                }
              />
              <YAxis
                domain={[0, 100]}
                orientation="right"
                allowDataOverflow={true}
                label={{
                  value: "Cumulative Frequency (%)",
                  angle: 90,
                  position: "outsideLeft",
                  dx: 20,
                }}
                yAxisId={"total_persen_losses"}
              />
              <YAxis
                domain={[0, 1000]}
                orientation="left"
                label={{
                  value: "Nilai Losses",
                  angle: -90,
                  dx: -10,
                }}
                allowDataOverflow={true}
              />
              {/* <YAxis allowDataOverflow={true} /> */}
              <Legend
                className="text-black"
                formatter={(value, entry, index) => (
                  <span className="text-black dark:text-white">{value}</span>
                )}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey={"total_nilai_losses"}
                name={"Total Nilai Loss"}
                fill="#F7ED53"
                className=""
                barSize={40}
              />
              {/* <Bar
                dataKey={"total_persen_losses"}
                name={"Total Persen Loss"}
                fill="#A2DE32"
                className="bg-gradient-to-b from-[#A2DE32] to-[#42C023]"
                barSize={20}
                yAxisId={"total_persen_losses"}
              /> */}
              <ReferenceLine
                x="Miscellaneous auxiliary load"
                stroke="#00b0f0"
                label="VITAL FEW"
                strokeDasharray={5}
                strokeWidth={2}
                strokeDashoffset={1}
                yAxisId={"total_persen_losses"}
              />
              <ReferenceLine
                y={Number(internalSliderValue)}
                // label="USEFUL MANY"
                stroke="#00b0f0"
                strokeDasharray={5}
                strokeWidth={2}
                strokeDashoffset={1}
                yAxisId={"total_persen_losses"}
              />
              {/* <Line
              name={"Total Persen Loss"}
              dataKey="total_persen_losses"
              type="monotone"
              stroke="#F8719D"
              strokeWidth={2}
              dot={true}
              yAxisId={"total_persen_losses"}
            /> */}
              <Line
                name={`Cummulative Frequency`}
                dataKey="cum_frequency"
                type="monotone"
                stroke="#D93832"
                strokeWidth={2}
                dot={true}
                yAxisId={"total_persen_losses"}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
        <div className="col-span-1 h-[55dvh]">
          <Slider
            size="sm"
            label="EAF (%)"
            step={1}
            onChange={(e) => {
              setInternalSliderValue(e);
            }}
            maxValue={100}
            minValue={0}
            className={`border-[#1C9EB6]`}
            classNames={{
              base: "max-w-md",
              filler:
                "bg-gradient-to-b from-[#1C9EB6] to-[#1C9EB6] bg-[#1C9EB6]",
              labelWrapper: "mb-2",
              label: "font-medium text-default-700 text-xs",
              track: "border-[#1C9EB6] border-b-[#1C9EB6]",
              value: "font-medium text-default-500 text-small",
              thumb: [
                "transition-size",
                "bg-gradient-to-b from-[#1C9EB6] to-[#1C9EB6]",
              ],
              step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
            }}
            formatOptions={{ style: "decimal" }}
            orientation="vertical"
            defaultValue={sliderValue}
          />
        </div>
      </CardContent>
    </Card>
  );
}
