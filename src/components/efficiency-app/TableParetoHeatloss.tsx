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
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table as NextTable,
  TableBody as NextTableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Checkbox,
} from "@nextui-org/react";
import { Box } from "lucide-react";
import EditableCell from "./EditableCell";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";
import ModalRootCause from "./ModalRootCause";

//un-memoized normal table body component - see memoized version below
function TableBody({ table }: { table: Table<ParetoType> }) {
  return (
    <tbody>
      {table.getRowModel().rows.length === 0 ? (
        <tr>
          <td
            colSpan={table.getVisibleLeafColumns().length}
            className="text-center"
          >
            No data!
          </td>
        </tr>
      ) : (
        table.getRowModel().rows.map((row: any) => (
          <tr key={row.id} className="border border-black">
            {row.getVisibleCells().map((cell: any) => (
              <td
                key={cell.id}
                className={`text-sm font-normal bg-neutral-50 dark:bg-neutral-700 ${
                  cell.column.columnDef.meta?.className ?? ""
                }`}
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                  maxWidth: "100px",
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}

// Memoized version of TableBody
export const MemoizedTableBody = React.memo(TableBody, (prev, next) => {
  const prevRowModel = prev.table.getRowModel().rows;
  const nextRowModel = next.table.getRowModel().rows;
  console.log(prevRowModel, nextRowModel, "Row");
  // Check for expanded state changes
  const prevExpanded = prevRowModel.map((row: any) => row.getIsExpanded());
  const nextExpanded = nextRowModel.map((row: any) => row.getIsExpanded());
  console.log(prevExpanded, nextExpanded);
  // If expanded state changes, re-render
  const hasExpandedStateChanged = prevExpanded.some(
    (isExpanded: boolean, idx: number) => isExpanded !== nextExpanded[idx]
  );

  // Also compare the data to ensure changes in data are detected
  const isSameData = prev.table.options.data === next.table.options.data;

  return isSameData && hasExpandedStateChanged;
}) as typeof TableBody;

export default function TableParetoHeatloss({
  tableData,
  mutate,
  isValidating,
  data_id,
}: {
  tableData: any;
  mutate: any;
  isValidating: any;
  data_id: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = React.useState(tableData);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [selectecModalId, setSelectedModalId] = React.useState<any>({
    variableId: "",
    detailId: "",
  });

  console.log(expanded, "Expanded State");

  const columns = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Parameter",
        minSize: 60,
        maxSize: 800,
        meta: {
          className:
            "sticky left-0 z-20 shadow-inner overflow-hidden whitespace-nowrap text-clip",
        },
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 2}rem`,
            }}
          >
            {props.row.getCanExpand() ? (
              <button
                {...{
                  onClick: props.row.getToggleExpandedHandler(),
                  style: { cursor: "pointer" },
                }}
              >
                {props.row.getIsExpanded() ? (
                  <CaretDownIcon fontSize={12} />
                ) : (
                  <CaretRightIcon fontSize={12} />
                )}
              </button>
            ) : (
              `🔵 ${props.row.original.variable.input_name}`
            )}{" "}
            {props.getValue() || props.row.depth > 0
              ? props.getValue()
              : "Uncategorized"}
          </div>
        ),
        enableResizing: true,
        footer: (props: any) => props.column.id,
      },
      {
        header: "UOM",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.data ? null : row.variable?.satuan || "",
        size: 25,
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
        size: 25,
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
        size: 25,
        accessorFn: (row: any) => row.persen_hr || "",
        cell: (props: any) =>
          props.row.depth > 0 ? (
            <EditableCell
              {...props}
              mutate={mutate}
              isValidating={isValidating}
            />
          ) : (
            <div>{props.getValue()}</div>
          ),
      },
      {
        header: "Deviasi",
        // Access the correct UOM value for each row or sub-row
        size: 25,
        accessorFn: (row: any) => (row.data ? null : row.deviasi || ""),
        cell: (props: any) =>
          props.row.depth > 0 ? (
            <EditableCell
              {...props}
              mutate={mutate}
              isValidating={isValidating}
            />
          ) : (
            <div>{props.getValue()}</div>
          ),
      },
      {
        accessorKey: "persen_losses",
        header: "Persen Losses",
        cell: (props: any) => {
          const value = props.getValue();
          if (!value) {
            return;
          }
          return Number(value).toFixed(2); // Ensures the value is formatted with 2 decimal places
        },
        footer: (props: any) => props.column.id,
      },
      {
        accessorKey: "nilai_losses",
        header: "Nilai Losses",
        cell: (props: any) => {
          const value = props.getValue();
          if (!value) {
            return;
          }
          return Number(value).toFixed(2); // Ensures the value is formatted with 2 decimal places
        },
        footer: (props: any) => props.column.id,
      },
      {
        accessorKey: "total_persen_losses",
        header: "Total Losses",
        cell: (props: any) => {
          const value = props.getValue();
          if (!value) {
            return;
          }
          return Number(value).toFixed(2); // Ensures the value is formatted with 2 decimal places
        },
        footer: (props: any) => props.column.id,
      },
      {
        header: "Symptoms",
        cell: (props: any) => (
          <>
            {props.row.depth > 0 && ( // Only render if it's a subrow
              <div
                style={{
                  paddingLeft: `${props.cell.row.depth * 2}rem`,
                }}
              >
                {props.row.original.gap < 0 ? "Lower" : "Higher"}
              </div>
            )}
          </>
        ),
      },
      {
        header: "Potential Benefit",
        cell: (props: any) =>
          props.row.depth > 0 ? <div>{props.getValue()}</div> : "",
      },
      {
        header: "Action Menutup Gap",
        cell: (props: any) =>
          props.row.depth > 0 ? <div>{props.getValue()}</div> : "",
      },
      {
        accessorKey: "total_biaya",
        header: "Biaya Untuk Closing Gap",
        cell: (props: any) =>
          props.row.depth > 0 ? <div>{props.getValue()}</div> : "",
      },
      {
        header: "Ratio Benefit to Cost",
        cell: (props: any) =>
          props.row.depth > 0 ? <div>{props.getValue()}</div> : "",
      },
      {
        header: "Action",
        cell: ({ row }) => {
          const rows = Array.from({ length: 18 });
          return (
            <React.Fragment key={row.id}>
              <Button
                onPress={() => {
                  setSelectedModalId({
                    variableId: row.original.variable.id,
                    detailId: row.original.id,
                  });
                  onOpen();
                }}
                color="warning"
                size="sm"
                className="m-2"
              >
                Open Checkbox
              </Button>
            </React.Fragment>
          );
        },
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
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev: any) =>
          prev.map((row: any, index: any) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        );
        return true;
      },
    },
    initialState: {
      expanded: true,
    },
    onExpandedChange: setExpanded,
    enableExpanding: true,
    getSubRows: (row) => row.data,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    // getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // filterFromLeafRows: true,
    // maxLeafRowFilterDepth: 0,
    debugTable: false,
    debugRows: false,
  });

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <>
      <ModalRootCause
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedModalId={selectecModalId}
        data_id={data_id}
      />
      {/* <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Root Cause Checkbox
              </ModalHeader>
              <ModalBody>
                <NextTable
                  aria-label="Root Cause Checkbox"
                  className="h-[360px]"
                >
                  <TableHeader>
                    <TableColumn>Heat Loss Caused </TableColumn>
                    <TableColumn>Kondensor TTD dan ∆ P naik </TableColumn>
                    <TableColumn>∆ T Kondensor naik</TableColumn>
                    <TableColumn>High O2 in condensate water</TableColumn>
                    <TableColumn>Repair</TableColumn>
                    <TableColumn>Biaya</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {checkboxColumn.map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {[1, 2, 3, 4, 5, 6].map((colIndex) => (
                          <TableCell key={colIndex} className="text-center">
                            {colIndex === 1 ? (
                              rowIndex === 0 ? (
                                "" // Leave the first cell of the first row empty
                              ) : (
                                `${_}` // Render a string for other rows in the first column
                              )
                            ) : colIndex === 6 ? (
                              rowIndex != 0 ? (
                                <>
                                  <input className="border bg-neutral-50 py-1 px-1 rounded-md" />
                                </>
                              ) : (
                                `` // Render a string for other rows in the first column
                              )
                            ) : (
                              <>
                                <Checkbox
                                  defaultChecked
                                  name={`${rowIndex * 5 + colIndex}`}
                                  className={`${rowIndex === 0 ? "hidden" : ""
                                    }`}
                                />
                                <p
                                  className={`${rowIndex != 0 ? "hidden" : ""}`}
                                >
                                  {``}
                                </p>
                              </>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </NextTable>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}

      <table
        cellPadding="2"
        cellSpacing="0"
        className="overflow-y-scroll"
        style={{
          ...columnSizeVars,
          width: table.getTotalSize(),
        }}
      >
        <thead className="sticky top-0 z-50 border-2">
          {table.getHeaderGroups().map((headerGroup: any) => {
            return (
              <tr key={`${headerGroup.id}`}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <th
                      key={header.id}
                      className={`relative group text-sm capitalize font-bold bg-blue-200 dark:bg-blue-700 ${
                        header.column.columnDef.meta?.className ?? ""
                      } `}
                      style={{
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      }}
                    >
                      <div
                        className={`absolute top-0 right-0 h-full w-[6px] hover:cursor-col-resize ${
                          header.column.getIsResizing()
                            ? "bg-red-700"
                            : "group-hover:bg-red-500 group-focus:bg-red-500"
                        }`}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      ></div>
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
        {/* Memoized Table Body for resizing performance  */}
        <MemoizedTableBody table={table} />
        {/* Initial Table Body for expanding row works */}
        {/* <TableBody table={table} /> */}
      </table>
    </>
  );
}
