import TableParetoHeatlossCost from "@/components/efficiency-app/cost-benefit-analysis/TableParetoHeatlossCost";
import { EfficiencyContentLayout } from "../../../containers/EfficiencyContentLayout";

export default function Page() {
  return (
    <EfficiencyContentLayout title={"Cost Benefit Analysis"}>
      <TableParetoHeatlossCost />
    </EfficiencyContentLayout>
  );
}
