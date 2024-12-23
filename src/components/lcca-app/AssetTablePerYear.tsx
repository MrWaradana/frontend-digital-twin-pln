import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { Box, Button, Flex, Menu, Text } from "@mantine/core";
import { useMemo } from "react";
import { formattedNumber } from "@/lib/formattedNumber";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { IconDownload } from "@tabler/icons-react";

export default function AssetTablePerYear({ data, assetName, selectedData }: any) {
  // CSV export configuration with dynamic filename
  const csvConfig = mkConfig({
    filename: `${assetName} Life Cycle Cost in ${selectedData}`,
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  // Transform the data to create rows from columns
  const transformData = (originalData: any) => {
    if (!originalData || originalData.length === 0) return [];

    return [
      { metric: "CM Labor Cost", value: originalData[0].rc_cm_labor_cost },
      {
        metric: "CM Material Cost",
        value: originalData[0].rc_cm_material_cost,
      },
      { metric: "Lost Cost", value: originalData[0].rc_lost_cost },
      {
        metric: "Maintenance Cost",
        value: originalData[0].rc_maintenance_cost,
      },
      { metric: "OH Labor Cost", value: originalData[0].rc_oh_labor_cost },
      {
        metric: "OH Material Cost",
        value: originalData[0].rc_oh_material_cost,
      },
      { metric: "Operation Cost", value: originalData[0].rc_operation_cost },
      { metric: "PM Labor Cost", value: originalData[0].rc_pm_labor_cost },
      {
        metric: "PM Material Cost",
        value: originalData[0].rc_pm_material_cost,
      },
      {
        metric: "Predictive Labor Cost",
        value: originalData[0].rc_predictive_labor_cost,
      },
      {
        metric: "Project Material Cost",
        value: originalData[0].rc_project_material_cost,
      },
      { metric: "Total Cost", value: originalData[0].rc_total_cost },
    ];
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "metric",
        header: "Type",
        size: 200,
        Cell: ({ row }) => (
          <Box
            style={{
              backgroundColor:
                row.original.metric === "Total Cost"
                  ? "#f0f7ff"
                  : "transparent",
            }}
          >
            <Text fw={row.original.metric === "Total Cost" ? 700 : 400}>
              {row.original.metric}
            </Text>
          </Box>
        ),
      },
      {
        accessorKey: "value",
        header: "Cost (Rp.)",
        size: 150,
        Cell: ({ row }) => (
          <Box
            style={{
              backgroundColor:
                row.original.metric === "Total Cost"
                  ? "#f0f7ff"
                  : "transparent",
            }}
          >
            <Text fw={row.original.metric === "Total Cost" ? 700 : 400}>
              {typeof row.original.value === "number"
                ? formattedNumber(row.original.value.toFixed(2))
                : row.original.value}
            </Text>
          </Box>
        ),
      },
    ],
    []
  );

  const transformedData = useMemo(() => transformData(data), [data]);

  // Export handlers
  const handleExportCSV = () => {
    const csv = generateCsv(csvConfig)(transformedData);
    download(csvConfig)(csv);
  };

  const handleExportExcel = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Asset Costs");

    // Add title
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `${assetName} Life Cycle Cost in ${selectedData}`;
    titleCell.font = { size: 14, bold: true };
    worksheet.mergeCells('A1:B1');
    
    // Add headers
    worksheet.addRow(["Type", "Cost (Rp.)"]);

    // Add data
    transformedData.forEach((row) => {
      worksheet.addRow([
        row.metric,
        typeof row.value === "number" ? row.value.toFixed(2) : row.value,
      ]);
    });

    // Style the total row
    const totalRow = worksheet.getRow(worksheet.rowCount);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF0F7FF" },
    };

    // Adjust column widths
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 20;

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `${assetName} Life Cycle Cost in ${selectedData}.xlsx`
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(`${assetName} Life Cycle Cost in ${selectedData}`, 14, 15);

    // Prepare data for auto-table
    const tableData = transformedData.map((row: any) => [
      row.metric,
      typeof row.value === "number"
        ? formattedNumber(row.value.toFixed(2))
        : row.value,
    ]);

    // Generate table
    autoTable(doc, {
      head: [["Type", "Cost (Rp.)"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
      //@ts-ignore
      rowStyles: (row) => {
        if (row.index === tableData.length - 1) {
          return {
            fillColor: [240, 247, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          };
        }
        return {};
      },
    });

    // Save the PDF
    doc.save(`${assetName} Life Cycle Cost in ${selectedData}.pdf`);
  };

  const table = useMantineReactTable({
    columns,
    data: transformedData,
    enableColumnFilters: true,
    enableColumnActions: false,
    enableColumnDragging: false,
    enableSorting: true,
    enableTopToolbar: true,
    mantineTableProps: {
      striped: false,
      highlightOnHover: false,
    },
    initialState: {
      density: "xs",
      pagination: {
        pageSize: 30,
        pageIndex: 0,
      },
    },
    renderTopToolbarCustomActions: () => (
      <Menu>
        <Menu.Target>
          <Button leftSection={<IconDownload size={20} />}>Export</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={handleExportCSV}>Export as CSV</Menu.Item>
          <Menu.Item onClick={handleExportExcel}>Export as Excel</Menu.Item>
          <Menu.Item onClick={handleExportPDF}>Export as PDF</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
  });

  return <MantineReactTable table={table} />;
}