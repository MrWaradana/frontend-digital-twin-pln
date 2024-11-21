import { useSelectedPaginationTagsStore } from "@/store/iPFI/setPaginationTags";
import { Input, Link, Pagination, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const ListTag = ({
  dataRow,
  mutate,
  isLoading,
  selectedKeys,
  setSelectedKeys,
  pagination,
}: {
  dataRow: any;
  mutate: any;
  isLoading: boolean;
  selectedKeys: any;
  setSelectedKeys: any;
  pagination: any;
}) => {
  type TagType = (typeof dataRow)[0];

  const setSelectedPaginationTags = useSelectedPaginationTagsStore(
    (state) => state.setSelectedPaginationTagState
  )

  const setLimitPaginationTags = useSelectedPaginationTagsStore(
    (state) => state.setLimitPaginationTagState
  );

  const [page, setPage]: any = React.useState(1);
  const [rowsPerPage, setRowsPerPage]: any = React.useState(20);
  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  const columns = [
    { name: "NO", uid: "no", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
  ];

  const renderCell = React.useCallback(
    (rowData: TagType, columnKey: React.Key, index: number) => {
      const cellValue = rowData[columnKey as keyof TagType];

      switch (columnKey) {
        case "no":
          return index;
        case "name":
          return cellValue
      }
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...dataRow];
    if (hasSearchFilter && filteredData.length != 0) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredData;
  }, [dataRow, filterValue, hasSearchFilter]);

  const pages = React.useMemo(() => {
    return pagination.total_pages;
  }, [pagination.total_pages]);

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

  useEffect(() => {
    setSelectedPaginationTags(page)
    setLimitPaginationTags(rowsPerPage)
  }, [page, pages, rowsPerPage]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400"></span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            wrapper: "gap-0 h-8 rounded border border-divider",
            item: "w-8 h-8 text-small rounded-none bg-transparent",
            cursor:
              "shadow-lg bg-[#1C9EB6]  dark:bg-[#fff] text-white font-bold",
          }}
        />
      </div>
    );
  }, [onNextPage, onPreviousPage, page, pages]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-full"
            placeholder="Search by name..."
            startContent={<MagnifyingGlassIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#1C9EB6] text-small">
            Total {dataRow.length} data
          </span>
          <label className="flex items-center text-[#1C9EB6] text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-[#1C9EB6] text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    mutate,
    filterValue,
    onSearchChange,
    onClear,
    onRowsPerPageChange,
    dataRow,
  ]);


  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl", "shadow-none"],
      cursor: ["shadow-lg bg-[#1C9EB6]  dark:bg-[#fff] text-white font-bold"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider",],
      td: [
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
    [],
  );

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-5 mx-2 sm:mx-4 border border-gray-200 shadow-xl">
      <Toaster />

      <Table
        aria-label="Example table with client async pagination"
        topContent={
          topContent
        }
        topContentPlacement="outside"
        bottomContent={
          bottomContent
        }
        bottomContentPlacement="outside"
        hideHeader
        classNames={classNames}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        selectionMode="single"
      >
        <TableHeader columns={columns} className="bg-blue-300">
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
          items={filteredItems}
          loadingContent={
            <>
              <Spinner color="primary" label="loading..." />
            </>
          }
          isLoading={isLoading}
        >
          {(item: TagType) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, item.index)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ListTag