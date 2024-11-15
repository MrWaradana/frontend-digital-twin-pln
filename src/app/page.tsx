import Navbar from "@/components/Navbar";
import { Card, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";
import Image from "next/image";
import { Fragment } from "react";
import BGAllApps from "../../public/bg-all-apps.jpg";

import newAhmLogo from "../../public/icons/new_AHM.png";
import newEfficiencyLogo from "../../public/icons/new_efficiency.png";
import newPfiLogo from "../../public/icons/new_iPFI.png";
import newIrfcaLogo from "../../public/icons/new_iRCFA.png";
import newLccLogo from "../../public/icons/new_LCCA.png";
import newOhLogo from "../../public/icons/new_optimum_oh.png";
import newRbdLogo from "../../public/icons/new_rbd.png";
import newReliableLogo from "../../public/icons/new_reliability_predict.png";
import newRiskLogo from "../../public/icons/new_risk_matrix.png";

export default async function Home() {
  const appList = [
    {
      name: "Efficiency & Heat Loss App",
      url: "/efficiency-app",
      bgColor: "bg-gradient-to-b from-yellow-400 to-[#FFC429]",
      textColor: "text-black",
      icon: (
        <Image
          src={newEfficiencyLogo}
          alt="Efficiency & Heat Loss App Logo"
          width={100}
          height={100}
        />
      ),
    },
    {
      name: "i-PFI App",
      url: "/pfi-app",
      bgColor: "bg-gradient-to-b from-[#F05A2C] to-[#C33232]",
      textColor: "text-white",
      icon: <Image src={newPfiLogo} alt="i-PFI App" width={100} height={100} />,
    },
    {
      name: "Reliability Predicts App",
      url: "/#",
      bgColor: "bg-gradient-to-b from-[#FFA201] to-[#EE6E01]",
      textColor: "text-white",
      icon: (
        <Image
          src={newReliableLogo}
          alt="Reliability Predicts Logo App"
          width={100}
          height={100}
        />
      ),
    },
    {
      name: "Risk Matrix App",
      url: "/risk-matrix-app",
      bgColor: "bg-gradient-to-b from-[#E714D8] to-[#AF01D3]",
      textColor: "text-white",
      icon: (
        <Image
          src={newRiskLogo}
          alt="Risk Matrix App"
          width={100}
          height={100}
        />
      ),
    },
    {
      name: "RBD App",
      url: "/#",
      bgColor: "bg-gradient-to-b from-[#8919FA] to-[#63389E]",
      textColor: "text-white",
      icon: <Image src={newRbdLogo} alt="RBD App" width={100} height={100} />,
    },
    {
      name: "LCCA App",
      url: "/#",
      bgColor: "bg-gradient-to-b from-[#42509F] to-[#272363]",
      textColor: "text-white",
      icon: <Image src={newLccLogo} alt="LCCA App" width={100} height={100} />,
    },
    {
      name: "Optimum OH App",
      url: "/optimum-oh-app",
      bgColor: "bg-gradient-to-b from-[#1D9DB6] to-[#2276AD]",
      textColor: "text-white",
      icon: (
        <Image src={newOhLogo} alt="Optimum OH App" width={100} height={100} />
      ),
    },
    {
      name: "i-RCFA App",
      url: "/#",
      bgColor: "bg-gradient-to-b from-[#589289] to-[#05584D]",
      textColor: "text-white",
      icon: (
        <Image src={newIrfcaLogo} alt="i-RCFA App" width={100} height={100} />
      ),
    },
    {
      name: "AHM App",
      url: "/#",
      bgColor: "bg-gradient-to-b from-[#75AB63] to-[#066D2A]",
      textColor: "text-white",
      icon: <Image src={newAhmLogo} alt="AHM App" width={100} height={100} />,
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
        <Card className="w-full h-[92dvh] rounded-none bg-transparent overflow-hidden p-0">
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
                  <p className="text-lg font-semibold leading-tight">
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
