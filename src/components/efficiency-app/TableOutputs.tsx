"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import toast from "react-hot-toast";

export default function TableOutputs() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${EFFICIENCY_API_URL}/variables/${"a6330942-8531-4063-a047-44c95f2c1f37"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.data?.user?.accessToken}`, // Adding Bearer prefix for the token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(response, "responseeeeeeeeeeeeeeeeeeeeeeeee");
        setTableData(data);
      } catch (error) {
        toast.error(`Failed to fetch variables: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.accessToken) {
      fetchVariables();
    }
  }, [session?.data?.user?.accessToken]);

  const filteredData = tableData.filter(
    (v: any) => v.variable_type === "input"
  );
  const rows = filteredData;

  const columns = [
    {
      key: "variable",
      label: "VARIABLE",
    },
    {
      key: "base_case",
      label: "OUTPUT VALUE",
    },
  ];

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(filteredData.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData]);

  return (
    <>
      {/* {JSON.stringify(filteredData)} */}
      <Table
        aria-label="Example table with dynamic content"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
