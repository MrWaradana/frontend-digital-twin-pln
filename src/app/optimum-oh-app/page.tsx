import { Crosshair, Cog, Calendar } from "lucide-react";
import OverviewContainer from "@/components/containers/OverviewContainer";
import { Button } from "@nextui-org/react";
import Engine from "@/components/optimum-oh-app/Engine";

export default async function Page() {
  return (
    <OverviewContainer navbarTitle={`Optimum Overhaul`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-3 bg-white rounded-3xl shadow-xl h-[80dvh] w-full p-8">
          {/* above image */}
          <div className={`flex flex-row justify-between`}>
            <div className="flex flex-row gap-12">
              <div className="flex flex-col gap-2 justify-center h-[7dvh] w-fit ">
                <p className="text-neutral-400">Number of equip needs to OH:</p>
                <p className={`text-2xl font-semibold text-black`}>30</p>
              </div>
              <div className="flex flex-col gap-2 justify-center h-[7dvh] w-fit p-4">
                <p className="text-neutral-400">Nearest OH Schedule:</p>
                <p className={`text-2xl font-semibold text-black`}>
                  {new Date().toLocaleDateString("id", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Button
                className={`bg-[#1C9EB6] text-white`}
                startContent={<Crosshair />}
                size={"lg"}
              >
                Scope OH
              </Button>
              <Button
                className={`bg-[#1C9EB6] text-white`}
                startContent={<Cog />}
                size={"lg"}
              >
                Calculate OH
              </Button>
            </div>
          </div>
          {/* Image Engine */}
          <div className="h-[65dvh] relative">
            <Engine />
          </div>
        </div>
        <div className="col-span-1 h-[80dvh] w-full flex flex-col gap-6">
          <div className={`bg-white rounded-3xl shadow-xl w-full h-1/2 p-12`}>
            <p className={`text-3xl font-semibold mb-4`}>
              Top 5 Critical Part:
            </p>
            <ol className="list-decimal list-inside text-neutral-500">
              <li className={`mb-4`}>Boiler Feed Pump</li>
              <li className={`mb-4`}>Boiler Reheater System</li>
              <li className={`mb-4`}>Drum Level (Right) Root Valve A</li>
              <li className={`mb-4`}>BCP A Discharge Velve</li>
              <li className={`mb-4`}>BFPT A EXH Press HI Root VLV</li>
            </ol>
          </div>
          <div
            className={`bg-white rounded-3xl shadow-xl w-full h-1/2 p-12 flex flex-col justify-between`}
          >
            <div className={`flex flex-row`}>
              <p className={`text-3xl font-semibold mb-4`}>
                Upcoming OH Schedules:
              </p>
              <Button
                className={`text-white bg-[#1C9EB6]`}
                startContent={<Calendar size={128} width={15} />}
              >
                Date
              </Button>
            </div>
            <div className="flex flex-row justify-between items-end">
              <p className="text-neutral-400">Scope</p>
              <p
                className={`text-[7rem] text-[#1C9EB6] font-semibold mb-0 leading-tight`}
              >
                B
              </p>
            </div>
          </div>
        </div>
      </div>
    </OverviewContainer>
  );
}
