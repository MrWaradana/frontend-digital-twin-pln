import Image from "next/image";
import EngineFlow from "../../../../public/engine-flow.png";
import { Tooltip, Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { EfficiencyContentLayout } from "../../../containers/EfficiencyContentLayout";

export default function Page() {
  return (
    <EfficiencyContentLayout title="Engine Flow">
      <div className="w-full flex flex-col gap-6 justify-center items-center m-2">
        <div className="relative">
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Custom Content</div>
                <div className="text-tiny">
                  This is a custom tooltip content
                </div>
                <Button as={Link} href={`#`} size="sm" color="primary">
                  Pareto Heat Loss
                </Button>
              </div>
            }
          >
            <Button
              variant="solid"
              color="primary"
              className="absolute top-20 left-36"
            >
              LPT
            </Button>
          </Tooltip>
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Custom Content</div>
                <div className="text-tiny">
                  This is a custom tooltip content
                </div>
                <Button as={Link} href={`#`} size="sm" color="primary">
                  Pareto Heat Loss
                </Button>
              </div>
            }
          >
            <Button
              variant="solid"
              color="primary"
              size="sm"
              className="absolute top-[5.5rem] left-[25rem] "
            >
              IPT
            </Button>
          </Tooltip>
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Custom Content</div>
                <div className="text-tiny">
                  This is a custom tooltip content
                </div>
                <Button as={Link} href={`#`} size="sm" color="primary">
                  Pareto Heat Loss
                </Button>
              </div>
            }
          >
            <Button
              variant="solid"
              color="primary"
              size="sm"
              className="absolute top-[5.5rem] right-64 "
            >
              HPT
            </Button>
          </Tooltip>
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Custom Content</div>
                <div className="text-tiny">
                  This is a custom tooltip content
                </div>
                <Button as={Link} href={`#`} size="sm" color="primary">
                  Pareto Heat Loss
                </Button>
              </div>
            }
          >
            <Button
              variant="solid"
              color="primary"
              size="md"
              className="absolute bottom-5 right-2 "
            >
              Coal Fire Burner
            </Button>
          </Tooltip>
          <Image src={EngineFlow} alt="engine-flow" className="w-full" />
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
