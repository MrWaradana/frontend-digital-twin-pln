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
} from "@nextui-org/react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

const TableEquipment = ({ dataRow }: { dataRow: any }) => {
  return (
    <>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {dataRow.map((row: any) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.status}</TableCell>
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
                        <DropdownItem href={`/pfi-app/engine-flow`}>
                          Update
                        </DropdownItem>
                        <DropdownItem href={`/pfi-app/engine-flow`}>
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default TableEquipment;
