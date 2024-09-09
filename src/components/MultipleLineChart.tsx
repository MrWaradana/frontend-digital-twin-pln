"use client";

import { TrendingUp } from "lucide-react";
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
  const [sliderValue, setSliderValue] = useState<SliderValue>(thresholdNumber);
  const [internalSliderValue, setInternalSliderValue] =
    useState<SliderValue>(thresholdNumber); // Holds the immediate value

  // Debounce the onThresholdChange call
  const debouncedThresholdChange = debounce((value) => {
    onThresholdChange(value);
  }, 500); // 300ms delay

  useEffect(() => {
    debouncedThresholdChange(internalSliderValue);
    return () => debouncedThresholdChange.cancel(); // Clean up on unmount
  }, [internalSliderValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heat Loss Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis domain={[0, 100]} />
            <Legend />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey={"total_persen_losses"}
              name={"Total Persen Loss"}
              fill="#111"
              barSize={20}
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
              name={"Total Persen Loss"}
              dataKey="total_persen_losses"
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
        <div className="h-[348px] col-span-1">
          <Slider
            size="md"
            label="Persentase"
            step={1}
            onChange={setInternalSliderValue}
            maxValue={100}
            minValue={0}
            formatOptions={{ style: "decimal" }}
            orientation="vertical"
            defaultValue={sliderValue}
          />
        </div>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing increase for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
