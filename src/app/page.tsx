import { Fragment } from "react";
import Image from "next/image";
import { Card, CardHeader, CardBody, Divider, Link } from "@nextui-org/react";
import Navbar from "@/components/Navbar";
import BGAllApps from "../../public/bg-all-apps.jpg";
import {
  AudioWaveform,
  HousePlug,
  TrendingUp,
  SquareAsterisk,
  Workflow,
  ChartNoAxesCombined,
  Grid2x2Check,
  SearchCheck,
  CircuitBoard,
} from "lucide-react";

export default async function Home() {
  const appList = [
    {
      name: "Efficiency App",
      url: "/efficiency-app",
      icon: <HousePlug size={48} />,
    },
    {
      name: "i-PFI App",
      url: "/pfi-app",
      icon: <AudioWaveform size={48} />,
    },
    {
      name: "Reliability Predicts App",
      url: "/#",
      icon: <TrendingUp size={48} />,
    },
    {
      name: "Risk Matrix App",
      url: "/#",
      icon: <SquareAsterisk size={48} />,
    },
    {
      name: "RBD App",
      url: "/#",
      icon: <Workflow size={48} />,
    },
    {
      name: "LCCA App",
      url: "/#",
      icon: <ChartNoAxesCombined size={48} />,
    },
    {
      name: "Optimum OH App",
      url: "/#",
      icon: <Grid2x2Check size={48} />,
    },
    {
      name: "i-RCFA App",
      url: "/#",
      icon: <SearchCheck size={48} />,
    },
    {
      name: "AHM App",
      url: "/#",
      icon: <CircuitBoard size={48} />,
    },
  ];

  return (
    <Fragment>
      <Navbar />
      <div className="flex justify-center items-start min-h-[100dvh] relative">
        <div className="absolute w-full h-full overflow-hidden top-0 left-0">
          <Image
            src={BGAllApps}
            alt={`background-all-apps`}
            className={`w-full`}
          />
        </div>
        <div className="absolute inset-0 w-full h-full bg-black/60"></div>
        <Card className={`w-full rounded-none bg-transparent`}>
          <CardHeader className="bg-blue-400 rounded-none flex justify-center w-full text-center">
            <h1 className="font-semibold text-xl text-center text-white">
              Pilih Aplikasi
            </h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {appList.map((item, index) => {
                return (
                  <Link
                    key={`${item}-${index}`}
                    href={`${item.url}`}
                    className="h-[170px] w-full hover:bg-yellow-300 bg-white/70 text-black border-blue-400 transition ease px-6 py-4 rounded-lg border flex flex-col gap-6 justify-center items-center"
                  >
                    {item.icon}
                    <p className="text-base font-normal leading-tight">
                      {item.name}
                    </p>
                  </Link>
                );
              })}
            </section>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  );
}
