import Navbar from "@/components/Navbar";
import { Card, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";
import Image from "next/image";
import { Fragment } from "react";
import BGAllApps from "../../public/bg-all-apps.jpg";

import ahmLogo from "../../public/icons/AHM App.png";
import efficiencyLogo from "../../public/icons/efficiency.png";
import pfiLogo from "../../public/icons/iPFI App.png";
import irfcaLogo from "../../public/icons/iRCFA App.png";
import lccLogo from "../../public/icons/LCC App.png";
import ohLogo from "../../public/icons/Optimum OH App.png";
import rdbLogo from "../../public/icons/RBD App.png";
import reliableLogo from "../../public/icons/Reliability Predict App.png";
import riskLogo from "../../public/icons/Risk Matrix App.png";

export default async function Home() {
  const appList = [
    {
      name: "Efficiency App",
      url: "/efficiency-app",
      icon: (
        <Image src={efficiencyLogo} alt="i-PFI App" width={175} height={175} />
      ),
    },
    {
      name: "i-PFI App",
      url: "/#",
      icon: <Image src={pfiLogo} alt="i-PFI App" width={175} height={175} />,
    },
    {
      name: "Reliability Predicts App",
      url: "/#",
      icon: (
        <Image
          src={reliableLogo}
          alt="reliable Logo App"
          width={175}
          height={175}
        />
      ),
    },
    {
      name: "Risk Matrix App",
      url: "/#",
      icon: <Image src={riskLogo} alt="i-PFI App" width={175} height={175} />,
    },
    {
      name: "RBD App",
      url: "/#",
      icon: <Image src={rdbLogo} alt="i-PFI App" width={175} height={175} />,
    },
    {
      name: "LCCA App",
      url: "/#",
      icon: <Image src={lccLogo} alt="i-PFI App" width={175} height={175} />,
    },
    {
      name: "Optimum OH App",
      url: "/#",
      icon: <Image src={ohLogo} alt="i-PFI App" width={175} height={175} />,
    },
    {
      name: "i-RCFA App",
      url: "/#",
      icon: <Image src={irfcaLogo} alt="i-PFI App" width={175} height={175} />,
    },
    {
      name: "AHM App",
      url: "/#",
      icon: <Image src={ahmLogo} alt="i-PFI App" width={175} height={175} />,
    },
  ];

  return (
    <Fragment>
      <Navbar />
      <div className="flex justify-center items-start min-h-[60dvh] relative">
        <div className="absolute w-full h-full overflow-hidden top-0 left-0">
          <Image
            src={BGAllApps}
            alt={`background-all-apps`}
            className={`w-full`}
          />
        </div>
        <div className="absolute inset-0 w-full h-full bg-black/60"></div>
        <Card className={`w-full rounded-none bg-transparent overflow-hidden`}>
          <CardHeader className="bg-blue-400 rounded-none flex justify-center w-full text-center">
            <h1 className="font-semibold text-xl text-center text-white">
              Pilih Aplikasi
            </h1>
          </CardHeader>
          <Divider />
          <CardBody className="h-full">
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[80dvh]">
              {appList.map((item, index) => {
                return (
                  <Link
                    key={`${item}-${index}`}
                    href={`${item.url}`}
                    className="h-full w-full hover:bg-yellow-300 bg-white/70 text-black border-blue-400 transition ease px-6 py-4 rounded-lg border flex flex-col gap-6 justify-center items-center"
                  >
                    {item.icon}
                    <p className="text-6xl font-normal leading-tight ">
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
