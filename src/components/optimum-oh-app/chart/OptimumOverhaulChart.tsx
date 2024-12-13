"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";

export default function OptimumOverhaulChart({ chartData, days }: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [echartsTheme, setEchartsTheme] = useState("light");
  const [markLinePosition, setMarkLinePosition] = useState("");

  // Calculate total cost by summing corrective and overhaul costs
  const processedData = chartData.map((point) => ({
    day: point.day,
    corrective_cost: Number(point.corrective_cost.toFixed(2)),
    overhaul_cost: Number(point.overhaul_cost.toFixed(2)),
    total_cost: Number(
      (point.corrective_cost + point.overhaul_cost).toFixed(2)
    ),
    num_failures: point.num_failures,
  }));

  const option = {
    title: {
      left: "left",
      text: "Optimum Overhaul Chart",
    },
    legend: {
      top: "bottom",
      data: ["Fake Data"],
    },
    tooltip: {
      triggerOn: "none",
      axisPointer: {
        type: "axis",
        snap: true,
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: function (params) {
        let result = `Day: ${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          // Get the color of the line
          const color = param.color;
          // Format large numbers with commas and fixed decimal places
          const value = new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(param.value[1]);
          // Add colored dot using the series color
          result += `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:5px;"></span>${param.seriesName}: Rp.${value}<br/>`;
        });
        return result;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
      padding: 10,
      position: (point) => {
        return [point[0], 130];
      },
    },
    toolbox: {
      right: 20,
      itemSize: 15,
      top: 55,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
      },
    },
    xAxis: {
      name: "Interval Inspection",
      nameLocation: "middle",
      nameGap: 25,
      nameTextStyle: {
        fontWeight: "bold",
        backgroundColor: "#7581BD",
        color: "white",
        padding: [3, 10, 3, 10],
        borderRadius: 4,
      },
      min: 1,
      type: "value",
      axisPointer: {
        value: `${days}`,
        snap: true,
        lineStyle: {
          color: "#7581BD",
          width: 2,
        },
        label: {
          show: true,
          formatter: function (params) {
            return `Day ${params.value}`;
          },
          backgroundColor: "#7581BD",
        },
        handle: {
          margin: 25,
          show: true,
          color: "#7581BD",
          formatter: function (params) {
            return `Day ${params.value}`;
          },
        },
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: "Day {value}",
      },
    },
    yAxis: {
      name: "Cost Downtime",
      nameLocation: "middle",
      nameGap: 65,
      nameTextStyle: {
        fontWeight: "bold",
        fontSize: 14,
        backgroundColor: "#7581BD",
        color: "white",
        padding: [5, 10, 5, 10],
        borderRadius: 4,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowBlur: 5,
        shadowOffsetY: 2,
      },
      type: "value",
      axisTick: {
        inside: true,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        inside: false,
        formatter: (value) => {
          return (
            new Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value / 1000000) + " Jt"
          );
        },
      },
    },
    // grid: {
    //   top: 110,
    //   left: 15,
    //   right: 15,
    //   height: 160,
    // },
    dataZoom: [
      {
        type: "inside",
        throttle: 50,
      },
    ],
    series: [
      {
        name: "Total Cost",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        sampling: "average",
        itemStyle: {
          color: "#0770FF",
        },
        stack: "a",
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: "rgba(58,77,233,0.8)",
        //     },
        //     {
        //       offset: 1,
        //       color: "rgba(58,77,233,0.3)",
        //     },
        //   ]),
        // },
        data: processedData.map((point) => [point.day, point.total_cost]),
      },
      {
        name: "Corrective Cost",
        type: "line",
        smooth: true,
        stack: "b",
        symbol: "circle",
        symbolSize: 5,
        sampling: "average",
        itemStyle: {
          color: "#F2597F",
        },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: "rgba(213,72,120,0.8)",
        //     },
        //     {
        //       offset: 1,
        //       color: "rgba(213,72,120,0.3)",
        //     },
        //   ]),
        // },
        data: processedData.map((point) => [point.day, point.corrective_cost]),
      },
      {
        name: "Overhaul Cost",
        type: "line",
        smooth: true,
        stack: "c",
        symbol: "circle",
        symbolSize: 5,
        sampling: "average",
        itemStyle: {
          color: "#28C840",
        },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: "rgba(13,272,120,0.8)",
        //     },
        //     {
        //       offset: 1,
        //       color: "rgba(13,272,120,0.3)",
        //     },
        //   ]),
        // },
        data: processedData.map((point) => [point.day, point.overhaul_cost]),
      },
    ],
  };

  // Event handler for chart clicks
  const onChartClick = (params) => {
    alert(JSON.stringify(params));
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <>
      <ReactECharts
        option={option}
        theme={echartsTheme}
        className="rounded-md p-4 min-h-[75dvh]"
        style={{ height: "100%", width: "100%" }}
        // onEvents={onEvents}
      />
    </>
  );
}
