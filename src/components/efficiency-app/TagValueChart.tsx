"use client";

import React, { useState, useEffect, useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

import { Variable } from "@/lib/APIs/useGetVariables";
var randomColor = require("randomcolor");

// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function TagValueChart({
  session,
  checkedTags,
  startDate,
  endDate,
  isLoadingTagValueDatas,
  errorTagValueDatas,
  tagValueDatas,
  tagRawData,
}: {
  session: any;
  checkedTags: any | Variable[];
  startDate: Date | any | null;
  endDate: Date | any | null;
  isLoadingTagValueDatas: any;
  errorTagValueDatas: any;
  tagValueDatas: any;
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
   * (START): GET CHART TAG VALUES DATA========================================================================================
   */
  const chartData: any = useMemo(() => {
    if (!tagValueDatas) return {};

    // const labelsNameAttribute = [];

    const dataSetAttributes = tagValueDatas!!.map((data: any) => {
      const datasets = {
        type: "line",
        name: data.name,
        showInLegend: false,
      };

      datasets["dataPoints"] = datasets["dataPoints"] || [];

      data.values.forEach((values: any) => {
        datasets["dataPoints"].push({
          x: new Date(values.time_stamp),
          y: values.value,
        });
      });

      return datasets;
    });

    return {
      dataSetAttributes,
    };
  }, [tagValueDatas]);
  // console.log(chartData);
  /**
   * (END): GET CHART TAG VALUES DATA==========================================================================================
   */

  // CREATE OPTION FOR LINE CHART
  const options = {
    responsive: true,
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
    data: chartData.dataSetAttributes,
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
  // console.log("OPTION==================================================");
  // console.log(options);

  // console.log("chart data", chartData);
  // console.log("typeof periode: ", chartData[0].periode);
  // chartData.length > 0
  //   ? console.log(
  //       "typeof Periode",
  //       typeof chartData[0].periode,
  //       " and data: ",
  //       chartData[0].periode.getDate()
  //     )
  //   : console.log("chartData");

  /**
   * (START): GET CHART TAG VALUES CONFIG========================================================================================
   */
  //   const chartConfig = useMemo(() => {
  //     return tagRawData.reduce((config: any, tag: any) => {
  //       if (checkedTags.includes(tag.id)) {
  //         config[tag.id] = {
  //           name: tag.name,
  //           color: `${randomColor()}`,
  //         };
  //       }
  //       return config;
  //     }, {});
  //   }, [tagRawData, checkedTags]);

  /**
   * (END): GET CHART TAG VALUES CONFIG===========================================================================================
   */

  if (isLoadingTagValueDatas)
    return (
      <div>
        <strong>Pilih tag untuk menampilkan grafik data...</strong>
      </div>
    );
  if (errorTagValueDatas) return <div>Error: {errorTagValueDatas.message}</div>;

  /** MANAGE TRENDING DATA */

  return (
    tagRawData && (
      <>
        {/* CARD TAG VALUE DATA */}
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Dynamic Multi-Line Chart with Time Range</CardTitle>
            <CardDescription>
              Add or remove datasets and adjust time range dynamically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <CanvasJSChart options={options} />
            </div>
          </CardContent>
        </Card>
      </>
    )
  );
}
