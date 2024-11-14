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
      bgColor: "bg-yellow-400",
      textColor: "text-black",
      icon: (
        <Image src={efficiencyLogo} alt="i-PFI App" width={90} height={90} />
      ),
    },
    {
      name: "i-PFI App",
      url: "/pfi-app",
      bgColor: "bg-red-500",
      textColor: "text-white",
      icon: <Image src={pfiLogo} alt="i-PFI App" width={90} height={90} />,
    },
    {
      name: "Reliability Predicts App",
      url: "/#",
      bgColor: "bg-orange-400",
      textColor: "text-white",
      icon: (
        <Image
          src={reliableLogo}
          alt="reliable Logo App"
          width={90}
          height={90}
        />
      ),
    },
    {
      name: "Risk Matrix App",
      url: "/#",
      bgColor: "bg-gradient-to-b from-[#E714D8] to-[#AF01D3]",
      textColor: "text-white",
      icon: <Image src={riskLogo} alt="i-PFI App" width={90} height={90} />,
    },
    {
      name: "RBD App",
      url: "/#",
      bgColor: "bg-purple-700",
      textColor: "text-white",
      icon: <Image src={rdbLogo} alt="i-PFI App" width={90} height={90} />,
    },
    {
      name: "LCCA App",
      url: "/#",
      bgColor: "bg-[#4554A5]",
      textColor: "text-white",
      icon: <Image src={lccLogo} alt="i-PFI App" width={90} height={90} />,
    },
    {
      name: "Optimum OH App",
      url: "/optimum-oh-app",
      bgColor: "bg-cyan-600",
      textColor: "text-white",
      icon: <Image src={ohLogo} alt="i-PFI App" width={90} height={90} />,
    },
    {
      name: "i-RCFA App",
      url: "/#",
      bgColor: "bg-emerald-600",
      textColor: "text-white",
      icon: <Image src={irfcaLogo} alt="i-PFI App" width={90} height={90} />,
    },
    {
      name: "AHM App",
      url: "/#",
      bgColor: "bg-green-500",
      textColor: "text-white",
      icon: <Image src={ahmLogo} alt="i-PFI App" width={90} height={90} />,
    },
  ];

  return (
    <div className="bg-black/80 min-h-[100dvh]">
      <Navbar />
      <div className="flex justify-center items-start relative min-h-[90dvh]">
        <div className="absolute w-full h-full overflow-hidden -top-10 left-0">
          <Image
            src={BGAllApps}
            alt={`background-all-apps`}
            className={`w-full h-full object-cover`}
          />
        </div>
        <div className="absolute inset-0 w-full h-full bg-black/80"></div>
        <Card className="w-full h-[91dvh] rounded-none bg-transparent overflow-hidden p-0">
          <CardBody className="flex flex-wrap overflow-hidden justify-center w-full h-full items-center p-0">
            <section className="grid grid-cols-1 sm:grid-cols-3 place-items-center place-content-center gap-4">
              {appList.map((item, index) => (
                <Link
                  key={`${item}-${index}`}
                  href={`${item.url}`}
                  className={`
                            w-[220px]
                            h-[195px]
                            hover:scale-105
                            inline-flex
                            duration
                            ease-in-out
                            ${item.bgColor}
                            ${item.textColor}
                            transition
                            border-transparent
                            px-6
                            py-4
                            rounded-2xl
                            border
                            flex
                            flex-col
                            gap-6
                            justify-between
                            items-start
                          `}
                >
                  <p className="text-xl font-semibold leading-tight">
                    {item.name}
                  </p>
                  <span className="flex w-full justify-end">{item.icon}</span>
                </Link>
              ))}
            </section>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
