import OverviewContainer from "@/components/containers/OverviewContainer";
import TargetReliabilityContainer from "@/components/optimum-oh-app/TargetReliabilityContainer";

export default function Page() {
  return (
    <OverviewContainer navbarTitle={`Optimum Overhaul`}>
      <TargetReliabilityContainer />
    </OverviewContainer>
  );
}
