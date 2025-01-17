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
// import EditableCell from "./EditableCell";
import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";

const formatIDNumber = (value: any) =>
  new Intl.NumberFormat("id-ID").format(value);

const formatCurrency = (number: any) => {
  // Convert to absolute value to handle negative numbers
  const absNumber = Math.abs(number);

  // Determine the appropriate suffix based on the value
  let formattedNumber;
  let suffix = "";

  if (absNumber >= 1_000_000_000_000) {
    // Trillions
    formattedNumber = (number / 1_000_000_000_000).toFixed(0);
    suffix = " T";
  } else if (absNumber >= 1_000_000_000) {
    // Billions
    formattedNumber = (number / 1_000_000_000).toFixed(0);
    suffix = " M";
  } else if (absNumber >= 1_000_000) {
    // Millions
    formattedNumber = (number / 1_000_000).toFixed(0);
    suffix = " Jt";
  } else if (absNumber >= 1_000) {
    // Millions
    formattedNumber = (number / 1_000).toFixed(0);
    suffix = " Rb";
  } else {
    // Thousands separator for smaller numbers
    formattedNumber = number.toLocaleString("id-ID");
  }

  return formatIDNumber(formattedNumber) + suffix;
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
                <tr key={row.id} className="border-b-1 border-neutral-400">
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className={`text-sm font-normal bg-neutral-50 dark:bg-neutral-700 py-3 px-1 ${
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
                      <tr key={subRow.id} className="py-6">
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

export default function TableParetoTop({
  tableData,
  summaryData,
  mutate,
  isValidating,
  data_id,
  setIsMutating,
  coalPrice,
}: {
  tableData: any;
  summaryData?: any;
  mutate?: any;
  isValidating?: any;
  data_id?: string;
  setIsMutating?: any;
  coalPrice?: any;
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
        header: () => <div className="text-left">Parameter</div>,
        minSize: 60,
        size: 550,
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
        meta: {
          className: "text-left",
        },
        // Access the correct UOM value for each row or sub-row
        accessorFn: (row: any) =>
          row.depth === 0 ? null : row.variable?.satuan || "",
        size: 25,
        cell: (props: any) => (
          <div
            style={{
              paddingLeft: `${props.cell.row.depth * 1}rem`,
            }}
            className="text-left"
          >
            <span className="rounded-full px-4 py-1 bg-[#1C9EB6] text-white">
              {props.getValue() != "NaN" ? props.getValue() : ""}
            </span>
          </div>
        ),
      },
      {
        id: "referenceData",
        header: () => (
          <div className="text-right">
            Reference Data <br />
            (Commision)
          </div>
        ),
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
            {formatIDNumber(props.getValue())}
          </div>
        ),
      },
      {
        id: "existingData",
        header: () => (
          <div className="text-right">
            Existing Data <br />
            (Current)
          </div>
        ),
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
            {formatIDNumber(props.getValue())}
          </div>
        ),
      },
      {
        id: "gap",
        header: () => <div className="text-right">Gap</div>,
        meta: {
          className: "text-right",
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
            return formatIDNumber(num.toFixed(2)); // For normal-sized numbers, show two decimal places
          };

          return (
            <div
              style={{
                paddingLeft: `${props.cell.row.depth * 1}rem`,
              }}
            >
              {value ? formatSmallNumber(Number(value)) : "0"}
            </div>
          );
        },
      },
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
    // @ts-ignore
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
      <div className="max-w-full mb-3 mt-1 overflow-auto relative printable-table shadow-xl p-12 rounded-2xl bg-white">
        <table
          cellPadding="1"
          cellSpacing="0"
          className="overflow-y-scroll relative min-w-full scroll-mt-12"
          style={{
            ...columnSizeVars,
            width: table.getTotalSize(),
          }}
          id="table-pareto-top"
        >
          <thead className="sticky top-0 z-50">
            {table.getHeaderGroups().map((headerGroup: any) => {
              return (
                <tr key={`${headerGroup.id}`}>
                  {headerGroup.headers.map((header: any) => {
                    return (
                      <th
                        key={header.id}
                        className={`relative group text-sm capitalize bg-white border-b-1 font-light  ${
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
        </table>
        <p className={`text-base font-medium py-4`}>
          Coal Price:{" "}
          <span className={`bg-gray-200 px-2 py-1 rounded-full`}>
            Rp. {formatIDNumber(coalPrice)}
          </span>
        </p>
      </div>
    </>
  );
}
