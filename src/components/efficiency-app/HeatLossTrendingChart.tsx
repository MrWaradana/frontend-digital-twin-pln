"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import useSWR, { mutate } from "swr";
import { Variable } from "@/lib/APIs/useGetVariables";
import {
  // DataTrending,
  useGetDataTrending,
} from "@/lib/APIs/useGetDataTrending";
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
import { trim } from "lodash";
// import { compareAsc, format, isAfter, isBefore, isValid } from "date-fns";

export const description = "A multiple line chart";

const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// const chartData = [
//   { month: "January", year: "2010", desktop: 186, laptop: 120, mobile: 80 },
//   { month: "February", year: "2011", desktop: 305, laptop: 180, mobile: 200 },
//   { month: "March", year: "2012", desktop: 237, laptop: 200, mobile: 120 },
//   { month: "April", year: "2013", desktop: 73, laptop: 140, mobile: 190 },
//   { month: "May", year: "2014", desktop: 209, laptop: 168, mobile: 130 },
//   { month: "June", year: "2015", desktop: 214, laptop: 470, mobile: 140 },
//   { month: "July", year: "2016", desktop: 214, laptop: 470, mobile: 140 },
//   { month: "July", year: "2016", desktop: 233, laptop: 790, mobile: 200 },
// ];

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
  session,
  isLoadingTrendingDatas,
  errorTrendingDatas,
  trendingDatas,
  checkedVariables,
  startDate,
  endDate,
  variableData,
}: {
  session: any;
  isLoadingTrendingDatas: any;
  errorTrendingDatas: any;
  trendingDatas: any;
  checkedVariables: any | Variable[];
  startDate: Date | any | null;
  endDate: Date | any | null;
  variableData: any;
}) {
  // const [variables, setVariables] = useState(null);
  // const [trendingDataChart, setTrendingDataChart] = useState(null);
  // const [trendingDataVariableIds, setTrendingDataVariableIds] = useState<any[]>(
  //   []
  // );
  // const [chartTrendingConfig, setChartTrendingConfig] = useState(
  //   {} satisfies ChartConfig
  // );

  // useEffect(() => {
  //   // setTrendingDataVariableIds(checkedVariables.map((item) => item.id));
  //   setTrendingDataVariableIds(checkedVariables);
  // }, [checkedVariables]);

  //   const trendingDatas = trendingData ?? [];
  const chartData = useMemo(() => {
    if (!trendingDatas) return [];

    return trendingDatas.map((data: any) => {
      const dataPoint: any = {
        periode: data.periode,
      };
      data.pareto.forEach((pareto: any) => {
        dataPoint[pareto.variable_id] = pareto.persen_losses;
      });
      return dataPoint;
    });
  }, [trendingDatas]);

  /**
   * (START): GET CHART CONFIG========================================================================================
   */
  const chartConfig = useMemo(() => {
    return variableData.reduce((config: any, variable: any) => {
      if (checkedVariables.includes(variable.id)) {
        config[variable.id] = {
          name: variable.short_name,
          color: `${randomColor()}`,
        };
      }
      return config;
    }, {});
  }, [variableData, checkedVariables]);

  /**
   * (END): GET CHART CONFIG===========================================================================================
   */

  if (isLoadingTrendingDatas)
    return (
      <div>
        <strong>Pilih variabel untuk menampilkan grafik data...</strong>
      </div>
    );
  if (errorTrendingDatas) return <div>Error: {errorTrendingDatas.message}</div>;

  /** MANAGE TRENDING DATA */

  return (
    variableData && (
      <Card>
        <CardHeader>
          <CardTitle>Heat Loss Trending Chart</CardTitle>
          <CardDescription>{`${startDate} to ${endDate}`}</CardDescription>
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
                dataKey="periode"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  value ? value.slice(0, 3) : "undefined"
                }
              />
              {/* <XAxis dataKey="periode" /> */}
              <YAxis />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {Object.entries(chartConfig)?.map(
                ([id, config]: [string, any]) => (
                  <Line
                    key={id}
                    type="monotone"
                    dataKey={id}
                    name={config.name}
                    stroke={config.color}
                    activeDot={{ r: 8 }}
                  />
                )
              )}
              {/* For Example */}
              {/* <Line
                dataKey="f8be624b-ffee-4d22-a36a-d3a80add5402"
                type="monotone"
                stroke={randomColor()}
                strokeWidth={2}
                dot={false}
              /> */}
            </LineChart>
          </ChartContainer>
          {/* {JSON.stringify(checkedVariables)} */}
        </CardContent>
        <CardFooter>
          {/* <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </div>
          </div> */}

          {/* FOR TESTING PURPOSE */}
          {/* <div>
            <h4>YOHOHO</h4>
            {trendingDatas?.map((data: any) => {
              return <pre key={data.id}>{JSON.stringify(data, null, 2)}</pre>;
            })}
            <h4>YOHOHO</h4>
            {checkedVariables?.map((data: any) => {
              return <pre key={data}>{JSON.stringify(data, null, 2)}</pre>;
            })}
          </div> */}
        </CardFooter>
      </Card>
    )
  );
}
