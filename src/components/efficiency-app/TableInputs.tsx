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
  Input,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import toast from "react-hot-toast";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { formattedNumber } from "@/lib/formattedNumber";

export default function TableOutputs({ data_id }: { data_id: string }) {
  const [tableData, setTableData]: any = useState([]);
  const [isLoading, setLoading] = useState(true);
  const session = useSession();
  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${EFFICIENCY_API_URL}/data/${data_id}/details?type=in`,
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

  const data = tableData.details ?? [];

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];
    if (hasSearchFilter && filteredData.length != 0) {
      filteredData = filteredData.filter((item) =>
        // @ts-ignore
        item.variable.excel_variable_name
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }
    return filteredData;
  }, [data, filterValue]);

  const mappedData = useMemo(() => {
    return filteredItems.map((item: any) => {
      // console.log(item);
      return {
        id: item.id,
        variable: item.variable.excel_variable_name,
        value: formattedNumber(Number(item.nilai).toFixed(2)),
        unit: item.variable.satuan === "NaN" ? "" : item.variable.satuan,
      };
    });
  }, [isLoading, filteredItems]);

  // console.log(mappedData);

  // const rows = mappedData;

  const columns = [
    {
      key: "variable",
      label: "VARIABLE",
    },
    {
      key: "value",
      label: "INPUT VALUE",
    },
    {
      key: "unit",
      label: "UNIT",
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

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[54%]"
            placeholder="Search by input variable..."
            startContent={<MagnifyingGlassIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, tableData.length, hasSearchFilter]);

  return (
    <>
      {/* {JSON.stringify(filteredData)} */}
      <Table
        aria-label="Input Table Efficiency"
        topContent={topContent}
        topContentPlacement="outside"
        color="success"
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
        <TableBody
          items={items}
          isLoading={isLoading}
          loadingContent={
            <>
              <Spinner label={`Loading...`} />
            </>
          }
          emptyContent={`Data is not available!`}
        >
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
