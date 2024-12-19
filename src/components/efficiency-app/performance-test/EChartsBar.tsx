import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { formattedNumber } from "@/lib/formattedNumber";
import { offsetPositive } from "recharts/types/util/ChartUtils";
import { useRouter } from "next/navigation";

export default function EChartsBar({
  data,
  selectedLabel,
  isLoadingPerformanceGroup,
}) {
  const router = useRouter();
  // Define fixed performance weight categories
  const fixedCategories = [40, 50, 60, 70, 80, 90, 95];

  // Create a map of existing data
  const dataMap = new Map(
    data.map((item) => [item.performance_weight, item.total_nilai_losses])
  );

  // Create complete dataset with zeros for missing categories
  const completeData = fixedCategories.map((weight) => {
    const value = dataMap.get(weight);
    const originalDataPoint = data.find(
      (item) => item.performance_weight === weight
    );
    return {
      performance_weight: weight,
      total_nilai_losses: !value || value === 0 ? null : value,
      id: originalDataPoint?.id, // Store the id from original data
    };
  });

  const handleChartClick = (params) => {
    const dataIndex = params.dataIndex;
    const clickedPoint = completeData[dataIndex];

    if (clickedPoint && clickedPoint.id) {
      // Navigate to the dynamic route with the data id
      router.push(
        `/efficiency-app/${clickedPoint.id}/pareto?percent-threshold=${clickedPoint.performance_weight}&potential-timeframe=1`
      );
    }
  };

  const onChartReady = (echarts) => {
    echarts.getZr().on("click", (params) => {
      handleChartClick(params);
    });
  };

  const colors = [
    "#60A5FA", // blue-400
    "#34D399", // emerald-400
    "#F472B6", // pink-400
    "#A78BFA", // violet-400
    "#FBBF24", // amber-400
  ];

  const series = {
    type: "line",
    smooth: 0,
    barGap: "10%",
    connectNulls: false, // This ensures the line breaks at null values
    barCategoryGap: "20%",
    // data: completeData.map((item: any) => item.total_nilai_losses),
    data: data.map((item: any) => item.total_nilai_losses),
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      cursor: "pointer", // Add pointer cursor to indicate clickable
    },
    lineStyle: {
      color: "#5470C6",
      width: 5,
    },
    // Add label configuration here
    label: {
      show: true,
      position: "top",
      formatter: function (params) {
        return params.value
          ? `${formattedNumber(params.value.toFixed(2))} kCal/kWh`
          : "";
      },
      fontSize: 12,
      color: "#666",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      padding: [4, 8],
      borderRadius: 4,
      distance: 10,
    },
    // areaStyle: {
    //   opacity: 0.8,
    //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //     {
    //       offset: 0,
    //       color: "#FD0100",
    //     },
    //     {
    //       offset: 1,
    //       color: "rgb(108, 255, 105)",
    //     },
    //   ]),
    // },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  };

  const option = {
    title: {
      text: `${selectedLabel} Performance Test Results`,
      left: "center",
      top: "26px",
      textStyle: {
        fontSize: 24,
        fontWeight: "normal",
      },
      subtextStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        if (!params[0].value) return `Load ${params[0].axisValue}<br/>No Data`;
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          result += `${formattedNumber(param.value.toFixed(2))} kCal/kWh <br/>`;
        });
        return result;
      },
    },
    // legend: {
    //   top: "80px",
    //   data: series.map((s) => s.name),
    //   textStyle: {
    //     fontSize: 12,
    //   },
    // },
    grid: {
      top: "130px",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      name: "Load Level",
      nameLocation: "middle",
      nameGap: 25,
      // data: fixedCategories.map((w) => `${w}%`),
      data: data
        .sort((a, b) => a.performance_weight - b.performance_weight)
        .map((item: any) => item.performance_weight),
      axisLabel: {
        fontSize: 14,
      },
    },
    yAxis: {
      type: "value",
      name: "Nilai Loss (kCal/kWh)",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: {
        formatter: `{value}`,
        fontSize: 12,
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: "Save as Image",
        },
        dataView: {
          title: "Data View",
          lang: ["Data View", "Close", "Refresh"],
        },
        dataZoom: {
          title: {
            zoom: "Zoom",
            back: "Zoom Reset",
          },
        },
        magicType: {
          title: {
            line: "Switch to Line",
            bar: "Switch to Bar",
            tiled: "Tiled",
          },
          type: ["line", "bar", "tiled"],
        },
      },
      top: "top",
      right: "20px",
    },
    series: series,
    animation: true,
    animationDuration: 1000,
    animationEasing: "cubicOut",
  };

  const { theme } = useTheme();
  const [echartsTheme, setEchartsTheme] = useState("light");

  useEffect(() => {
    setEchartsTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="w-full h-[67dvh] bg-card rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                Try selecting another performance group
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading or empty state if needed
  if (isLoadingPerformanceGroup) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="w-full h-[67dvh] bg-card rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">
                Loading performance data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="w-full h-[67dvh] bg-card rounded-2xl">
          <ReactECharts
            option={option}
            theme={echartsTheme}
            style={{ height: "100%", width: "100%" }}
            onEvents={{
              click: handleChartClick,
            }}
            onChartReady={onChartReady}
          />
        </div>
      </CardContent>
    </Card>
  );
}
