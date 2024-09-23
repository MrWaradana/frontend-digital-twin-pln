"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import MultipleLineChart from "@/components/efficiency-app/nett-plant-heat-rate/MultipleLineChart";
import BarChartNPHR from "@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR";

export default function Page() {
  const [percentageThreshold, setPercentageThreshold] = useState(100);
  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      <div>
        <BarChartNPHR />
      </div>
    </EfficiencyContentLayout>
  );
}
