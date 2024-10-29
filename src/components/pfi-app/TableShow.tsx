import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  DotsVerticalIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import CreateModal from "./equipments/CreateModal";
import UpdateModal from "./equipments/UpdateModal";

const TableShow = ({
  dataRow,
  categories,
  eqTrees,
  mutate,
  isValidating,
  parent_id,
}: {
  dataRow: any;
  categories: any;
  eqTrees: any;
  mutate: any;
  isValidating: boolean;
  parent_id?: string | null;
}) => {
  type EquipmentType = (typeof dataRow)[0];

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
      name: "EQUIPMENT DESCRIPTION",
      uid: "equipment_description",
      sortable: true,
    },
    { name: "ASSET NUMBER", uid: "asset_number", sortable: true },
    { name: "CATEGORY", uid: "category", sortable: true },
    { name: "LOCATION TAG", uid: "location_tag", sortable: true },
    { name: "SYSTEM TAG", uid: "system_tag", sortable: true },
    { name: "STATUS", uid: "actions" },
  ];

  // Handle opening and closing of the modal
  const handleModal = React.useCallback((row: any = null) => {
    setSelectedRow(row);
    setIsOpen((prev) => !prev);
  }, []);

  const renderCell = React.useCallback(
    (rowData: EquipmentType, columnKey: React.Key) => {
      const cellValue = rowData[columnKey as keyof EquipmentType];
      switch (columnKey) {
        case "name":
          return cellValue;
        case "equipment_description":
          return cellValue?.name ?? "No Data";
        case "asset_number":
          return cellValue ? cellValue : "No Data";
        case "category":
          return cellValue?.name ?? "No Data";
        case "location_tag":
          return cellValue ? cellValue : "No Data";
        case "system_tag":
          return cellValue ? cellValue : "No Data";
        case "status":
          return (
            <Button size="sm" variant="solid" color="primary">
              <DotsVerticalIcon className="text-white dark:text-black text-2xl" />
            </Button>
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
  }, [filterValue, onSearchChange, onClear, onRowsPerPageChange, dataRow]);

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

      {/* Update Modal rendered outside of the table */}
      {isOpen && selectedRow && (
        <UpdateModal
          categories={categories}
          eqTrees={eqTrees}
          mutate={mutate}
          isOpen={isOpen}
          handleModal={handleModal}
          selectedData={selectedRow} // Pass the selected row data
        />
      )}
    </>
  );
};

export default TableShow;
