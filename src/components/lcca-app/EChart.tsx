import ReactECharts from "echarts-for-react";

interface EchartExampleProps {}

export default function EchartExample(props: EchartExampleProps) {
  const {} = props;

  const xAxisData = [
    "00:00",
    "01:15",
    "02:30",
    "03:45",
    "05:00",
    "06:15",
    "07:30",
    "08:45",
    "10:00",
    "11:15",
    "12:30",
    "13:45",
    "15:00",
    "16:15",
    "17:30",
    "18:45",
    "20:00",
    "21:15",
    "22:30",
    "23:45",
  ];

  const chartOption = {
    title: {
      text: "Distribution of Something",
      subtext: "Fake Data",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
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
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} W",
      },
      axisPointer: {
        snap: true,
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: 6,
          color: "green",
        },
        {
          gt: 6,
          lte: 8,
          color: "green",
        },
        {
          gt: 8,
          lte: 14,
          color: "green",
        },
        {
          gt: 14,
          lte: 17,
          color: "green",
        },
        {
          gt: 17,
          color: "green",
        },
      ],
    },
    series: [
      {
        name: "Bar",
        data: [
          300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500,
          600, 750, 800, 700, 600, 400,
        ],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
      {
        name: "Electricity Down",
        type: "line",
        smooth: true,
        // prettier-ignore
        data: xAxisData.map((year, index) => {
                    const totalPoints = xAxisData.length - 1;
                    const progress = index / totalPoints;  // 0 to 1
                    const y = Math.round(2000 * (1 - progress * progress));  // Curve formula

                    return y
                }),
      },
      {
        name: "Electricity Up",
        type: "line",
        smooth: true,
        // prettier-ignore
        data: xAxisData.map((year, index) => {
                    const maxValue = 2000;
                    const minValue = 1;
                    const progress = index / (xAxisData.length - 1);  // 0 to 1
                    const value = Math.round(minValue + (maxValue - minValue) * (progress * progress));

                    return value;
                }),
        markArea: {
          itemStyle: {
            color: "rgba(255, 173, 177, 0.4)",
          },
          data: [
            [
              {
                name: "Intersection",
                xAxis: "16:15",
              },
              {
                xAxis: "17:30",
              },
            ],
          ],
        },
      },
    ],
  };

  return <ReactECharts option={chartOption}></ReactECharts>;
}