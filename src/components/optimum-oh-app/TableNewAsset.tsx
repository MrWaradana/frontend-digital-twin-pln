import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_RowSelectionState,
} from "mantine-react-table";
import { useState } from "react";
import { Button, JsonInput } from "@mantine/core";
import { Spinner } from "@nextui-org/react";

const data = [
  {
    locationTag: "asd",
    durationOh: "asd",
    resources: "asd",
    cost: "asd",
    description: "asd",
  },
];

export default function TableNewAsset({
  dataTable,
  isLoading,
  totalPages,
  itemsPerPage,
  pagination,
  setPagination,
  mutate,
  totalItems,
}: any) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "assetnum",
          header: "ASSET NUM",
        },
        {
          accessorKey: "location_tag",
          header: "LOCATION TAG",
        },
        {
          accessorKey: "name",
          header: "NAME",
        },
      ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: dataTable,
    initialState: {
      density: "xs",
      columnVisibility: { assetnum: false },
      pagination: {
        pageIndex: 0,
        pageSize: itemsPerPage,
      },
    },
    enableSelectAll: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      isLoading,
      pagination,
    },
    mantineSelectCheckboxProps: { color: "red", size: "lg" },
    positionToolbarAlertBanner: "head-overlay",
    manualPagination: true,
    onPaginationChange: (state: any) => {
      setPagination(state);
    },
    pageCount: totalPages,
    rowCount: totalItems,
    renderBottomToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          const selectedRows = table.getSelectedRowModel().rows;
          alert(JSON.stringify(selectedRows));
        }}
      >
        Download Selected Users
      </Button>
    ),
  });

  return <>{isLoading ? <Spinner /> : <MantineReactTable table={table} />}</>;
}
