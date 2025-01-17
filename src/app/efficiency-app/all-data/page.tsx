"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CircularProgress,
  Divider,
  Link,
  Button,
  Selection,
} from "@nextui-org/react";
import { GearIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import TableEfficiency from "@/components/efficiency-app/TableEfficiency";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AUTH_API_URL, EFFICIENCY_API_URL } from "@/lib/api-url";
import { useExcelStore } from "@/store/excels";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useStatusThermoflowStore } from "@/store/statusThermoflow";
import { usePathname, useRouter } from "next/navigation";
import { error } from "console";
import { useGetExcel } from "@/lib/APIs/useGetExcel";
import { useGetData } from "@/lib/APIs/useGetData";
import { mutate } from "swr";
import { access } from "fs";
import { useSelectedEfficiencyDataStore } from "@/store/selectedEfficiencyData";

export default function Page() {
  const pathname = usePathname();
  // const [isLoading, setLoading] = useState(true);
  // const [efficiencyData, setEfficiencyData] = useState([]);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterParameter, setFilterParameter] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>(
    // new Set(INITIAL_VISIBLE_STATUS)
    "all"
  );

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

  const {
    data: efficiencyData,
    isLoading: efficiencyLoading,
    mutate: mutateEfficiency,
    isValidating: isValidatingEfficiency,
    error: errorEfficiency,
  } = useGetData(
    session?.user.access_token,
    0,
    page,
    rowsPerPage,
    filterSearch,
    filterParameter,
    statusFilter
  );

  if (error || errorEfficiency) {
    // console.log(error, "ERROOOOOOOR");
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

  // console.log(efficiencyData, "data efficiency");
  const StatusThermoflow = useStatusThermoflowStore(
    (state) => state.statusThermoflow
  ); // Retrieve currentKey from Zustand

  const setStatusThermoflow = useStatusThermoflowStore(
    (state) => state.setStatusThermoflow
  ); // Retrieve currentKey from Zustand

  const setSelectedEfficiencyData = useSelectedEfficiencyDataStore(
    (state) => state.setSelectedEfficiencyData
  );

  const thermoStatus = efficiencyData?.thermo_status ?? StatusThermoflow;
  const efficiency = useMemo(() => {
    return efficiencyData?.transactions ?? [];
  }, [efficiencyData]);
  // const efficiencyFiltered = efficiency.filter(
  //   (item: any) => item.created_by === session?.user.user.id
  // );

  const pages = useMemo(() => {
    return efficiencyData?.total_pages ? efficiencyData?.total_pages : 0;
  }, [efficiencyData, rowsPerPage]);

  const total_items = useMemo(() => {
    return efficiencyData?.total_items ? efficiencyData?.total_items : 0;
  }, [efficiencyData, rowsPerPage]);

  useEffect(() => {
    const api = `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/stream`;
    const es = new EventSource(api);
    // @ts-ignore
    es.addEventListener("data_outputs", (e) => {
      toast.success(`Efficiency data has been processed!`, { duration: 3000 });
      setStatusThermoflow(false);
      mutateEfficiency();
      // if (pathname === "/efficiency-app") {
      //   setTimeout(() => window.location.reload(), 3000);
      // }
    });

    // @ts-ignore
    // es.addEventListener("error", (e) => {
    //   // @ts-ignore
    //   // toast.error(`Error: ${e}`);
    //   console.log(e, "DATA STREAM!");
    //   if (pathname === "/efficiency-app") {
    //     setTimeout(() => window.location.reload(), 3000);
    //   }
    // });

    // // Handle SSE connection errors
    // es.onerror = (_) => {
    //   toast.error(`Something went wrong!, ${_}`);
    //   console.log(_, "Error");
    //   // Close the SSE connection
    //   es.close();
    // };
  }, []);

  if (isLoading)
    return (
      <EfficiencyContentLayout title="All Efficiency Data">
        <div className="w-full mt-24 flex justify-center items-center">
          <CircularProgress
            color="primary"
            label={isLoading ? "Loading..." : "Validating..."}
          />
        </div>
      </EfficiencyContentLayout>
    );

  if (error)
    return (
      <div className="w-full mt-24 flex flex-col gap-6 justify-center items-center">
        <Button as={Link} href="/" color="primary">
          Back to All Apps
        </Button>
        <p>No Excel Data!</p>
      </div>
    );

  return (
    <>
      <EfficiencyContentLayout title="All Efficiency Data">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-8 justify-center items-center w-full min-h-full p-2">
            {/* {JSON.stringify(excels)} */}
            {/* <h1>{excels[3].excel_filename}</h1> */}
            <TableEfficiency
              tableData={
                session?.user.user.role === "Admin" ? efficiency : efficiency
              }
              thermoStatus={thermoStatus}
              addNewUrl={`/efficiency-app/input`}
              efficiencyLoading={efficiencyLoading}
              mutate={mutateEfficiency}
              isValidating={isValidatingEfficiency}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              pages={pages}
              total_items={total_items}
              // filterSearch
              setFilterSearch={setFilterSearch}
              // filterParameter
              setFilterParameter={setFilterParameter}
              // filterStatus
              setFilterStatus={setFilterStatus}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </div>
      </EfficiencyContentLayout>
    </>
  );
}
