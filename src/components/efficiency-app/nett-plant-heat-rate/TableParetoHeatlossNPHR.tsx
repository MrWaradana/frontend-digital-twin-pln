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
  Tooltip,
} from "@nextui-org/react";
import { Box, CircleHelp, DownloadIcon, PrinterIcon } from "lucide-react";
import EditableCell from "../EditableCell";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";
import ModalRootCause from "../ModalRootCause";
import ModalRootCauseAction from "../ModalRootCauseAction";

const formattedNumber = (value: any) =>
  new Intl.NumberFormat("id-ID").format(value);

// const formatCurrency = (number: any) => {
//   // Convert to absolute value to handle negative numbers
//   const absNumber = Math.abs(number);
//   const formatIDNumber = (value: any) =>
//     new Intl.NumberFormat("id-ID").format(value);
//   // Determine the appropriate suffix based on the value
//   let formattedNumber;
//   let suffix = "";

//   if (absNumber >= 1_000_000_000_000) {
//     // Trillions
//     formattedNumber = (number / 1_000_000_000_000).toFixed(2);
//     suffix = " T";
//   } else if (absNumber >= 1_000_000_000) {
//     // Billions
//     formattedNumber = (number / 1_000_000_000).toFixed(2);
//     suffix = " M";
//   } else if (absNumber >= 1_000_000) {
//     // Millions
//     formattedNumber = (number / 1_000_000).toFixed(2);
//     suffix = " Jt";
//   } else if (absNumber >= 1_000) {
//     // Millions
//     formattedNumber = (number / 1_000).toFixed(2);
//     suffix = " Rb";
//   } else {
//     // Thousands separator for smaller numbers
//     formattedNumber = number.toLocaleString("id-ID");
//   }

//   return formatIDNumber(formattedNumber) + suffix;
// };

const formatCurrency = (number: any) => {
  // Handle zero case
  if (number === 0) {
    return "Rp0";
  }

  // Convert to absolute value to handle negative numbers
  const absNumber = Math.abs(number);
  const sign = number < 0 ? "-" : "";

  // If the number is very small (more than 2 decimal places of zeros)
  if (absNumber > 0 && absNumber < 0.01) {
    // Convert to scientific notation
    const scientificStr = number.toExponential();
    // Format to match desired pattern (e.g., -7.6x10^-8)
    const [coefficient, exponent] = scientificStr.split("e");
    return `${Number(coefficient).toFixed(1)}x10^${exponent}`;
  }

  // Regular formatting for normal numbers
  const inMillions = (absNumber / 1_000_000).toFixed(2);
  return sign + new Intl.NumberFormat("id-ID").format(Number(inMillions));
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
                <tr key={row.id} className="border-b-1 border-neutral-200">
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className={`text-sm font-normal bg-neutral-50 dark:bg-neutral-700 px-1 ${
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
                            className={`text-sm font-normal bg-neutral-50 dark:bg-neutral-700 border-b-1 border-neutral-200 print-cell px-1 ${
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
                {!row.original.total_nilai_losses ? null : (
                  <tr
                    key={`summary-${row.id}`}
                    className="bg-neutral-100 dark:bg-neutral-900 border-b-1 border-neutral-200"
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
                      if (cell.column.id === "nilaiLosses") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-200 text-right"
                          >
                            {row.original.total_nilai_losses
                              ? row.original.total_nilai_losses.toFixed(2)
                              : "0"}
                          </td>
                        );
                      }
                      if (cell.column.id === "persenLosses") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-200 text-right"
                          >
                            {row.original.total_persen_losses
                              ? row.original.total_persen_losses.toFixed(2)
                              : "0"}
                          </td>
                        );
                      }
                      if (cell.column.id === "potentialBenefit") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-200 text-right"
                          >
                            Rp.
                            {row.original.total_cost_benefit
                              ? formatCurrency(
                                  row.original.total_cost_benefit.toFixed(0)
                                )
                              : 0}
                          </td>
                        );
                      }
                      if (cell.column.id === "biayaClosingGap") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-200 text-right"
                          >
                            Rp.
                            {row.original.total_cost_gap
                              ? formatCurrency(
                                  row.original.total_cost_gap.toFixed(0)
                                )
                              : "0"}
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

