import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_TableOptions,
  useMantineReactTable,
} from "mantine-react-table";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMemo } from "react";
import { formattedNumber } from "@/lib/formattedNumber";

export default function AssetTablePerYear({ data }: any) {
  // Transform the data to create rows from columns
  const transformData = (originalData: any) => {
    if (!originalData || originalData.length === 0) return [];

    return [
      { metric: "CM Labor Cost", value: originalData[0].rc_cm_labor_cost },
      {
        metric: "CM Material Cost",
        value: originalData[0].rc_cm_material_cost,
      },
      { metric: "Lost Cost", value: originalData[0].rc_lost_cost },
      {
        metric: "Maintenance Cost",
        value: originalData[0].rc_maintenance_cost,
      },
      { metric: "OH Labor Cost", value: originalData[0].rc_oh_labor_cost },
      {
        metric: "OH Material Cost",
        value: originalData[0].rc_oh_material_cost,
      },
      { metric: "Operation Cost", value: originalData[0].rc_operation_cost },
      { metric: "PM Labor Cost", value: originalData[0].rc_pm_labor_cost },
      {
        metric: "PM Material Cost",
        value: originalData[0].rc_pm_material_cost,
      },
      {
        metric: "Predictive Labor Cost",
        value: originalData[0].rc_predictive_labor_cost,
      },
      {
        metric: "Project Material Cost",
        value: originalData[0].rc_project_material_cost,
      },
      { metric: "Total Cost", value: originalData[0].rc_total_cost },
    ];
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "metric",
        header: "Type",
        size: 200,
        Cell: ({ row }) => (
          <Box
            style={{
              backgroundColor:
                row.original.metric === "Total Cost"
                  ? "#f0f7ff"
                  : "transparent",
            }}
          >
            <Text fw={row.original.metric === "Total Cost" ? 700 : 400}>
              {row.original.metric}
            </Text>
          </Box>
        ),
      },
      {
        accessorKey: "value",
        header: "Cost (Rp.)",
        size: 150,
        Cell: ({ row }) => (
          <Box
            style={{
              backgroundColor:
                row.original.metric === "Total Cost"
                  ? "#f0f7ff"
                  : "transparent",
            }}
          >
            <Text fw={row.original.metric === "Total Cost" ? 700 : 400}>
              {typeof row.original.value === "number"
                ? formattedNumber(row.original.value.toFixed(2))
                : row.original.value}
            </Text>
          </Box>
        ),
      },
    ],
    []
  );

  const transformedData = useMemo(() => transformData(data), [data]);

  const table = useMantineReactTable({
    columns,
    data: transformedData,
    enableColumnFilters: true,
    enableColumnActions: false,
    enableColumnDragging: false,
    enableSorting: true,
    enableTopToolbar: true,
    mantineTableProps: {
      striped: false,
      highlightOnHover: false,
    },
    initialState: {
      density: "xs",
      pagination: {
        pageSize: 30,
        pageIndex: 0,
      },
    },
  });

  return <MantineReactTable table={table} />;
}
