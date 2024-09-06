"use client";

import React, { useMemo } from "react";
import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { paretoData, ParetoType } from "@/lib/pareto-api-data";
import { Button, Input } from "@nextui-org/react";
import { Box } from "lucide-react";

export default function TableParetoHeatloss() {
  const [data, setData] = React.useState(paretoData);

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Parameter",
        size: 50,
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {" "}
            {props.row.getCanExpand() ? (
              <button
                {...{
                  onClick: props.row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
              >
                {props.row.getIsExpanded() ? "👇" : "👉"}
              </button>
            ) : (
              `🔵 ${props.row.original.variable.input_name}`
            )}{" "}
            {props.getValue()}
          </div>
        ),
        footer: (props: any) => props.column.id,
      },
      {
        header: "UOM",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.data ? null : row.variable?.satuan || "",
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "Reference Data",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.data
            ? null
            : (row.reference_data != null
                ? row.reference_data.toFixed(2)
                : 0) || "",
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "Existing Data",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.data
            ? null
            : (row.existing_data != null ? row.existing_data.toFixed(2) : 0) ||
              "",
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "Gap",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.gap.toFixed(2) || ""),
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "% HR",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.persen_hr || ""),
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            <Input
              defaultValue={props.getValue()}
              className={props.getValue() == null ? "hidden" : ""}
              size="sm"
              endContent={<>%</>}
            />
          </div>
        ),
      },
      {
        header: "Deviasi",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.deviasi || ""),
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            <Input
              defaultValue={props.getValue()}
              className={props.getValue() == null ? "hidden" : ""}
              size="sm"
            />
          </div>
        ),
      },
      {
        accessorKey: "total_losses",
        header: "Total Losses",
        cell: (props: any) => props.getValue(),
        footer: (props: any) => props.column.id,
      },
      {
        header: "Symptoms",
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {props.row.original.gap < 0 ? "Lower" : "Higher"}
          </div>
        ),
      },
      {
        header: "Potential Benefit",
        cell: (props: any) => (
          <div>
            <Input
              defaultValue={"77000"}
              size="sm"
              type="number"
              startContent={<>Rp.</>}
            />
          </div>
        ),
      },
      {
        header: "Action Menutup Gap",
        cell: (props: any) => (
          <div>
            <Input size="sm" />
          </div>
        ),
      },
      {
        header: "Biaya Untuk Closing Gap",
        cell: (props: any) => (
          <div>
            <Input size="sm" startContent={<>Rp.</>} />
          </div>
        ),
      },
      {
        header: "Ratio Benefit to Cost",
        cell: (props: any) => <div>1:7</div>,
      },
      {
        header: "Action",
        cell: (props: any) => (
          <div>
            <Button size="sm" color="warning">
              Checkbox
            </Button>
          </div>
        ),
      },

      // {
      //   accessorKey: "data",
      //   header: "Data",
      //   cell: ({ row }: any) =>
      //     row.getCanExpand() ? (
      //       <button onClick={row.getToggleExpandedHandler()}>
      //         {row.getIsExpanded() ? "Collapse" : "Expand"}
      //       </button>
      //     ) : null,
      //   footer: (props: any) => props.column.id,
      // },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.data,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // filterFromLeafRows: true,
    // maxLeafRowFilterDepth: 0,
    debugTable: true,
  });

  return (
    <table
      cellPadding="2"
      cellSpacing="0"
      className="border-2  overflow-y-scroll"
      width={table.getTotalSize()}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup: any) => {
          return (
            <tr
              key={`${headerGroup.id}`}
              className="border border-black bg-primary/20"
            >
              {headerGroup.headers.map((header: any) => {
                return (
                  <th
                    key={header.id}
                    className="border-2"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    <Box
                    />
                    {header.column.columnDef.header}
                  </th>
                );
              })}
            </tr>
          );
        })}
        {/* <tr className="border border-black bg-primary/20">
          <th>Category</th>
          <th>Variable Name</th>
          <th>Satuan</th>
          <th>Reference Data</th>
          <th>Existing Data</th>
          <th>Gap</th>
          <th>Percentage HR</th>
          <th>Deviation</th>
          <th>Losses</th>
          <th>Symptoms</th>
          <th>Potential Benefit</th>
          <th>Action Menutup Gap</th>
          <th>Biaya untuk Closing Gap</th>
          <th>Ratio Benefit to Cost</th>
          <th>Actions</th>
        </tr> */}
      </thead>
      <tbody>
        {/* {data.map((item) => {
          return (
            <tr key={item.category}>
              <td colSpan={14}>
                {item.category !== null ? item.category : "Uncategorized"}
              </td>
            </tr>
          );
        })}
        ; */}
        {table.getRowModel().rows.map((row: any) => {
          return (
            <>
              <tr key={row.id} className="border border-black">
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    <td
                      key={cell.id}
                      className=""
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
              {/* {row.getIsExpanded() &&
                row.subRows?.length > 0 &&
                row.subRows.map((subRow) => (
                  <tr key={subRow.id}>
                    {subRow.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))} */}
            </>
          );
        })}
        {/* {data.map((item) => (
          <React.Fragment key={item.category}>
            <tr className="border border-black">
              <td colSpan={9}>
                <strong>
                  {item.category !== null ? item.category : "Uncategorized"}
                </strong>
              </td>
            </tr>
            {item.data.map((dataItem) => (
              <tr key={dataItem.id} className="border border-black">
                <td></td>
                <td className="text-nowrap max-w-64 overflow-x-scroll">
                  {dataItem.variable.input_name}
                </td>
                <td>{dataItem.variable.satuan}</td>
                <td>{dataItem.reference_data?.toFixed(4)}</td>
                <td>{dataItem.existing_data?.toFixed(4)}</td>
                <td>{dataItem.gap != null ? dataItem.gap?.toFixed(4) : 0}</td>
                <td>
                  <Input
                    defaultValue={Number(dataItem.persen_hr)}
                    size="sm"
                    type="number"
                  />
                </td>
                <td>
                  <Input
                    defaultValue={Number(dataItem.deviasi)}
                    size="sm"
                    type="number"
                  />
                </td>
                <td>{dataItem.nilai_losses.toFixed(4)}</td>
                <td>Higher</td>
                <td>
                  <Input type="number" size="sm" placeholder="Rp. 999.999" />
                </td>
                <td>
                  <Input type="number" size="sm" placeholder="" />
                </td>
                <td>
                  <Input type="number" size="sm" placeholder="" />
                </td>
                <td>
                  <Input type="number" size="sm" placeholder="" />
                </td>
                <td>
                  <Button color="primary">Checkbox</Button>
                </td>
              </tr>
            ))}
            <tr className="bg-neutral-200">
              <td colSpan={14}>
                <strong>Total Losses</strong>
              </td>
              <td colSpan={1}>
                <strong>{item.total_losses.toFixed(4)}</strong>
              </td>
            </tr>
          </React.Fragment>
        ))} */}
      </tbody>
    </table>
  );
}
