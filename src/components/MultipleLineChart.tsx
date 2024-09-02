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
import { useState } from "react";

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

export default function MultipleLineChart() {
  const [sliderValue, setSliderValue] = useState<SliderValue>(80);
  const chartData = [
    { month: "January", category: 28, cum_frequency: 60 },
    { month: "February", category: 45, cum_frequency: 70 },
    { month: "March", category: 37, cum_frequency: 75 },
    { month: "April", category: 73, cum_frequency: 80 },
    { month: "May", category: 79, cum_frequency: 85 },
    { month: "June", category: 94, cum_frequency: 100 },
  ];
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
            data={chartData}
            margin={{
              top: 12,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Legend />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey={"category"} fill="#f5f1f5" barSize={20} />
            <ReferenceLine
              x="March"
              stroke="#D2042D"
              label="VITAL FEW"
              strokeDasharray={5}
              strokeWidth={2}
              strokeDashoffset={1}
            />
            <ReferenceLine
              y={Number(sliderValue)}
              label="USEFUL MANY"
              stroke="#D2042D"
              strokeDasharray={5}
              strokeWidth={2}
              strokeDashoffset={1}
            />
            <Line
              dataKey="category"
              type="monotone"
              stroke="var(--color-category)"
              strokeWidth={2}
              dot={false}
            />
            <Line
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
            onChange={setSliderValue}
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
