"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner
} from "@nextui-org/react";
import { DotsVerticalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { debounce } from "lodash";
import CalculateOH from "../CalculateOH";

interface TableProps {
  tableData: any[];
  isValidating: boolean;
}

const INITIAL_VISIBLE_COLUMNS = [
  "no",
  "location_tag",
  "name",
  "actions",
];

export default function TableTargetReliability({
  tableData,
  isValidating
}: TableProps) {
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending"
  });

  // Memoized debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilterValue(value);
      setPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  const columns = [
    { name: "NO", uid: "no", sortable: false },
    { name: "LOCATION TAG", uid: "location_tag", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "ACTIONS", uid: "actions" }
  ];

  const hasSearchFilter = Boolean(filterValue);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...tableData];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [tableData, hasSearchFilter, filterValue]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    if (!filteredItems.length) return [];

    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as string];
      const second = b[sortDescriptor.column as string];

      if (first == null || second == null) return 0;

      return sortDescriptor.direction === "descending"
        ? String(second).localeCompare(String(first))
        : String(first).localeCompare(String(second));
    });
  }, [filteredItems, sortDescriptor]);

  // Calculate pagination
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, rowsPerPage, sortedItems]);

  // Cell rendering
  const renderCell = useCallback((item, columnKey, rowIndex) => {
    switch (columnKey) {
      case "no":
        return <div>{(page - 1) * rowsPerPage + rowIndex + 1}.</div>;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="solid"
                  radius="full"
                  className="bg-[#1C9EB6]"
                >
                  <DotsVerticalIcon className="text-white dark:text-black text-2xl" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem href="#">Edit</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return item[columnKey];
    }
  }, [page, rowsPerPage]);

  // Pagination handlers
  const onNextPage = useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  // Search handlers
  const onSearchChange = useCallback((value: string) => {
    debouncedSearch(value);
  }, [debouncedSearch]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Memoized content
  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%] bg-white rounded-full"
          placeholder="Search by unit name..."
          startContent={<MagnifyingGlassIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <CalculateOH title="Menu" size="md" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total items: {filteredItems.length}
          {hasSearchFilter && ` (filtered: "${filterValue}")`}
        </span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
            value={rowsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  ), [filterValue, filteredItems.length, hasSearchFilter, rowsPerPage]);

  const bottomContent = useMemo(() => (
    <div className="py-2 px-2 flex justify-between items-center">
      <div className="w-[30%]" />
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
        className="hidden sm:flex"
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          isDisabled={page === 1}
          size="sm"
          variant="flat"
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={page === pages}
          size="sm"
          variant="flat"
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  ), [page, pages, onPreviousPage, onNextPage]);

  const classNames = {
    base: ["min-h-full"],
    wrapper: ["min-h-full"],
    th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
    td: ["py-2", "px-3"]
  };

  return (
    <Table
      aria-label="Data Table"
      isCompact
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="inside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            key={column.uid}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        isLoading={isValidating}
        emptyContent="No data found"
        loadingContent={<Spinner color="primary" label="Loading..." />}
        items={paginatedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  columnKey,
                  paginatedItems.findIndex(row => row.id === item.id)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}