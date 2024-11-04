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
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Box, Button, Modal, Text, TextInput } from "@mantine/core";
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
  const [opened, { open, close }] = useDisclosure(false);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = (rowId: any) => {
    alert(`delete ${rowId}`);
  };

  const table = useMantineReactTable({
    columns,
    data: filteredAndTransformedData,
    enableExpanding: true,
    enableExpandAll: true,
    state: {
      density: "xs",
      isLoading: isLoading || isValidating,
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Box className="flex flex-nowrap gap-8">
        <ActionIcon color="blue">
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
            handleDelete(row.original.id);
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

        <Button onClick={open}>
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
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Add New Parent Root Cause"
        centered
      >
        {/* Modal content */}
      </Modal>{" "}
      <MantineReactTable table={table} />
    </>
  );
}
