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
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Checkbox,
} from "@nextui-org/react";
import { Box } from "lucide-react";

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

export default function TableParetoHeatloss({ tableData }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = React.useState(tableData);
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);

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
        cell: ({ row }) => {
          const rows = Array.from({ length: 18 });
          return (
            <React.Fragment key={row.id}>
              <Button
                onPress={onOpen}
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
    debugTable: true,
  });

  return (
    <>
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
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <table
        cellPadding="2"
        cellSpacing="0"
        className="border-2  overflow-y-scroll"
        width={table.getTotalSize()}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup: any) => {
            return (
              <tr key={`${headerGroup.id}`} className="bg-primary/20">
                {headerGroup.headers.map((header: any) => {
                  return (
                    <th
                      key={header.id}
                      className="border-2 border-neutral-300 relative group text-sm capitalize font-bold"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      <div
                        className="absolute top-0 right-0 h-full w-[8px] group-hover:bg-primary/30 group-focus:bg-primary/30 hover:cursor-col-resize"
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
                        className="text-sm font-normal"
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
    </>
  );
}
