"use client";

import React, { useEffect, useMemo, useState } from "react";
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

export default function TableOutputs({ data_id }: { data_id: string }) {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${EFFICIENCY_API_URL}/data/${data_id}/details?type=out`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.data?.user?.access_token}`, // Adding Bearer prefix for the token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(response, "responseeeeeeeeeeeeeeeeeeeeeeeee");
        setTableData(data.data);
      } catch (error) {
        toast.error(`Failed to fetch variables: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.access_token) {
      fetchVariables();
    }
  }, [data_id, session?.data?.user?.access_token]);

  const data = tableData ?? []

  const mappedData = useMemo(() => {
    return data.map((item: any) => {
      console.log(item)
      return {

        id: item.id,
        variable: item.variable.input_name,
        value: item.nilai,
      };
    })
  }, [isLoading])

  console.log(mappedData)

  const rows = mappedData;

  const columns = [
    {
      key: "variable",
      label: "VARIABLE",
    },
    {
      key: "value",
      label: "OUTPUT VALUE",
    },
  ];

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(mappedData.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return mappedData.slice(start, end);
  }, [page, mappedData]);

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
            <TableRow key={item.id}>
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
