"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import {
  useMemo,
  useState,
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES,
} from "react";
import { Spinner } from "@nextui-org/react";
import {
  createRow,
  MantineReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_TableOptions,
  useMantineReactTable,
} from "mantine-react-table";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Input,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  useGetVariableCausesAll,
  VariableCause,
  VariableCauseAction,
} from "@/lib/APIs/useGetVariableCauseAll";
import { useSession } from "next-auth/react";
import {
  IconEdit,
  IconSearch,
  IconPlus,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import { EFFICIENCY_API_URL } from "@/lib/api-url";

// Extend VariableCause to include subRows for MantineReactTable
interface VariableCauseWithSubRows extends VariableCause {
  subRows?: VariableCauseWithSubRows[];
}

// Transform the data to work with MantineReactTable's expanding rows
const transformData = (causes: VariableCause[]): VariableCauseWithSubRows[] => {
  if (!Array.isArray(causes)) return [];

  return causes.map((cause) => {
    // Start with the base cause data
    const transformedCause: VariableCauseWithSubRows = {
      ...cause,
      subRows: undefined, // Initialize subRows as undefined
    };

    // If there are children, transform them recursively
    if (cause.children && cause.children.length > 0) {
      transformedCause.subRows = cause.children.map((child) => ({
        ...child,
        subRows:
          child.children?.map((grandChild) => ({
            ...grandChild,
            subRows: [], // Leaf nodes have empty subRows
          })) || [],
      }));
    }

    return transformedCause;
  });
};

export default function RootCauseTable() {
  const [openedParent, { open: openParent, close: closeParent }] =
    useDisclosure(false);
  const [
    openedConfirmationDelete,
    { open: openConfirmationDelete, close: closeConfirmationDelete },
  ] = useDisclosure(false);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedToDelete, setSelectedToDelete]: any = useState(null);
  const [name, setName] = useState("");

  const { data, isLoading, isValidating, mutate, error } =
    useGetVariableCausesAll(session?.user.access_token);

  // Filter data based on search term (only parent level)
  const filteredAndTransformedData = useMemo(() => {
    const transformedData = transformData(data || []);
    if (!searchTerm) return transformedData;

    return transformedData.filter((cause) =>
      cause.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const availableVariableData = data?.reduce((arr: any, variableCause: any) => {
    if (
      variableCause.variable_name &&
      !arr.find((a) => a.value === variableCause.variable_id)
    ) {
      arr.push({
        value: variableCause.variable_id,
        label: variableCause.variable_name,
      });
    }
    return arr;
  }, []);

  const columns = useMemo<MRT_ColumnDef<VariableCauseWithSubRows>[]>(
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
      // Add Variable Name column
      {
        accessorKey: "variable_name",
        header: "Variable Name",
        size: 300,
        Cell: ({ row }) => (
          <Box>
            <Text>{row.original.variable_name}</Text>
          </Box>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) => {
          if (!row.original.created_at) return "-";
          const date = new Date(row.original.created_at);
          return date.toLocaleDateString();
        },
      },
      {
        accessorFn: (row) => row.actions?.[0]?.name ?? "",
        header: "Action",
        Cell: ({ row }) => {
          const action = row.original.actions?.[0]?.name;
          return <Text>{action || "-"}</Text>;
        },
      },
    ],
    []
  );

  const handleDelete = async (row: any) => {
    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/variables/${row.original.variable_id}/causes/${row.original.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        }
      );

      if (!response.ok) {
        setIsActionLoading(false);
      }

      setIsActionLoading(false);
      closeConfirmationDelete();
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  //  //DELETE action
  //  const openDeleteConfirmModal = (row: MRT_Row<User>) =>
  //   modals.openConfirmModal({
  //     title: 'Are you sure you want to delete this user?',
  //     children: (
  //       <Text>
  //         Are you sure you want to delete {row.original.firstName}{' '}
  //         {row.original.lastName}? This action cannot be undone.
  //       </Text>
  //     ),
  //     labels: { confirm: 'Delete', cancel: 'Cancel' },
  //     confirmProps: { color: 'red' },
  //     onConfirm: () => deleteUser(row.original.id),
  //   });

  //CREATE action
  const handleCreateChildren = async (values, onClose) => {
    setIsActionLoading(true);
    const payload = {
      name: values.name,
      parent_id: values.parent_id,
    };

    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/variables/${values.variable_id}/causes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        mutate();
        setIsActionLoading(false);
        onClose(false);
        return;
      }
    } catch (error) {
      setIsActionLoading(false);
      console.log(error);
    }
  };
  //Edit Action
  //CREATE action
  const handleEditCause: MRT_TableOptions<VariableCause>["onEditingRowSave"] =
    async ({ values, exitEditingMode, row }) => {
      // const newValidationErrors = validateMasterData(values);

      // if (Object.values(newValidationErrors).some((error) => error)) {
      //     setValidationErrors(newValidationErrors);
      //     setIsActionLoading(false);
      //     return;
      // }

      // setValidationErrors({});
      // await createUser(values);
      console.log(values);
      setIsActionLoading(true);
      // //Create MasterData
      const payload = {
        name: values.name,
      };

      try {
        const response = await fetch(
          `${EFFICIENCY_API_URL}/variables/${row.original.variable_id}/causes/${row.original.id}`,
          {
            method: "PUT",
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
        mutate();
      } catch (error) {
        console.error(error);
      }

      exitEditingMode();
    };

  const table = useMantineReactTable({
    columns,
    data: filteredAndTransformedData,
    enableExpanding: true,
    enableExpandAll: true,
    state: {
      density: "xs",
      isLoading: isLoading || isValidating,
      isSaving: isActionLoading,
      showAlertBanner: error ? true : false,
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => {
      return (
        <Stack>
          <Title order={3}>Create New Children Root Cause</Title>
          {/* {internalEditComponents} */}
          <TextInput
            label={`Name`}
            name={`name`}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />
          <Flex justify="flex-end" mt="xl">
            <Button
              onClick={() =>
                handleCreateChildren(
                  {
                    name: name,
                    variable_id: row.original.variable_id,
                    parent_id: row.original.id,
                  },
                  table.setCreatingRow
                )
              }
              disabled={!name.trim()}
              loading={isActionLoading}
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      );
    },
    onEditingRowSave: handleEditCause,
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => {
      const regex = /^\d+(\.\d+)*_name$/;
      const selectedComponent = internalEditComponents.find((component) =>
        // @ts-ignore
        regex.test(component?.key as string)
      );

      return (
        <Stack>
          <Title order={3}>Edit {row.original.name}</Title>
          {selectedComponent}
          <Flex justify="flex-end" mt="xl">
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </Flex>
        </Stack>
      );
    },
    renderRowActions: ({ row }) => (
      <Box className="flex flex-nowrap gap-8">
        <ActionIcon
          color="blue"
          onClick={() => {
            table.setCreatingRow(row);
          }}
        >
          <IconPlus />
        </ActionIcon>
        <ActionIcon
          color="orange"
          onClick={() => {
            table.setEditingRow(row);
          }}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() => {
            // handleDelete(row);
            setSelectedToDelete(row);
            openConfirmationDelete();
          }}
        >
          <IconTrash />
        </ActionIcon>
      </Box>
    ),
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
        <TextInput
          placeholder="Search parent causes..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          style={{ width: "300px" }}
        />

        <Button onClick={openParent}>
          <IconPlus />
          Add New Parent Root Cause
        </Button>
      </Box>
    ),
    renderEmptyRowsFallback: () => (
      <Box py="xl">
        <Text>No data found</Text>
      </Box>
    ),
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
    },
    //Group by Variable name
    enableGrouping: true,
    initialState: { grouping: ["variable_name"] },
  });

  const formParent = useForm({
    mode: "uncontrolled",
    initialValues: {
      rootCauseName: "",
      variableCause: "",
    },

    validate: {
      rootCauseName: (value) =>
        /^[a-zA-Z]/.test(value) ? null : "Invalid Name",
    },
  });

  const deleteConfirmationModal = (
    <>
      <Modal
        opened={openedConfirmationDelete}
        onClose={closeConfirmationDelete}
        title={`Are you sure you want to delete this item?`}
      >
        <div className={`flex justify-end gap-5`}>
          <Button
            color={`gray`}
            onClick={() => {
              closeConfirmationDelete();
            }}
          >
            Cancel
          </Button>
          <Button
            color={`red`}
            onClick={() => {
              handleDelete(selectedToDelete);
            }}
          >
            Yes, delete
          </Button>
        </div>
      </Modal>
    </>
  );

  return (
    <>
      {deleteConfirmationModal}
      <Modal
        opened={openedParent}
        onClose={closeParent}
        title="Add New Parent Root Cause"
        centered
      >
        <form
          id={`parent-root-cause-form`}
          onSubmit={formParent.onSubmit(async (values) => {
            const payload = {
              name: values.rootCauseName,
            };

            try {
              const response = await fetch(
                `${EFFICIENCY_API_URL}/variables/${values.variableCause}/causes`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user.access_token}`,
                  },
                  body: JSON.stringify(payload),
                }
              );

              if (response.ok) {
                mutate();
                setIsActionLoading(false);
                closeParent();
                return;
              }
            } catch (error) {
              setIsActionLoading(false);
              console.log(error);
            }
          })}
        >
          <TextInput
            label={`Name`}
            type={`text`}
            placeholder="Parent Root Cause Name..."
            key={formParent.key("rootCauseName")}
            {...formParent.getInputProps("rootCauseName")}
          />
          <Select
            data={availableVariableData}
            label="Variable"
            placeholder="Pick variable"
            key={formParent.key("variableCause")}
            {...formParent.getInputProps("variableCause")}
            // value={value ? value.value : null}
            // onChange={(_value, option) => setValue(option)}
          />
          <div className={`flex justify-end mt-4`}>
            <Button color={`green`} type="submit">
              Submit
            </Button>
          </div>
        </form>
        {/* Modal content */}
      </Modal>{" "}
      <MantineReactTable table={table} />
    </>
  );
}
