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
  BarChart,
  Tooltip,
  Label,
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

const dataChart = [
  {
    category: "40%",
    Parameter1: 0,
    Parameter2: 0,
    Parameter3: 0,
    Parameter4: 0,
    Parameter5: 0,
  },
  {
    category: "50%",
    Parameter1: 25,
    Parameter2: 15,
    Parameter3: 35,
    Parameter4: 12,
    Parameter5: 55,
  },
  {
    category: "60%",
    Parameter1: 43,
    Parameter2: 53,
    Parameter3: 43,
    Parameter4: 23,
    Parameter5: 63,
  },
  {
    category: "70%",
    Parameter1: 63,
    Parameter2: 73,
    Parameter3: 63,
    Parameter4: 53,
    Parameter5: 83,
  },
  {
    category: "80%",
    Parameter1: 73,
    Parameter2: 73,
    Parameter3: 83,
    Parameter4: 63,
    Parameter5: 93,
  },
  {
    category: "90%",
    Parameter1: 83,
    Parameter2: 96,
    Parameter3: 98,
    Parameter4: 91,
    Parameter5: 97,
  },
  {
    category: "95%",
    Parameter1: 96,
    Parameter2: 98,
    Parameter3: 99,
    Parameter4: 94,
    Parameter5: 99,
  },
];

export default function MultipleLineChart({
  data,
  thresholdNumber = 100,
}: any) {
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState<SliderValue>(thresholdNumber);
  const [internalSliderValue, setInternalSliderValue] =
    useState<SliderValue>(thresholdNumber); // Holds the immediate value

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Test</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1">
        <ChartContainer config={chartConfig} className="col-span-2">
          <ComposedChart
            accessibilityLayer
            data={dataChart}
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
            >
              <Label
                position={"insideBottomRight"}
                style={{
                  textAnchor: "middle",
                  fontSize: "130%",
                  fill: "black",
                }}
                className="-translate-x-8"
                angle={0}
                offset={-10}
                value={"Beban"}
              />
            </XAxis>
            <YAxis domain={[0, 100]}>
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: "130%",
                  fill: "black",
                }}
                angle={270}
                value={"Nilai"}
              />
            </YAxis>
            <Legend className="dark:fill-slate-50" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              name={"Parameter 1"}
              dataKey="Parameter1"
              type="monotone"
              stroke="#06C"
              strokeWidth={2}
              dot={true}
            />
            <Line
              name={"Parameter 2"}
              dataKey="Parameter2"
              type="monotone"
              stroke="#4CB140"
              strokeWidth={2}
              dot={true}
            />
            <Line
              name={"Parameter 3"}
              dataKey="Parameter3"
              type="monotone"
              stroke="#C9190B"
              strokeWidth={2}
              dot={true}
            />
            <Line
              name={"Parameter 4"}
              dataKey="Parameter4"
              type="monotone"
              stroke="#5752D1"
              strokeWidth={2}
              dot={true}
            />
            <Line
              name={"Parameter 5"}
              dataKey="Parameter5"
              type="monotone"
              stroke="#EC7A08"
              strokeWidth={2}
              dot={true}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
