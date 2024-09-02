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
  aggregationFns,
} from "@tanstack/react-table";
import { makeData, Person, ParetoType } from "../../lib/makeData";
import {
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
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

const checkboxColumn = [
  "Macrofouling",
  "Microfouling",
  "Excessive Air in leakage",
  "Inadequate air removal capacity",
  "Increase CW System Resistance",
  "- Air binding cond. Disch. Pipe/tunnel",
  "- Macrofouling at CW pump disch. Piping",
  "- Plugged condenser tube",
  "- Condenser inlet/outlet valve not open",
  "- Air binding condensor inlet-outlet waterbox (low waterbox level)",
  "Decrease CW Pump Performance",
  "- Pump casing or impeller wear/corrosion",
  "- Damaged casing or impeller",
  "- Pump cavitation",
  "- Macrofouling / siltation of intake/struct",
  "- Low inlet pump level",
  "Decrease Ejector/Vacuum pump performance",
  "Instrument Error",
];

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

    return typeof initialValue === "number" ? (
      <input
        value={value as number}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type="number"
        className="border border-primary/20 rounded-md bg-neutral-100 max-w-24 my-1 mx-2"
      />
    ) : (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="border border-primary/20 rounded-md bg-neutral-100 max-w-24 my-1 mx-2"
      />
    );
  },
};

const displayOnlyColumn: Partial<ColumnDef<ParetoType>> = {
  cell: ({ getValue }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mounted, setMounted] = React.useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      setMounted(true);
    }, []);

    return mounted ? <p className="p-1">{getValue() as string}</p> : null;
  },
};

