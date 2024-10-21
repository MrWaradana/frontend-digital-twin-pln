import { Fragment } from "react";
import { Card, CardHeader, CardBody, Divider, Link } from "@nextui-org/react";
import Navbar from "@/components/Navbar";
import { AudioWaveform, HousePlug } from "lucide-react";

export default async function Home() {
  const appList = [
    {
      name: "Efficiency App",
      url: "/efficiency-app",
      icon: <HousePlug size={48} />,
    },
    {
      name: "PFI App",
      url: "/pfi-app",
      icon: <AudioWaveform size={48} />,
    },
    {
      name: "App3",
      url: "/#",
    },
    {
      name: "App4",
      url: "/#",
    },
    {
      name: "App5",
      url: "/#",
    },
    {
      name: "App6",
      url: "/#",
    },
    {
      name: "App7",
      url: "/#",
    },
    {
      name: "App8",
      url: "/#",
    },
    {
      name: "App9",
      url: "/#",
    },
  ];

  return (
    <Fragment>
      <Navbar />
      <div className="flex justify-center items-start min-h-full">
        <Card className={`w-full rounded-none`}>
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
                    className="h-[170px] w-full hover:bg-blue-300 text-blue-500 border-blue-400 transition ease px-6 py-4 rounded-lg border flex flex-col gap-6 justify-center items-center"
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
