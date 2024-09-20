"use client";

import { Router, TrendingUp } from "lucide-react";
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
import { Slider, SliderValue } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

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
  onThresholdChange,
  thresholdNumber,
}: any) {
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState<SliderValue>(thresholdNumber);
  const [internalSliderValue, setInternalSliderValue] =
    useState<SliderValue>(thresholdNumber); // Holds the immediate value

  // Debounce the onThresholdChange call
  const debouncedThresholdChange = debounce((value) => {
    onThresholdChange(value);
  }, 500); // 300ms delay

  const handleBarClick = (data: any, index: any) => {
    // Perform your navigation or redirection logic here
    // `data` contains the data for the clicked bar
    router.replace(`/efficiency-app`); // Replace with your desired route
  };
  useEffect(() => {
    debouncedThresholdChange(internalSliderValue);
    return () => debouncedThresholdChange.cancel(); // Clean up on unmount
  }, [internalSliderValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Benefit Analysis</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3">
        <ChartContainer config={chartConfig} className="col-span-2">
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
                value ? value.slice(0, 4) : "Uncategorized"
              }
            />
            <YAxis domain={[0, 1000000]} />
            <Legend className="dark:fill-slate-50" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey={"cost_benefit"}
              name={"Cost Benefit"}
              fill="#111 dark:#fff"
              className="dark:fill-slate-50 dark:stroke-slate-50 hover:cursor-pointer"
              barSize={20}
              onClick={handleBarClick}
            />
            <ReferenceLine
              x="Miscellaneous auxiliary load"
              stroke="#00b0f0"
              label="VITAL FEW"
              strokeDasharray={5}
              strokeWidth={2}
              strokeDashoffset={1}
            />
            <ReferenceLine
              y={Number(internalSliderValue)}
              label="USEFUL MANY"
              stroke="#00b0f0"
              strokeDasharray={5}
              strokeWidth={2}
              strokeDashoffset={1}
            />
            <Line
              name={"Cost Benefit"}
              dataKey="cost_benefit"
              type="monotone"
              stroke="var(--color-category)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              name={`Cummulative Frequency`}
              dataKey="cum_frequency"
              type="monotone"
              stroke="var(--color-cum_frequency)"
              strokeWidth={2}
              dot={true}
            />
          </ComposedChart>
        </ChartContainer>
        <div className="h-full col-span-1">
          <Slider
            size="md"
            label="Persentase"
            step={1000}
            onChange={setInternalSliderValue}
            maxValue={1000000}
            minValue={0}
            formatOptions={{ style: "decimal" }}
            orientation="vertical"
            defaultValue={sliderValue}
          />
        </div>
      </CardContent>
    </Card>
  );
}
