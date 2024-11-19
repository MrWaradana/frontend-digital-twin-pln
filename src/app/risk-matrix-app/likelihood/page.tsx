"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { name: "Dataset A", likelihood: 3.7, severity: 2.5, count: 50 },
  { name: "Dataset B", likelihood: 1.2, severity: 4.8, count: 75 },
  { name: "Dataset C", likelihood: 4.5, severity: 3.2, count: 30 },
  { name: "Dataset D", likelihood: 2.8, severity: 1.9, count: 20 },
  { name: "Dataset E", likelihood: 3.3, severity: 4.1, count: 100 },
];

const severityLevels = [1, 2, 3, 4, 5];

const processedData = severityLevels.map((severity) => {
  const obj = { name: `Severity ${severity}` };
  data.forEach((item) => {
    if (Math.floor(item.severity) === severity) {
      obj[item.name] = item.likelihood;
    }
  });
  return obj;
});

export default function LikelihoodBarChart() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Likelihood Distribution by Severity</CardTitle>
        <CardDescription>
          Bar chart showing likelihood for each dataset grouped by severity
          level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            "Dataset A": { label: "Dataset A", color: "#26355D" },
            "Dataset B": { label: "Dataset B", color: "#AF47D2" },
            "Dataset C": { label: "Dataset C", color: "#FF8F00" },
            "Dataset D": { label: "Dataset D", color: "#FFDB00" },
            "Dataset E": { label: "Dataset E", color: "#007F73" },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Likelihood",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {data.map((dataset, index) => (
                <Bar
                  key={dataset.name}
                  dataKey={dataset.name}
                  fill={`var(--color-${dataset.name
                    .toLowerCase()
                    .replace(" ", "-")})`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}