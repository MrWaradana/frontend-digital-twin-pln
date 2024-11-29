import * as echarts from "echarts";
import { useEffect, useRef, useMemo } from "react";

const TimeDownChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const formatter = new Intl.DateTimeFormat("id", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  useEffect(() => {
    let myChart: echarts.ECharts | undefined;

    if (chartRef.current) {
      myChart = echarts.init(chartRef.current);

      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
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
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Count Down Chart</span>
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

export default TimeDownChart;
