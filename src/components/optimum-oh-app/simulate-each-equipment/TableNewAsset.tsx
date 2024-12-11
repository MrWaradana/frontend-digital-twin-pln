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
import { usePostNewAsset } from "@/lib/APIs/mutation/usePostNewAsset";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { classNames } from "primereact/utils";

export default function TableNewAsset({
  dataTable,
  isLoading,
  totalPages,
  itemsPerPage,
  pagination,
  setPagination,
  mutate,
  totalItems,
  filterScope,
}: any) {
  const { data: session } = useSession();
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); //ts type available

  const { data, trigger, error, isMutating } = usePostNewAsset(
    session?.user.access_token
  );

  const handleSubmitNewAsset = async (values: any) => {
    try {
      const result = await trigger({
        token: session?.user.access_token,
        body: { scope_name: filterScope, assetnums: values },
      });

      // Check if values array is empty
      if (!values || values.length === 0) {
        toast.error("Please select at least one asset");
        return;
      }

      // Success case
      if (result) {
        toast.success("Assets added successfully");
        // Optionally refresh data or clear selection
        mutate?.();
        setRowSelection({});
      }
    } catch (err) {
      // Error case
      toast.error(err instanceof Error ? err.message : "Failed to add assets");
    }
  };

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
          meta: {
            classNames: "text-wrap text-xs w-full overflow-wrap",
          },
          size: 100,
        },
      ] as MRT_ColumnDef<(typeof dataTable)[0]>[],
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
    positionPagination: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <div className={`w-full flex `}>
        <Button
          onClick={() => {
            const selectedRows = table.getSelectedRowModel().rows;
            let selectedAsset = selectedRows.map(
              (item) => item.original.assetnum
            );
            handleSubmitNewAsset(selectedAsset);
          }}
          loading={isMutating}
        >
          Add
        </Button>
      </div>
    ),
  });

  return (
    <div className={`w-full m-auto`}>
      {isLoading ? (
        <div className={`w-full flex items-center justify-center`}>
          <Spinner />
        </div>
      ) : (
        <MantineReactTable table={table} />
      )}
    </div>
  );
}
