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

const data = [
  {
    category: "Boiler Assembly [2] - BLR 1",
    total_persen_losses: 22.51919750220655,
    cum_frequency: 22.51919750220655,
  },
  {
    category: "Fuel Source [10] - Coal Fuel Info",
    total_persen_losses: 11.148201130110975,
    cum_frequency: 33.66739863231752,
  },
  {
    category: null,
    total_persen_losses: 8.551118102417442,
    cum_frequency: 42.21851673473496,
  },
  {
    category: "Fuel Source [10] - Coal",
    total_persen_losses: 5.724503174251868,
    cum_frequency: 47.94301990898683,
  },
  {
    category: "ST Assembly [1] - ST 1",
    total_persen_losses: 5.141314351758274,
    cum_frequency: 53.0843342607451,
  },
  {
    category:
      "Stream [123] - Outlet of Mixer [85] -> CW inlet of Water-cooled Condenser (PCE) [59]",
    total_persen_losses: 2.953505738328226,
    cum_frequency: 56.03783999907333,
  },
  {
    category: "Stream [96] - Outlet of Boiler Assembly [2] - BLR 1",
    total_persen_losses: 2.9364510389362657,
    cum_frequency: 58.974291038009596,
  },
  {
    category: "Stream [41] - Outlet of ST Assembly [1] - ST 1",
    total_persen_losses: 2.916831932650533,
    cum_frequency: 61.89112297066013,
  },
  {
    category:
      "Stream [64] - Outlet 3 of Splitter [51] -> Inlet of Pipe (PCE) [63]",
    total_persen_losses: 2.8586625411058404,
    cum_frequency: 64.74978551176596,
  },
  {
    category:
      "Stream [66] - Outlet 1 of Splitter [51] -> Inlet of ST Assembly [1] - ST 1",
    total_persen_losses: 2.7901092637602547,
    cum_frequency: 67.53989477552622,
  },
  {
    category: "ST-Driven Pump [86] - BFPT-B",
    total_persen_losses: 2.692069000949256,
    cum_frequency: 70.23196377647548,
  },
  {
    category:
      "Stream [32] - Outlet of Mixer [25] -> Inlet of ST Assembly [1] - ST 1",
    total_persen_losses: 2.5291980124009554,
    cum_frequency: 72.76116178887644,
  },
  {
    category: "ST-Driven Pump [1] - BFPT-A",
    total_persen_losses: 2.4588406179429305,
    cum_frequency: 75.22000240681936,
  },
  {
    category:
      "Stream [61] - Outlet 3 of Splitter [50] -> Inlet of Pipe (PCE) [61]",
    total_persen_losses: 2.2767970532263107,
    cum_frequency: 77.49679946004568,
  },
  {
    category:
      "Stream [59] - Outlet 3 of Splitter [49] -> Inlet of Pipe (PCE) [60]",
    total_persen_losses: 2.094441254201732,
    cum_frequency: 79.5912407142474,
  },
  {
    category:
      "Stream [26] - Outlet 2 of Splitter [20] -> Inlet of Pipe (PCE) [36]",
    total_persen_losses: 2.0264932225756445,
    cum_frequency: 81.61773393682304,
  },
  {
    category: "Feedwater Heater [24] - HPH-3",
    total_persen_losses: 1.8725444622149183,
    cum_frequency: 83.49027839903796,
  },
  {
    category:
      "Stream [27] - Outlet 3 of Splitter [18] -> Inlet of ST Assembly [1] - ST 1",
    total_persen_losses: 1.75325900032453,
    cum_frequency: 85.2435373993625,
  },
  {
    category: "Stream [10] - Steam outlet of Boiler Assembly [2] - BLR 1",
    total_persen_losses: 1.7275051336879237,
    cum_frequency: 86.97104253305042,
  },
  {
    category: "Stream [38] - Outlet of Mixer [30] -> Inlet of Pipe (PCE) [37]",
    total_persen_losses: 1.722866365461079,
    cum_frequency: 88.6939088985115,
  },
  {
    category: "Stream [67] - Outlet of ST Assembly [1] - ST 1",
    total_persen_losses: 1.700763101738044,
    cum_frequency: 90.39467200024954,
  },
  {
    category:
      "Stream [69] - CW outlet of Water-cooled Condenser (PCE) [59] -> Inlet of Water Sink [58]",
    total_persen_losses: 1.6885476802576078,
    cum_frequency: 92.08321968050716,
  },
  {
    category:
      "Stream [107] - Outlet 2 of Splitter [71] -> Inlet of Splitter [70]",
    total_persen_losses: 1.670609782016195,
    cum_frequency: 93.75382946252336,
  },
  {
    category: "Stream [16] - Gas outlet of Boiler Assembly [2] - BLR 1",
    total_persen_losses: 1.60224811805584,
    cum_frequency: 95.3560775805792,
  },
  {
    category: "Stream [2] - Primary air outlet of Boiler Assembly [2] - BLR 1",
    total_persen_losses: 1.5877862847041466,
    cum_frequency: 96.94386386528335,
  },
  {
    category: "Feedwater Heater [53] - LPH-8",
    total_persen_losses: 1.5650331644979625,
    cum_frequency: 98.50889702978131,
  },
  {
    category:
      "Stream [17] - Feedwater outlet of Feedwater Heater [16] - HPH-1 -> Inlet of Pipe (PCE) [76]",
    total_persen_losses: 1.4650804010914271,
    cum_frequency: 99.97397743087274,
  },
];

export default function MultipleLineChart({ thresholdNumber }: any) {
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState<SliderValue>(thresholdNumber);
  const [internalSliderValue, setInternalSliderValue] =
    useState<SliderValue>(thresholdNumber); // Holds the immediate value

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto Heat Loss</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1">
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
            <YAxis domain={[0, 100]} />
            <Legend className="dark:fill-slate-50" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey={"total_persen_losses"}
              name={"Total Persen Loss"}
              fill="#111 dark:#fff"
              className="dark:fill-slate-50 dark:stroke-slate-50 hover:cursor-pointer"
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
              label="Cost Threshold"
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
      </CardContent>
    </Card>
  );
}
