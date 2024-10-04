"use client";

import React, { useMemo, useEffect } from "react";
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
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as XLSX from "xlsx";
import html2PDF from "jspdf-html2canvas";
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
import { Box, DownloadIcon, PrinterIcon } from "lucide-react";
import EditableCell from "./EditableCell";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";
import ModalRootCause from "./ModalRootCause";

const formatCurrency = (number: any) => {
  // Convert to absolute value to handle negative numbers
  const absNumber = Math.abs(number);

  // Determine the appropriate suffix based on the value
  let formattedNumber;
  let suffix = "";

  if (absNumber >= 1_000_000_000_000) {
    // Trillions
    formattedNumber = (number / 1_000_000_000_000).toFixed(0);
    suffix = " triliun";
  } else if (absNumber >= 1_000_000_000) {
    // Billions
    formattedNumber = (number / 1_000_000_000).toFixed(0);
    suffix = " miliar";
  } else if (absNumber >= 1_000_000) {
    // Millions
    formattedNumber = (number / 1_000_000).toFixed(0);
    suffix = " juta";
  } else if (absNumber >= 1_000) {
    // Millions
    formattedNumber = (number / 1_000).toFixed(0);
    suffix = " ribu";
  } else {
    // Thousands separator for smaller numbers
    formattedNumber = number.toLocaleString("id-ID");
  }

  return formattedNumber + suffix;
};

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
        table.getRowModel().rows.map(
          (row: any) =>
            row.depth < 1 && (
              <>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {/* Render expandable sub-rows only once */}
                {row.getIsExpanded() && row.subRows.length > 0 && (
                  <>
                    {row.subRows.map((subRow: any) => (
                      <tr key={subRow.id}>
                        {subRow.getVisibleCells().map((cell: any) => (
                          <td
                            key={cell.id}
                            className={`text-sm font-normal bg-neutral-50 dark:bg-neutral-700 border border-neutral-500 print-cell ${
                              cell.column.columnDef.meta?.className ?? ""
                            }`}
                            style={{
                              width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                              maxWidth: "100px",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* Render summary row under specific columns */}
                {row.original.total_nilai_losses &&
                  row.original.total_persen_losses && (
                    <tr
                      key={`summary-${row.id}`}
                      className="bg-neutral-100 dark:bg-neutral-900 border border-black"
                    >
                      {row.getVisibleCells().map((cell: any) => {
                        // Render summary under the specific columns
                        if (cell.column.id === "category") {
                          return (
                            <td
                              key={cell.id}
                              className="font-bold sticky left-0 bg-neutral-100 dark:bg-neutral-900 print-cell"
                            >
                              Summary
                            </td>
                          );
                        }
                        if (cell.column.id === "nilai_losses") {
                          return (
                            <td
                              key={cell.id}
                              className="font-bold border border-neutral-700 text-right"
                            >
                              {row.original.total_nilai_losses.toFixed(2)}
                            </td>
                          );
                        }
                        if (cell.column.id === "persen_losses") {
                          return (
                            <td
                              key={cell.id}
                              className="font-bold border border-neutral-700 text-right"
                            >
                              {row.original.total_persen_losses.toFixed(2)}
                            </td>
                          );
                        }
                        if (cell.column.id === "cost_benefit") {
                          return (
                            <td
                              key={cell.id}
                              className="font-bold border border-neutral-700 text-right"
                            >
                              Rp.
                              {formatCurrency(
                                row.original.total_cost_benefit.toFixed(0)
                              )}
                            </td>
                          );
                        }
                        if (cell.column.id === "total_biaya") {
                          return (
                            <td
                              key={cell.id}
                              className="font-bold border border-neutral-700 text-right"
                            >
                              Rp.
                              {formatCurrency(
                                row.original.total_cost_gap.toFixed(0)
                              )}
                            </td>
                          );
                        }
                        // Render empty cells for other columns
                        return <td key={cell.id}></td>;
                      })}
                    </tr>
                  )}
              </>
            )
        )
      )}
    </tbody>
  );
}

// Memoized version of TableBody
export const MemoizedTableBody = React.memo(TableBody, (prev, next) => {
  const prevRowModel = prev.table.getRowModel().rows;
  const nextRowModel = next.table.getRowModel().rows;
  // Check for expanded state changes
  const prevExpanded = prevRowModel.map((row: any) => row.getIsExpanded());
  const nextExpanded = nextRowModel.map((row: any) => row.getIsExpanded());
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
  summaryData,
  mutate,
  isValidating,
  data_id,
  setIsMutating,
}: {
  tableData: any;
  summaryData: any;
  mutate: any;
  isValidating: any;
  data_id: string;
  setIsMutating: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = React.useState(tableData);
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  const [tableDataPrint, setTableDataPrint] = React.useState([tableData]);

  const [selectecModalId, setSelectedModalId] = React.useState<any>({
    variableId: "",
    detailId: "",
  });

  // console.log(summaryData, "summaryData");

  const columns = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Parameter",
        minSize: 60,
        size: 550,
        maxSize: 800,
        meta: {
          className:
            "sticky left-0 z-20 shadow-inner overflow-hidden whitespace-nowrap text-clip print-column",
        },
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
            className="print-cell"
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
            <span className="text-base print-cell">
              {" "}
              {props.getValue() || props.row.depth > 0
                ? props.getValue()
                : "Uncategorized"}
            </span>
          </div>
        ),
        enableResizing: true,
        footer: (props: any) => props.column.id,
      },
      {
        header: "UOM",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0 ? null : row.variable?.satuan || "",
        size: 25,
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
          >
            {props.getValue() != "NaN" ? props.getValue() : ""}
          </div>
        ),
      },
      {
        header: "Reference Data",
        meta: {
          className: "text-right",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0
            ? null
            : (row.reference_data != null
                ? row.reference_data.toFixed(2)
                : 0) || "",
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "Existing Data",
        meta: {
          className: "text-right",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0
            ? null
            : (row.existing_data != null ? row.existing_data.toFixed(2) : 0) ||
              "",
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "Gap",
        meta: {
          className: "text-right",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.gap.toFixed(2) || ""),
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
          >
            {props.getValue()}
          </div>
        ),
      },
      {
        header: "% HR",
        meta: {
          className: "text-right",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => row.persen_hr || "",
        cell: (props: any) =>
          props.row.depth > 0 ? (
            <EditableCell
              {...props}
              mutate={mutate}
              isValidating={isValidating}
              setIsMutating={setIsMutating}
            />
          ) : (
            <div>{props.getValue()}</div>
          ),
      },
      {
        header: "Deviasi",
        meta: {
          className: "text-right",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.deviasi || ""),
        cell: (props: any) =>
          props.row.depth > 0 ? (
            <EditableCell
              {...props}
              mutate={mutate}
              isValidating={isValidating}
              setIsMutating={setIsMutating}
            />
          ) : (
            <div>{props.getValue()}</div>
          ),
      },
      {
        accessorKey: "persen_losses",
        meta: {
          className: "text-right",
        },
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
        meta: {
          className: "text-right",
        },
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
        header: "Symptoms",
        cell: (props: any) => (
          <>
            {props.row.depth > 0 && ( // Only render if it's a subrow
              <div
                style={{
                  paddingLeft: `${props.cell.row.depth * 2}rem`,
                }}
              >
                {props.row.original.gap < 0 ? (
                  <span className="py-1 px-3 bg-red-400 rounded-md">Lower</span>
                ) : (
                  <span className="py-1 px-3 bg-blue-400 rounded-md">
                    Higher
                  </span>
                )}
              </div>
            )}
          </>
        ),
      },
      {
        header: "Potential Benefit",
        meta: {
          className: "text-right",
        },
        accessorKey: "cost_benefit",
        cell: (props: any) => {
          const value = props.getValue();
          if (props.row.depth > 0) {
            return `Rp.${formatCurrency(value.toFixed(2))}`;
          }
          return "";
        },
      },
      {
        header: "Action Menutup Gap",
        cell: (props: any) =>
          props.row.depth > 0 ? <div>{props.getValue()}</div> : "",
      },
      {
        accessorKey: "total_biaya",
        meta: {
          className: "text-right",
        },
        header: "Biaya Untuk Closing Gap",
        cell: (props: any) => {
          const value = props.getValue();
          if (props.row.depth > 0) {
            return `Rp.${formatCurrency(value.toFixed(0))}`;
          }
          return "";
        },
      },
      {
        header: "Ratio Benefit to Cost",
        meta: {
          className: "text-right",
        },
        cell: (props: any) => {
          const costBenefit = props.row.original.cost_benefit;
          const totalBiaya = props.row.original.total_biaya;
          if (totalBiaya === 0) {
            return `${costBenefit.toFixed(0)} : 0 | -`;
          }

          // Calculate the ratio
          const ratio = costBenefit / totalBiaya;

          // Scale both values to one decimal place
          const scaledCostBenefit = ratio * 1; // numerator scaled to 1 decimal place
          const scaledTotalBiaya = 1; // denominator is 10
          // Round both values to the nearest whole number
          const roundedCostBenefit = scaledCostBenefit.toFixed(2);
          const roundedTotalBiaya = Math.round(scaledTotalBiaya);
          return (
            <>
              {props.row.depth > 0 && ( // Only render if it's a subrow
                <div
                  style={{
                    paddingLeft: `${props.cell.row.depth * 2}rem`,
                  }}
                >
                  {`${roundedCostBenefit} : ${roundedTotalBiaya} | ${
                    totalBiaya == 0
                      ? "-"
                      : (costBenefit / totalBiaya).toFixed(2)
                  }`}
                </div>
              )}
            </>
          );
        },
      },
      {
        header: "To Do Checklist",
        size: 350,
        cell: ({ row }) => {
          // Only render the button if it's a subrow (depth > 0)
          if (row.depth > 0 && row.original.has_cause) {
            return (
              <div key={row.id} className="flex gap-1">
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
                  Root Cause
                </Button>
                <Button
                  onPress={() => {
                    setSelectedModalId({
                      variableId: row.original.variable.id,
                      detailId: row.original.id,
                    });
                    onOpen();
                  }}
                  color="primary"
                  size="sm"
                  className="m-2"
                >
                  Action
                </Button>
              </div>
            );
          }

          // Return null or an empty fragment if it's not a subrow
          return null;
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

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const flattenedData = data.flatMap((entry: any) =>
      entry.data.map((dataItem: any) => ({
        id: dataItem.id,
        category: entry.category,
        parameter: dataItem.variable.input_name,
        existing_data: dataItem.existing_data,
        reference_data: dataItem.reference_data,
        gap: dataItem.gap,
        nilai_losses: dataItem.nilai_losses,
        persen_losses: dataItem.persen_losses,
        persen_hr: dataItem.persen_hr,
        deviasi: dataItem.deviasi,
        symptoms: dataItem.symptoms,
        total_biaya: dataItem.total_biaya,
        total_nilai_losses: entry.total_nilai_losses,
        total_persen_losses: entry.total_persen_losses,
        total_cost_benefit: entry.total_cost_benefit,
        total_cost_gap: entry.total_cost_gap,
      }))
    );
    // Generate CSV using flattened data
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  const handleExportPDFData = async () => {
    const table = document.getElementById("table-pareto");
    const tableContainer = document.querySelector(".printable-table");
    const stickyColumns = document.querySelectorAll(".print-column");
    const stickyCells = document.querySelectorAll(".print-cell");

    // Remove classes that limit the height and width and make columns sticky
    tableContainer?.classList.remove(
      "max-h-[568px]",
      "max-w-full",
      "overflow-hidden",
      "overflow-auto"
    );
    stickyColumns.forEach((column) => column.classList.remove("sticky"));
    stickyCells.forEach((cell) => cell.classList.remove("sticky"));

    // Create PDF
    const pdf = await html2PDF(table, {
      jsPDF: {
        format: "a4",
        orientation: "landscape",
      },
      margin: {
        top: 12,
        right: 12,
        bottom: 12,
        left: 12,
      },
      html2canvas: {
        scrollX: 0,
        scrollY: -window.scrollY,
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Use CORS for external images if required
        backgroundColor: "#ffffff", // Set a white background to avoid transparency issues
      },
      imageType: "image/jpeg",
      autoResize: true,
      output: "./pdf/pareto-generated.pdf",
    });

    // Restore classes after generating the PDF
    tableContainer?.classList.add(
      "max-h-[568px]",
      "max-w-full",
      "overflow-auto"
    );
    stickyColumns.forEach((column) => column.classList.add("sticky"));
    stickyCells.forEach((cell) => cell.classList.add("sticky"));

    return pdf;
  };

  const handleExportExcel = () => {
    const flattenedData = data.flatMap((entry: any) =>
      entry.data.map((dataItem: any) => ({
        id: dataItem.id,
        category: entry.category,
        parameter: dataItem.variable.input_name,
        existing_data: dataItem.existing_data,
        reference_data: dataItem.reference_data,
        gap: dataItem.gap,
        nilai_losses: dataItem.nilai_losses,
        persen_losses: dataItem.persen_losses,
        persen_hr: dataItem.persen_hr,
        deviasi: dataItem.deviasi,
        symptoms: dataItem.symptoms,
        total_biaya: dataItem.total_biaya,
        total_nilai_losses: entry.total_nilai_losses,
        total_persen_losses: entry.total_persen_losses,
        total_cost_benefit: entry.total_cost_benefit,
        total_cost_gap: entry.total_cost_gap,
      }))
    );
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    return XLSX.writeFile(workbook, "ParetoData.xlsx");
  };

  const handlePrint = () => {
    // Trigger the print dialog
    window.print();
  };

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
        paretoMutate={mutate}
      />
      <div className=" flex justify-end gap-6">
        <Button
          onClick={() => handleExportExcel()}
          color="success"
          endContent={<DownloadIcon size={16} />}
        >
          Export to Excel
        </Button>
        <Button
          onClick={() => handleExportData()}
          color="success"
          endContent={<DownloadIcon size={16} />}
        >
          Export to CSV
        </Button>
        <Button
          onClick={() => handleExportPDFData()}
          color="danger"
          endContent={<DownloadIcon size={16} />}
        >
          Export to PDF
        </Button>
        {/* <Button
          onClick={() => handlePrint()}
          color="secondary"
          endContent={<PrinterIcon size={16} />}
        >
          Print table
        </Button> */}
      </div>
      <div className="max-w-full max-h-[568px] mb-24 mt-12 overflow-auto relative printable-table">
        <table
          cellPadding="1"
          cellSpacing="0"
          className="overflow-y-scroll relative"
          style={{
            ...columnSizeVars,
            width: table.getTotalSize(),
          }}
          id="table-pareto"
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
          </thead>
          {/* Memoized Table Body for resizing performance  */}
          <MemoizedTableBody table={table} />
          {/* Initial Table Body for expanding row works */}
          {/* <TableBody table={table} /> */}
          <tfoot className="sticky bottom-0 z-50 border-2">
            <tr className="text-left">
              <th className="sticky left-0 bg-blue-200 dark:bg-blue-600">
                Total Summary
              </th>
              <th className="bg-blue-200 dark:bg-blue-600" colSpan={6}></th>
              <th className="bg-blue-200 dark:bg-blue-600 text-right">
                {formatCurrency(summaryData.total_persen.toFixed(2))}
              </th>
              <th className="bg-blue-200 dark:bg-blue-600 text-right">
                {formatCurrency(summaryData.total_nilai.toFixed(2))}
              </th>
              <th className="bg-blue-200 dark:bg-blue-600" colSpan={1}></th>
              <th className="bg-blue-200 dark:bg-blue-600 text-right">
                Rp.{formatCurrency(summaryData.total_cost_benefit.toFixed(2))}
              </th>
              <th className="bg-blue-200 dark:bg-blue-600" colSpan={1}></th>
              <th className="bg-blue-200 dark:bg-blue-600 text-right">
                Rp.{formatCurrency(summaryData.total_cost_gap.toFixed(2))}
              </th>
              <th className="bg-blue-200 dark:bg-blue-600" colSpan={2}></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
