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
import TableEfficiency from "@/components/efficiency-app/TableEfficiency";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { columns, users, statusOptions } from "@/lib/efficiency-data";
import { EFFICIENCY_API_URL } from "../../lib/api-url";
import { useExcelStore } from "../../store/excels";

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const [efficiencyData, setEfficiencyData] = useState(true);

  const session = useSession();

  console.log(session.data?.user);

  useEffect(() => {
    const fetchExcels = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${EFFICIENCY_API_URL}/excels`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.data?.user?.accessToken}`, // Adding Bearer prefix for the token
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log(response, "responseeeeeeeeeeeeeeeeeeeeeeeee");
        useExcelStore.getState().setExcels(data.data);
      } catch (error) {
        toast.error(`Failed to fetch excels: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.accessToken) {
      fetchExcels();
    }
  }, [session?.data?.user?.accessToken]);

  useEffect(() => {
    const fetchEfficiencyData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${EFFICIENCY_API_URL}/data?page=1&size=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.data?.user?.accessToken}`, // Adding Bearer prefix for the token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log(response, "responseeeeeeeeeeeeeeeeeeeeeeeee");
        setEfficiencyData(data.data.transactions);
      } catch (error) {
        toast.error(`Failed to fetch efficiency data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.accessToken) {
      fetchEfficiencyData();
    }
  }, [session?.data?.user?.accessToken]);

  const excels = useExcelStore((state) => state.excels);

  if (isLoading)
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress color="primary" />
      </div>
    );
  if (!excels)
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
      <div className="flex flex-col gap-8 justify-center items-center w-full">
        <div className="w-full px-96 flex justify-between mx-24">
          <Button
            as={Link}
            color="primary"
            startContent={<ChevronLeftIcon size={18} />}
            href={`/`}
            size="sm"
          >
            Back to all apps
          </Button>
          {/* <Button
          as={Link}
          color="primary"
          endContent={<ChevronRightIcon size={18} />}
          href={`/efficiency-app/${params.excels_name}/heat-rate`}
          size="sm"
        >
          Heat Rate
        </Button> */}
        </div>
        {/* {JSON.stringify(excels)} */}
        {/* <h1>{excels[3].excel_filename}</h1> */}
        <div>
          <TableEfficiency
            tableData={efficiencyData}
            addNewUrl={`/efficiency-app/${excels[0].excel_filename}/input`}
            params={excels[0].excel_filename}
          />
        </div>
      </div>

      {/* <h1>Choose Excel Page</h1> */}
      {/* {JSON.stringify(excels)} */}
      <Card className="hidden">
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
            {excels?.map((item: any, index: number) => {
              return (
                <div
                  key={`${item.excel_filename}-${index}`}
                  className="h-24 w-48 relative hover:bg-green-300 transition ease px-6 py-4 rounded-lg border flex justify-center items-center"
                >
                  <Link
                    href="#"
                    className="hover:scale-105 hover:bg-white rounded-md p-1 absolute top-2 right-2 text-black"
                  >
                    <GearIcon />
                  </Link>
                  <Link
                    href={`/efficiency-app/${item.excel_filename}`}
                    className="text-base font-normal leading-tight text-black hover:scale-105 transition ease"
                  >
                    {item.excel_filename}
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
