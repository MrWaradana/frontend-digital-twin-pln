"use client";

import React from "react";
import {
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import {
  DotsVerticalIcon,
  PlusIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { columns, users, statusOptions } from "@/lib/data";
import { capitalize } from "@/lib/utils";
import { useGetUsers } from "../../lib/APIs/useGetUsers";
import { useSession } from "next-auth/react";
import { AUTH_API_URL } from "../../lib/api-url";
import toast from "react-hot-toast";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "role",
  "username",
  "email",
  "actions",
];

export default function TableAdmin({
  tableData,
  addNewUrl = "#",
}: {
  tableData: any;
  addNewUrl?: string;
}) {
  const { data: session } = useSession();

  const { data, error, mutate, isValidating, isLoading } = useGetUsers(
    session?.user.access_token
  );

  const userData = data?.users ?? [];

  type User = (typeof userData)[0];

  const { statusOptions } = tableData;

  const roleOptions = [
    { name: "Admin", uid: "Admin" },
    { name: "Management", uid: "Management" },
    { name: "Engineer", uid: "Engineer" },
  ];

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "USERNAME", uid: "username", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const [tableState, setTableState] = React.useState(userData ?? []);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedRoles, setSelectedRoles] = React.useState<Selection>(
    new Set(["app1"])
  );
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  // const [visibleColumns, setVisibleColumns] = React.useState<Selection>("all");
  const [roleFilter, setRoleFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...userData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.role?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      roleFilter !== "all" &&
      Array.from(roleFilter).length !== roleOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        //@ts-ignore
        Array.from(roleFilter).includes(user?.role)
      );
    }

    return filteredUsers;
  }, [userData, filterValue, roleFilter, tableState]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      //@ts-ignore
      const first = a[sortDescriptor.column as keyof User] as number;
      //@ts-ignore
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User description={user.email} name={cellValue}>
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.role}
            </p>
          </div>
        );
      // case "status":
      //   return (
      //     <Chip
      //       className="capitalize"
      //       color={statusColorMap[user.status]}
      //       size="sm"
      //       variant="flat"
      //     >
      //       {cellValue}
      //     </Chip>
      //   );
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  className={`bg-[#1C9EB6]`}
                  variant="solid"
                  radius={`full`}
                  color="primary"
                >
                  <DotsVerticalIcon className="text-white text-2xl " />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {/* <DropdownItem href="/admin/view">View</DropdownItem> */}
                <DropdownItem href={`/admin/users/${user.id}/edit`}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    //@ts-ignore
                    setSelectedRowId(user.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete {user.name}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "permission":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize">
                  Permission
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Multiple selection example"
                variant="flat"
                closeOnSelect={false}
                disallowEmptySelection
                selectionMode="multiple"
                selectedKeys={selectedRoles}
                onSelectionChange={setSelectedRoles}
              >
                <DropdownItem key="app1">Aplikasi 1</DropdownItem>
                <DropdownItem key="app2">Aplikasi 2</DropdownItem>
                <DropdownItem key="app3">Aplikasi 3</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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

  // Function to delete the selected row
  const handleDelete = async () => {
    if (!selectedRowId) return;
    // setLoadingEfficiency(isValidating);
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/users/${selectedRowId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });
      if (response.ok) {
        // Remove the item from tableData after successful deletion
        const updatedData = userData.filter(
          (item: User) => item.id !== selectedRowId
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
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
              >
                {roleOptions.map((status: any) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
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
              color="primary"
              className="bg-[#1C9EB6]"
              startContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {userData.length} users
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
    roleFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    userData.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
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

  return (
    <>
      {deleteConfirmationModal}
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        classNames={{
          wrapper: "max-h-full",
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="inside"
        onSelectionChange={setSelectedKeys}
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
          emptyContent={
            error ? "Something went wrong with fetch users!" : "No users found!"
          }
          items={sortedItems}
          isLoading={(isLoading ?? false) || (isValidating ?? false)}
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
