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
import { OPTIMUM_OH_API_URL } from "@/lib/api-url";
import { useSession } from "next-auth/react";
import { useSelectedEfficiencyDataStore } from "@/store/selectedEfficiencyData";
import toast from "react-hot-toast";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";
import { useDateFormatter } from "@react-aria/i18n";
import { debounce } from "lodash";
import { formattedNumber } from "@/lib/formattedNumber";

const scopeOptions = [
  { name: "A", uid: "A" },
  { name: "B", uid: "B" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "assetnum",
  "location_tag",
  "master_equipment",
];

export default function TableSelectAsset({
  tableData,
  addNewUrl = "#",
  mutate,
  isLoading,
  isValidating,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  pages,
  total_items,
  setFilterSearch,
  calculationId,
  statusFilter,
  scopeFilter,
  setScopeFilter,
  filterScope,
  setFilterScope,
  availableEquipmentData,
  pagination,
  setPagination,
  isLoadingAvailableEquipment,
  isValidatingAvailableEquipment,
  trigger,
}: any) {
  const { data: session } = useSession();
  const router = useRouter();

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
    { name: "ASSET NUM", uid: "assetnum", sortable: true },
    { name: "LOCATION TAG", uid: "location_tag", sortable: true },
    { name: "NAME", uid: "master_equipment", sortable: true },
  ];

  type TransactionsType = (typeof tableData)[0];

  const [periodValue, setPeriodValue] = React.useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone()),
  });
  const [modalChoosePeriod, setModalChoosePeriod] = React.useState(false);
  const [loadingEfficiency, setLoadingEfficiency] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys]: any = React.useState<Selection>(
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
    // if (
    //   statusFilter !== "all" &&
    //   Array.from(statusFilter).length !== statusOptions.length
    // ) {
    //   filteredData = filteredData.filter((item) =>
    //     Array.from(statusFilter).includes(item.status)
    //   );
    // }
    // filter non performance data
    // filteredData = filteredData.filter((item) => {
    //   return item.is_performance_test !== true;
    // });

    return filteredData;
  }, [tableData, hasSearchFilter, filterValue]);

  // const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const handleSelectKeys = async (selectedKeys) => {
    try {
      const result = await trigger({
        token: session?.user.access_token,
        body: {
          assetnum: selectedKeys,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

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
        {/* <Select
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
        </Select> */}
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] bg-white rounded-full"
            classNames={{
              mainWrapper: ["!rounded-full"],
            }}
            placeholder="Search by asset name..."
            startContent={<MagnifyingGlassIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={(value) => {
              onSearchChange(value);
              debouncedSetFilterSearch(value);
            }}
          />
          {/* <div className="flex gap-3">
            {isLoadingAvailableEquipment || isValidatingAvailableEquipment ? (
              "Loading..."
            ) : (
              <AddNewAssetModal
                filterScope={filterScope}
                availableEquipmentData={availableEquipmentData}
                pagination={pagination}
                setPagination={setPagination}
                mutateScopeEquipment={mutate}
              />
            )}
          </div> */}
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
          // hidden={isValidating}
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

  const classNames = React.useMemo(
    () => ({
      wrapper: ["min-h-full", "bg-transparent", "shadow-none"],
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
      <Table
        aria-label="Efficiency Data Table"
        isCompact
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        color="primary"
        classNames={classNames}
        selectionMode="single"
        selectionBehavior="replace"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="inside"
        // onSelectionChange={(value) => {
        //   handleSelectedId(value);
        // }}
        selectedKeys={selectedKeys}
        onSelectionChange={(e: any) => {
          setSelectedKeys(e);
          handleSelectKeys(e?.currentKey);
        }}
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
