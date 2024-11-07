"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { offsetPositive } from "recharts/types/util/ChartUtils";

export default function EChartsStackedLine({ data }: any) {
  const dataChart = [
    {
      period: "2019",
      Parameter1: 0,
      Parameter2: 0,
      Parameter3: 0,
      Parameter4: 0,
      Parameter5: 0,
    },
    {
      period: "2020",
      Parameter1: 25,
      Parameter2: 15,
      Parameter3: 35,
      Parameter4: 12,
      Parameter5: 55,
    },
    {
      period: "2021",
      Parameter1: 43,
      Parameter2: 53,
      Parameter3: 43,
      Parameter4: 23,
      Parameter5: 63,
    },
    {
      period: "2022",
      Parameter1: 63,
      Parameter2: 73,
      Parameter3: 63,
      Parameter4: 53,
      Parameter5: 83,
    },
    {
      period: "2023",
      Parameter1: 73,
      Parameter2: 73,
      Parameter3: 83,
      Parameter4: 63,
      Parameter5: 93,
    },
    {
      period: "2024",
      Parameter1: 83,
      Parameter2: 96,
      Parameter3: 98,
      Parameter4: 91,
      Parameter5: 97,
    },
    {
      period: "2025",
      Parameter1: 96,
      Parameter2: 98,
      Parameter3: 99,
      Parameter4: 94,
      Parameter5: 99,
    },
  ];

  // Extract categories for the x-axis
  const categories = dataChart.map((item) => item.period);

  // Extract series data for each parameter
  const series = [
    {
      name: "Parameter1",
      type: "line",
      // stack: "Total",
      smooth: true,
      data: dataChart.map((item) => item.Parameter1),
    },
    {
      name: "Parameter2",
      type: "line",
      // stack: "Total",
      smooth: true,
      data: dataChart.map((item) => item.Parameter2),
    },
    {
      name: "Parameter3",
      type: "line",
      // stack: "Total",
      smooth: true,
      data: dataChart.map((item) => item.Parameter3),
    },
    {
      name: "Parameter4",
      type: "line",
      // stack: "Total",
      smooth: true,
      data: dataChart.map((item) => item.Parameter4),
    },
    {
      name: "Parameter5",
      type: "line",
      // stack: "Total",
      smooth: true,
      data: dataChart.map((item) => item.Parameter5),
    },
  ];

  // ECharts option
  const option = {
    title: {
      text: "Efficiency Trending",
      offsetPositive: 24,
    },
    tooltip: {
      order: "valueDesc",
      trigger: "axis",
    },
    legend: {
      data: [
        "Parameter1",
        "Parameter2",
        "Parameter3",
        "Parameter4",
        "Parameter5",
      ],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      name: "Period",
      boundaryGap: false,
      data: categories,
    },
    yAxis: {
      type: "value",
      name: "Nilai Heat Loss",
      min: 0,
      max: 100,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 10,
      },
      {
        start: 0,
        end: 10,
      },
    ],
    series: series,
  };

  const { theme } = useTheme(); // Detect the current theme
  const [echartsTheme, setEchartsTheme] = useState("light");

  // Detect when the theme changes and set ECharts theme accordingly
  useEffect(() => {
    // Update the ECharts theme based on the current theme
    if (theme === "dark") {
      setEchartsTheme("dark");
    } else {
      setEchartsTheme("light");
    }
  }, [theme]);

  return (
    <Card>
      <CardBody>
        <ReactECharts
          option={option}
          theme={echartsTheme} // Apply the theme dynamically
          className="rounded-md p-4  min-h-[80dvh] "
        />
      </CardBody>
    </Card>
  );
}
