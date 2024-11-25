"use client";

import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { Box, Button } from "@mantine/core";
import { FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Excel from "exceljs";
import { saveAs } from "file-saver";

interface ActionData {
  actions: string[];
  id: string;
  is_pareto: boolean | null;
  variable_category: string;
  variable_id: string;
  variable_name: string;
}

interface ActionSubRow {
  problem: string;
  check: string;
  action: string;
}

export default function ActionsTable({ data }: { data: ActionData[] }) {
  // Function to parse action strings into structured data
  const parseActionString = (actionStr: string): ActionSubRow => {
    const [problem, check, action] = actionStr.split(" | ");
    return {
      problem,
      check,
      action,
    };
  };

  // Process data to include parsed actions
  const processedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        subRows: item.actions.map(parseActionString),
      })),
    [data]
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "variable_name",
        header: "Variable Name",
      },
      {
        accessorKey: "variable_category",
        header: "Category",
      },
    ],
    []
  );

  const subRowColumns = useMemo<MRT_ColumnDef<ActionSubRow>[]>(
    () => [
      {
        accessorKey: "problem",
        header: "Problem",
      },
      {
        accessorKey: "check",
        header: "Check",
      },
      {
        accessorKey: "action",
        header: "Action",
      },
    ],
    []
  );

  // Prepare flattened data for export
  const getFlattenedData = () => {
    return processedData.flatMap((row) =>
      row.subRows.map((subRow) => ({
        variable_name: row.variable_name,
        variable_category: row.variable_category,
        ...subRow,
      }))
    );
  };

  // CSV Export Configuration
  const csvConfig = mkConfig({
    filename: "actions-data",
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  // Export Handlers
  const handleExportCSV = () => {
    const csv = generateCsv(csvConfig)(getFlattenedData());
    download(csvConfig)(csv);
  };

  const handleExportExcel = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Actions");

    // Add headers
    const headers = ["Variable Name", "Category", "Problem", "Check", "Action"];
    worksheet.addRow(headers);

    // Add data
    getFlattenedData().forEach((row) => {
      worksheet.addRow([
        row.variable_name,
        row.variable_category,
        row.problem,
        row.check,
        row.action,
      ]);
    });

    // Generate buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "actions-data.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const flatData = getFlattenedData();

    autoTable(doc, {
      head: [["Variable Name", "Category", "Problem", "Check", "Action"]],
      body: flatData.map((row) => [
        row.variable_name,
        row.variable_category,
        row.problem,
        row.check,
        row.action,
      ]),
    });

    doc.save("actions-data.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data: processedData,
    renderDetailPanel: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <MantineReactTable
          columns={subRowColumns}
          data={row.original.subRows}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
        />
      </div>
    ),
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleExpandedHandler(),
      sx: { cursor: "pointer" },
    }),
    renderTopToolbarCustomActions: () => (
      //@ts-ignore
      <Box sx={{ display: "flex", gap: "16px" }}>
        <Button
          leftSection={<FileSpreadsheet className="h-4 w-4" />}
          onClick={handleExportExcel}
          variant="outline"
        >
          Excel
        </Button>
        <Button
          leftSection={<FileJson className="h-4 w-4" />}
          onClick={handleExportCSV}
          variant="outline"
        >
          CSV
        </Button>
        <Button
          leftSection={<FileText className="h-4 w-4" />}
          onClick={handleExportPDF}
          variant="outline"
        >
          PDF
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
}
