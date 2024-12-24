import { Slider } from "@nextui-org/react";
import * as echarts from "echarts";
import { useEffect, useRef, useMemo, useState } from "react";

const PredictChart2 = ({ dataRow }: { dataRow: any }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const alarm = useMemo(() => {
    return dataRow?.map((item: any) =>
      item.values?.map((value: any) => value.value).sort((a: number, b: number) => b - a)[0]
    )[0];
  }, [dataRow]);

  const [tripValue, setTripValue] = useState(alarm * 0.2);

  // Formatter untuk tanggal dan waktu lengkap
  const dateFormatter = new Intl.DateTimeFormat("id", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const values = useMemo(() => {
    if (!dataRow) return [];
    return dataRow.flatMap((item: any) =>
      item.values?.map((value: any) => ({
        category: value.date_time, // Simpan timestamp asli
        value: value.value,
        displayDate: dateFormatter.format(new Date(value.date_time))
      })) || []
    );
  }, [dataRow]);

  const predictions = useMemo(() => {
    if (!dataRow) return [];
    return dataRow.flatMap((item: any) =>
      item.predictions?.map((value: any) => ({
        category: value.date_time, // Simpan timestamp asli
        value: value.pfi_value,
        displayDate: dateFormatter.format(new Date(value.date_time))
      })) || []
    );
  }, [dataRow]);

  useEffect(() => {
    let myChart: echarts.ECharts | undefined;

    if (chartRef.current) {
      myChart = echarts.init(chartRef.current);

      const option = {
        grid: {
          left: '5%',
          right: '7%',
          bottom: '15%',
          top: '12%',
          containLabel: true
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          axisLabel: {
            formatter: (value: number) => {
              const date = new Date(value);
              return date.toLocaleDateString('id', {
                year: '2-digit',
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });
            },
            rotate: 45,
            interval: 'auto',
            showMaxLabel: true,
            hideOverlap: true,
            fontSize: 11
          },
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              opacity: 0.2
            }
          }
        },
        yAxis: {
          type: "value",
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            formatter: (value: number) => {
              return value.toFixed(2);
            }
          },
          min: (value: { min: number }) => (value.min < 0 ? value.min : 0)
        },
        legend: {
          data: ["Features", "Predictions", "Alarm", "Trip"],
          top: '2%'
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const date = new Date(params[0].value[0]);
            return dateFormatter.format(date) + '<br/>' +
              params.map((param: any) =>
                `${param.marker} ${param.seriesName}: <strong>${typeof param.value[1] === 'number' ? param.value[1].toFixed(2) : param.value[1]
                }</strong>`
              ).join('<br/>');
          }
        },
        series: [
          {
            name: "Features",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#1C9EB6",
              width: 2
            },
            symbol: 'none',
            data: values.map(item => [new Date(item.category).getTime(), item.value]),
            z: 2
          },
          {
            name: "Predictions",
            type: "line",
            smooth: true,
            lineStyle: {
              type: "dashed",
              color: "#62499D",
              width: 2
            },
            symbol: 'none',
            data: predictions.map(item => [new Date(item.category).getTime(), item.value]),
            z: 1
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
              label: {
                formatter: '{c}',
                position: 'start',
                backgroundColor: 'rgba(244, 156, 56, 0.2)',
                padding: [4, 8]
              },
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
              label: {
                formatter: '{c}',
                position: 'start',
                backgroundColor: 'rgba(226, 82, 63, 0.2)',
                padding: [4, 8]
              },
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
            filterMode: 'none',
            bottom: '2%',
            height: 20,
            borderColor: 'transparent',
            backgroundColor: '#e2e2e2',
            fillerColor: 'rgba(98, 73, 157, 0.2)',
            handleStyle: {
              color: '#0598ab'
            },
            labelFormatter: (value: number) => {
              const date = new Date(value);
              return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            }
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none',
            width: 20,
            right: '2%',
            borderColor: 'transparent',
            backgroundColor: '#e2e2e2',
            fillerColor: 'rgba(98, 73, 157, 0.2)',
            handleStyle: {
              color: '#0598ab'
            }
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
  }, [values, predictions, alarm, tripValue]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4 font-medium">Potential Failure Interval Chart</span>
      </div>
      <div className="flex gap-4 w-full h-60 sm:h-72 md:h-[400px] lg:h-[500px]">
        <div
          ref={chartRef}
          style={{ width: "100%", height: "100%" }}
          className="flex-grow"
        />
        <div className="flex items-center px-2">
          <Slider
            aria-label="Trip Value"
            step={0.1}
            maxValue={alarm}
            size="md"
            color="primary"
            orientation="vertical"
            value={tripValue}
            onChange={(val) => setTripValue(val as number)}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PredictChart2;