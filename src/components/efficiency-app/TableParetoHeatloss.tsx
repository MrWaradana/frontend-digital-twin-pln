"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
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
import { useGetData } from "@/lib/APIs/useGetData";
import { useDebouncedCallback } from "use-debounce";
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
  Tooltip,
  Checkbox,
  Badge,
} from "@nextui-org/react";
import { Box, CircleHelp, DownloadIcon, PrinterIcon } from "lucide-react";
import EditableCell from "./EditableCell";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";
import ModalRootCause from "./ModalRootCause";
import ModalRootCauseAction from "./ModalRootCauseAction";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";

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
                <tr key={row.id} className="border-b-1 border-neutral-400 ">
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className={`text-sm font-normal bg-gray-200 dark:bg-neutral-700 ${
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
                            className={`text-sm font-normal bg-neutral-50 dark:bg-neutral-700 border-b-1 border-neutral-500 print-cell ${
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
                {row.original.total_nilai_losses ||
                row.original.total_persen_losses ||
                row.original.total_cost_benefit ||
                row.original.total_cost_gap ? (
                  <tr
                    key={`summary-${row.id}`}
                    className="bg-[#D9E9EE] dark:bg-neutral-900 border-b-1 border-neutral-400 py-8"
                  >
                    {row.getVisibleCells().map((cell: any) => {
                      // Render summary under the specific columns
                      if (cell.column.id === "category") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold sticky left-0 bg-[#D9E9EE] dark:bg-neutral-900 print-cell px-1"
                          >
                            Summary
                          </td>
                        );
                      }
                      if (cell.column.id === "nilaiLosses") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-400 text-right pb-4"
                          >
                            {row.original.total_nilai_losses
                              ? formattedNumber(
                                  row.original.total_nilai_losses.toFixed(2)
                                )
                              : "0"}
                          </td>
                        );
                      }
                      if (cell.column.id === "persenLosses") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-400 text-right pb-4"
                          >
                            {row.original.total_persen_losses
                              ? formattedNumber(
                                  row.original.total_persen_losses.toFixed(2)
                                )
                              : "0"}
                          </td>
                        );
                      }
                      if (cell.column.id === "potentialBenefit") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-400 text-right pb-4"
                          >
                            Rp.
                            {row.original.total_cost_benefit
                              ? formatCurrency(
                                  row.original.total_cost_benefit.toFixed(2)
                                )
                              : 0}
                          </td>
                        );
                      }
                      if (cell.column.id === "biayaClosingGap") {
                        return (
                          <td
                            key={cell.id}
                            className="font-bold border-b-1 border-neutral-400 text-right pb-4"
                          >
                            Rp.
                            {row.original.total_cost_gap
                              ? formatCurrency(
                                  row.original.total_cost_gap.toFixed(2)
                                )
                              : "0"}
                          </td>
                        );
                      }
                      // Render empty cells for other columns
                      return <td key={cell.id}></td>;
                    })}
                  </tr>
                ) : null}
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
  isValidatingRootCauseCount,
  rootCauseCount,
  isLoadingRootCauseCount,
  potentialTimeframe,
  setPotentialTimeframe,
  setDataId,
  dataId,
  params,
  setSelectedLabel,
  selectedLabel,
}: {
  tableData: any;
  summaryData: any;
  mutate?: any;
  isValidating?: any;
  data_id?: string;
  setIsMutating?: any;
  isValidatingRootCauseCount: any;
  rootCauseCount: any;
  isLoadingRootCauseCount: any;
  potentialTimeframe: any;
  setPotentialTimeframe: any;
  setDataId: any;
  dataId: any;
  params: any;
  setSelectedLabel: any;
  selectedLabel: any;
}) {
  const { data: session } = useSession();
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
  const [rootCauseCountState, setRootCauseCountState] = React.useState([]);
  const [inputValueTimeframe, setInputValueTimeframe] = useState(
    String(potentialTimeframe)
  );
  const [selectecModalId, setSelectedModalId] = React.useState<any>({
    variableId: "",
    detailId: "",
  });

  const {
    data: efficiencyData,
    error: errorEfficiencyData,
    mutate: mutateEfficiencyData,
    isLoading: isLoadingEfficiencyData,
    isValidating: isValidatingEfficiencyData,
  } = useGetData(session?.user.access_token, 0);

  const selectedEfficiencyData =
    efficiencyData?.transactions.filter((i: any) => i.status === "Done") ?? [];

  const filterEfficiencyData = (inputValue: string) => {
    return EfficiencyDataOptions.filter((i: any) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  useEffect(() => {
    setRootCauseCountState(rootCauseCount);
  }, [rootCauseCount]);

  // console.log(summaryData, "summaryData");

  const [columnVisibility, setColumnVisibility] = React.useState({
    category: true,
    uom: true, //hide this column by default
    referenceData: true,
    existingData: true,
    gap: true,
    persenLosses: true,
    nilaiLosses: true,
    symptomps: true,
    potentialBenefit: true,
    biayaClosingGap: true,
    toDoChecklist: session?.user.user.role === "Management" ? false : true,
  });

  const columns = useMemo(
    () => [
      {
        id: "category",
        accessorKey: "category",
        header: () => <div className={`text-left`}>Parameter</div>,
        minSize: 60,
        size: 250,
        maxSize: 800,
        meta: {
          className:
            "sticky left-0 z-20 overflow-hidden whitespace-nowrap text-clip print-column",
        },
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
            className={`print-cell ${
              props.cell.row.depth > 0 ? "" : "bg-gray-200"
            }`}
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
              ` ${props.row.original.variable.input_name}`
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
        id: "uom",
        header: "UOM",
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0 ? null : row.variable?.satuan || "",
        size: 25,
        cell: (props: any) => (
          <div className={`text-center`}>
            {props.getValue() != "NaN" ? props.getValue() : ""}
          </div>
        ),
      },
      {
        id: "referenceData",
        size: 85,
        header: () => (
          <Tooltip
            content={
              <>
                Reference Data: <br />
                {selectedLabel}
              </>
            }
          >
            <div className="text-center">
              Reference Data <br /> (
              {selectedLabel.length > 9
                ? `${selectedLabel.slice(0, 9)}...`
                : selectedLabel}
              )
            </div>
          </Tooltip>
        ),
        meta: {
          className: "text-right pr-2",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0
            ? null
            : (row.reference_data != null ? row.reference_data : 0) || "",
        cell: (props: any) => {
          const value = props.getValue();
          return (
            <div
              style={{
                paddingLeft: `${props.cell.row.depth * 1}rem`,
              }}
            >
              {props.row.depth > 0
                ? formattedNumber(Number(value).toFixed(2))
                : ""}
            </div>
          );
        },
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
            : (row.existing_data != null ? row.existing_data : 0) || "",
        cell: (props: any) => {
          const value = props.getValue();

          return (
            <div
              style={{
                paddingLeft: `${props.cell.row.depth * 1}rem`,
              }}
            >
              {props.row.depth > 0
                ? formattedNumber(Number(value).toFixed(2))
                : ""}
            </div>
          );
        },
      },
      {
        id: "gap",
        header: () => <div className="text-center">Gap</div>,
        size: 45,
        meta: {
          className: "text-right pr-2",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) => (row.data ? null : row.gap || ""),
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
              {props.row.depth > 0 && value
                ? formatSmallNumber(Number(value))
                : props.row.depth > 0
                ? "-"
                : ""}
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
              {props.row.depth > 0 && value
                ? formatSmallNumber(Number(value))
                : props.row.depth > 0
                ? "-"
                : ""}
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
                Nilai Losses <br /> (kWh/kCal)
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
              {props.row.depth > 0 && value
                ? formatSmallNumber(Number(value))
                : props.row.depth > 0
                ? "-"
                : ""}
            </div>
          );
        },
        footer: (props: any) => props.column.id,
      },
      {
        id: "symptomps",
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
                      <span className="py-1 px-3 bg-[#1C9EB6] rounded-full text-white">
                        Lower
                      </span>
                    );
                  } else if (goodIndicator === "plus" && gap > 0) {
                    return (
                      <span className="py-1 px-3 bg-[#1C9EB6] rounded-full text-white">
                        Higher
                      </span>
                    );
                  } else if (gap === 0) {
                    return (
                      <span className="py-1 px-3 bg-neutral-200 dark:bg-yellow-600 rounded-full text-black">
                        Normal
                      </span>
                    );
                  } else {
                    return (
                      <span className="py-1 px-3 bg-[#D93832] rounded-full text-white">
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
            Potential Benefit <br /> (Juta/ {potentialTimeframe} Jam)
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

          if (
            (props.row.depth > 0 || !props.row.original.total_nilai_losses) &&
            value
          ) {
            return `Rp.${formatCurrency(value.toFixed(2))}`;
          } else if (props.row.depth > 0) {
            return `Rp.0`;
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
          if (
            (props.row.depth > 0 || !props.row.original.total_nilai_losses) &&
            value
          ) {
            return `Rp.${formatCurrency(value.toFixed(0))}`;
          } else if (props.row.depth > 0) {
            return `-`;
          }
          return "";
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
              {props.row.depth > 0 && ( // Only render if it's a subrow
                <div>
                  {/* {`${formattedNumber(roundedCostBenefit)} : ${formattedNumber(
                    roundedTotalBiaya
                  )} | ${
                    totalBiaya == 0
                      ? "-"
                      : formattedNumber((costBenefit / totalBiaya).toFixed(2))
                  }`} */}
                  {`${formattedNumber(roundedCostBenefit)} : ${formattedNumber(
                    roundedTotalBiaya
                  )}`}
                </div>
              )}
            </>
          );
        },
      },
      {
        id: "toDoChecklist",
        header: "To Do Checklist",
        size: 280,
        cell: ({ row }) => {
          const gap = row.original.gap;
          const goodIndicator = row.original.good_indicator;

          if (session?.user.user.role === "Management") {
            return null; // Hide the column for management role
          }
          let countData;
          if (rootCauseCount) {
            // countData = rootCauseCount.find(
            //   // @ts-ignore
            //   (item) => item.id === row.original.id
            // );
            countData = rootCauseCount[row.original.id];
          }
          // Only render the button if it's a subrow (depth > 0)
          if (row.depth > 0 && row.original.has_cause) {
            const done = countData?.done || 0; // Default to 0 if countData is undefined
            // const total = countData?.total || 0; // Default to 0 if countData is undefined
            return (
              <div key={row.id} className="flex gap-1 w-full justify-center">
                {/* <Badge
                  content={`${done}/${total}`}
                  // content={`1`}
                  color={done === total || done != 0 ? "success" : "danger"}
                  className="text-white"
                > */}
                <Button
                  onPress={() => {
                    setSelectedModalId({
                      variableId: row.original.variable.id,
                      detailId: row.original.id,
                    });
                    modalRootCauseOnopen();
                  }}
                  // isLoading={isValidatingRootCauseCount}
                  color={
                    done != 0 ||
                    (goodIndicator === "minus" && gap < 0) ||
                    (goodIndicator === "plus" && gap > 0) ||
                    gap === 0
                      ? "success"
                      : "default"
                  }
                  size="sm"
                  className={`m-0 py-1 px-3 rounded-full my-2 ${
                    done != 0 ||
                    (goodIndicator === "minus" && gap < 0) ||
                    (goodIndicator === "plus" && gap > 0) ||
                    gap === 0
                      ? "text-white"
                      : ""
                  }`}
                >
                  Root Cause
                </Button>
                {/* </Badge> */}
                {/* <Badge content="!" color="danger"> */}
                <Button
                  onPress={() => {
                    setSelectedModalId({
                      variableId: row.original.variable.id,
                      detailId: row.original.id,
                    });
                    modalRootActionOnopen();
                  }}
                  // isLoading={isValidatingRootCauseCount}
                  color={
                    (goodIndicator === "minus" && gap < 0) ||
                    (goodIndicator === "plus" && gap > 0) ||
                    gap === 0
                      ? "success"
                      : "primary"
                  }
                  size="sm"
                  className={`m-0 py-1 px-3 rounded-full my-2 ${
                    done != 0 ||
                    (goodIndicator === "minus" && gap < 0) ||
                    (goodIndicator === "plus" && gap > 0) ||
                    gap === 0
                      ? "text-white"
                      : ""
                  }`}
                >
                  Action
                </Button>
                {/* </Badge> */}
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetTimeframe = useCallback(
    debounce((value) => {
      setPotentialTimeframe(value);
    }, 500), // 500ms delay
    [] // Empty dependency array since we don't want to recreate the debounced function
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      columnVisibility,
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
    filename: `Pareto Heat Loss - ${new Date().toLocaleString("id")}`,
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
        action_menutup_gap: dataItem.action_menutup_gap.join("\n"),
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
        scrollY: -6 * window.scrollY,
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
      // "max-h-[568px]",
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
        action_menutup_gap: dataItem.action_menutup_gap.join("\n"),
      }))
    );
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    // const worksheet_root_cause = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pareto_Heat_Loss");
    // XLSX.utils.book_append_sheet(workbook, worksheet_root_cause, "Root_Cause_Actions");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    return XLSX.writeFile(
      workbook,
      `ParetoData-${new Date().toLocaleString("id")}.xlsx`
    );
  };

  const handlePrint = () => {
    // Trigger the print dialog
    window.print();
  };

  // Load options asynchronously
  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterEfficiencyData(inputValue));
    }, 1000); // Simulating a delay for async data fetching
  };

  // Data
  const EfficiencyDataOptions = selectedEfficiencyData
    .filter((item) => item.status === "Done" && item.id != params)
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
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
        isOpen={modalRootCauseIsopen}
        onOpenChange={modalRootCauseonOpenChange}
        selectedModalId={selectecModalId}
        // @ts-ignore
        data_id={data_id}
        paretoMutate={mutate}
      />

      <ModalRootCauseAction
        isOpen={modalRootActionIsopen}
        onOpenChange={modalRootActionOnOpenChange}
        selectedModalId={selectecModalId}
        // @ts-ignore
        data_id={data_id}
        paretoMutate={mutate}
      />

      <div className="flex justify-between gap-2">
        <div className={`flex gap-3 w-full`}>
          <AsyncSelect
            className="z-50"
            classNamePrefix="select"
            isClearable={true}
            placeholder={`Select Reference Data...`}
            isSearchable={true}
            loadOptions={loadOptions}
            defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
            defaultValue={
              dataId ? { value: dataId, label: selectedLabel } : null
            }
            cacheOptions // Caches the loaded options
            isLoading={isValidating}
            onChange={(e: any) => {
              const newValue = e?.value ?? null;
              const newLabel = e?.label ?? "";
              setDataId(newValue);
              setSelectedLabel(newLabel);
            }}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: 8,
                height: 49,
                borderColor: "rgb(229 229 229)",
                borderWidth: 2,
              }),
            }}
            name="efficiencyData"
          />
          <Input
            type="number"
            className="max-w-xs"
            radius="sm"
            size="sm"
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValueTimeframe(newValue);
              debouncedSetTimeframe(newValue);
            }}
            min={0}
            value={String(inputValueTimeframe)}
            endContent={`jam`}
            label={`Potential Timeframe`}
            variant="bordered"
          />
        </div>
        <div className={`flex gap-3`}>
          <Button
            onClick={() => handleExportExcel()}
            size="sm"
            endContent={<DownloadIcon size={16} />}
          >
            Export to Excel
          </Button>
          <Button
            onClick={() => handleExportData()}
            size="sm"
            endContent={<DownloadIcon size={16} />}
          >
            Export to CSV
          </Button>
          <Button
            onClick={() => handleExportPDFData()}
            size="sm"
            endContent={<DownloadIcon size={16} />}
          >
            Export to PDF
          </Button>
        </div>

        {/* <Button
          onClick={() => handlePrint()}
          color="secondary"
          endContent={<PrinterIcon size={16} />}
        >
          Print table
        </Button> */}
      </div>
      <div className="min-w-full mb-3 mt-1 overflow-auto relative printable-table p-12 shadow-xl rounded-xl">
        <table
          cellPadding=".25"
          cellSpacing="0"
          className={`overflow-y-scroll relative min-w-full ${
            session?.user.user.role === "Management" ? "min-w-full" : ""
          }`}
          style={{
            ...columnSizeVars,
            width: table.getTotalSize(),
          }}
          id="table-pareto"
        >
          <thead className="sticky top-0 z-40  print-cell">
            {table.getHeaderGroups().map((headerGroup: any) => {
              return (
                <tr key={`${headerGroup.id}`}>
                  {headerGroup.headers.map((header: any) => {
                    return (
                      <th
                        key={header.id}
                        className={`relative group text-sm capitalize font-light border-b-1 border-neutral-800 ${
                          header.column.columnDef.meta?.className ?? ""
                        } ${
                          header.column.id === "toDoChecklist" &&
                          session?.user.user.role === "Management"
                            ? "hidden"
                            : ""
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
          <tfoot className="sticky bottom-0 z-50 border-b-1 print-cell">
            <tr className="text-left pb-8">
              <th className="sticky left-0 bg-[#D9E9EE] dark:bg-blue-600 pb-4 px-1">
                Total Summary
              </th>
              <th className="bg-[#D9E9EE] dark:bg-blue-600" colSpan={4}></th>
              <th className="bg-[#D9E9EE] dark:bg-blue-600 text-right pb-4">
                {formattedNumber(summaryData.total_persen.toFixed(2))}
              </th>
              <th className="bg-[#D9E9EE] dark:bg-blue-600 text-right pb-4">
                {formattedNumber(summaryData.total_nilai.toFixed(2))}
              </th>
              <th className="bg-[#D9E9EE] dark:bg-blue-600" colSpan={1}></th>
              <th className="bg-[#D9E9EE] dark:bg-blue-600 text-right pb-4">
                Rp.{formatCurrency(summaryData.total_cost_benefit.toFixed(2))}
              </th>
              {/* <th className="bg-[#D9E9EE] dark:bg-blue-600" colSpan={1}></th> */}
              <th className="bg-[#D9E9EE] dark:bg-blue-600 text-right pb-4">
                Rp.{formatCurrency(summaryData.total_cost_gap.toFixed(2))}
              </th>
              <th className="bg-[#D9E9EE] dark:bg-blue-600" colSpan={4}></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
