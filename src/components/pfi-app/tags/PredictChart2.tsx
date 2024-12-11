import { Slider } from "@nextui-org/react";
import * as echarts from "echarts";
import { useEffect, useRef, useMemo, useState } from "react";

const PredictChart2 = ({ dataRow }: { dataRow: any }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const alarm = useMemo(() => {
    return dataRow?.map((item: any) =>
      item.values?.map((value: any) => value.value).sort((a: number, b: number) => b - a)[0]
    )[0];
  }, [
    dataRow,
  ]);

  const [tripValue, setTripValue] = useState(alarm * 0.2);

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
          data: ["Features", "Predictions", "Alarm", "Trip"],
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
            data: values.map((item: { category: any; value: any; }) => [item.category, item.value]),
          },
          {
            name: "Predictions",
            type: "line",
            lineStyle: {
              type: "dashed",
              color: "#62499D",
            },
            data: predictions.map((item: { category: any; value: any; }) => [item.category, item.value]),
          },
          {
            name: 'Alarm',
            type: 'line',
            lineStyle: {
              color: "#F49C38",
            },
            markLine: {
              silent: true,
              symbol: 'none',
              data: [{
                yAxis: alarm,
                lineStyle: {
                  color: '#F49C38',
                  type: 'dashed',
                  width: 2
                }
              }]
            }
          },
          {
            name: 'Trip',
            type: 'line',
            lineStyle: {
              color: "#E2523F",
            },
            markLine: {
              silent: true,
              symbol: 'none',
              data: [{
                yAxis: tripValue,
                lineStyle: {
                  color: '#E2523F',
                  type: 'dashed',
                  width: 2
                }
              }]
            }
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
  }, [values, predictions, tripValue]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Potential Failure Interval Chart</span>
      </div>
      <div className="flex gap-4 w-full h-60 sm:h-72 md:h-[400px] lg:h-[500px]">
        <div
          ref={chartRef}
          style={{ width: "100%", height: "100%" }}
          className="flex-grow"
        />
        <div className="flex items-center px-2">
          <Slider
            aria-label="Volume"
            step={10}
            maxValue={alarm}
            size="md"
            color="primary"
            orientation="vertical"
            value={tripValue}
            onChange={(val) => setTripValue(val as number)}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictChart2;
