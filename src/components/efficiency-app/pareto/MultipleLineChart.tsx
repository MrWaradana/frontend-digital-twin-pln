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
import { Slider, SliderValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
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
  onBarClick,
  totalPersen,
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
              tickFormatter={(value) => (value ? value.slice(0, 4) : "Pareto")}
            />
            <YAxis
              domain={[0, 100]}
              orientation="right"
              allowDataOverflow={true}
              label={{
                value: "Persen Losses",
                angle: 90,
                position: "outsideLeft",
                dx: 20,
              }}
              yAxisId={"total_persen_losses"}
            />
            <YAxis
              orientation="left"
              label={{
                value: "Nilai Losses",
                angle: -90,
                dx: -10,
              }}
              allowDataOverflow={true}
            />
            {/* <YAxis allowDataOverflow={true} /> */}
            <Legend className="" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey={"total_nilai_losses"}
              name={"Total Nilai Loss"}
              fill="#559e83"
              className=""
              barSize={20}
            />
            <Bar
              dataKey={"total_persen_losses"}
              name={"Total Persen Loss"}
              fill="#1b85b8"
              className=""
              barSize={20}
              yAxisId={"total_persen_losses"}
            />
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
              label="USEFUL MANY"
              stroke="#00b0f0"
              strokeDasharray={5}
              strokeWidth={2}
              strokeDashoffset={1}
              yAxisId={"total_persen_losses"}
            />
            <Line
              name={"Total Persen Loss"}
              dataKey="total_persen_losses"
              type="monotone"
              stroke="var(--color-category)"
              strokeWidth={2}
              dot={true}
              yAxisId={"total_persen_losses"}
            />
            <Line
              name={`Cummulative Frequency`}
              dataKey="cum_frequency"
              type="monotone"
              stroke="#f1c232"
              strokeWidth={2}
              dot={true}
              yAxisId={"total_persen_losses"}
            />
          </ComposedChart>
        </ChartContainer>
        <div className="h-full col-span-1">
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
    </Card>
  );
}
