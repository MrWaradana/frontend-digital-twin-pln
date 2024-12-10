"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  DatePicker,
  DateRangePicker,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  DotsVerticalIcon,
  PlusIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
} from "@radix-ui/react-icons";
import { parameterOptions, statusOptions } from "@/lib/efficiency-data";
import { capitalize } from "@/lib/utils";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { useGetThermoStatus } from "@/lib/APIs/useGetThermoStatus";
import { useSession } from "next-auth/react";
import { useSelectedEfficiencyDataStore } from "@/store/selectedEfficiencyData";
import toast from "react-hot-toast";
import { useStatusThermoflowStore } from "@/store/statusThermoflow";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useRouter } from "next/navigation";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";
import { useDateFormatter } from "@react-aria/i18n";
import ModalInputData from "@/components/efficiency-app/ModalInputData";
import { debounce } from "lodash";
import { formattedNumber } from "@/lib/formattedNumber";
import AddNewAssetModal from "@/components/optimum-oh-app/AddNewAssetModal";

const scopeOptions = [
  { name: "A", uid: "A" },
  { name: "B", uid: "B" },
];

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
  "no",
  "location_tag",
  "duration_oh",
  "crew",
  "total_cost",
  "master_equipment",
  "actions",
];

const INITIAL_VISIBLE_PARAMETER = ["current", "periodic"];
const INITIAL_VISIBLE_STATUS = ["Done", "Pending", "Processing"];

