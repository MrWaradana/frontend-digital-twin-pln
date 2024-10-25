"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function EChartsRiskMatrixPreciseScatter() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const data: any[] = [
        {
          name: "Dataset A",
          likelihood: 3.7,
          severity: 2.5,
          count: 50,
          dataset: Array.from({ length: 50 }, () => ({
            value: Math.random() * 5,
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset B",
          likelihood: 1.2,
          severity: 4.8,
          count: 75,
          dataset: Array.from({ length: 75 }, () => ({
            value: Math.random() * 5,
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset C",
          likelihood: 4.5,
          severity: 3.2,
          count: 30,
          dataset: Array.from({ length: 30 }, () => ({
            value: Math.random() * 5,
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset D",
          likelihood: 2.8,
          severity: 1.9,
          count: 20,
          dataset: Array.from({ length: 20 }, () => ({
            value: Math.random() * 5,
            date: new Date(
              2023,
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
          })),
        },
        {
          name: "Dataset E",
          likelihood: 3.3,
          severity: 4.1,
          count: 100,
          dataset: Array.from({ length: 100 }, () => ({
            value: Math.random() * 5,
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
          text: "Risk Matrix Chart (Precise Scatter Placement)",
          subtext: "Datasets represented by scatter points",
          left: "center",
        },
        tooltip: {
          formatter: function (params) {
            const data = params.data;
            if (data.dataset) {
              const avgValue = (
                data.dataset.reduce((sum, item) => sum + item.value, 0) /
                data.count
              ).toFixed(2);
              const latestDate = new Date(
                Math.max(...data.dataset.map((item) => item.date))
              );
              return `
                ${data.name}<br/>
                Likelihood: ${data.likelihood.toFixed(2)}<br/>
                Severity: ${data.severity.toFixed(2)}<br/>
                Dataset Count: ${data.count}<br/>
                Average Value: ${avgValue}<br/>
                Latest Date: ${latestDate.toLocaleDateString()}
              `;
            } else {
              return `
                Likelihood: ${params.data[0] + 1}<br/>
                Severity: ${params.data[1] + 1}<br/>
                Risk Level: ${params.data[2]}
              `;
            }
          },
        },
        xAxis: [
          {
            type: "category",
            data: ["1", "2", "3", "4", "5"],
            name: "Likelihood",
            nameLocation: "middle",
            nameGap: 25,
            splitArea: {
              show: true,
            },
          },
          {
            type: "value",
            min: 1,
            max: 5,
            show: false,
          },
        ],
        yAxis: [
          {
            type: "category",
            data: ["1", "2", "3", "4", "5"],
            name: "Severity",
            nameLocation: "middle",
            nameGap: 25,
            splitArea: {
              show: true,
            },
          },
          {
            type: "value",
            min: 1,
            max: 5,
            show: false,
          },
        ],
        visualMap: {
          min: 1,
          max: 3,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "5%",
          inRange: {
            color: ["#52c41a", "#faad14", "#f5222d"],
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
              [0, 4, 3],
              [1, 4, 3],
              [2, 4, 3],
              [3, 4, 3],
              [4, 4, 3],
              [0, 3, 2],
              [1, 3, 2],
              [2, 3, 2],
              [3, 3, 2],
              [4, 3, 3],
              [0, 2, 2],
              [1, 2, 2],
              [2, 2, 2],
              [3, 2, 2],
              [4, 2, 3],
              [0, 1, 1],
              [1, 1, 1],
              [2, 1, 2],
              [3, 1, 2],
              [4, 1, 3],
              [0, 0, 1],
              [1, 0, 1],
              [2, 0, 2],
              [3, 0, 2],
              [4, 0, 3],
            ],
            label: {
              show: false,
              formatter: function (params) {
                return ["Low", "Medium", "High"][params.data[2] - 1];
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
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.map((item) => ({
              name: item.name,
              value: [item.likelihood, item.severity],
              symbolSize: Math.sqrt(item.count) * 2,
              itemStyle: {
                color: "#333",
                opacity: 0.8,
              },
              ...item,
            })),
            label: {
              show: false,
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
    <div className="w-full max-w-3xl mx-auto p-4">
      <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}
