import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { DotsVerticalIcon, EyeOpenIcon, MagnifyingGlassIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Toaster } from 'react-hot-toast';

const TableTag = ({
  dataRow,
  mutate,
  isValidating,
}: {
  dataRow: any;
  mutate: any;
  isValidating: boolean;
}) => {
  type TagType = (typeof dataRow)[0];

  const router = useRouter()

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const session = useSession();

  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const columns = [
    { name: "NAME", uid: "name", sortable: true },
    {
      name: "TAG DESCRIPTION",
      uid: "descriptor",
      sortable: true,
    },
    { name: "ENGINEERING UNITS", uid: "engineering_units", sortable: true },
    { name: "PATH", uid: "path", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  // Handle opening and closing of the modal
  const handleModal = React.useCallback((row: any = null) => {
    setSelectedRow(row);
    setIsOpen((prev) => !prev);
  }, []);

  const renderCell = React.useCallback(
    (rowData: TagType, columnKey: React.Key) => {
      const cellValue = rowData[columnKey as keyof TagType];

      switch (columnKey) {
        case "name":
          return cellValue;
        case "descriptor":
          return cellValue ? cellValue : "-";
        case "engineering_units":
          return cellValue ? cellValue : "-";
        case "path":
          return cellValue ? cellValue : "-";
        case "actions":
          return (
            <div className="relative flex justify-left items-left gap-2">
              <button
                className={`bg-yellow-500 backdrop-blur-sm px-1.5 py-0.5 rounded-sm 
                         md:text-[16px] text-xs shadow-sm border border-gray-200/50 whitespace-nowrap
                         hover:scale-105 hover:bg-blue-500/80 hover:shadow-md
                         transition-all duration-200 ease-in-out
                         transform origin-center`}
                onClick={() => router.push(`/pfi-app/selected-tag/3871`)}
              >
                <div className="font-semibold text-neutral-200 px-2 py-1">
                  Warning
                </div>
              </button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [handleModal]
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
    });
  }, [sortDescriptor, items]);

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

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {dataRow.length} data
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
  }, [onNextPage, onPreviousPage, page, pages]);

  return (
    <>
      <Toaster />

      <Table
        aria-label="Example static collection table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        onSortChange={setSortDescriptor}
        sortDescriptor={sortDescriptor}
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
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </>
  );
}

export default TableTag