export default function TableScope({
  tableData,
  addNewUrl = "#",
  mutate,
  isLoading,
  isValidating,
  thermoStatus,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  pages,
  total_items,
  setFilterSearch,
  setFilterParameter,
  setFilterStatus,
  statusFilter,
  setStatusFilter,
  scopeFilter,
  setScopeFilter,
  filterScope,
  setFilterScope,
}: any) {
  const router = useRouter();
  const [tableState, setTableState] = useState(tableData);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const session = useSession();
  let formatter = useDateFormatter({ dateStyle: "long" });

  //state modal input data
  const [showVariables, setShowVariables] = useState(false);

  const [selectedParameter, setSelectedParameter] = useState("current");

  const [loading, setLoading] = useState(false);

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetFilterSearch = useCallback(
    debounce((value) => {
      setFilterSearch(value);
    }, 500), // 500ms delay
    [] // Empty dependency array since we don't want to recreate the debounced function
  );

  const dateFormat = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: getLocalTimeZone(),
  };

  const columns = [
    { name: "NO", uid: "no", sortable: false },
    { name: "ID", uid: "id", sortable: true },
    { name: "LOCATION TAG", uid: "location_tag", sortable: true },
    { name: "DURATION OH", uid: "duration_oh", sortable: true },
    { name: "RESOURCE (CREW)", uid: "crew", sortable: true },
    { name: "COST OH (Rp.)", uid: "total_cost", sortable: true },
    { name: "DESCRIPTION", uid: "master_equipment", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  type TransactionsType = (typeof tableData)[0];

  const [periodValue, setPeriodValue] = React.useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
  });
  const [modalChoosePeriod, setModalChoosePeriod] = React.useState(false);
  const [loadingEfficiency, setLoadingEfficiency] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
    // "all"
  );

  const [sortDescriptor, setSortDescriptor]: any =
    React.useState<SortDescriptor>({
      column: "age",
      direction: "ascending",
    });

  const hasSearchFilter = Boolean(filterValue);

  const nonPerformanceData = tableData.filter(
    (item: any) =>
      !item.is_performance_test && item.jenis_parameter === "current"
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
        item.master_equipment.name
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }
    // filter non performance data
    filteredData = filteredData.filter((item) => {
      return item.is_performance_test !== true;
    });

    return filteredData;
  }, [tableData, hasSearchFilter, statusFilter, filterValue]);

  // const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const loadingState = isLoading || isValidating ? "loading" : "idle";

  // const items = React.useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;
  //   return filteredItems.slice(start, end);
  // }, [page, filteredItems, rowsPerPage,]);

  const sortedItems = React.useMemo(() => {
    // Since we're using server-side pagination, we only sort the current page
    if (!filteredItems || filteredItems.length === 0) return [];

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];

      // Handle null/undefined values
      if (first === null || first === undefined) return 1;
      if (second === null || second === undefined) return -1;

      // Handle different data types
      if (typeof first === "number" && typeof second === "number") {
        return sortDescriptor.direction === "descending"
          ? second - first
          : first - second;
      }

      // Handle dates
      if (first instanceof Date && second instanceof Date) {
        return sortDescriptor.direction === "descending"
          ? second.getTime() - first.getTime()
          : first.getTime() - second.getTime();
      }

      // Default string comparison
      const firstStr = String(first).toLowerCase();
      const secondStr = String(second).toLowerCase();
      const cmp = firstStr.localeCompare(secondStr);

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor, tableData]);

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
        setTableState(updatedData);
        toast.success("Data deleted successfully!");
        setDeleteModalOpen(false); // Close the modal
      } else {
        console.error("Failed to delete");
        toast.error("Failed to delete data, try again later...");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error(`Error: ${error || "Unknown error occurred"}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Handler for date range changes
  const handleDateRangeChange = (range) => {
    if (!range.start || !range.end) return;

    const daysDifference = Math.abs(Number(range.end) - Number(range.start));

    if (daysDifference > 30) {
      // If selected range is more than 30 days, adjust the start date
      setPeriodValue({
        //@ts-ignore
        start: Number(range.end) - 30,
        end: range.end,
      });
    } else {
      setPeriodValue(range);
    }
  };
  const handlePeriod = () => {
    const url = `${addNewUrl}?parameter=periodic&start_date=${periodValue.start}&end_date=${periodValue.end}`;
    router.push(url);
  };

  const renderCell = React.useCallback(
    (rowData: TransactionsType, columnKey: React.Key, rowIndex: number) => {
      const cellValue = rowData[columnKey as keyof TransactionsType];

      switch (columnKey) {
        case "no":
          return <div>{(page - 1) * rowsPerPage + rowIndex + 1}.</div>;
        case "master_equipment":
          return cellValue.name;
        case "location_tag":
          return rowData.master_equipment?.location_tag;
        case "total_cost":
          return <div className={``}>Rp. {formattedNumber(cellValue)}</div>;
        case "crew":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{rowData.scope?.crew}</p>
            </div>
          );
        case "duration_oh":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">
                {rowData.scope?.duration_oh} days
              </p>
            </div>
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
                      radius="full"
                      className=" bg-[#1C9EB6]"
                      // isDisabled={!thermoStatus}
                    >
                      <DotsVerticalIcon className="text-white dark:text-black text-2xl" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    {/* <DropdownItem href={`/efficiency-app/heat-rate`}>
                  Heat Rate
                </DropdownItem> */}
                    {/* <DropdownItem
                      className={rowData.status != "Done" ? "hidden" : ""}
                      href={`/efficiency-app/${rowData.id}/engine-flow`}
                    >
                      Engine Flow
                    </DropdownItem> */}
                    <DropdownItem href={`#`}>Edit</DropdownItem>
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
    [page, rowsPerPage]
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
      // setPage(1);
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
        <h3 className="text-2xl font-semibold">Budget Constraint</h3>
        <Select
          labelPlacement={`outside-left`}
          disallowEmptySelection
          size="sm"
          label="Scope"
          className="max-w-xs items-center"
          onChange={(e) => {
            const newValue = e.target.value;
            setScopeFilter(newValue);
            setFilterScope(newValue);
          }}
          defaultSelectedKeys={["A"]}
        >
          {scopeOptions.map((scope) => (
            <SelectItem key={scope.uid}>{scope.name}</SelectItem>
          ))}
        </Select>
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] bg-white rounded-full"
            classNames={{
              mainWrapper: ["!rounded-full"],
            }}
            label={`Input Budget`}
            startContent={`Rp.`}
            labelPlacement={`outside`}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={(value) => {
              onSearchChange(value);
              debouncedSetFilterSearch(value);
            }}
          />
          <div className="flex gap-3">
            <AddNewAssetModal filterScope={filterScope} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Showing {filteredItems.length}{" "}
            {filterValue
              ? ""
              : `item from total of ${
                  total_items ? total_items : nonPerformanceData.length
                }${" "}`}
            {filterValue ? ` for \"${filterValue}\"` : ""}
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
    scopeFilter,
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
          onChange={(page) => {
            mutate();
            setPage(page);
          }}
          hidden={isValidating}
          classNames={{
            cursor: "bg-[#1C9EB6]",
          }}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            hidden={total_items > 0 ? false : true}
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1 || pages === 0 || pages - page == 0}
            size="sm"
            variant="flat"
            hidden={total_items > 0 ? false : true}
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [filteredItems.length, page, pages, hasSearchFilter]);

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
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isDeleteLoading}
                // onPress={handleDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const classNames = React.useMemo(
    () => ({
      wrapper: ["min-h-full"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      thead: [
        "bg-transparent",
        "shadow-none",
        "![&>tr]:first:shadow-none",
        "![&_tr]:shadow-none",
        "![&>tr]:first:!shadow-none",
      ],
      tr: ["shadow-none", "bg-transparent", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <>
      {deleteConfirmationModal}
      <Table
        aria-label="Efficiency Data Table"
        isCompact
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        color="primary"
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="single"
        selectionBehavior="replace"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="inside"
        // onSelectionChange={(value) => {
        //   handleSelectedId(value);
        // }}
        onSortChange={setSortDescriptor}
      >
        <TableHeader
          columns={headerColumns}
          className="bg-transparent shadow-none"
        >
          {(column: any) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={`No data found`}
          loadingState={loadingState}
          loadingContent={
            <>
              <Spinner color="primary" label="loading..." />
            </>
          }
          items={sortedItems ?? []}
        >
          {(item: TransactionsType) => {
            const rowIndex =
              sortedItems?.findIndex((row) => row.id === item.id) ?? 0;
            return (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey, rowIndex)}</TableCell>
                )}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </>
  );
}
