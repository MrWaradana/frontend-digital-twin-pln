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
import { AUTH_API_URL, EFFICIENCY_API_URL } from "@/lib/api-url";
import { useExcelStore } from "@/store/excels";
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

  if (error) {
    console.log(error, "ERROOOOOOOR");
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

  if (!isLoading) {
    useExcelStore.getState().setExcels(excel);
  }

  const {
    data: efficiencyData,
    isLoading: efficiencyLoading,
    mutate: mutateEfficiency,
    isValidating: isValidatingEfficiency,
  } = useGetData(session?.user.access_token);

  console.log(efficiencyData, "data efficiency");

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
            mutate={mutateEfficiency}
            isValidating={isValidatingEfficiency}
          />
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
