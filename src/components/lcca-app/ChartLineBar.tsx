import { color } from "echarts";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import ReactECharts from "echarts-for-react";
import { useState } from "react";
import AssetTablePerYear from "./AssetTablePerYear";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import { formattedNumber } from "@/lib/formattedNumber";

// Configuration for CSV export
const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "chart-data",
  fieldSeparator: ",",
});

export const exportChartData = {
  // Export to CSV
  toCsv: (data) => {
    const formattedData = data.map((item) => ({
      Year: item.tahun,
      "Annualized O&M Cost": formattedNumber(item.eac_annual_mnt_cost),
      "Annualized Acquisition Cost": formattedNumber(item.eac_annual_acq_cost),
      EAC: formattedNumber(item.eac_eac),
    }));

    const csv = generateCsv(csvConfig)(formattedData);
    download(csvConfig)(csv);
  },

  // Export to PDF
  toPdf: (data, assetName) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(`${assetName} - Life Cycle Cost Analysis`, 14, 15);

    // Prepare data for table
    const tableHeaders = [
      ["Year", "Annualized O&M Cost", "Annualized Acquisition Cost", "EAC"],
    ];
    const tableData = data.map((item) => [
      item.tahun,
      formattedNumber(item.eac_annual_mnt_cost),
      formattedNumber(item.eac_annual_acq_cost),
      formattedNumber(item.eac_eac),
    ]);

    // Add table
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 40 },
      },
    });

    doc.save(
      `${assetName.toLowerCase().replace(/\s+/g, "-")}-lifecycle-cost.pdf`
    );
  },

  // Export to Excel
  toExcel: async (data, assetName) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Life Cycle Cost Analysis");

    // Add title
    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `${assetName} - Life Cycle Cost Analysis`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: "center" };

    // Define columns
    worksheet.columns = [
      { header: "Year", key: "year", width: 15 },
      { header: "Annualized O&M Cost", key: "omCost", width: 25 },
      { header: "Annualized Acquisition Cost", key: "acqCost", width: 25 },
      { header: "EAC", key: "eac", width: 20 },
    ];

    // Style the header row
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2980B9" },
      bgColor: { argb: "2980B9" },
    };

    // Add data
    data.forEach((item) => {
      worksheet.addRow({
        year: item.tahun,
        omCost: item.eac_annual_mnt_cost,
        acqCost: item.eac_annual_acq_cost,
        eac: item.eac_eac,
      });
    });

    // Format number columns
    worksheet.getColumn("omCost").numFmt = "#,##0.00";
    worksheet.getColumn("acqCost").numFmt = "#,##0.00";
    worksheet.getColumn("eac").numFmt = "#,##0.00";

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `${assetName.toLowerCase().replace(/\s+/g, "-")}-lifecycle-cost.xlsx`
    );
  },
};

