import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  annotationPlugin
);

const DistributionChart = ({ X, Y, current, yCurrent, theme = "light" }) => {
  // Insert yCurrent into the Y array at the current index
  const YWithCurrent = [...Y];
  const currentIndex = X.indexOf(current);
  if (currentIndex !== -1) {
    YWithCurrent[currentIndex] = yCurrent; // Update the Y array with yCurrent at the current index
  }

  if (X.length !== YWithCurrent.length || X.length < 2) {
    return (
      <div className="text-red-500 font-semibold text-center">
        Error: X and Y must contain at least 2 points each with matching
        lengths.
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
  };

  const straightLineY = [
    { x: X[0], y: YWithCurrent[0] },
    { x: X[X.length - 1], y: YWithCurrent[YWithCurrent.length - 1] },
  ];

  const data = {
    labels: X,
    datasets: [
      {
        label: "Instant Probability of Failure",
        data: YWithCurrent,
        fill: false,
        borderColor: theme === "dark" ? "#1C9EB6" : "#1C9EB6",
        tension: 0.6,
        pointRadius: 2,
        pointBackgroundColor: theme === "dark" ? "#1C9EB6" : "#1C9EB6",
        borderWidth: 2,
        hoverBackgroundColor: theme === "dark" ? "#FF6F61" : "#FF5733",
        hoverRadius: 4,
      },
      {
        data: straightLineY,
        fill: false,
        borderColor: "#B3B3B3",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipStyle.backgroundColor,
        titleColor: tooltipStyle.color,
        bodyColor: tooltipStyle.color,
        callbacks: {
          title: (tooltipItem) => {
            const label = tooltipItem[0]?.label;
            return `Time: ${
              label && !isNaN(label) ? Number(label).toFixed(2) : label
            }`;
          },
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `Probability: ${Number(value).toExponential(2)}`;
          },
        },
      },
      annotation: {
        annotations: [
          {
            type: "line",
            xMin: current,
            xMax: current,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
          {
            type: "label",
            position: "center",
            xValue: current,
            content: `Current: ${current.toFixed(2)}`,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
            font: {
              weight: "bold",
              size: 12,
              family: "Arial, sans-serif",
            },
            borderRadius: 8,
            padding: 8,
            yAdjust: -100,
          },
          {
            type: "label",
            position: "center",
            xValue: current,
            yValue: yCurrent,
            content: `Y = ${yCurrent}`,
            color: theme === "dark" ? "#fff" : "#333",
            font: {
              weight: "bold",
              size: 12,
              family: "Arial, sans-serif",
            },
            borderRadius: 8,
            padding: 8,
          },
        ],
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        ticks: {
          callback: (value) => Math.round(value),
          autoSkip: false,
          maxRotation: 0,
          stepSize: Math.max(1, (Math.max(...X) - Math.min(...X)) / 5),
        },
        min: Math.min(...X),
        max: Math.max(...X),
        title: {
          display: true,
          text: "Time since last failure (days)",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            const valueStr = value.toString();
            const decimalIndex = valueStr.indexOf(".");

            if (decimalIndex !== -1 && valueStr.length - decimalIndex - 1 > 2) {
              return value.toExponential(2);
            }

            return value.toFixed(2);
          },
        },
        title: {
          display: true,
          text: "Instant probability of failure",
        },
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-full pt-4">
      <Line data={data} options={options} height={280} />
    </div>
  );
};

export default DistributionChart;
