"use client";

import React from "react";
import ReactDOM from "react-dom/client";

//
// import "./index.css";

//
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { makeData, Person, ParetoType } from "../../lib/makeData";
import {
  Button,
  Checkbox,
  Input,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table as NextTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<ParetoType>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export default function TableParetoEdit() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const columns = React.useMemo<ColumnDef<ParetoType>[]>(
    () => [
      {
        header: "PARAMETER",
        accessorKey: "parameter",
        footer: (props) => props.column.id,
      },
      {
        header: "UOM",
        accessorKey: "uom",
        footer: (props) => props.column.id,
      },
      {
        header: "REFERENCE DATA",
        footer: (props) => props.column.id,
        columns: [
          {
            header: "(Commisioning & Design Data)",
            accessorKey: "cdd",
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "EXISTING DATA",
        footer: (props) => props.column.id,
        columns: [
          {
            header: "(Average Data 2012 SM 1)",
            accessorKey: "average",
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "GAP",
        accessorKey: "gap",
        footer: (props) => props.column.id,
      },
      {
        header: "FAKTOR KOREKSI",
        footer: (props) => props.column.id,
        columns: [
          {
            header: "% HR",
            accessorKey: "hr",
            footer: (props) => props.column.id,
          },
          {
            header: "deviasi",
            accessorKey: "DEVIASI",
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "NILAI LOSSES",
        footer: (props) => props.column.id,
        columns: [
          {
            header: "% ABSOLUTE",
            accessorKey: "absolute",
            footer: (props) => props.column.id,
          },
          {
            header: "kCal/kWh",
            accessorKey: "kcal",
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "SYMPTOMPS",
        accessorKey: "symptomps",
        footer: (props) => props.column.id,
      },
      {
        header: "POTENTIAL BENEFIT (Rp.)",
        accessorKey: "benefit",
        footer: (props) => props.column.id,
      },
      {
        header: "ACTION MENUTUP GAP",
        accessorKey: "actionGap",
        footer: (props) => props.column.id,
      },
      {
        header: "BIAYA UNTUK CLOSING GAP (Rp.)",
        accessorKey: "closing",
        footer: (props) => props.column.id,
      },
      {
        header: "RATIO BENEFIT TO COST",
        accessorKey: "ratio",
        footer: (props) => props.column.id,
      },
      {
        header: "ACTION",
        accessorKey: "actions",
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          const rows = Array.from({ length: 18 });
          return (
            <React.Fragment key={row.id}>
              <Popover placement="bottom" showArrow offset={10}>
                <PopoverTrigger>
                  <Button color="primary">Root Cause Checkbox</Button>
                </PopoverTrigger>
                <PopoverContent className="">
                  {(titleProps) => (
                    <div className="px-1 py-2 w-[480px] overflow-ellipsis">
                      <p
                        className="text-small font-bold text-foreground"
                        {...titleProps}
                      >
                        Root Cause Checkbox
                      </p>
                      {/* <div className="mt-2 flex flex-row gap-2 w-full overflow-x-scroll">
                        <Checkbox defaultSelected>
                          Kondensor TTD dan ∆ P naik{" "}
                        </Checkbox>
                        <Checkbox defaultSelected></Checkbox>
                        <Checkbox defaultSelected></Checkbox>
                        <Checkbox defaultSelected></Checkbox>
                        <Checkbox defaultSelected></Checkbox>
                      </div> */}
                      <NextTable
                        aria-label="Root Cause Checkbox"
                        className=" h-[320px] overflow-y-scroll"
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
                          {rows.map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {[1, 2, 3, 4, 5, 6].map((colIndex) => (
                                <TableCell key={colIndex}>
                                  {colIndex === 1 ? (
                                    rowIndex === 0 ? (
                                      "" // Leave the first cell of the first row empty
                                    ) : (
                                      `Row ${rowIndex} - Text` // Render a string for other rows in the first column
                                    )
                                  ) : (
                                    <>
                                      <Checkbox
                                        defaultChecked
                                        name={`${rowIndex * 5 + colIndex}`}
                                        className={`${
                                          rowIndex === 0 ? "hidden" : ""
                                        }`}
                                      />
                                      <p
                                        className={`${
                                          rowIndex != 0 ? "hidden" : ""
                                        }`}
                                      >
                                        {`Column ${colIndex - 1}`}
                                      </p>
                                    </>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </NextTable>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              {/* <Button
                as={Link}
                href={`/efficiency-app/TFELINK.xlsm/pareto/root-cause`}
                color="primary"
                variant="flat"
                className="m-1"
              >
                Go to Root Cause Checklist {`>`}
              </Button> */}
            </React.Fragment>
          );
        },
      },
      //   {
      //     header: "Name",
      //     footer: (props) => props.column.id,
      //     columns: [
      //       {
      //         accessorKey: "firstName",
      //         footer: (props) => props.column.id,
      //       },
      //       {
      //         accessorFn: (row) => row.lastName,
      //         id: "lastName",
      //         header: () => <span>Last Name</span>,
      //         footer: (props) => props.column.id,
      //       },
      //     ],
      //   },
      //   {
      //     header: "Info",
      //     footer: (props) => props.column.id,
      //     columns: [
      //       {
      //         accessorKey: "age",
      //         header: () => "Age",
      //         footer: (props) => props.column.id,
      //       },
      //       {
      //         header: "More Info",
      //         columns: [
      //           {
      //             accessorKey: "visits",
      //             header: () => <span>Visits</span>,
      //             footer: (props) => props.column.id,
      //           },
      //           {
      //             accessorKey: "status",
      //             header: "Status",
      //             footer: (props) => props.column.id,
      //           },
      //           {
      //             accessorKey: "progress",
      //             header: "Profile Progress",
      //             footer: (props) => props.column.id,
      //           },
      //         ],
      //       },
      //     ],
      //   },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(1000));
  const refreshData = () => setData(() => makeData(1000));

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <div className="max-w-full px-12 overflow-x-scroll">
        <table className="border ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="border"
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </div>
  );
}
function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

// const rootElement = document.getElementById("root");
// if (!rootElement) throw new Error("Failed to find the root element");

// ReactDOM.createRoot(rootElement).render(
//   <React.StrictMode>
//     <TableParetoEdit />
//   </React.StrictMode>
// );
