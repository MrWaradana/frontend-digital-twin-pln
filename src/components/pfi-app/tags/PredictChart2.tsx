import * as echarts from "echarts";
import { useEffect, useRef, useMemo } from "react";

const PredictChart2 = ({ dataRow }: { dataRow: any }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const formatter = new Intl.DateTimeFormat("id", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const values = useMemo(() => {
    if (!dataRow) return [];
    return dataRow.flatMap((item: any) =>
      item.values?.map((value: any) => ({
        category: formatter.format(new Date(value.date_time)),
        value: value.value,
      })) || []
    );

  }, [dataRow]);

  const predictions = useMemo(() => {
    if (!dataRow) return [];
    return dataRow.flatMap((item: any) =>
      item.predictions?.map((value: any) => ({
        category: formatter.format(new Date(value.date_time)),
        value: value.pfi_value,
      })) || []
    );
  }, [dataRow]);

  useEffect(() => {
    let myChart: echarts.ECharts | undefined;

    if (chartRef.current) {
      myChart = echarts.init(chartRef.current);

      const option = {
        xAxis: {
          type: "category",
          data: [...values, ...predictions].map((item) => item.category),
          boundaryGap: false,
          axisLabel: {
            formatter: (value: string) => value, // Formatter langsung karena data sudah diformat
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: ["Actual", "Predictions"],
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) =>
            params
              .map(
                (data: any) =>
                  `${data.marker} ${data.seriesName} <br/>${data.axisValue}: <strong>${data.value[1]}</strong>`
              )
              .join("<br/>"),
        },
        series: [
          {
            name: "Actual",
            type: "line",
            lineStyle: {
              color: "#1C9EB6",
            },
            data: values.map((item) => [item.category, item.value]),
          },
          {
            name: "Predictions",
            type: "line",
            lineStyle: {
              type: "dashed",
              color: "#62499D",
            },
            data: predictions.map((item) => [item.category, item.value]),
          },
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none'
          }
        ]
      };

      myChart.setOption(option);

      const handleResize = () => {
        if (myChart) {
          myChart.resize();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (myChart) {
          myChart.dispose();
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [values, predictions]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Potential Failure Interval Chart</span>
      </div>
      <div className="w-full h-60 sm:h-72 md:h-[400px] lg:h-[500px]">
        <div
          ref={chartRef}
          style={{ width: "100%", height: "100%" }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PredictChart2;
