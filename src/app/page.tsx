import { Fragment } from "react";
import { Card, CardHeader, CardBody, Divider, Link } from "@nextui-org/react";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const appList = [
    {
      name: "Efficiency App",
      url: "/efficiency-app",
    },
    {
      name: "Aplikasi 2",
      url: "/aplikasi-2",
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
      <div className="flex justify-center items-start mt-24 min-h-screen">
        <Card>
          <CardHeader>
            <h1 className="font-semibold text-xl">Aplikasi</h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {appList.map((item, index) => {
                return (
                  <Link
                    key={`${item}-${index}`}
                    href={`${item.url}`}
                    className="h-24 w-48 hover:bg-blue-300 transition ease px-6 py-4 rounded-lg border flex justify-center items-center"
                  >
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
