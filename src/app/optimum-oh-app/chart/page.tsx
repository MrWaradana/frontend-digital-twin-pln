import OverviewContainer from "@/components/containers/OverviewContainer";
import ChartContainer from "@/components/optimum-oh-app/chart/ChartContainer";

export default function Page() {
  return (
    <OverviewContainer navbarTitle={`Optimum Overhaul`}>
      <ChartContainer />
    </OverviewContainer>
  );
}