export default function ChartLinebar({ chartData, minSeq, assetName }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedData, setSelectedData] = useState(null);
  const xAxisData = chartData.map((item) => {
    return item.tahun;
  });

  const chartOption = {
    // title: {
    //   text: "Distribution of Something",
    //   subtext: "Fake Data",
    // },
    grid: {
      left: "3%",
      right: "3%",
      top: "3%",
      bottom: "5%",
      containLabel: true,
    },
    legend: {
      top: "bottom",
      data: ["Annualized Acquisition Cost", "Annualized O&M Cost", "EAC"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: function (params) {
        let result = `Day: ${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          // Get the color of the line
          const color = param.color;
          // Format large numbers with commas and fixed decimal places
          const value = new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(param.value);
          // Add colored dot using the series color
          result += `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${
            param.seriesName == "Annualized O&M Cost"
              ? "#A2DE32"
              : param.seriesName == "Annualized Acquisition Cost"
              ? "#F7ED53"
              : color
          };margin-right:5px;"></span>${param.seriesName}: Rp.${value}<br/>`;
        });
        return result;
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
        restore: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      // prettier-ignore
      data: xAxisData,
      axisLabel: {
        rotate: 45,
        interval: 0,
        formatter: (value, index) => {
          const currentYear = new Date().getFullYear().toString();
          const minData = chartData.filter((item) => item.seq == minSeq);
          if (String(value) === currentYear) {
            return `{blue|${value}}`; // Current year: blue and bold
          }
          if (String(value) <= currentYear) {
            return `{bold|${value}}`; // Years up to and including minSeq: bold
          }
          if (String(value) > currentYear) {
            return `{light|${value}}`; // Years up to and including minSeq: bold
          }
          return value; // Other years: normal
        },
        rich: {
          blue: {
            color: "#4169E1",
            fontWeight: "bold",
          },
          bold: {
            fontWeight: "bold",
          },
          light: {
            color: "#B2B2B2",
            fontWeight: "200",
          },
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        inside: false,
        formatter: (value) => {
          return (
            new Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value / 1000000) + " Jt"
          );
        },
      },
      axisPointer: {
        snap: true,
      },
    },
    // visualMap: {
    //   show: false,
    //   dimension: 0,
    //   pieces: [
    //     {
    //       lte: 6,
    //       color: "green",
    //     },
    //     {
    //       gt: 6,
    //       lte: 8,
    //       color: "green",
    //     },
    //     {
    //       gt: 8,
    //       lte: 14,
    //       color: "green",
    //     },
    //     {
    //       gt: 14,
    //       lte: 17,
    //       color: "green",
    //     },
    //     {
    //       gt: 17,
    //       color: "green",
    //     },
    //   ],
    // },
    dataZoom: [
      {
        type: "inside",
        throttle: 50,
      },
    ],
    series: [
      {
        name: "Annualized O&M Cost",
        data: chartData.map((item) => {
          return item.eac_annual_mnt_cost;
        }),
        type: "bar",
        itemStyle: {
          color: new Function(`return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#A2DE32' // Start color
                }, {
                  offset: 1,
                  color: '#42C023' // End color
                }],
                global: false
              }`)(),
        },
        // showBackground: true,
        // backgroundStyle: {
        //   color: "rgba(180, 180, 180, 0.2)",
        // },
      },

      {
        name: "Annualized Acquisition Cost",
        data: chartData.map((item) => {
          return item.eac_annual_acq_cost;
        }),
        type: "bar",
        itemStyle: {
          color: new Function(`return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#F7ED53' // Start color
                  }, {
                    offset: 1,
                    color: '#D4CA2F' // End color
                  }],
                  global: false
                }`)(),
        },
        // showBackground: true,
        // backgroundStyle: {
        //   color: "rgba(180, 180, 180, 0.2)",
        // },
      },
      {
        name: "EAC",
        type: "line",
        smooth: false,
        data: chartData.map((item) => {
          return item.eac_eac;
        }),
        symbolSize: 6,
        itemStyle: {
          color: "#D93832",
        },
        lineStyle: {
          width: 2,
          color: "#D93832",
        },
        // areaStyle: {
        //   opacity: 0.2,
        // },
        emphasis: {
          focus: "series",
          symbolSize: 8,
        },
        markPoint: {
          symbol:
            "path://M0,0 L100,0 Q120,0 120,20 L120,40 Q120,60 100,60 L60,60 L50,75 L40,60 L0,60 Q-20,60 -20,40 L-20,20 Q-20,0 0,0",
          symbolSize: [120, 40],
          symbolOffset: [0, -25],
          itemStyle: {
            color: "#28C840", // Green color matching your image
          },
          silent: true, // Disables hover interactions
          emphasis: {
            scale: 1, // Prevents scaling on hover
          },
          label: {
            formatter: "Minimum Eac",
            position: "inside",
            color: "#fff",
            distance: 10,
            fontSize: 18,
            fontWeight: "semibold",
          },
          data: [
            {
              type: "min",
              name: "Minimum Eac",
            },
          ],
        },
        markLine: {
          label: {
            formatter: "Minimum EAC: {c}",
          },
          symbol: ["none", "none"],
          lineStyle: {
            color: "#D93832",
            type: "dashed",
          },
          data: [
            {
              xAxis: minSeq, // This will create a vertical line at minSeq year
              label: {
                show: false,
                position: "middle",
              },
            },
          ],
        },
      },

      //   {
      //     name: "Electricity Up",
      //     type: "line",
      //     smooth: true,
      //     // prettier-ignore
      //     data: xAxisData.map((year, index) => {
      //                     const maxValue = 2000;
      //                     const minValue = 1;
      //                     const progress = index / (xAxisData.length - 1);  // 0 to 1
      //                     const value = Math.round(minValue + (maxValue - minValue) * (progress * progress));

      //                     return value;
      //                 }),
      //     markArea: {
      //       itemStyle: {
      //         color: "rgba(255, 173, 177, 0.4)",
      //       },
      //       data: [
      //         [
      //           {
      //             name: "Intersection",
      //             xAxis: "16:15",
      //           },
      //           {
      //             xAxis: "17:30",
      //           },
      //         ],
      //       ],
      //     },
      //   },
    ],
  };

  const tableData =
    chartData.filter((item) => item.tahun == selectedData) ?? [];

  // Event handler for chart clicks
  const onChartClick = (params) => {
    console.log(params.name);
    setSelectedData(params.name);
    if (selectedData) {
      onOpenChange();
    }
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        isDismissable={false}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {assetName} Life Cycle Cost in {selectedData}
              </ModalHeader>
              <ModalBody>
                <div className={`overflow-y-auto`}>
                  <AssetTablePerYear data={tableData} />
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ReactECharts
        option={chartOption}
        style={{ minHeight: "50dvh" }}
        onEvents={onEvents}
      ></ReactECharts>
      <section className="w-full flex justify-end">
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => exportChartData.toCsv(chartData)}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => exportChartData.toPdf(chartData, assetName)}
          >
            Export PDF
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => exportChartData.toExcel(chartData, assetName)}
          >
            Export Excel
          </Button>
        </div>
      </section>
    </>
  );
}
