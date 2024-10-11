
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";

import CostBenefitContainer from "../../../components/efficiency-app/cost-benefit-analysis/CostBenefitContainer";

export default function CostBenefitAnalysisPage() {


  return (
    <EfficiencyContentLayout title={"Cost Benefit Analysis"}>
      <CostBenefitContainer />
    </EfficiencyContentLayout>
  );
}
