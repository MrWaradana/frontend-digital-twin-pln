"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { offsetPositive } from "recharts/types/util/ChartUtils";
import { Smokum } from "next/font/google";
import MultipleLineChart from "@/components/efficiency-app/nett-plant-heat-rate/MultipleLineChart";
import { useGetDataNPHR } from "@/lib/APIs/useGetDataNPHR";
import { useSession } from "next-auth/react";

export default function EChartsStackedLine({
  chartData,
  selectedSeries,
  setSelectedSeries,
}: any) {
  const { data: session } = useSession();
  const { theme } = useTheme(); // Detect the current theme
  const [echartsTheme, setEchartsTheme] = useState("light");
  const [dataId, setDataId] = useState("");
  const [selectedPareto, setSelectedPareto] = useState(false);

  const [selectedCategory, setSelectedCategory]: any = useState(null);

  const {
    data,
    mutate,
    isLoading: isLoadingNPHR,
    isValidating,
    error,
  } = useGetDataNPHR(session?.user.access_token, dataId);

  // console.log(selectedSeries, "selected series");

  // Custom color palettes
  const mainChartColors = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ];
  const modalChartColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B4DCA",
    "#FFB6B9",
    "#A8E6CF",
  ];

  // Check if data is empty or invalid
  const isDataEmpty = !chartData || chartData.length === 0;

  // Extract categories for the x-axis
  // const categories = dataChart.map((item) => item.period);
  const periode = chartData.map((item: any) => item.data.periode);

  const listCategories = useMemo(() => {
    const categories = new Set<string>();
    chartData.forEach((pareto) => {
      Object.keys(pareto).forEach((key) => {
        if (key !== "data") {
          categories.add(key);
        }
      });
    });
    return Array.from(categories);
  }, [chartData]);

  // Create a lookup map for IDs based on the period
  const idMap = useMemo(() => {
    const map = new Map();
    chartData.forEach((point) => {
      map.set(point.data.periode, point.data.id);
    });
    return map;
  }, [chartData]);

  // Transform the series data keeping the original format
  const seriesData = listCategories
    .map((item, index) => {
      return {
        name: item,
        type: "line",
        smooth: true,
        yAxisIndex: item === "generator_gross_output" ? 1 : 0,
        data: chartData.map((point) => point[item].toFixed(2)),
        lineStyle: {
          width: 2,
          color: mainChartColors[index % mainChartColors.length],
        },
        itemStyle: {
          color: mainChartColors[index % mainChartColors.length],
          borderWidth: 2,
          borderColor: "#fff",
        },
        symbol: "circle",
        symbolSize: 8,
        showSymbol: true,
        emphasis: {
          scale: true,
          itemStyle: {
            borderWidth: 2,
            borderColor: "#fff",
          },
        },
      };
    })
    .filter(
      (item) =>
        item.name === "total_nilai_losses" ||
        item.name === "generator_gross_output"
    );

  const summaryData = data ?? [];
  const paretoData: any = data?.pareto_result ?? [];
  const chartParetoData = data?.chart_result ?? [];
  const chartDataRef = useRef<any | null>(null);

  const chartParetoDataWithCumFeq = useMemo(() => {
    const mapped_data = chartParetoData
      .map((item: any, index: number) => {
        const cum_frequency = chartParetoData
          .slice(0, index + 1) // Get all previous items up to the current index
          .reduce(
            (acc: any, current: { total_persen_losses: any }) =>
              acc + current.total_persen_losses,
            0
          ); // Accumulate total_persen_losses
        return {
          ...item, // Spread the original item
          cum_frequency, // Add the accumulated frequency
        };
      })
      // .filter((item: any) => item.cum_frequency <= 300 && );
      .filter((item: any) => item.category);

    // console.log(mapped_data, "mapped chart data");
    //   return mapped_data;
    // }, [tableData]);

    // Ensure that chartDataRef is always updated correctly
    if (!chartDataRef.current) {
      chartDataRef.current = mapped_data;
    } else if (chartDataRef.current.length === mapped_data.length) {
      // Preserve array length and only update necessary fields
      chartDataRef.current = chartDataRef.current.map(
        (item: any, index: number) => ({
          ...item,
          total_persen_losses: mapped_data[index].total_persen_losses,
          total_nilai_losses: mapped_data[index].total_nilai_losses,
          cum_frequency: mapped_data[index].cum_frequency,
        })
      );
    } else {
      // In case of mismatch, reset chartDataRef to match the mapped_data
      chartDataRef.current = mapped_data;
    }

    // if (chartDataRef.current != null && mapped_data.length > 0) {
    //   chartDataRef.current = mapped_data;
    // }

    return chartDataRef.current;
  }, [chartParetoData]);

  // Event handler for chart clicks
  const onChartClick = (params) => {
    // Get the period from the x-axis
    console.log(params, "params");
    const period = periode[params.dataIndex];

    // Look up the ID using the period
    const id = idMap.get(period);

    console.log("Clicked data:", {
      seriesName: params.seriesName,
      value: params.value,
      period: period,
      id: id,
    });

    if (id) {
      setDataId(id);
      setSelectedPareto(true);
    }
  };

  const onModalChartClick = (params) => {
    const categoryName = params.seriesName;
    const categoryData = chartData.map((point) => {
      const categoryInfo = point[categoryName];
      return {
        period: point.data.periode,
        total_losses: categoryInfo.total_nilai_losses,
        breakdown: categoryInfo.data.map((item) => ({
          name: item.variable.input_name,
          nilai_losses: item.nilai_losses,
          symptoms: item.symptoms,
          existing_data: item.existing_data,
          reference_data: item.reference_data,
          gap: item.gap,
        })),
      };
    });

    setSelectedCategory({
      name: categoryName,
      data: categoryData,
    });
  };

  const onEvents = {
    click: onChartClick,
  };

  const onModalEvents = {
    click: onModalChartClick,
  };

  const getCategoryChartOptions = (data) => {
    // Distinct color palette with high contrast
    const distinctColors = [
      "#FF3B30", // Red
      "#007AFF", // Blue
      "#4CD964", // Green
      "#FF9500", // Orange
      "#5856D6", // Purple
      "#FFD700", // Gold
      "#FF2D55", // Pink
      "#00FFFF", // Cyan
      "#8B4513", // Brown
      "#FF1493", // Deep Pink
      "#32CD32", // Lime Green
      "#4169E1", // Royal Blue
      "#FF4500", // Orange Red
      "#9370DB", // Medium Purple
      "#00FA9A", // Medium Spring Green
    ];

    // Different line styles for better distinction
    const lineStyles = [
      { width: 3, type: "solid" },
      { width: 3, type: "solid" },
      { width: 3, type: "solid" },
      { width: 4, type: "solid" },
      { width: 4, type: "solid" },
      { width: 4, type: "solid" },
      { width: 5, type: "solid" },
      { width: 5, type: "solid" },
      { width: 5, type: "solid" },
    ];

    // Different symbols for data points
    const symbols = [
      "circle",
      "rect",
      "triangle",
      "diamond",
      "pin",
      "arrow",
      "none",
    ];

    const componentNames = new Set();
    data.data.forEach((point) => {
      point.breakdown.forEach((component) => {
        componentNames.add(component.name);
      });
    });

    const series = Array.from(componentNames).map((componentName, index) => {
      const componentData = data.data.map((point) => {
        const component = point.breakdown.find((c) => c.name === componentName);
        return {
          nilai_losses: component ? component.nilai_losses : 0,
          existing: component ? component.existing_data : 0,
          reference: component ? component.reference_data : 0,
          gap: component ? component.gap : 0,
          symptoms: component ? component.symptoms : "",
        };
      });

      return {
        name: componentName,
        type: "line",
        smooth: true,
        triggerLineEvent: true,
        yAxisIndex: 0,
        data: componentData.map((d) => d.nilai_losses),
        emphasis: {
          focus: "series",
          lineStyle: {
            width: lineStyles[index % lineStyles.length].width + 2,
          },
        },
        lineStyle: {
          ...lineStyles[index % lineStyles.length],
          color: distinctColors[index % distinctColors.length],
        },
        itemStyle: {
          color: distinctColors[index % distinctColors.length],
        },
        symbol: symbols[index % symbols.length],
        symbolSize: 8,
        showSymbol: true,
        // areaStyle: {
        //   opacity: 0.00002,
        //   color: distinctColors[index % distinctColors.length],
        // },
        tooltip: {
          formatter: (params) => {
            const dataPoint = componentData[params.dataIndex];
            return `
              <div style="font-weight: bold; margin-bottom: 4px; color: ${
                distinctColors[index % distinctColors.length]
              }">
                ${params.seriesName}
              </div>
              <div style="margin: 4px 0">
                Heat Loss: ${params.value.toFixed(2)} kCal/kWh
              </div>
              <div style="margin: 4px 0">
                Existing: ${dataPoint.existing.toFixed(2)}
              </div>
              <div style="margin: 4px 0">
                Reference: ${dataPoint.reference.toFixed(2)}
              </div>
              <div style="margin: 4px 0">
                Gap: ${dataPoint.gap.toFixed(2)}
              </div>
              <div style="margin: 4px 0">
                Symptoms: ${dataPoint.symptoms}
              </div>
            `;
          },
        },
      };
    });

    // Calculate min/max values for y-axis
    let minValue = Infinity;
    let maxValue = -Infinity;

    series.forEach((s) => {
      const values = s.data;
      const seriesMin = Math.min(...values);
      const seriesMax = Math.max(...values);
      minValue = Math.min(minValue, seriesMin);
      maxValue = Math.max(maxValue, seriesMax);
    });

    const padding = (maxValue - minValue) * 0.1;
    minValue = Math.floor(minValue - padding);
    maxValue = Math.ceil(maxValue + padding);

    return {
      title: {
        text: `${data.name} - Component Breakdown`,
        left: "center",
        top: 0,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          snap: true, // Snaps to nearest data point
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: {
          color: "#333",
        },
        padding: 10,
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        bottom: 0,
        data: Array.from(componentNames),
        textStyle: {
          fontSize: 12,
        },
        selectedMode: true,
        selector: [
          { type: "all", title: "All" },
          { type: "inverse", title: "Inverse" },
        ],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.data.map((point) => point.period),
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Heat Loss (kCal/kWh)",
        min: minValue,
        max: maxValue,
        scale: true,
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      dataZoom: [
        {
          type: "inside",
          bottom: 46,
          start: 0,
          end: 100,
        },
        {
          bottom: 46,
          start: 0,
          end: 100,
        },
      ],
      toolbox: {
        feature: {
          magicType: {
            type: ["line", "bar"],
            title: {
              line: "Switch to Line Chart",
              bar: "Switch to Bar Chart",
            },
          },
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      series,
    };
  };

  // Modal chart options
  const getModalChartOptions = (data) => {
    // Create series for each category
    const modalSeries = data.allSeries.map((series: any, index) => ({
      name: series.name,
      type: "line",
      smooth: true,
      triggerLineEvent: true,
      data: series.data.map((item) => item.value),
      lineStyle: {
        width: series.isClickedSeries ? 4 : 2,
        // type: series.isClickedSeries ? "solid" : "dashed",
        type: "solid",
        color: modalChartColors[index % modalChartColors.length],
      },
      itemStyle: {
        color: modalChartColors[index % modalChartColors.length],
      },
      emphasis: {
        focus: "series",
        lineStyle: {
          width: 4,
        },
      },
      markPoint: series.isClickedSeries
        ? {
            data: [
              { type: "max", name: "Maximum" },
              { type: "min", name: "Minimum" },
            ],
          }
        : undefined,
      markLine: series.isClickedSeries
        ? {
            data: [{ type: "average", name: "Average" }],
          }
        : undefined,
      areaStyle: {
        opacity: 0.1,
        color: modalChartColors[index % modalChartColors.length],
      },
    }));

    return {
      title: {
        text: `Nilai Heat Loss per Category`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        type: "scroll",
        bottom: 0,
        size: 12,
        data: data.allSeries.map((series) => series.name),
      },
      toolbox: {
        feature: {
          magicType: {
            type: ["line", "bar"],
            title: {
              line: "Switch to Line Chart",
              bar: "Switch to Bar Chart",
            },
          },
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "12%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        name: "Period",
        boundaryGap: false,
        data: data.allSeries[0].data.map((item) => item.period),
      },
      yAxis: {
        type: "value",
        name: "Nilai Heat Loss",
      },
      series: modalSeries,
      dataZoom: [
        {
          type: "inside",
          bottom: 32,
          start: 0,
        },
        {
          bottom: 32,
          start: 0,
        },
      ],
    };
  };

  // Main chart options
  const option = {
    title: {
      text: "Efficiency Trending",
      textAlign: "left",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      type: "scroll",
      orient: "horizontal", // Changed from vertical to horizontal
      align: "auto",
      top: 25, // Position from top
      left: "center", // Center horizontally
      formatter: function (name) {
        return name;
      },
      data: listCategories,
      textStyle: {
        fontSize: 12,
        overflow: "truncate",
      },
      pageButtonPosition: "end", // Position of scroll buttons
      pageButtonGap: 5, // Gap between scroll buttons
      pageButtonItemGap: 5, // Gap between button and text
      padding: [5, 10], // Add some padding [vertical, horizontal]
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        magicType: {
          type: ["line", "bar"],
          title: {
            line: "Switch to Line Chart",
            bar: "Switch to Bar Chart",
          },
        },
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      name: "Period",
      nameLocation: "middle", // 'start', 'middle' or 'end'
      nameGap: 55, // Adjust the gap between name and axis
      nameTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        padding: [15, 0, 0, 0], // Add padding [top, right, bottom, left]
      },
      boundaryGap: true, // true for bar charts, false for line charts
      data: periode,
      axisLabel: {
        rotate: 45,
        interval: 0,
        margin: 15, // Distance between axis labels and axis line
      },
      axisTick: {
        alignWithLabel: true, // Align ticks with labels
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Total Nilai Losses",
        position: "left",
        axisLine: {
          show: true,
          lineStyle: {
            color: mainChartColors[0], // Color for total_nilai_losses axis
          },
        },
        axisLabel: {
          formatter: "{value} kCal/kWh",
        },
      },
      {
        type: "value",
        name: "Generator Gross Output",
        position: "right",
        axisLine: {
          show: true,
          lineStyle: {
            color: mainChartColors[1], // Color for generator_gross_output axis
          },
        },
        axisLabel: {
          formatter: "{value} MW",
        },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        xAxisIndex: 0,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
        bottom: 60, // Adjust this value to move dataZoom up
        height: 20, // Control the height of the slider
        borderColor: "transparent",
      },
    ],
    graphic: [
      {
        type: "group",
        left: "center",
        top: "middle",
        children: [
          {
            type: "text",
            style: {
              text: isDataEmpty ? "No data available" : "",
              font: "14px sans-serif",
              fill: theme === "dark" ? "#fff" : "#999",
            },
            silent: true,
          },
        ],
      },
    ],
    series: seriesData,
  };

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
          theme={echartsTheme}
          className="rounded-md p-4 min-h-[75dvh]"
          onEvents={onEvents}
        />

        {selectedSeries && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedSeries(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end items-center mb-4">
                {/* <h3 className="text-xl font-semibold">
                  Detailed Analysis: {selectedSeries.clickedName}
                </h3> */}
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSelectedSeries(null)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div
                className="relative w-full"
                style={{ height: "calc(70vh - 4rem)" }}
              >
                <div className="absolute inset-0">
                  <ReactECharts
                    option={getModalChartOptions(selectedSeries)}
                    theme={echartsTheme}
                    style={{ height: "100%", width: "100%" }}
                    onEvents={onModalEvents}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedPareto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedPareto(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[140dvh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end items-center mb-4">
                {/* <h3 className="text-xl font-semibold">
                  Detailed Analysis: {selectedSeries.clickedName}
                </h3> */}
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSelectedPareto(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div
                className="relative w-full"
                style={{ height: "calc(70vh - 4rem)" }}
              >
                <div className="absolute inset-0">
                  <MultipleLineChart
                    data={chartParetoDataWithCumFeq}
                    summaryData={summaryData}
                    paretoData={paretoData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={() => setSelectedCategory(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedCategory.name} - Component Analysis
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSelectedCategory(null)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="h-[70vh]">
                <ReactECharts
                  option={getCategoryChartOptions(selectedCategory)}
                  theme={echartsTheme}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
