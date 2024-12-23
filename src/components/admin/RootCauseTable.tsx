"use client";

import {
  useMemo,
  useState,
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES,
  useEffect,
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
  Menu,
  Modal,
  Select,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Title,
  Tooltip,
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
  const [
    openedAddActionModal,
    { open: openAddActionModal, close: closeAddActionModal },
  ] = useDisclosure(false);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedToDelete, setSelectedToDelete]: any = useState(null);
  const [selectedToAddAction, setSelectedToAddAction]: any = useState(null);
  const [name, setName] = useState("");
  const [actionName, setActionName] = useState("");
  const [actions, setActions] = useState<string[]>([]);

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
            <Text className="whitespace-pre-wrap break-words">
              {row.original.name}
            </Text>
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
            <Text className={`whitespace-pre-wrap break-words`}>
              {row.original.variable_name}
            </Text>
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
        id: "actions",
        accessorFn: (row) => row.actions ?? [],
        header: "To Do Action",
        Cell: ({ row }) => {
          const actions = row.original.actions
            ?.map((action) => action.name)
            .join(",\n");
          return (
            <Text className="whitespace-pre-wrap break-words">
              {actions || "-"}
            </Text>
          );
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

  const handleAddAction = async (row: any) => {
    setIsActionLoading(true);
    const payload = {
      name: actionName,
      cause_id: row.original.id,
    };
    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/variables/${row.original.variable_id}/actions`,
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
      closeAddActionModal();
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

  //CREATE children
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
  //Edit data
  const handleEditCause = async (values, exitEditingMode) => {
    setIsActionLoading(true);

    try {
      const causeEdit = await fetch(
        `${EFFICIENCY_API_URL}/variables/${values.variable_id}/causes/${values.cause_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
          },
          body: JSON.stringify({
            name: values.name,
          }),
        }
      );

      if (values.isLastChild) {
        const actionsEdit = await fetch(
          `${EFFICIENCY_API_URL}/variables/${values.variable_id}/actions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.access_token}`,
            },
            body: JSON.stringify({
              cause_id: values.cause_id,
              names: values.actions,
            }),
          }
        );
      }
      setIsActionLoading(false);
    } catch (error) {
      console.error(error);
    }

    mutate();
    exitEditingMode(false);
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
    onCreatingRowCancel: () => setName(""),
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
    onEditingRowCancel: () => {
      setName("");
      setActions([]);
    },
    // onEditingRowSave: handleEditCause,
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => {
      const regex = /^\d+(\.\d+)*_(name|actions)$/;
      const selectedComponent = internalEditComponents.filter((component) =>
        // @ts-ignore
        regex.test(component?.key as string)
      );
      const isLastChild = row.original.actions ? true : false;

      return (
        <Stack>
          <Title order={3}>Edit {row.original.name}</Title>
          {/* {selectedComponent} */}
          <TextInput
            label={`Name`}
            name={`name`}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />

          <TagsInput
            label="Press Enter to submit a action"
            placeholder="Enter action"
            value={actions}
            onChange={setActions}
            clearable
            disabled={!isLastChild}
            className={!isLastChild ? "hidden" : ""}
          />

          <Flex justify="flex-end" mt="xl">
            <Button
              onClick={() =>
                handleEditCause(
                  {
                    name: name,
                    actions: actions,
                    variable_id: row.original.variable_id,
                    cause_id: row.original.id,
                    isLastChild: isLastChild,
                  },
                  table.setEditingRow
                )
              }
              disabled={!name.trim()}
              loading={isActionLoading}
              className={`bg-[#1C9EB6]`}
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      );
    },
    renderRowActionMenuItems: ({ row }) => (
      <>
        {row.original.children && !(row.original.actions.length == 0) ? null : (
          <Menu.Item
            onClick={() => {
              table.setCreatingRow(row);
            }}
          >
            Add Children
          </Menu.Item>
        )}
        {row.original.children.length > 0 ? null : (
          <Menu.Item
            onClick={() => {
              setSelectedToAddAction(row);
              openAddActionModal();
            }}
          >
            Add Action
          </Menu.Item>
        )}
        <Menu.Item
          onClick={() => {
            const actionsData = row.original.actions?.map(
              (action) => action.name
            );
            setActions(actionsData);
            setName(row.original.name);
            table.setEditingRow(row);
          }}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setSelectedToDelete(row);
            openConfirmationDelete();
          }}
        >
          Delete
        </Menu.Item>
      </>
    ),
    // renderRowActions: ({ row }) => {
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
        <TextInput
          placeholder="Search parent causes..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          style={{ width: "300px" }}
        />

        <Button onClick={openParent} className="bg-[#1C9EB6]">
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

  const createActionModal = (
    <>
      <Modal
        opened={openedAddActionModal}
        onClose={closeAddActionModal}
        title={`Add To Do Action`}
      >
        <TextInput
          label={`Name`}
          name={`name`}
          value={actionName}
          onChange={(e) => setActionName(e.currentTarget.value)}
          required
        />
        <div className={`flex justify-end gap-5 mt-6`}>
          <Button
            color={`gray`}
            onClick={() => {
              closeAddActionModal();
            }}
          >
            Cancel
          </Button>
          <Button
            color={`blue`}
            disabled={!actionName.trim()}
            loading={isActionLoading}
            className="bg-[#1C9EB6]"
            onClick={() => {
              handleAddAction(selectedToAddAction);
            }}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );

  return (
    <>
      {createActionModal}
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
            <Button color={`green`} type="submit" className={`bg-[#1C9EB6]`}>
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
