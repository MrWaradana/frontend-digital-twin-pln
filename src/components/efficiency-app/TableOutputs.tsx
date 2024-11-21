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
import { table } from "console";

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
        unit: item.variable.satuan,
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
      label: "OUTPUT VALUE",
    },
    {
      key: "unit",
      label: "UNIT",
    },
  ];

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 12;

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
        <div className={`flex flex-col w-full items-center `}>
          <h2 className={`capitalize font-bold`}>
            {tableData.name} Output Data
          </h2>

          <h3 className={`capitalize font-semibold`}>
            Parameter: {tableData.jenis_parameter}
          </h3>
        </div>

        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[54%]"
            placeholder="Search by output variable..."
            startContent={<MagnifyingGlassIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, tableData.length, hasSearchFilter]);

  // if (isLoading) {
  //   return (
  //     <div className="w-full flex justify-center">
  //       <Spinner label="Loading..." />
  //     </div>
  //   );
  // }

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-full"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      thead: [
        "bg-transparent",
        "shadow-none",
        "![&>tr]:first:shadow-none",
        "![&_tr]:shadow-none",
        "![&>tr]:first:!shadow-none",
      ],
      tr: ["shadow-none", "bg-transparent", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <>
      {/* {JSON.stringify(mappedData)} */}
      <Table
        aria-label="Output table efficiency"
        topContent={topContent}
        topContentPlacement="inside"
        classNames={classNames}
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
          emptyContent={`Data is not available yet, please wait...`}
          loadingContent={
            <>
              <Spinner label={`Loading...`} />
            </>
          }
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
