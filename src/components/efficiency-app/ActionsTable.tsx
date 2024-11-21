"use client";

import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";

interface ActionData {
  actions: string[];
  id: string;
  is_pareto: boolean | null;
  variable_category: string;
  variable_id: string;
  variable_name: string;
}

interface ActionSubRow {
  problem: string;
  check: string;
  action: string;
}

export default function ActionsTable({ data }: { data: ActionData[] }) {
  // Function to parse action strings into structured data
  const parseActionString = (actionStr: string): ActionSubRow => {
    const [problem, check, action] = actionStr.split(" | ");
    return {
      problem,
      check,
      action,
    };
  };

  // Process data to include parsed actions
  const processedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        subRows: item.actions.map(parseActionString),
      })),
    [data]
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "variable_name",
        header: "Variable Name",
      },
      {
        accessorKey: "variable_category",
        header: "Category",
      },
    ],
    []
  );

  const subRowColumns = useMemo<MRT_ColumnDef<ActionSubRow>[]>(
    () => [
      {
        accessorKey: "problem",
        header: "Problem",
      },
      {
        accessorKey: "check",
        header: "Check",
      },
      {
        accessorKey: "action",
        header: "Action",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: processedData,
    renderDetailPanel: ({ row }) => (
      <MantineReactTable
        columns={subRowColumns}
        data={row.original.subRows}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={false}
        enableSorting={false}
      />
    ),
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleExpandedHandler(),
      sx: { cursor: "pointer" },
    }),
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
}
