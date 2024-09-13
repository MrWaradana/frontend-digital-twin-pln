"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
var randomColor = require("randomcolor");

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

export const description = "A multiple line chart";

const chartData = [
  { month: "January", year: "2010", desktop: 186, laptop: 120, mobile: 80 },
  { month: "February", year: "2011", desktop: 305, laptop: 180, mobile: 200 },
  { month: "March", year: "2012", desktop: 237, laptop: 200, mobile: 120 },
  { month: "April", year: "2013", desktop: 73, laptop: 140, mobile: 190 },
  { month: "May", year: "2014", desktop: 209, laptop: 168, mobile: 130 },
  { month: "June", year: "2015", desktop: 214, laptop: 470, mobile: 140 },
];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   laptop: {
//     label: "Laptop",
//     color: randomColor(),
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-3))",
//   },
// } satisfies ChartConfig;

export function HeatLossTrendingChart({
  dataLineChart,
}: {
  dataLineChart: any[];
}) {
  const [lineChart, setlineChart] = useState(dataLineChart);

  // console.log(dataLineChart, "INI DATANYA");

  const [chartConfig, setCharConfig] = useState({} satisfies ChartConfig);

  // const chartData = useMemo(() => {
  //   const dataList = dataLineChart?.map((item: any, index: number) => {
  //     item.configLabel = item.id;
  //     item.configColor = randomColor;

  //     return { ...item };
  //   });

  //   return dataList;
  // }, [dataLineChart]);
  // console.log(chartData, "OWALAGH");

  // useEffect(() => {
  //   setlineChart(lineChart);
  // }, [lineChart]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heat Loss Trending Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} stroke="#DEE5D4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke={randomColor()}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="laptop"
              type="monotone"
              stroke="var(--color-laptop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        {JSON.stringify(dataLineChart)}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
        <div>
          {lineChart?.map((data: any) => {
            return <pre key={data.id}>{JSON.stringify(data, null, 2)}</pre>;
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
