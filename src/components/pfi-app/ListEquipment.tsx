import { Button, Input, Pagination, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Link } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ChevronLeftIcon, CircleAlert, CircleCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const ListEquipment = ({
  dataRow,
  mutate,
  isValidating,
  parent_id,
  title
}: {
  dataRow: any;
  mutate: any;
  isValidating: boolean;
  parent_id?: string | null;
  title: string
}) => {
  type EquipmentType = (typeof dataRow)[0];
  const router = useRouter()

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const session = useSession();

  const [filterValue, setFilterValue] = React.useState("");
  const hasSearchFilter = Boolean(filterValue);

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const columns = [
    { name: "NO", uid: "no", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (rowData: EquipmentType, columnKey: React.Key, index: any) => {
      const cellValue = rowData[columnKey as keyof EquipmentType];

      switch (columnKey) {
        case "no":
          return index;
        case "name":
          return (
            <Link
              href={`/pfi-app/${rowData.id}`}
              className="text-[#918E8E] break-words w-52 block"
            >
              {cellValue}
            </Link>

          );
        case "actions":
          return (
            <span className="flex bg-[#1C9EB6] text-neutral-200 py-1 rounded-full justify-center px-3 sm:px-1">
              <CircleCheck className="inline-block me-2 w-4" />
              Normal
            </span>
          );
        default:
          return cellValue;
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
    return [...items].sort((a: EquipmentType, b: EquipmentType) => {
      const first = a[sortDescriptor.column as keyof EquipmentType] as number;
      const second = b[sortDescriptor.column as keyof EquipmentType] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    }).map((item, index) => ({
      ...item, index: index + 1
    }));
  }, [sortDescriptor, items]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between  gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[100%] rounded-full"
            placeholder="Search by name..."
            startContent={<MagnifyingGlassIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
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
    parent_id,
    filterValue,
    onSearchChange,
    onClear,
    onRowsPerPageChange,
    dataRow,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center justify-between">
        {/* <Button
          as={Link}
          onPress={() => router.back()}
          size="sm"
          className="mr-auto bg-[#E2523F]"
        >
          <ChevronLeftIcon size={12} />
          Back
        </Button> */}


        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          variant="light"
          className="ml-auto"
        />
      </div>


    );
  }, [onNextPage, onPreviousPage, page, pages]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl", "shadow-none"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider",],
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
    [],
  );
  return (
    <div className="bg-white rounded-3xl p-3 sm:p-5 mx-2 sm:mx-4 border border-gray-200 shadow-xl ">
      <div className="flex mb-5 mt-3 px-5">
        <h1 className="text-xl font-semibold">
          {title}
        </h1>
        <CircleAlert className="inline-block text-red-600 ms-5" />
      </div>

      <Table
        aria-label="Example static collection table"
        topContent={topContent}
        topContentPlacement="inside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        onSortChange={setSortDescriptor}
        sortDescriptor={sortDescriptor}
        hideHeader
        classNames={classNames}
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
                <TableCell className="text-[#918E8E]">{renderCell(item, columnKey, item.index)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ListEquipment