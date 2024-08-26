"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CircularProgress,
  Divider,
  Link,
  Button,
} from "@nextui-org/react";
import { GearIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type excelGetData = {
  data: [String];
};

export default function Page() {
  const [excelList, setExcelList] = useState<excelGetData>();
  const [isLoading, setLoading] = useState(true);

  const session = useSession();

  console.log(session.data?.user);

  useEffect(() => {
    // fetch(`https://m20vpzqk-3001.asse.devtunnels.ms/excels/TFELINK.xlsm`)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/excels`)
      .then((res) => res.json())
      .then((data) => {
        setExcelList(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error);
      });
  }, []);

  const excelListTemplate = [
    {
      name: "Excel 1",
      url: "/efficiency-app/input",
    },
    {
      name: "Excel 2",
      url: "/efficiency-app/input",
    },
    {
      name: "Excel 3",
      url: "/efficiency-app/input",
    },
    {
      name: "Excel 4",
      url: "/efficiency-app/input",
    },
  ];

  if (isLoading)
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  if (!excelList || !excelList.data)
    return (
      <div className="w-full mt-24 flex flex-col gap-6 justify-center items-center">
        <Button as={Link} href="/" color="primary">
          Back to All Apps
        </Button>
        <p>No Excel Data!</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1>Choose Excel Page</h1>
      <Card>
        <CardBody>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* {excelListTemplate.map((item: any, index: number) => {
              return (
                <div
                  key={`${item.name}-${index}`}
                  className="h-24 w-48 relative hover:bg-green-300 transition ease px-6 py-4 rounded-lg border flex justify-center items-center"
                >
                  <Link
                    href="#"
                    className="hover:scale-105 hover:bg-white rounded-md p-1 absolute top-2 right-2"
                  >
                    <GearIcon />
                  </Link>
                  <Link
                    href={item.url}
                    className="text-base font-normal leading-tight"
                  >
                    {item.name}
                  </Link>
                </div>
              );
            })} */}
            {excelList?.data?.map((item: any, index: number) => {
              return (
                <div
                  key={`${item}-${index}`}
                  className="h-24 w-48 relative hover:bg-green-300 transition ease px-6 py-4 rounded-lg border flex justify-center items-center"
                >
                  <Link
                    href="#"
                    className="hover:scale-105 hover:bg-white rounded-md p-1 absolute top-2 right-2 text-black"
                  >
                    <GearIcon />
                  </Link>
                  <Link
                    href={`/efficiency-app/${item}`}
                    className="text-base font-normal leading-tight text-black hover:scale-105 transition ease"
                  >
                    {item}
                  </Link>
                </div>
              );
            })}
          </section>
        </CardBody>
      </Card>
    </div>
  );
}
