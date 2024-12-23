"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
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
  Slider,
  SliderValue,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { debounce } from "lodash";

interface ChartData {
  assetnum: string;
  eaf: number;
  cum_frequency: number;
}

interface MultipleLineChartProps {
  data: ChartData[];
  thresholdNumber: number;
  onFilterScopeChange: (value: string) => void;
  onThresholdChange?: (value: number) => void;
}

const scopeOptions = [
  { name: "A", uid: "A" },
  { name: "B", uid: "B" },
] as const;

type ScopeType = typeof scopeOptions[number]["uid"];

const chartConfig: ChartConfig = {
  category: {
    label: "category",
    color: "hsl(var(--chart-1))",
  },
  cum_frequency: {
    label: "cum_frequency",
    color: "hsl(var(--chart-2))",
  },
};

export default function MultipleLineChart({
  data,
  thresholdNumber = 100,
  onFilterScopeChange,
  onThresholdChange,
  
}: MultipleLineChartProps) {
  const [internalSliderValue, setInternalSliderValue] = useState<SliderValue>(thresholdNumber);
  const [filterScope, setFilterScope] = useState<ScopeType>("A");

  // Create debounced function for threshold updates
  const debouncedThresholdUpdate = useCallback(
    debounce((value: number) => {
      if (onThresholdChange) {
        onThresholdChange(value);
      }
    }, 500),
    [onThresholdChange]
  );

  // Update internal slider value when threshold changes
  useEffect(() => {
    setInternalSliderValue(thresholdNumber);
  }, [thresholdNumber]);

  useEffect(() => {
    onFilterScopeChange(filterScope)
  }, [filterScope])

  // Notify parent of threshold changes
  useEffect(() => {
    if (onThresholdChange) {
      const timeoutId = setTimeout(() => {
        onThresholdChange(Number(internalSliderValue));
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [internalSliderValue, onThresholdChange]);

  return (
    <Card className="border-none h-[75dvh]">
      <CardHeader className="flex flex-row pb-0 justify-between">
        <div className="flex flex-col items-center gap-4">
          <CardTitle>
            <span className="px-1">
              Target Reliability {filterScope}
            </span>
          </CardTitle>
          <Select
            labelPlacement="outside-left"
            disallowEmptySelection
            size="sm"
            label="Scope"
            className="max-w-xs items-center"
            defaultSelectedKeys={["A"]}
            onChange={(e) => setFilterScope(e.target.value as ScopeType)}
          >
            {scopeOptions.map((scope) => (
              <SelectItem key={scope.uid} value={scope.uid}>
                {scope.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-12 mt-12 relative">
        <div className="w-full col-span-11 flex flex-col">
          <ChartContainer config={chartConfig} className="w-full h-[52dvh]">
            <ComposedChart
              data={data}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#888888"
              />
              <XAxis
                dataKey="assetnum"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={[0, 100]}
                allowDataOverflow
                label={{
                  value: "Cumulative Frequency (%)",
                  angle: 90,
                  position: "outsideLeft",
                  dx: 20,
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-black dark:text-white">
                    {value}
                  </span>
                )}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="eaf"
                name="EAF"
                fill="#F7ED53"
                barSize={40}
              />
              <Line
                name="Cummulative Frequency"
                dataKey="cum_frequency"
                type="monotone"
                stroke="#D93832"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>

        <div className="col-span-1 h-[55dvh]">
          <Slider
            size="sm"
            label="EAF (%)"
            step={1}
            maxValue={100}
            minValue={0}
            className="border-[#1C9EB6]"
            classNames={{
              base: "max-w-md",
              filler: "bg-gradient-to-b from-[#1C9EB6] to-[#1C9EB6] bg-[#1C9EB6]",
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
            value={internalSliderValue}
            onChange={setInternalSliderValue}
          />
        </div>
      </CardContent>
    </Card>
  );
}