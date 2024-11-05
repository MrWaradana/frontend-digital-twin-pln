'use client'

import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { MasterData, useGetMasterData } from "@/lib/APIs/useGetMasterData";
import { ActionIcon, Box, Button, Flex, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { size } from "lodash";
import { MantineReactTable, MRT_ColumnDef, MRT_EditActionButtons, MRT_TableOptions, useMantineReactTable } from "mantine-react-table";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";


export default function MasterDataTable() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
    >({});

    const {
        data: masterData,
        isLoading,
        isValidating,
        mutate,
        error,
    } = useGetMasterData(session?.user.access_token);


    const memoMasterData = useMemo(() => {
        const data = masterData ?? [];

        return data
    }, [masterData])


    const columns = useMemo<MRT_ColumnDef<MasterData>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Name",
                size: 300,
                Cell: ({ row }) => (
                    <Box>
                        <Text>{row.original.name}</Text>
                    </Box>
                ),
            },
            {
                accessorKey: "nphr_value",
                header: "Value",
                size: 150,
                Cell: ({ row }) => (
                    <Box>
                        <Text>{row.original.nphr_value}</Text>
                    </Box>
                ),
            },
        ], []
    )

    const validateRequired = (value: string) => !!value.length;
    function validateMasterData(masterData: MasterData) {
        return {
            name: validateRequired(masterData.name) ? undefined : 'Name is required',
            nphr_value: validateRequired(masterData.nphr_value.toString()) ? undefined : 'Value is required',
        };
    }


    //CREATE action
    const handleCreateUser: MRT_TableOptions<MasterData>['onCreatingRowSave'] = async ({
        values,
        exitCreatingMode,
    }) => {
        const newValidationErrors = validateMasterData(values);

        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            setIsActionLoading(false);
            return;
        }

        setValidationErrors({});
        // await createUser(values);
        setIsActionLoading(true);
        //Create MasterData 
        const payload = {
            name: values.name,
            nphr_value: values.nphr_value
        }

        try {
            const response = await fetch(
                `${EFFICIENCY_API_URL}/cases`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user.access_token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                setIsActionLoading(false);
            }

            setIsActionLoading(false);
            mutate()
        } catch (error) {
            console.error(error);
        }

        exitCreatingMode();
    };


    const table = useMantineReactTable({
        columns,
        data: memoMasterData,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        positionActionsColumn: "last",
        mantineToolbarAlertBannerProps: error
            ? {
                color: 'red',
                children: 'Error loading data',
            }
            : undefined,
        // mantineTableContainerProps: {
        //     sx: {
        //         minHeight: '500px',
        //     },
        // },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateUser,
        // onEditingRowCancel: () => setValidationErrors({}),
        // onEditingRowSave: handleSaveUser,
        renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Create New User</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Edit User</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderRowActions: ({ row, table }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => { }}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                onClick={() => {
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Create New User
            </Button>
        ),
        state: {
            isLoading: isLoading || isValidating,
            isSaving: isActionLoading,
            showAlertBanner: error ? true : false,
            density: "xs",
        },
    });


    return (
        <>
            <MantineReactTable table={table} />
        </>
    )

}