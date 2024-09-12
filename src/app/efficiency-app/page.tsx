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
import { useSession, signOut } from "next-auth/react";
import TableEfficiency from "@/components/efficiency-app/TableEfficiency";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { columns, users, statusOptions } from "@/lib/efficiency-data";
import { AUTH_API_URL, EFFICIENCY_API_URL } from "../../lib/api-url";
import { useExcelStore } from "../../store/excels";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useRouter } from "next/navigation";
import { error } from "console";
import { useGetExcel } from "@/lib/APIs/useGetExcel";
import { useGetData } from "@/lib/APIs/useGetData";
import { mutate } from "swr";
import { access } from "fs";

export default function Page() {
  // const [isLoading, setLoading] = useState(true);
  // const [efficiencyData, setEfficiencyData] = useState([]);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const {
    data: excelData,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useGetExcel(session?.user.access_token);

  async function updateSessionToken(newToken: any) {
    await update({
      ...session,
      user: {
        ...session?.user,
        access_token: newToken,
      },
    });
  }

  console.log(session, "name");

  if (error) {
    console.log(error, "ERRPPPPPPPPPPR");
    fetch(`${AUTH_API_URL}/refresh-token`, {
      headers: {
        Authorization: `Bearer ${session?.user?.refresh_token}`, // Ensure refresh token exists
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to refresh token: ${response.statusText}`);
        }
        return response.json(); // Parse response JSON
      })
      .then((resData) => {
        updateSessionToken(resData.data.access_token);
        mutate();
        console.log(session?.user.access_token, "token baru");
      })
      .catch((error) => {
        console.error("Error refreshing token:", error);
      });
  }

  const excel = excelData ?? [];

  console.log(excel);

  if (!isLoading) {
    useExcelStore.getState().setExcels(excel);
  }

  const { data: efficiencyData, isLoading: efficiencyLoading } = useGetData(
    session?.user.access_token
  );

  const efficiency = efficiencyData?.transactions ?? [];

  if (isLoading && efficiencyLoading)
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress color="primary" />
      </div>
    );
  if (!excel)
    return (
      <div className="w-full mt-24 flex flex-col gap-6 justify-center items-center">
        <Button as={Link} href="/" color="primary">
          Back to All Apps
        </Button>
        <p>No Excel Data!</p>
      </div>
    );

  return (
    <EfficiencyContentLayout title="All Efficiency Data">
      <div className="flex flex-col items-center justify-center mt-24">
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          {/* {JSON.stringify(excels)} */}
          {/* <h1>{excels[3].excel_filename}</h1> */}
          <TableEfficiency
            tableData={efficiency}
            addNewUrl={`/efficiency-app/input`}
            params={excel[0].excel_filename}
          />
        </div>

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
              {excel?.map((item: any, index: number) => {
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
    </EfficiencyContentLayout>
  );
}
