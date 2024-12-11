import OverviewContainer from "@/components/containers/OverviewContainer";
import SimulateEachEquipmentContainer from "@/components/optimum-oh-app/simulate-each-equipment/SimulateEachEquipmentContainer";

export default function Page() {
  return (
    <OverviewContainer navbarTitle={`Optimum Overhaul`}>
      <SimulateEachEquipmentContainer />
    </OverviewContainer>
  );
}
