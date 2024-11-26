import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";

const PredictChart2 = ({ dataRow }: { dataRow: any }) => {
  const chartRef = useRef(null); // Referensi ke elemen DOM untuk chart
  const [dropdownVisible, setDropdownVisible] = useState(false); // State untuk visibilitas dropdown
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 }); // Posisi dropdown
  const [clickedData, setClickedData]: any = useState(null); // Data dari elemen yang diklik


  let data: { name: string; value: (string | number)[] }[] = [];
  let now = new Date(1997, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let value = Math.random() * 1000;
  for (var i = 0; i < 1000; i++) {
    data.push(randomData());
  }

  function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value)
      ]
    };
  }

  useEffect(() => {
    let myChart;
    if (chartRef.current) {
      myChart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' : ' +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: 'Fake Data',
            type: 'line',
            showSymbol: false,
            data: data
          },
          {
            name: '2 Data',
            type: 'line',
            showSymbol: false,
            data: data
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

      setInterval(function () {
        for (var i = 0; i < 5; i++) {
          data.shift();
          data.push(randomData());
        }
        myChart.setOption({
          series: [
            {
              data: data
            }
          ]
        });
      }, 1000);

      // Render chart
      myChart.setOption(option);

      // Event handler untuk klik
      myChart.on("click", (params) => {
        if (params) {
          setClickedData(params); // Simpan data yang diklik
          setDropdownPosition({ x: params.event.offsetX, y: params.event.offsetY }); // Simpan posisi klik
          setDropdownVisible(true); // Tampilkan dropdown
        }
      });

      // Tangani resize untuk responsivitas
      const handleResize = () => {
        if (myChart) {
          myChart.resize();
        }
      };

      window.addEventListener("resize", handleResize);

      // Bersihkan saat komponen unmount
      return () => {
        if (myChart) {
          myChart.dispose();
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div className="col-span-2 flex flex-col items-center w-full">
      <div className="flex">
        <span className="text-center mb-4">Potential Failure Interval Chart</span>
      </div>
      <div className="w-full h-80 md:h-[400px] lg:h-[500px]">
        {/* Tempat untuk ECharts */}
        <div
          ref={chartRef}
          style={{ width: "100%", height: "100%" }}
          className="w-full h-80 md:h-[400px] lg:h-[500px]"
        />

      </div>
    </div>
  );
};

export default PredictChart2;
