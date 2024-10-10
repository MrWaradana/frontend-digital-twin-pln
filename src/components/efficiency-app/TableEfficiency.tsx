"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Link,
  Spinner,
} from "@nextui-org/react";
import {
  DotsVerticalIcon,
  PlusIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { parameterOptions } from "@/lib/efficiency-data";
import { capitalize } from "@/lib/utils";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { useSession } from "next-auth/react";
import { useSelectedEfficiencyDataStore } from "../../store/selectedEfficiencyData";
import toast from "react-hot-toast";

const parameterColorMap: Record<string, ChipProps["color"]> = {
  current: "success",
  Niaga: "primary",
  Commision: "warning",
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  Done: "primary",
  Processing: "warning",
  Failed: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "jenis_parameter",
  "is_performance_test",
  "periode",
  "status",
  "actions",
];
const INITIAL_VISIBLE_PARAMETER = ["current"];

export default function TableEfficiency({
  tableData,
  addNewUrl = "#",
  mutate,
  efficiencyLoading,
  isValidating,
  thermoStatus,
}: {
  tableData: any;
  addNewUrl?: string;
  mutate: any;
  efficiencyLoading: any;
  isValidating: boolean;
  thermoStatus: any;
}) {
  const [tableState, setTableState] = React.useState(tableData);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const session = useSession();

  // console.log(tableData, "table data");

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAMA", uid: "name", sortable: true },
    { name: "JENIS PARAMETER", uid: "jenis_parameter", sortable: true },
    { name: "PERIODE", uid: "periode", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  type TransactionsType = (typeof tableData)[0];

  const [loadingEfficiency, setLoadingEfficiency] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [parameterFilter, setParameterFilter] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_PARAMETER)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const selectedEfficiencyData = useSelectedEfficiencyDataStore(
    (state) => state.selectedEfficiencyData
  ); // Retrieve currentKey from Zustand

  useEffect(() => {
    if (selectedEfficiencyData) {
      setSelectedKeys(new Set([selectedEfficiencyData])); // Convert currentKey to Set and update the state
    }
  }, [selectedEfficiencyData]);

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const nonPerformanceData = tableData.filter(
    (item: any) => !item.is_performance_test
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) =>
      Array.from(visibleColumns).includes(column.uid.toLowerCase())
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...tableData];
    if (hasSearchFilter && filteredData.length != 0) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      parameterFilter !== "all" &&
      Array.from(parameterFilter).length !== parameterOptions.length
    ) {
      filteredData = filteredData.filter((item) =>
        Array.from(parameterFilter).includes(item.jenis_parameter)
      );
    }
    // filter non performance data
    filteredData = filteredData.filter((item) => {
      return item.is_performance_test !== true;
    });

    return filteredData;
  }, [tableData, filterValue, parameterFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TransactionsType, b: TransactionsType) => {
      const first = a[
        sortDescriptor.column as keyof TransactionsType
      ] as number;
      const second = b[
        sortDescriptor.column as keyof TransactionsType
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      setLoadingEfficiency(false);
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items, tableState]);

  // Function to delete the selected row
  const handleDelete = async () => {
    if (!selectedRowId) return;
    setLoadingEfficiency(isValidating);
    setIsDeleteLoading(true);
    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/data/${selectedRowId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.data?.user.access_token}`,
          },
        }
      );
      if (response.ok) {
        // Remove the item from tableData after successful deletion
        const updatedData = tableData.filter(
          (item: TransactionsType) => item.id !== selectedRowId
        );
        mutate();
        setLoadingEfficiency(isValidating);
        setTableState(updatedData);
        toast.success("Data deleted succesfully!");
        setDeleteModalOpen(false); // Close the modal
      } else {
        console.error("Failed to delete");
        toast.error("Failed to delete data, try again later...");
      }
    } catch (error) {
      toast.error(`${error}`);
      console.error("Error deleting data:", error);
      setIsDeleteLoading(false);
    }
  };

  const renderCell = React.useCallback(
    (rowData: TransactionsType, columnKey: React.Key) => {
      const cellValue = rowData[columnKey as keyof TransactionsType];

      switch (columnKey) {
        case "name":
          return (
            <Link
              size="sm"
              href={`/efficiency-app/${rowData.id}/output`}
              underline={"hover"}
            >
              {cellValue}
            </Link>
          );
        case "jenis_parameter":
          return (
            <Chip
              className="capitalize"
              color={parameterColorMap[rowData.jenis_parameter]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "periode":
          return cellValue;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[rowData.status]}
              size="sm"
              variant="flat"
            >
              {cellValue ? cellValue : "No Data"}
            </Chip>
          );
        case "actions":
          return (
            <>
              <div className="relative flex justify-center items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="solid"
                      color="primary"
                      // isDisabled={!thermoStatus}
                    >
                      <DotsVerticalIcon className="text-white dark:text-black text-2xl" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {/* <DropdownItem href={`/efficiency-app/heat-rate`}>
                  Heat Rate
                </DropdownItem> */}
                    <DropdownItem href={`/efficiency-app/engine-flow`}>
                      Engine Flow
                    </DropdownItem>
                    <DropdownItem
                      href={`/efficiency-app/${rowData.id}/pareto?percent-threshold=${rowData.persen_threshold}`}
                    >
                      Pareto Heat Loss
                    </DropdownItem>
                    <DropdownItem href={`/efficiency-app/${rowData.id}/output`}>
                      View
                    </DropdownItem>
                    {/* <DropdownItem href="#">Edit</DropdownItem>*/}
                    <DropdownItem
                      onPress={() => {
                        setSelectedRowId(rowData.id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete {rowData.name}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<MagnifyingGlassIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Parameter
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={parameterFilter}
                selectionMode="multiple"
                onSelectionChange={setParameterFilter}
              >
                {parameterOptions.map((parameter: any) => (
                  <DropdownItem key={parameter.uid} className="capitalize">
                    {capitalize(parameter.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column: any) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              as={Link}
              href={addNewUrl}
              isDisabled={thermoStatus ? thermoStatus : false}
              isLoading={thermoStatus ? thermoStatus : false}
              color="primary"
              startContent={
                <PlusIcon className={`${thermoStatus ? "hidden" : ""}`} />
              }
            >
              {!thermoStatus ? "Add New" : "Processing Data..."}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {nonPerformanceData.length} data
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    parameterFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    tableData.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {/* {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`} */}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  // The modal that shows up when attempting to delete an item
  const deleteConfirmationModal = (
    <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                isLoading={isDeleteLoading}
                onPress={handleDelete}
              >
                Delete
              </Button>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  // if (isDeleteLoading) {
  //   return (
  //     <div>
  //       <Spinner label="Validating..." />
  //     </div>
  //   );
  // }

  return (
    <>
      {deleteConfirmationModal}
      <Table
        aria-label="Efficiency Data Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        color="primary"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        selectionBehavior="replace"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={(value) => {
          setSelectedKeys(value);
          useSelectedEfficiencyDataStore
            .getState()
            //@ts-ignore
            .setSelectedEfficiencyData(value);
        }}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={`No ${parameterFilter} data found`}
          isLoading={efficiencyLoading}
          loadingContent={
            <>
              <Spinner color="primary" label="loading..." />
            </>
          }
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
