import OverviewContainer from "@/components/containers/OverviewContainer";
import HomeContainer from "@/components/optimum-oh-app/HomeContainer";

export default async function Page() {
  return (
    <OverviewContainer navbarTitle={`Optimum Overhaul`}>
      <HomeContainer />
    </OverviewContainer>
  );
}
