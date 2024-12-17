import { color } from "echarts";
import ReactECharts from "echarts-for-react";

export default function ChartLinebar({ chartData, minSeq }: any) {
  const xAxisData = chartData.map((item) => {
    return item.tahun;
  });

  const chartOption = {
    // title: {
    //   text: "Distribution of Something",
    //   subtext: "Fake Data",
    // },
    grid: {
      left: "3%",
      right: "3%",
      top: "3%",
      bottom: "5%",
      containLabel: true,
    },
    legend: {
      top: "bottom",
      data: ["Annualized Acquisition Cost", "Annualized O&M Cost", "EAC"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: function (params) {
        let result = `Day: ${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          // Get the color of the line
          const color = param.color;
          // Format large numbers with commas and fixed decimal places
          const value = new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(param.value);
          // Add colored dot using the series color
          result += `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${
            param.seriesName == "Annualized O&M Cost"
              ? "#A2DE32"
              : param.seriesName == "Annualized Acquisition Cost"
              ? "#F7ED53"
              : color
          };margin-right:5px;"></span>${param.seriesName}: Rp.${value}<br/>`;
        });
        return result;
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      // prettier-ignore
      data: xAxisData,
      axisLabel: {
        interval: 0,
        formatter: (value, index) => {
          const currentYear = new Date().getFullYear().toString();
          const minData = chartData.filter((item) => item.seq == minSeq);
          if (String(value) === currentYear) {
            return `{blue|${value}}`; // Current year: blue and bold
          }
          if (String(value) <= currentYear) {
            return `{bold|${value}}`; // Years up to and including minSeq: bold
          }
          if (String(value) > currentYear) {
            return `{light|${value}}`; // Years up to and including minSeq: bold
          }
          return value; // Other years: normal
        },
        rich: {
          blue: {
            color: "#4169E1",
            fontWeight: "bold",
          },
          bold: {
            fontWeight: "bold",
          },
          light: {
            color: "#B2B2B2",
            fontWeight: "200",
          },
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        inside: false,
        formatter: (value) => {
          return (
            new Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value / 1000000) + " Jt"
          );
        },
      },
      axisPointer: {
        snap: true,
      },
    },
    // visualMap: {
    //   show: false,
    //   dimension: 0,
    //   pieces: [
    //     {
    //       lte: 6,
    //       color: "green",
    //     },
    //     {
    //       gt: 6,
    //       lte: 8,
    //       color: "green",
    //     },
    //     {
    //       gt: 8,
    //       lte: 14,
    //       color: "green",
    //     },
    //     {
    //       gt: 14,
    //       lte: 17,
    //       color: "green",
    //     },
    //     {
    //       gt: 17,
    //       color: "green",
    //     },
    //   ],
    // },
    series: [
      {
        name: "Annualized O&M Cost",
        data: chartData.map((item) => {
          return item.eac_annual_mnt_cost;
        }),
        type: "bar",
        itemStyle: {
          color: new Function(`return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#A2DE32' // Start color
                }, {
                  offset: 1,
                  color: '#42C023' // End color
                }],
                global: false
              }`)(),
        },
        // showBackground: true,
        // backgroundStyle: {
        //   color: "rgba(180, 180, 180, 0.2)",
        // },
      },

      {
        name: "Annualized Acquisition Cost",
        data: chartData.map((item) => {
          return item.eac_annual_acq_cost;
        }),
        type: "bar",
        itemStyle: {
          color: new Function(`return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#F7ED53' // Start color
                  }, {
                    offset: 1,
                    color: '#D4CA2F' // End color
                  }],
                  global: false
                }`)(),
        },
        // showBackground: true,
        // backgroundStyle: {
        //   color: "rgba(180, 180, 180, 0.2)",
        // },
      },
      {
        name: "EAC",
        type: "line",
        smooth: false,
        data: chartData.map((item) => {
          return item.eac_eac;
        }),
        symbolSize: 6,
        itemStyle: {
          color: "#D93832",
        },
        lineStyle: {
          width: 2,
          color: "#D93832",
        },
        // areaStyle: {
        //   opacity: 0.2,
        // },
        emphasis: {
          focus: "series",
          symbolSize: 8,
        },
        markPoint: {
          symbol:
            "path://M0,0 L100,0 Q120,0 120,20 L120,40 Q120,60 100,60 L60,60 L50,75 L40,60 L0,60 Q-20,60 -20,40 L-20,20 Q-20,0 0,0",
          symbolSize: [120, 40],
          symbolOffset: [0, -25],
          itemStyle: {
            color: "#28C840", // Green color matching your image
          },
          silent: true, // Disables hover interactions
          emphasis: {
            scale: 1, // Prevents scaling on hover
          },
          label: {
            formatter: "Minimum Eac",
            position: "inside",
            color: "#fff",
            distance: 10,
            fontSize: 18,
            fontWeight: "semibold",
          },
          data: [
            {
              type: "min",
              name: "Minimum Eac",
            },
          ],
        },
        markLine: {
          label: {
            formatter: "Minimum EAC: {c}",
          },
          symbol: ["none", "none"],
          lineStyle: {
            color: "#D93832",
            type: "dashed",
          },
          data: [
            {
              xAxis: minSeq, // This will create a vertical line at minSeq year
              label: {
                show: false,
                position: "middle",
              },
            },
          ],
        },
      },

      //   {
      //     name: "Electricity Up",
      //     type: "line",
      //     smooth: true,
      //     // prettier-ignore
      //     data: xAxisData.map((year, index) => {
      //                     const maxValue = 2000;
      //                     const minValue = 1;
      //                     const progress = index / (xAxisData.length - 1);  // 0 to 1
      //                     const value = Math.round(minValue + (maxValue - minValue) * (progress * progress));

      //                     return value;
      //                 }),
      //     markArea: {
      //       itemStyle: {
      //         color: "rgba(255, 173, 177, 0.4)",
      //       },
      //       data: [
      //         [
      //           {
      //             name: "Intersection",
      //             xAxis: "16:15",
      //           },
      //           {
      //             xAxis: "17:30",
      //           },
      //         ],
      //       ],
      //     },
      //   },
    ],
  };

  return (
    <ReactECharts
      option={chartOption}
      style={{ minHeight: "50dvh" }}
    ></ReactECharts>
  );
}
