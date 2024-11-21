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
import { Button, Slider, SliderValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import Link from "next/link";
import { CaretLeftIcon } from "@radix-ui/react-icons";

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
    <Card className="rounded-xl shadow-xl h-[85dvh]">
      <CardHeader className={`flex flex-row pb-0 justify-between`}>
        <div className={`flex items-center gap-4`}>
          <Link href={`/efficiency-app`} className={`text-xl`}>
            <CaretLeftIcon width={44} height={44} />
          </Link>
          <CardTitle>
            {" "}
            <span className={`px-1`}>
              Data Pareto {efficiencyData.name}
            </span>{" "}
          </CardTitle>
        </div>
        <Button
          className={`text-white bg-[#D4CA2F]`}
          onClick={() => {
            setOpenDetails(!openDetails);
            setTimeout(() => {
              window.scrollTo({
                top: 830,
                behavior: "smooth",
              });
            }, 300);
          }}
        >
          {openDetails ? "Close" : "See"} Details
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-12 mt-12 relative">
        <ChartContainer
          config={chartConfig}
          className="col-span-11 w-full h-[65dvh]"
        >
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
                value: "Cumulative Frequency (%)",
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
              barSize={20}
            />
            <Bar
              dataKey={"total_persen_losses"}
              name={"Total Persen Loss"}
              fill="#A2DE32"
              className="bg-gradient-to-b from-[#A2DE32] to-[#42C023]"
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
        <div className="col-span-1">
          <Slider
            size="md"
            label="Persentase"
            step={1}
            onChange={(e) => {
              setInternalSliderValue(e);
              setOpenDetails(true);
              setTimeout(() => {
                window.scrollTo({
                  top: 830,
                  behavior: "smooth",
                });
              }, 300);
            }}
            maxValue={100}
            minValue={0}
            className={`border-[#D4CA2F]`}
            classNames={{
              base: "max-w-md ",
              filler:
                "bg-gradient-to-b from-[#D4CA2F] to-[#D4CA2F] bg-[#D4CA2F]",
              labelWrapper: "mb-2",
              label: "font-medium text-default-700 text-medium",
              track: "border-[#D4CA2F] border-b-[#D4CA2F]",
              value: "font-medium text-default-500 text-small",
              thumb: [
                "transition-size",
                "bg-gradient-to-b from-[#D4CA2F] to-[#D4CA2F]",
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