export default function TableParetoEdit() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const rerender = React.useReducer(() => ({}), {})[1];

  const columns = React.useMemo<ColumnDef<ParetoType>[]>(
    () => [
      {
        header: "PARAMETER",
        accessorKey: "parameter",
        footer: "Total",
        ...displayOnlyColumn,
      },
      {
        header: "UOM",
        accessorKey: "uom",
        ...displayOnlyColumn,
      },
      {
        header: "REFERENCE DATA",
        columns: [
          {
            header: "(Commisioning & Design Data)",
            accessorKey: "cdd",

            ...displayOnlyColumn,
          },
        ],
      },
      {
        header: "EXISTING DATA",
        columns: [
          {
            header: "(Average Data 2012 SM 1)",
            accessorKey: "average",

            ...displayOnlyColumn,
          },
        ],
      },
      {
        header: "GAP",
        accessorKey: "gap",
        ...displayOnlyColumn,
      },
      {
        header: "FAKTOR KOREKSI",
        columns: [
          {
            header: "% HR",
            accessorKey: "hr",
            ...defaultColumn,
          },
          {
            header: "DEVIASI",
            accessorKey: "deviasi",
            ...defaultColumn,
          },
        ],
      },
      {
        header: "NILAI LOSSES",
        columns: [
          {
            header: "% ABSOLUTE",
            accessorKey: "absolute",
            aggregationFn: "sum",
            aggregatedCell: (props) => {
              const total = props.getValue();
              return total;
            },
            footer: (props) => {
              const total = "1,10";
              return <p>{total}</p>;
            },
            ...displayOnlyColumn,
          },
          {
            header: "kCal/kWh",
            accessorKey: "kcal",
            footer: "1,55",
            ...displayOnlyColumn,
          },
        ],
      },
      {
        header: "SYMPTOMPS",
        accessorKey: "symptomps",
        // footer: (props) => props.column.id,
        cell: ({ getValue }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [mounted, setMounted] = React.useState(false);

          // eslint-disable-next-line react-hooks/rules-of-hooks
          React.useEffect(() => {
            setMounted(true);
          }, []);
          if ((getValue() as string) == "Higher") {
            return mounted ? (
              <p className="p-1 bg-blue-400">{getValue() as string}</p>
            ) : null;
          } else {
            return mounted ? (
              <p className="p-1 bg-red-400">{getValue() as string}</p>
            ) : null;
          }
        },
        // ...displayOnlyColumn,
      },
      {
        header: "POTENTIAL BENEFIT (Rp.)",
        accessorKey: "benefit",
        // footer: (props) => props.column.id,
        ...displayOnlyColumn,
      },
      {
        header: "ACTION MENUTUP GAP",
        accessorKey: "actionGap",
        // footer: (props) => props.column.id,
        ...displayOnlyColumn,
      },
      {
        header: "BIAYA UNTUK CLOSING GAP (Rp.)",
        accessorKey: "closing",
        // footer: (props) => props.column.id,
        ...displayOnlyColumn,
      },
      {
        header: "RATIO BENEFIT TO COST",
        accessorKey: "ratio",
        // footer: (props) => props.column.id,
        ...displayOnlyColumn,
      },
      {
        header: "ACTION",
        accessorKey: "actions",
        // footer: (props) => props.column.id,
        cell: ({ row }) => {
          const rows = Array.from({ length: 18 });
          return (
            <React.Fragment key={row.id}>
              <Button onPress={onOpen} color="primary" className="m-2">
                Open Checkbox
              </Button>
            </React.Fragment>
          );
        },
      },
    ],
    []
  );

  const [data, setData] = React.useState([
    {
      parameter: "Boiler fuel efficiency (LHV)",
      uom: "%",
      cdd: 75.52,
      average: 72.36,
      gap: 0.05,
      hr: 100,
      deviasi: 1,
      absolute: 0.25,
      kcal: 0.05,
      symptomps: "Higher",
      benefit: 0.3,
      actionGap: "Action",
      closing: 0.05,
      ratio: 0.7,
      actions: "Action",
    },
    {
      parameter: "Boiler fuel efficiency (HHV)",
      uom: "%",
      cdd: 34.56,
      average: 72.36,
      gap: 0.65,
      hr: 100,
      deviasi: 1,
      absolute: 0.25,
      kcal: 0.44,
      symptomps: "Lower",
      benefit: 0.86,
      actionGap: "Action",
      closing: 0.16,
      ratio: 0.63,
      actions: "Action",
    },
    {
      parameter: "Furnace w/ Pulverizer [7]: Pressure",
      uom: "bar",
      cdd: 34.56,
      average: 72.36,
      gap: 0.59,
      hr: 100,
      deviasi: 1,
      absolute: 0.27,
      kcal: 0.97,
      symptomps: "Lower",
      benefit: 0.72,
      actionGap: "Action",
      closing: 0.2,
      ratio: 0.02,
      actions: "Action",
    },
    {
      parameter: "Furnace w/ Pulverizer [7]: Mass flow",
      uom: "t/h",
      cdd: 34.56,
      average: 72.36,
      gap: 0.97,
      hr: 100,
      deviasi: 1,
      absolute: 0.33,
      kcal: 0.09,
      symptomps: "Higher",
      benefit: 0.72,
      actionGap: "Action",
      closing: 0.15,
      ratio: 0.49,
      actions: "Action",
    },
  ]);
  const refreshData = () => setData(() => makeData(5));

  // console.log(data, "data tabel");

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    aggregationFns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex: any, columnId: any, value: any) => {
        setData((old: any) =>
          old.map((row: any, index: any) => {
            if (index === rowIndex) {
              // Get the original value type
              const originalValue = old[rowIndex][columnId];

              // Perform type conversion based on the original value type
              let newValue;
              if (typeof originalValue === "number") {
                newValue = parseFloat(value);
                if (isNaN(newValue)) newValue = 0; // Fallback if parsing fails
              } else if (typeof originalValue === "boolean") {
                newValue = value === "true" || value === true;
              } else {
                newValue = value; // Default case for strings or other types
              }

              return {
                ...old[rowIndex],
                [columnId]: newValue,
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
      <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
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
                                  <input className="border bg-neutral-200 py-1 px-1 rounded-md" />
                                </>
                              ) : (
                                `` // Render a string for other rows in the first column
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
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="h-2" />
      <div className="max-w-full px-12 overflow-x-auto">
        <table>
          <thead className="bg-primary/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="border-1 border-black px-2 py-1"
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
                      <td key={cell.id} className="border-b-1 border-black/20">
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
          <tfoot className="bg-neutral-300 border-t-1 border-black">
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <td key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      <div className="h-2" />
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
  // if column id key is uom, don't show filter
  if (column.id === "uom" || column.id === "actions") {
    return null;
  }
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  // If the column's accessorKey is 'uom', return null to hide the filter

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      {/* <input
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
      /> */}
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
