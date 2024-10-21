import React from "react";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import {
  DotsVerticalIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import CreateModal from "./equipments/CreateModal";
import UpdateModal from "./equipments/UpdateModal";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

const TableEquipment = ({
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const session = useSession();

  // Handle opening and closing of the modal
  const handleModal = (row: any = null) => {
    setSelectedRow(row);
    setIsOpen((prev) => !prev);
  };

  const deleteHandler = async (id: string) => {
    try {
      Swal.fire({
        title: "Apakah anda ingin menghapus data ini?",
        text: "Mohon diperiksa kembali!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_PFI_APP_URL}/equipment/` + id,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.data?.user.access_token}`,
              },
            }
          );
          if (res.status == 200) {
            toast.success("Equipment berhasil dihapus");
            Swal.close();
            mutate();
          }
        }
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <CreateModal
              categories={categories}
              eqTrees={eqTrees}
              mutate={mutate}
              parent_id={parent_id}
            />
          </div>
        </div>
      </div>
    );
  }, [categories, mutate, parent_id, eqTrees]);

  return (
    <>
      <Toaster />

      <Table
        aria-label="Example static collection table"
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Level Equipment</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isValidating}
          loadingContent={
            <>
              <Spinner color="primary" label="loading..." />
            </>
          }
        >
          {dataRow.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.equipment_tree.name}</TableCell>
              <TableCell>{row.category.name}</TableCell>
              <TableCell>Normal</TableCell>
              <TableCell>
                <div className="relative flex justify-left items-left gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="solid"
                        color="primary"
                      >
                        <DotsVerticalIcon className="text-white dark:text-black text-2xl" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        startContent={<EyeOpenIcon />}
                        href={`/pfi-app/equipments/${row.id}`}
                      >
                        View
                      </DropdownItem>
                      <DropdownItem
                        startContent={<Pencil1Icon />}
                        onClick={() => handleModal(row)}
                      >
                        Update
                      </DropdownItem>
                      <DropdownItem
                        startContent={<TrashIcon />}
                        onClick={() => deleteHandler(row.id)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal rendered outside of the table */}
      {isOpen && selectedRow && (
        <UpdateModal
          categories={categories}
          mutate={mutate}
          isOpen={isOpen}
          handleModal={handleModal}
          selectedData={selectedRow} // Pass the selected row data
        />
      )}
    </>
  );
};

export default TableEquipment;