export default function TableParetoHeatlossNPHR({
  tableData,
  summaryData,
  mutate,
  isValidating,
  data_id,
  setIsMutating,
}: {
  tableData: any;
  summaryData: any;
  mutate?: any;
  isValidating?: any;
  data_id?: string;
  setIsMutating?: any;
}) {
  const {
    isOpen: modalRootCauseIsopen,
    onOpen: modalRootCauseOnopen,
    onOpenChange: modalRootCauseonOpenChange,
  } = useDisclosure();
  const {
    isOpen: modalRootActionIsopen,
    onOpen: modalRootActionOnopen,
    onOpenChange: modalRootActionOnOpenChange,
  } = useDisclosure();
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
        header: () => <span className={`text-left`}>Parameter</span>,
        minSize: 60,
        size: 250,
        maxSize: 800,
        meta: {
          className:
            "sticky left-0 z-20  overflow-hidden whitespace-nowrap text-clip print-column",
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
              `${props.row.original.variable.input_name}`
            )}{" "}
            <span className="text-base print-cell">
              {" "}
              {props.getValue() || props.row.depth > 0 ? props.getValue() : ""}
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
            className="text-center"
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
          >
            {props.getValue() != "NaN" ? props.getValue() : ""}
          </div>
        ),
      },
      {
        id: "referenceData",
        size: 45,
        header: () => (
          <div className="text-center">
            Reference Data <br /> (Commission)
          </div>
        ),
        meta: {
          className: "text-right pr-2",
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
            {formattedNumber(Number(props.getValue()).toFixed(2))}
          </div>
        ),
      },
      {
        id: "existingData", // Add a unique id for the column
        size: 45,
        header: () => (
          <div className="text-center">
            Existing Data <br /> (Current)
          </div>
        ),
        meta: {
          className: "text-right pr-2",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0
            ? null
            : (row.existing_data != null ? row.existing_data.toFixed(2) : 0) ||
              "",
        cell: (props: any) => (
          <div className="text-center">
            {formattedNumber(Number(props.getValue()).toFixed(2))}
          </div>
        ),
      },
      {
        id: "gap",
        header: () => <div className="text-center">Gap</div>,
        size: 45,
        meta: {
          className: "text-right pr-2",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.gap.toFixed(2) || ""),
        cell: (props: any) => {
          const value = props.getValue();

          // Function to handle very small numbers and convert them to scientific notation
          const formatSmallNumber = (num: number) => {
            if (Math.abs(num) < 0.01 && num !== 0) {
              const exponentialForm = num.toExponential(1); // Format to exponential notation
              const [coefficient, exponent] = exponentialForm.split("e");
              return `${coefficient}x10^${exponent}`;
            }
            return formattedNumber(num.toFixed(2)); // For normal-sized numbers, show two decimal places
          };

          return (
            <div
              style={{
                paddingLeft: `${props.cell.row.depth * 1}rem`,
              }}
            >
              {value ? formatSmallNumber(Number(value)) : ""}
            </div>
          );
        },
      },
      // {
      //   header: "% HR",
      //   meta: {
      //     className: "text-right",
      //   },
      //   // Access the correct UOM value for each row or sub-row
      //   accessorFn: (row: any) => row.persen_hr || "",
      //   cell: (props: any) =>
      //     props.row.depth > 0 ? (
      //       <EditableCell
      //         {...props}
      //         mutate={mutate}
      //         isValidating={isValidating}
      //         setIsMutating={setIsMutating}
      //       />
      //     ) : (
      //       <div>{props.getValue()}</div>
      //     ),
      // },
      // {
      //   header: "Deviasi",
      //   meta: {
      //     className: "text-right",
      //   },
      //   // Access the correct UOM value for each row or sub-row
      //   accessorFn: (row: any) => (row.data ? null : row.deviasi || ""),
      //   cell: (props: any) =>
      //     props.row.depth > 0 ? (
      //       <EditableCell
      //         {...props}
      //         mutate={mutate}
      //         isValidating={isValidating}
      //         setIsMutating={setIsMutating}
      //       />
      //     ) : (
      //       <div>{props.getValue()}</div>
      //     ),
      // },
      {
        id: "persenLosses",
        accessorKey: "persen_losses",
        size: 45,
        meta: {
          className: "text-right pr-2",
        },
        header: () => (
          <Tooltip
            content={
              <span>
                Rumus Persen Losses: <br />
                <strong>
                  absolute( (gap/deviasi) * <em>persen_hr</em> )
                </strong>
                <br />
              </span>
            }
          >
            <div className="text-center flex flex-row gap-1">
              <p>
                Persen Losses <br /> (%)
              </p>
              <CircleHelp size={16} />
            </div>
          </Tooltip>
        ),
        cell: (props: any) => {
          const value = props.getValue();

          // Function to handle very small numbers and convert them to scientific notation
          const formatSmallNumber = (num: number) => {
            if (Math.abs(num) < 0.01 && num !== 0) {
              const exponentialForm = num.toExponential(1); // Format to exponential notation
              const [coefficient, exponent] = exponentialForm.split("e");
              return `${coefficient}x10^${exponent}`;
            }
            return formattedNumber(num.toFixed(2)); // For normal-sized numbers, show two decimal places
          };

          return (
            <div
              style={{
                paddingLeft: `${props.cell.row.depth * 1}rem`,
              }}
            >
              {value ? formatSmallNumber(Number(value)) : ""}
            </div>
          );
        },
        footer: (props: any) => props.column.id,
      },
      {
        id: "nilaiLosses",
        accessorKey: "nilai_losses",
        size: 45,
        meta: {
          className: "text-right pr-2",
        },
        header: () => (
          <Tooltip
            content={
              <span>
                Rumus Nilai Losses: <br />
                <strong>(persen_losses/100)*(NPHR Commisioning)</strong>
                <br />
              </span>
            }
          >
            <div className="text-center flex flex-row gap-1">
              <p>
                Nilai Losses <br /> (kCal/kWh)
              </p>
              <CircleHelp size={12} />
            </div>
          </Tooltip>
        ),
        cell: (props: any) => {
          const value = props.getValue();

          // Function to handle very small numbers and convert them to scientific notation
          const formatSmallNumber = (num: number) => {
            if (Math.abs(num) < 0.01 && num !== 0) {
              const exponentialForm = num.toExponential(1); // Format to exponential notation
              const [coefficient, exponent] = exponentialForm.split("e");
              return `${coefficient}x10^${exponent}`;
            }
            return formattedNumber(num.toFixed(2)); // For normal-sized numbers, show two decimal places
          };

          return (
            <div
              style={{
                paddingLeft: `${props.cell.row.depth * 1}rem`,
              }}
            >
              {value ? formatSmallNumber(Number(value)) : ""}
            </div>
          );
        },
        footer: (props: any) => props.column.id,
      },
      {
        header: "Symptoms",
        size: 45,
        cell: (props: any) => (
          <>
            {(props.row.depth > 0 ||
              !props.row.original.total_nilai_losses) && ( // Only render if it's a subrow
              <div className="flex justify-center">
                {(() => {
                  const gap = props.row.original.gap;
                  const goodIndicator = props.row.original.good_indicator;

                  if (goodIndicator === "minus" && gap < 0) {
                    return (
                      <span className="py-1 px-3 my-2 bg-[#1C9EB6] rounded-full text-white">
                        Lower
                      </span>
                    );
                  } else if (goodIndicator === "plus" && gap > 0) {
                    return (
                      <span className="py-1 px-3 my-2 bg-[#1C9EB6] rounded-full text-white">
                        Higher
                      </span>
                    );
                  } else if (gap === 0) {
                    return (
                      <span className="py-1 px-3 my-2 bg-neutral-200 dark:bg-yellow-600 rounded-full text-black">
                        Normal
                      </span>
                    );
                  } else {
                    return (
                      <span className="py-1 px-3 my-2 bg-[#D93832] rounded-full text-white">
                        {gap < 0 ? "Lower" : "Higher"}
                      </span>
                    );
                  }
                })()}
              </div>
            )}
          </>
        ),
      },
      {
        id: "potentialBenefit",
        header: () => (
          <div className="text-center">
            Potential Benefit <br /> (Juta/Jam)
          </div>
        ),
        size: 125,
        meta: {
          className: "text-right pr-2",
        },
        accessorKey: "cost_benefit",
        cell: (props: any) => {
          const value = props.getValue();
          const gap = props.row.original.gap;
          const goodIndicator = props.row.original.good_indicator;
          if (
            (goodIndicator === "minus" && gap <= 0) ||
            (goodIndicator === "plus" && gap >= 0)
          ) {
            return "";
          }
          if (!props.row.original.total_nilai_losses && value) {
            return `Rp.${formatCurrency(value)}`;
          }
          return "";
        },
      },
      // {
      //   header: "Action Menutup Gap",
      //   size: 45,
      //   cell: (props: any) =>
      //     props.row.depth > 0 ? <div>{props.getValue()}</div> : "",
      // },
      {
        id: "biayaClosingGap",
        accessorKey: "total_biaya",
        meta: {
          className: "text-right pr-2",
        },
        header: () => (
          <div className="text-center">
            Biaya untuk Closing Gap <br /> (Juta)
          </div>
        ),
        size: 125,
        cell: (props: any) => {
          const value = props.getValue();
          const gap = props.row.original.gap;
          const goodIndicator = props.row.original.good_indicator;
          if (
            (goodIndicator === "minus" && gap <= 0) ||
            (goodIndicator === "plus" && gap >= 0)
          ) {
            return "";
          }
          if (!props.row.original.total_nilai_losses && value) {
            return `Rp.${formatCurrency(value.toFixed(0))}`;
          }
          return "Rp.0";
        },
      },
      {
        id: "ratioBenefitCost",
        header: () => <div className="text-center">Ratio Benefit to Cost</div>,
        size: 105,
        meta: {
          className: "text-right pr-2",
        },
        cell: (props: any) => {
          const costBenefit = props.row.original.cost_benefit;
          const totalBiaya = props.row.original.total_biaya;
          const gap = props.row.original.gap;
          const goodIndicator = props.row.original.good_indicator;
          if (
            (goodIndicator === "minus" && gap <= 0) ||
            (goodIndicator === "plus" && gap >= 0)
          ) {
            return "";
          }
          if (totalBiaya === 0) {
            // return `${costBenefit.toFixed(0)} : 0 | -`;
            return `-`;
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
              {
                // Only render if it's a subrow
                <div>
                  {/* {`${roundedCostBenefit} : ${roundedTotalBiaya} | ${
                    totalBiaya == 0
                      ? "-"
                      : (costBenefit / totalBiaya).toFixed(2)
                  }`} */}
                  {`${formattedNumber(
                    roundedCostBenefit
                  )} : ${roundedTotalBiaya}`}
                </div>
              }
            </>
          );
        },
      },
      // {
      //   id: "toDoChecklist",
      //   header: "To Do Checklist",
      //   size: 280,
      //   cell: ({ row }) => {
      //     // Only render the button if it's a subrow (depth > 0)
      //     if (row.depth > 0 && row.original.has_cause) {
      //       return (
      //         <div key={row.id} className="flex gap-1">
      //           <Button
      //             onPress={() => {
      //               setSelectedModalId({
      //                 variableId: row.original.variable.id,
      //                 detailId: row.original.id,
      //               });
      //               modalRootCauseOnopen();
      //             }}
      //             color="warning"
      //             size="sm"
      //             className="m-0 p-1"
      //           >
      //             Root Cause
      //           </Button>
      //           <Button
      //             onPress={() => {
      //               setSelectedModalId({
      //                 variableId: row.original.variable.id,
      //                 detailId: row.original.id,
      //               });
      //               modalRootActionOnopen();
      //             }}
      //             color="primary"
      //             size="sm"
      //             className="m-0 p-1"
      //           >
      //             Action
      //           </Button>
      //         </div>
      //       );
      //     }

      //     // Return null or an empty fragment if it's not a subrow
      //     return null;
      //   },
      // },

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
    filename: `Pareto-${summaryData.category}-${new Date().toLocaleString(
      "id"
    )}`,
  });

  const handleExportData = () => {
    const flattenedData = data.flatMap((entry: any) => entry);
    const csvData = flattenedData.map((dataItem: any) => ({
      id: dataItem.id,
      category: dataItem.variable.category,
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
      action_menutup_gap: dataItem.action_menutup_gap.join("| \n "),
    }));
    // Generate CSV using flattened data
    const csv = generateCsv(csvConfig)(csvData);
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
    //@ts-ignore
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
    tableContainer?.classList.add("max-w-full", "overflow-auto");
    stickyColumns.forEach((column) => column.classList.add("sticky"));
    stickyCells.forEach((cell) => cell.classList.add("sticky"));

    return pdf;
  };

  const handleExportExcel = () => {
    const flattenedData = data.flatMap((entry: any) => entry);
    const excelData = flattenedData.map((dataItem: any) => ({
      id: dataItem.id,
      category: dataItem.variable.category,
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
      action_menutup_gap: dataItem.action_menutup_gap.join("| \n "),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    // const worksheet_root_cause = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pareto Heat Loss");
    // XLSX.utils.book_append_sheet(workbook, worksheet_root_cause, "Pareto Heat Loss");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    return XLSX.writeFile(
      workbook,
      `ParetoData-${summaryData.category}-${new Date().toLocaleString(
        "id"
      )}.xlsx`
    );
  };

  const handlePrint = () => {
    // Trigger the print dialog
    window.print();
  };

  // For resizing optimization
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
      {/* <ModalRootCause
        isOpen={modalRootCauseIsopen}
        onOpenChange={modalRootCauseonOpenChange}
        selectedModalId={selectecModalId}
        data_id={data_id}
        paretoMutate={mutate}
      />

      <ModalRootCauseAction
        isOpen={modalRootActionIsopen}
        onOpenChange={modalRootActionOnOpenChange}
        selectedModalId={selectecModalId}
        data_id={data_id}
        paretoMutate={mutate}
      /> */}

      <div className="flex justify-end gap-2">
        <Button
          onClick={() => handleExportExcel()}
          color={`default`}
          size="sm"
          endContent={<DownloadIcon size={16} />}
        >
          Export to Excel
        </Button>
        <Button
          onClick={() => handleExportData()}
          color={`default`}
          size="sm"
          endContent={<DownloadIcon size={16} />}
        >
          Export to CSV
        </Button>
        <Button
          onClick={() => handleExportPDFData()}
          color={`default`}
          size="sm"
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
      <div className="max-w-full max-h-[568px] mb-3 mt-1 overflow-auto relative printable-table">
        <table
          cellPadding=".25"
          cellSpacing="0"
          className="overflow-y-scroll relative"
          style={{
            ...columnSizeVars,
            width: table.getTotalSize(),
          }}
          id="table-pareto-nphr"
        >
          <thead className="sticky top-0 z-50 border-b-1">
            {table.getHeaderGroups().map((headerGroup: any) => {
              return (
                <tr key={`${headerGroup.id}`}>
                  {headerGroup.headers.map((header: any) => {
                    return (
                      <th
                        key={header.id}
                        className={`relative group text-sm capitalize font-light border-b-1 border-neutral-200 ${
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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
          <tfoot className="sticky bottom-0 z-50 border-b-1">
            <tr className="text-left">
              <th className="sticky left-0 bg-[#D9E9EE]">Total Summary</th>
              <th className="bg-[#D9E9EE]" colSpan={4}></th>
              <th className="bg-[#D9E9EE] text-right">
                {formattedNumber(summaryData.total_persen_losses.toFixed(2))}
              </th>
              <th className="bg-[#D9E9EE] text-right">
                {formattedNumber(summaryData.total_nilai_losses.toFixed(2))}
              </th>
              <th className="bg-[#D9E9EE]" colSpan={1}></th>
              <th className="bg-[#D9E9EE] text-right">
                Rp.{formatCurrency(summaryData.total_cost_benefit.toFixed(2))}
              </th>
              {/* <th className="bg-[#D9E9EE]" colSpan={1}></th> */}
              <th className="bg-[#D9E9EE] text-right">
                Rp.{formatCurrency(summaryData.total_cost_gap.toFixed(2))}
              </th>
              <th className="bg-[#D9E9EE]" colSpan={2}></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
