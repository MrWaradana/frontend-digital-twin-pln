// "use client";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import BarChartNPHR from "@/components/efficiency-app/nett-plant-heat-rate/BarChartNPHR";
import { Button, Link } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

export default function Page() {
  return (
    <EfficiencyContentLayout title="Nett Plant Heat Rate">
      {/* <Button
        as={Link}
        color="primary"
        startContent={
          <>
            <PlusIcon />
          </>
        }
        href="/efficiency-app/nett-plant-heat-rate/input-niaga"
      >
        Input Niaga
      </Button> */}
      <div>
        <BarChartNPHR />
      </div>
    </EfficiencyContentLayout>
  );
}
