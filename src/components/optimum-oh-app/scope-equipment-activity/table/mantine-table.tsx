import { Box, Button, Flex, Menu, Stack, TextInput, Title, Text } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable, MRT_EditActionButtons, MRT_TableOptions } from "mantine-react-table";
import React, { useState } from "react";
import { ActivitiyColumn } from "./column";
import { IconPlus } from "@tabler/icons-react";
import { EquipmentActiviy } from "@/lib/APIs/UseGetEquipmentActivities";
import { usePostNewEquipmentActivity } from "@/lib/APIs/mutation/usePostNewEquipmentActivity";
import { useSession } from "next-auth/react";
import { use } from "echarts";
import ModalAddEdit from "./modal-add-edit";
import { useDisclosure } from "@nextui-org/react";

interface DataTableProps {
    columns: MRT_ColumnDef<ActivitiyColumn>[];
    data: ActivitiyColumn[];
    assetnum: String;
    tableMutate: any
}

export function MantineTable({
    columns,
    data,
    assetnum,
    tableMutate
}: DataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false)
    const [initialFormData, setInitialFormData] = useState<any>()
    const [selectedRowId, setSelectedRowId] = useState("");


    // Trigger Post
    const { isLoading: postLoading, data: postData, trigger } = usePostNewEquipmentActivity(session?.user.access_token, selectedRowId)

    //CREATE action
    const handleCreateActivity = async (values) => {
        if (!values.name || !values.cost) {
            return
        }

        await trigger({
            token: session?.user.access_token,
            body: {
                assetnum: assetnum,
                name: values.name,
                cost: values.cost
            }
        });
        tableMutate()
        setIsOpen(false)
    };


    const table = useMantineReactTable({
        columns,
        data,
        state: {
            density: "xs",
            rowSelection,
            pagination: { pageIndex: pagination, pageSize: pageSize },
            isSaving: postLoading,
        },
        enableRowActions: true,
        positionActionsColumn: "last",
        renderRowActionMenuItems: ({ row }) => (
            <>
                <Menu.Item onClick={() => {
                    // setInitialFormData({
                    //     name: row.original.name,
                    //     cost: row.original.cost
                    // })
                    // setSelectedRowId(row.original.id)
                    // onOpenChange()
                    setIsOpen(true)
                }}>
                    Edit
                </Menu.Item>
                <Menu.Item

                >
                    Delete
                </Menu.Item>
            </>
        ),
        //   return (
        //     <Box className="flex flex-nowrap gap-8">
        //       {row.original.actions ? null : (
        //         <Tooltip label={`Add Children`}>
        //           <ActionIcon
        //             color="blue"
        //             onClick={() => {
        //               table.setCreatingRow(row);
        //             }}
        //           >
        //             <IconPlus />
        //           </ActionIcon>
        //         </Tooltip>
        //       )}
        //       {row.original.children.length > 0 ? null : (
        //         <Tooltip label={`Add Action`}>
        //           <ActionIcon
        //             color="green"
        //             onClick={() => {
        //               setSelectedToAddAction(row);
        //               openAddActionModal();
        //             }}
        //           >
        //             <IconPlus />
        //           </ActionIcon>
        //         </Tooltip>
        //       )}
        //       <Tooltip label={`Edit ${row.original.name}`}>
        //         <ActionIcon
        //           color="orange"
        //           onClick={() => {
        //             table.setEditingRow(row);
        //           }}
        //         >
        //           <IconEdit />
        //         </ActionIcon>
        //       </Tooltip>
        //       <Tooltip label={`Delete ${row.original.name}`}>
        //         <ActionIcon
        //           color="red"
        //           onClick={() => {
        //             // handleDelete(row);
        //             setSelectedToDelete(row);
        //             openConfirmationDelete();
        //           }}
        //         >
        //           <IconTrash />
        //         </ActionIcon>
        //       </Tooltip>
        //     </Box>
        //   );
        // },
        mantineLoadingOverlayProps: {
            loaderProps: {
                type: "dots",
                size: "xl",
            },
        },
        renderTopToolbarCustomActions: () => (
            <Box
                mb="xs"
                className={`flex flex-nowrap items-center w-full justify-between gap-6`}
            >
                <Button onClick={() => setIsOpen(true)}>
                    <IconPlus />
                    Add
                </Button>
            </Box>
        ),
        mantineTableProps: {
            highlightOnHover: true,
        },
    });


    return (
        <>
            <ModalAddEdit isOpen={isOpen} onOpenChange={setIsOpen} onSubmit={handleCreateActivity} initialData={initialFormData} />
            <MantineReactTable table={table} />
        </>
    )
}