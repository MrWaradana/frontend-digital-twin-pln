"use client";

import React, { useState, useMemo } from "react";
import { Variable } from "@/lib/APIs/useGetVariables";
var randomColor = require("randomcolor");

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Dynamic Multi-Line Chart",
    },
  },
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

    const dataSetAttribute = tagValueDatas!!.map((data: any) => {
      const datasets = {
        label: data.name,
        data: [],
        borderColor: randomColor(),
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tension: 0.1,
      };
      data.values.forEach((values: any) => {
        datasets["data"] += values.value;
      });

      return datasets;
    });

    return {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: dataSetAttribute,
    };
  }, [tagValueDatas]);

  console.log("chart data", chartData);
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
   * (END): GET CHART TAG VALUES DATA==========================================================================================
   */

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
              <Line data={chartData} options={options} />
            </div>
          </CardContent>
        </Card>
      </>
    )
  );
}
