import { Input, Link, Pagination, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { Toaster } from "react-hot-toast";

const ListTag = ({
  dataRow,
  mutate,
  isValidating,
  selectedKeys,
  setSelectedKeys
}: {
  dataRow: any;
  mutate: any;
  isValidating: boolean;
  selectedKeys: any;
  setSelectedKeys: any;
}) => {
  type TagType = (typeof dataRow)[0];

  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
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

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

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

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TagType, b: TagType) => {
      const first = a[sortDescriptor.column as keyof TagType] as number;
      const second = b[sortDescriptor.column as keyof TagType] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    }).map((item, index) => ({
      ...item, index: index + 1
    }));
  }, [sortDescriptor, items]);

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
          <div className="flex gap-3">

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#E2523F] text-small">
            Total {dataRow.length} data
          </span>
          <label className="flex items-center text-[#E2523F] text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-[#E2523F] text-small"
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
    mutate,
    filterValue,
    onSearchChange,
    onClear,
    onRowsPerPageChange,
    dataRow,
  ]);

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
        />
      </div>
    );
  }, [onNextPage, onPreviousPage, page, pages]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl", "shadow-none"],
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
        aria-label="Example static collection table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        onSortChange={setSortDescriptor}
        sortDescriptor={sortDescriptor}
        classNames={classNames}
        hideHeader
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
          isLoading={isValidating}
          emptyContent="No data found"
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