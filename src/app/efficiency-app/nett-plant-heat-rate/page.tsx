// "use client";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import BarChartNPHR from "@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR";

export default function Page() {
  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      <div>
        <BarChartNPHR />
      </div>
    </EfficiencyContentLayout>
  );
}
