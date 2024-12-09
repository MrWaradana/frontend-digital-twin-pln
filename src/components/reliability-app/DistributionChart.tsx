import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

const DistributionChart = ({ X, Y, current, theme = "light" }) => {
  // Validasi jumlah data
  if (X.length !== Y.length || X.length < 2) {
    console.error(
      "X and Y must have the same length and contain at least 2 points."
    );
    return (
      <div>
        Error: X and Y must contain at least 2 points each with matching
        lengths.
      </div>
    );
  }

  const formatData = (xArray: number[], yArray: number[]) => {
    let formattedX: number[] = []; // Explicitly define the type as number[]
    let formattedY: number[] = [];
    const uniqueXMap: Map<number, number> = new Map();

    xArray.forEach((x, index) => {
      const roundedX = Math.round(x / 100) * 100;
      if (!uniqueXMap.has(roundedX)) {
        uniqueXMap.set(roundedX, index);
        formattedX.push(roundedX);
        formattedY.push(yArray[index]);
      }
    });

    return { X: formattedX, Y: formattedY };
  };

  const { X: formattedX, Y: formattedY } = formatData(X, Y);
  const maxX = Math.max(...formattedX);
  const minX = Math.min(...formattedX);

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
  };

  const adjustDomain = (min, max, current) => {
    let step = 100;
    if (max - min > 1000) {
      step = 500;
    }
    if (max - min > 5000) {
      step = 1000;
    }

    const adjustedMin = Math.floor(Math.min(min, current) / step) * step;
    const adjustedMax = Math.ceil(Math.max(max, current) / step) * step;

    return [adjustedMin, adjustedMax];
  };

  const domainX = adjustDomain(minX, maxX, current);

  const currentY =
    current !== null
      ? formattedY[formattedX.length - 1]
      : formattedY[formattedY.length - 1];
  const updatedX = [...formattedX, current].sort((a, b) => a - b);
  const updatedY = [...formattedY, currentY];

  return (
    <div
      style={{ width: "100%", height: "300px" }}
      className="flex justify-center items-start m-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={updatedX.map((xVal, idx) => ({
            x: xVal,
            y: updatedY[idx].toFixed(2),
          }))}
          margin={{ bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            name="Time since last failure (days)"
            stroke={theme === "dark" ? "#fff" : "#333"}
            tickFormatter={(value) => String(Math.round(value))}
            label={{
              value: "Time since last failure (days)",
              position: "bottom",
              offset: 5,
            }}
            domain={domainX}
            ticks={[...updatedX]}
          />
          <YAxis
            label={{
              value: "Instant probability of failure",
              angle: -90,
              position: "center",
              dx: -23,
            }}
            stroke={theme === "dark" ? "#fff" : "#333"}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(label, payload) => {
              const originalTime = payload[0]?.payload.x;
              return `Time: ${
                originalTime !== undefined ? originalTime : label
              }`;
            }}
            formatter={(value) => [`Probability: ${Number(value).toFixed(2)}`]}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke={theme === "dark" ? "#1C9EB6" : "#1C9EB6"}
            dot={{
              r: 2,
              fill: theme === "dark" ? "#1C9EB6" : "#1C9EB6",
            }}
            activeDot={{
              r: 2,
              fill: theme === "dark" ? "#FF6F61" : "#FF5733",
            }}
            strokeWidth={2}
          />
          {current !== null && (
            <ReferenceLine
              x={current}
              stroke={theme === "dark" ? "#FF6F61" : "#FF5733"}
              strokeDasharray="3 3"
              label={
                <Label
                  value={`Current: ${current.toFixed(2)}`}
                  position="insideTopRight"
                  fontWeight="bold"
                  fontSize={12}
                />
              }
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
