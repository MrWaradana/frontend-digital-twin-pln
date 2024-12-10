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

const DistributionChart = ({ X, Y, current, theme = "light" }) => {
  if (X.length !== Y.length || X.length < 2) {
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
    { x: X[0], y: Y[0] },
    { x: X[X.length - 1], y: Y[Y.length - 1] },
  ];

  const data = {
    labels: X,
    datasets: [
      {
        label: "Instant Probability of Failure",
        data: Y,
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
          title: (tooltipItem) => `Time: ${tooltipItem[0]?.label}`,
          label: (tooltipItem) =>
            `Probability: ${Number(tooltipItem.raw).toFixed(2)}`,
        },
      },
      annotation: {
        annotations: [
          {
            type: "line", // Explicitly set to "line"
            xMin: current,
            xMax: current,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
          {
            type: "label", // Explicitly set to "label"
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
    <div className="flex justify-center items-start w-full pt-4">
      <Line data={data} options={options} height={280} />
    </div>
  );
};

export default DistributionChart;
