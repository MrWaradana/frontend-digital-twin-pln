import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

export default function EChartsBar({ data, selectedLabel }) {
  // Define fixed performance weight categories
  const fixedCategories = [40, 50, 60, 70, 80, 90, 95];

  // Create a map of existing data
  const dataMap = new Map(
    data.map((item) => [item.performance_weight, item.total_nilai_losses])
  );

  // Create complete dataset with zeros for missing categories
  const completeData = fixedCategories.map((weight) => ({
    performance_weight: weight,
    total_nilai_losses: dataMap.get(weight) || 0,
  }));

  const colors = [
    "#60A5FA", // blue-400
    "#34D399", // emerald-400
    "#F472B6", // pink-400
    "#A78BFA", // violet-400
    "#FBBF24", // amber-400
  ];

  const series = {
    type: "bar",
    barGap: "10%",
    barCategoryGap: "20%",
    data: completeData.map((item) => item.total_nilai_losses),
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
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
      subtext: "Parameter Comparison Across Load Levels",
      left: "center",
      top: "20px",
      textStyle: {
        fontSize: 24,
        fontWeight: "normal",
      },
      subtextStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        let result = `${params[0].axisValue}%<br/>`;
        params.forEach((param) => {
          result += `${param.value}<br/>`;
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
      nameGap: 35,
      data: fixedCategories.map((w) => `${w}%`),
      axisLabel: {
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      name: "Nilai Loss (kCal/kWh)",
      nameLocation: "middle",
      nameGap: 50,
      axisLabel: {
        formatter: "{value}",
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
            stack: "Stack",
            tiled: "Tiled",
          },
          type: ["line", "bar", "stack", "tiled"],
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

  return (
    <Card className="w-full shadow-lg">
      <CardContent>
        <div className="w-full h-[600px] bg-card rounded-lg">
          <ReactECharts
            option={option}
            theme={echartsTheme}
            style={{ height: "100%", width: "100%" }}
            className="p-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}
