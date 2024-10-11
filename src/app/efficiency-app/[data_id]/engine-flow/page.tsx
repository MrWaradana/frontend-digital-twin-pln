'use client'

import Image from "next/image";
import EngineFlow from "../../../../../public/engine-flow.png";
import { Tooltip, Button, Link, CircularProgress } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { EfficiencyContentLayout } from "../../../../containers/EfficiencyContentLayout";
import { useGetDataEngineFlow } from "@/lib/APIs/useGetDataEngineFlow";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { data_id: string } }) {
  const { data: session, status } = useSession();


  const {
    data: engineFlow,
    isLoading,
    error,
  } = useGetDataEngineFlow(session?.user.access_token, params.data_id);

  const engineFlowData = engineFlow ?? {};

  const positions = {
    // Top row - turbines
    EG: { top: '13%', left: '6%' },
    LPT: { top: '7%', left: '19%' },
    IPT: { top: '9%', left: '44%' },
    HPT: { top: '12%', left: '69%' },

    // Bottom row - RH components
    RH7: { top: '83%', left: '17.7%' },
    RH6: { top: '83%', left: '26.6%' },
    RH5: { top: '83%', left: '35.5%' },
    RH3: { top: '83%', left: '51.6%' },
    RH2: { top: '83%', left: '61%' },
    RH1: { top: '83%', left: '70%' }
  };
  const formatValue = (value) => {
    if (value === undefined || value === null) return '-';
    return Number(value).toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  };


  if (isLoading)
    return (
      <EfficiencyContentLayout title="Input Form">
        <div className="flex justify-center mt-12">
          <CircularProgress color="primary" />
        </div>
      </EfficiencyContentLayout>
    );


  return (
    <EfficiencyContentLayout title="Engine Flow">
      <div className="w-full flex flex-col gap-6 justify-center items-center m-2">
        <div>
          <Button
            as={Link}
            href={`/efficiency-app`}
            className="mb-4"
            color="primary"
            size="sm"
            startContent={<ChevronLeftIcon size={16} />}
          >
            Back to all
          </Button>
        </div>
        <div className="relative">
          {/* EG */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">EG Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-24 left-6"
            ></Button>
          </Tooltip> */}
          {/* CON */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">CON Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-40 left-6"
            ></Button>
          </Tooltip> */}
          {/* CP */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">CP Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-24 left-24"
            ></Button>
          </Tooltip> */}
          {/* RH7 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH7 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 left-36"
            ></Button>
          </Tooltip> */}
          {/* RH6 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH6 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 left-56"
            ></Button>
          </Tooltip> */}
          {/* RH5 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH5 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 left-[19rem]"
            ></Button>
          </Tooltip> */}
          {/* RH4 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH4 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-20 left-[25rem]"
            ></Button>
          </Tooltip> */}
          {/* FWP */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">FWP Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 left-[25rem]"
            ></Button>
          </Tooltip> */}
          {/* RH3 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH3 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 left-[29rem]"
            ></Button>
          </Tooltip> */}
          {/* RH2 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH2 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 right-[21rem]"
            ></Button>
          </Tooltip> */}
          {/* RH1 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RH1 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-8 right-[16rem]"
            ></Button>
          </Tooltip> */}
          {/* LPT */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">LPT Content</div>
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
              variant="light"
              size="lg"
              className="absolute top-20 left-36"
            ></Button>
          </Tooltip> */}
          {/* IPT */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">IPT Content</div>
                <div className="text-tiny">This is IPT content</div>
                <Button as={Link} href={`#`} size="sm" color="primary">
                  Pareto Heat Loss
                </Button>
              </div>
            }
          >
            <Button
              variant="light"
              size="sm"
              className="absolute top-[5.5rem] left-[25rem] "
            ></Button>
          </Tooltip>
          {/* HPT */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">HPT Content</div>
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
              variant="light"
              size="md"
              className="absolute top-[5.5rem] right-64 "
            ></Button>
          </Tooltip> */} 
          {/* Valve 1 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 1 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-36 right-56 "
            ></Button>
          </Tooltip> */}
          {/* Valve 2 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 2 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-[13rem] right-[19rem]"
            ></Button>
          </Tooltip> */}
          {/* Valve 3 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 3 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-[13rem] right-[25rem]"
            ></Button>
          </Tooltip> */}
          {/* Valve 4 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 4 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-[13rem] right-[30rem]"
            ></Button>
          </Tooltip> */}
          {/* Valve 5 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 5 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-[13rem] left-[19rem]"
            ></Button>
          </Tooltip> */}
          {/* Valve 6 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 6 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-[10rem] left-[15rem]"
            ></Button>
          </Tooltip> */}
          {/* Valve 7 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Valve 7 Content</div>
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
              variant="light"
              size="sm"
              className="absolute top-[13rem] left-[8rem]"
            ></Button>
          </Tooltip> */}
          {/* Coal-fired boiler */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">
                  Coal-fired boiler Content
                </div>
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
              variant="light"
              size="lg"
              className="absolute bottom-5 right-6 " */}
            {/* ></Button>
          </Tooltip> */}
          {/* Furnace */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Furnace Content</div>
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
              variant="light"
              size="lg"
              className="absolute bottom-28 right-6 "
            ></Button>
          </Tooltip> */}
          {/* SH2 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">SH2 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-56 right-10 "
            ></Button>
          </Tooltip> */}
          {/* RHR */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">RHR Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-64 right-20 "
            ></Button>
          </Tooltip> */}
          {/* SH1 */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">SH1 Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-64 right-36"
            ></Button>
          </Tooltip> */}
          {/* ECO */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">ECO Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-48 right-36"
            ></Button>
          </Tooltip> */}
          {/* AP */}
          {/* <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">AP Content</div>
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
              variant="light"
              size="sm"
              className="absolute bottom-20 right-36"
            ></Button>
          </Tooltip> */}
          <Image src={EngineFlow} alt="engine-flow" className="w-full" />
          {Object.keys(positions).map((key) => (
            <div
              key={key}
              style={{
                top: positions[key].top,
                left: positions[key].left,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-10"
            >
              <div className="bg-white/5 backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         text-[14px] shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-125 hover:bg-white/80 hover:shadow-md
                         transition-all duration-200 ease-in-out cursor-pointer
                         transform origin-center" >

                <div className="font-semibold text-gray-700">{key}</div>
                <div className="text-blue-600">{formatValue(engineFlowData[key])}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
