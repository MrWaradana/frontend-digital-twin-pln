"use client";

import React, { useState, useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
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
import dynamic from "next/dynamic";
// import { compareAsc, format, isAfter, isBefore, isValid } from "date-fns";

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

const chartDummyData = [
  { month: "January", year: "2010", desktop: 186, laptop: 120, mobile: 80 },
  { month: "February", year: "2011", desktop: 305, laptop: 180, mobile: 200 },
  { month: "March", year: "2012", desktop: 237, laptop: 200, mobile: 120 },
  { month: "April", year: "2013", desktop: 73, laptop: 140, mobile: 190 },
  { month: "May", year: "2014", desktop: 209, laptop: 168, mobile: 130 },
  { month: "June", year: "2015", desktop: 214, laptop: 470, mobile: 140 },
  { month: "July", year: "2016", desktop: 214, laptop: 470, mobile: 140 },
  { month: "July", year: "2016", desktop: 233, laptop: 790, mobile: 200 },
];

// const chartDummyConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   laptop: {
//     label: "Laptop",
//     color: "hsl(var(--chart-2))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-3))",
//   },
// } satisfies ChartConfig;

export function HeatLossTrendingChartNew({
  session,
  isLoadingTrendingDatas,
  errorTrendingDatas,
  trendingDatas,
  isLoadingTagValueDatas,
  errorTagValueDatas,
  tagValueDatas,
  checkedVariables,
  startDate,
  endDate,
  variableRawData,
  tagRawData,
}: {
  session: any;
  isLoadingTrendingDatas: any;
  errorTrendingDatas: any;
  trendingDatas: any;
  isLoadingTagValueDatas: any;
  errorTagValueDatas: any;
  tagValueDatas: any;
  checkedVariables: any | Variable[];
  checkedTags: any | Variable[];
  startDate: Date | any | null;
  endDate: Date | any | null;
  variableRawData: any;
  tagRawData: any;
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

  /**
   * (START): GET CHART TRENDING DATA========================================================================================
   */
  // const CanvasJSChart = dynamic(
  //   () => import("@canvasjs/react-charts").then((mod) => mod.CanvasJSChart),
  //   { ssr: false }
  // )
  const chartData = useMemo(() => {
    if (!trendingDatas) return [];

    const groupedData = {};

    trendingDatas.forEach((dataEntry: any) => {
      // const dataPoint: any = {
      //   periode: new Date(data.periode),
      // };
      // const datasets = {
      //   type: "line",
      //   name: data.name,
      //   showInLegend: false,
      // };

      // datasets["dataPoints"] = datasets["dataPoints"] || [];
      dataEntry.pareto.forEach((paretoItem: any) => {
        const { id, variable_id, variable_name, persen_losses } = paretoItem;
        // If the variable_id group doesn't exist yet, initialize it
        if (!groupedData[variable_id]) {
          groupedData[variable_id] = {
            // id: dataEntry.id, // Retain the original id
            type: "line",
            name: variable_name,
            showInLegend: false,
            dataPoints: [],
          };
        }

        groupedData[variable_id].dataPoints.push({
          x: new Date(dataEntry["periode"]),
          y: persen_losses,
        });
      });
    });

    return Object.values(groupedData);
  }, [trendingDatas]);

  // console.log("chartDataHEATLOSS");
  // console.log(chartData);
  // console.log("typeof periode: ", chartData[0].periode);
  // chartData.length > 0
  //   ? console.log(
  //       "typeof Periode",
  //       typeof chartData[0].periode,
  //       " and data: ",
  //       chvisxartData[0].periode.getDate()
  //     )
  //   : console.log("chartData");
  /**
   * (END): GET CHART TRENDING DATA==========================================================================================
   */

  /**
   * (START): GET CHART TRENDING CONFIG========================================================================================
   */
  // const chartConfig = useMemo(() => {
  //   return variableRawData.reduce((config: any, variable: any) => {
  //     if (checkedVariables.includes(variable.id)) {
  //       config[variable.id] = {
  //         name: variable.short_name,
  //         color: `${randomColor()}`,
  //       };
  //     }
  //     return config;
  //   }, {});
  // }, [variableRawData, checkedVariables]);

  /**
   * (END): GET CHART TRENDING CONFIG===========================================================================================
   */

  // CREATE OPTION FOR LINE CHART
  const options = {
    responsive: true,
    zoomEnabled: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Tag Value Chart",
      },
    },
    toolTip: {
      shared: true,
    },
    data: chartData,
    //   scales: {
    //     x: {
    //       type: "linear",
    //       position: "bottom",
    //       title: {
    //         display: true,
    //         text: "Data Point",
    //       },
    //     },
    //     y: {
    //       type: "linear",
    //       position: "left",
    //       title: {
    //         display: true,
    //         text: "Value",
    //       },
    //     },
    //   },
  };

  if (isLoadingTrendingDatas)
    return (
      <div>
        <strong>Pilih variabel untuk menampilkan grafik data...</strong>
      </div>
    );
  if (errorTrendingDatas) return <div>Error: {errorTrendingDatas.message}</div>;

  /** MANAGE TRENDING DATA */

  return (
    variableRawData && (
      <>
        {/* CARD HEAT LOSS TRENDING DATA */}
        <Card>
          <CardHeader>
            <CardTitle>Heat Loss Trending Chart</CardTitle>
            <CardDescription>{`${startDate} to ${endDate}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <CanvasJSChart options={options} />
            </div>
          </CardContent>
          <CardFooter>
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
      </>
    )
  );
}
