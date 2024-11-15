"use client";

import React, { useEffect, useRef } from "react";

import { RiskMatrixContentLayout } from "@/containers/RiskMatrixContentLayout";

import * as echarts from "echarts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const data: Array<any> = [
        {
          name: "Dataset A",
          likelihood: 3.5,
          severity: 3.5,
          count: 50,
          dataset: Array.from({ length: 50 }, () => ({
            value: Math.floor(Math.random() * 100),
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset B",
          likelihood: 4,
          severity: 2,
          count: 75,
          dataset: Array.from({ length: 75 }, () => ({
            value: Math.floor(Math.random() * 100),
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset C",
          likelihood: 3,
          severity: 4,
          count: 30,
          dataset: Array.from({ length: 30 }, () => ({
            value: Math.floor(Math.random() * 100),
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset D",
          likelihood: 5,
          severity: 5,
          count: 20,
          dataset: Array.from({ length: 20 }, () => ({
            value: Math.floor(Math.random() * 100),
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset E",
          likelihood: 1.5,
          severity: 1.8,
          count: 100,
          dataset: Array.from({ length: 100 }, () => ({
            value: Math.floor(Math.random() * 100),
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset F",
          likelihood: 1.5,
          severity: 1.8,
          count: 100,
          dataset: Array.from({ length: 100 }, () => ({
            value: Math.floor(Math.random() * 100),
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
      ];

      const option = {
        title: {
          text: "Risk Matrix Chart",
          subtext: "Datasets represented by scatter points",
          left: "center",
        },
        tooltip: {
          formatter: function (params) {
            const data = params.data;

            // Check if 'dataset' is defined and has length before using it
            if (data && data.dataset && data.dataset.length) {
              const avgValue = (
                data.dataset.reduce((sum, item) => sum + item.value, 0) /
                data.count
              ).toFixed(2);
              const latestDate = new Date(
                Math.max(...data.dataset.map((item) => item.date))
              );
              return `
                ${data.name}<br/>
                Likelihood: ${data.likelihood}<br/>
                Severity: ${data.severity}<br/>
                Dataset Count: ${data.count}<br/>
                Average Value: ${avgValue}<br/>
                Latest Date: ${latestDate.toLocaleDateString()}
              `;
            } else {
              return `${data.name}<br/>No dataset available`;
            }
          },
        },
        xAxis: {
          type: "category",
          data: ["1", "2", "3", "4", "5"],
          name: "Likelihood",
          nameLocation: "middle",
          nameGap: 25,
          interval: 0.1,
          splitArea: {
            show: true,
          },
        },
        yAxis: {
          type: "category",
          data: ["1", "2", "3", "4", "5"],
          name: "Severity",
          nameLocation: "middle",
          nameGap: 25,
          interval: 0.1,
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 1,
          max: 5,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "5%",
          inRange: {
            color: ["#52c41a", "#faad14", "#f5222d", "#722ed1", "#1890ff"],
          },
          textStyle: {
            color: "#333",
          },
        },
        series: [
          {
            name: "Risk Matrix",
            type: "heatmap",
            data: [
              [0, 0, 1],
              [1, 0, 1],
              [2, 0, 2],
              [3, 0, 3],
              [4, 0, 4],
              [0, 1, 1],
              [1, 1, 1],
              [2, 1, 2],
              [3, 1, 3],
              [4, 1, 4],
              [0, 2, 2],
              [1, 2, 2],
              [2, 2, 3],
              [3, 2, 4],
              [4, 2, 4],
              [0, 3, 3],
              [1, 3, 3],
              [2, 3, 4],
              [3, 3, 4],
              [4, 3, 5],
              [0, 4, 4],
              [1, 4, 4],
              [2, 4, 4],
              [3, 4, 5],
              [4, 4, 5],
            ],

            // WHAT IS THIS BLOCK CODE MEAN?
            // data: Array.from({ length: 5 }, (_, i) =>
            //   Array.from({ length: 5 }, (_, j) => [i + 1, j + 1, i + j + 2])
            // ).flat(),

            label: {
              show: true,
              formatter: function (params) {
                return ["Low", "Medium", "High", "Very High", "Extreme"][
                  params.data[2] - 1
                ];
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
          {
            name: "Datasets",
            type: "scatter",
            data: data.map((item) => ({
              name: item.name,
              value: [item.likelihood - 1, item.severity - 1],
              symbolSize: Math.sqrt(item.count) * 2,
              itemStyle: {
                color: "#333",
                opacity: 0.8,
              },
              ...item,
            })),
            label: {
              show: true,
              formatter: function (param) {
                return param.data.name;
              },
              position: "inside",
              fontSize: 12,
              fontWeight: "bold",
              color: "#fff",
            },
          },
        ],
      };

      myChart.setOption(option);

      // Cleanup
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return (
    <RiskMatrixContentLayout title="Risk Matrix">
      <div className="w-full max-w-3xl mx-auto p-4">
        <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
      </div>
    </RiskMatrixContentLayout>
  );
}
