"use client";

import React from "react";
import { useReactTable } from "@tanstack/react-table";
import { paretoData } from "@/lib/pareto-api-data";

// Define the types
type ParetoType = {
  category: string;
  data: DataParetoType[];
  total_losses: number;
};

type DataParetoType = {
  deviasi: number;
  existing_data: number;
  gap: number;
  id: string;
  nilai_losses: number;
  persen_hr: number;
  reference_data: number;
  variable: VariableType;
};

type VariableType = {
  category: string;
  created_at: string;
  created_by: string;
  excel_id: string;
  excel_variable_name: string;
  id: string;
  in_out: string;
  input_name: string;
  is_faktor_koreksi: boolean;
  is_nilai_losses: boolean;
  is_pareto: boolean;
  satuan: string;
  short_name: string;
  updated_at: string;
  updated_by: string | null;
};

// Sample data
// const paretoData: ParetoType[] = [
//   {
//     category: "Stream [2] - Primary air outlet of Boiler Assembly [2] - BLR 1",
//     data: [
//       {
//         deviasi: 1,
//         existing_data: 0.2391944456616636,
//         gap: -1.5380660213166846,
//         id: "5c74afc0-b356-47be-9934-534e9edbcd4b",
//         nilai_losses: 153.80660213166846,
//         persen_hr: 100,
//         reference_data: -1.298871575655021,
//         variable: {
//           category:
//             "Stream [2] - Primary air outlet of Boiler Assembly [2] - BLR 1",
//           created_at: "2024-08-30T08:51:10.699783",
//           created_by: "24d28102-4d6a-4628-9a70-665bcd50a0f0",
//           excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
//           excel_variable_name:
//             "Stream [2] - Primary air outlet of Boiler Assembly [2] - BLR 1: Rotary Air Heater [8] - Rotary Air Heater -> Primary air inlet of Boiler Assembly [2] - BLR 1: Furnace w/ Pulverizer [7]: Pressure",
//           id: "a2d46afd-ff6f-4329-b6f4-fc2f6284fa49",
//           in_out: "out",
//           input_name:
//             "Rotary Air Heater [8] - Rotary Air Heater -> Primary air inlet of Boiler Assembly [2] - BLR 1: Furnace w/ Pulverizer [7]: Pressure",
//           is_faktor_koreksi: false,
//           is_nilai_losses: false,
//           is_pareto: true,
//           satuan: "bar",
//           short_name:
//             "Rotary Air Heater [8] - Rotary Air Heater -> Primary air inlet of Boiler Assembly [2] - BLR 1: Furnace w/ Pulverizer [7]: Pressure",
//           updated_at: "2024-08-30T08:51:10.699783",
//           updated_by: null,
//         },
//       },
//       {
//         deviasi: 1,
//         existing_data: 65.89154144857667,
//         gap: 0.3998299125986904,
//         id: "ec0dccf5-b95a-4ef1-a8a5-184211c61f74",
//         nilai_losses: 39.98299125986904,
//         persen_hr: 100,
//         reference_data: 66.29137136117536,
//         variable: {
//           category:
//             "Stream [2] - Primary air outlet of Boiler Assembly [2] - BLR 1",
//           created_at: "2024-08-30T08:51:10.699783",
//           created_by: "24d28102-4d6a-4628-9a70-665bcd50a0f0",
//           excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
//           excel_variable_name:
//             "Stream [2] - Primary air outlet of Boiler Assembly [2] - BLR 1: Rotary Air Heater [8] - Rotary Air Heater -> Primary air inlet of Boiler Assembly [2] - BLR 1: Furnace w/ Pulverizer [7]: Mass flow",
//           id: "202bcc69-b470-4ddc-b2b5-4b4e4e2fb7ac",
//           in_out: "out",
//           input_name:
//             "Rotary Air Heater [8] - Rotary Air Heater -> Primary air inlet of Boiler Assembly [2] - BLR 1: Furnace w/ Pulverizer [7]: Mass flow",
//           is_faktor_koreksi: false,
//           is_nilai_losses: false,
//           is_pareto: true,
//           satuan: "t/h",
//           short_name:
//             "Rotary Air Heater [8] - Rotary Air Heater -> Primary air inlet of Boiler Assembly [2] - BLR 1: Furnace w/ Pulverizer [7]: Mass flow",
//           updated_at: "2024-08-30T08:51:10.699783",
//           updated_by: null,
//         },
//       },
//     ],
//     total_losses: 193.7895933915375,
//   },
//   {
//     category:
//       "Stream [28] - Outlet of Pipe (PCE) [36] -> Heating steam inlet of Feedwater Heater [17] - HPH-2",
//     data: [
//       {
//         deviasi: 1,
//         existing_data: 35.683218531172926,
//         gap: 0.1950786247979508,
//         id: "4eb817f8-5431-4d3b-9684-c9c663d93725",
//         nilai_losses: 19.50786247979508,
//         persen_hr: 100,
//         reference_data: 35.87829715597088,
//         variable: {
//           category:
//             "Stream [28] - Outlet of Pipe (PCE) [36] -> Heating steam inlet of Feedwater Heater [17] - HPH-2",
//           created_at: "2024-08-30T08:51:10.699783",
//           created_by: "24d28102-4d6a-4628-9a70-665bcd50a0f0",
//           excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
//           excel_variable_name:
//             "Stream [28] - Outlet of Pipe (PCE) [36] -> Heating steam inlet of Feedwater Heater [17] - HPH-2: Mass flow",
//           id: "2a68f76f-b585-4a17-9f3c-37e5c0f042a9",
//           in_out: "out",
//           input_name: "Mass flow",
//           is_faktor_koreksi: false,
//           is_nilai_losses: false,
//           is_pareto: true,
//           satuan: "t/h",
//           short_name: "Mass flow",
//           updated_at: "2024-08-30T08:51:10.699783",
//           updated_by: null,
//         },
//       },
//     ],
//     total_losses: 19.50786247979508,
//   },
//   {
//     category: "Stream [10] - Steam outlet of Boiler Assembly [2] - BLR 1",
//     data: [
//       {
//         deviasi: 1,
//         existing_data: 26.36253580143999,
//         gap: -0.10420925654562296,
//         id: "e7cd840e-61f5-4170-91c7-feae027a4fe4",
//         nilai_losses: 10.420925654562296,
//         persen_hr: 100,
//         reference_data: 26.258326544894366,
//         variable: {
//           category: "Stream [10] - Steam outlet of Boiler Assembly [2] - BLR 1",
//           created_at: "2024-08-30T08:51:10.699783",
//           created_by: "24d28102-4d6a-4628-9a70-665bcd50a0f0",
//           excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
//           excel_variable_name:
//             "Stream [10] - Steam outlet of Boiler Assembly [2] - BLR 1: Superheater (PCE) - Parallel Flow [78] - RH-1 -> Inlet of Boiler Assembly [2] - BLR 1: Valve [14]: Pressure",
//           id: "74d5f630-2924-4310-ae17-76f96cea27de",
//           in_out: "out",
//           input_name:
//             "Superheater (PCE) - Parallel Flow [78] - RH-1 -> Inlet of Boiler Assembly [2] - BLR 1: Valve [14]: Pressure",
//           is_faktor_koreksi: false,
//           is_nilai_losses: false,
//           is_pareto: true,
//           satuan: "bar",
//           short_name:
//             "Superheater (PCE) - Parallel Flow [78] - RH-1 -> Inlet of Boiler Assembly [2] - BLR 1: Valve [14]: Pressure",
//           updated_at: "2024-08-30T08:51:10.699783",
//           updated_by: null,
//         },
//       },
//     ],
//     total_losses: 10.420925654562296,
//   },
// ];

const columns = [
  {
    accessorKey: "variable",
    header: "Parameter",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
];

export default function TableParetoHeatloss() {
  const [data, setData] = React.useState(paretoData);

  return (
    <table cellPadding="10" cellSpacing="0" className="border-2">
      <thead>
        <tr className="border border-black bg-primary/20">
          <th>Category</th>
          <th>Variable Name</th>
          <th>Satuan</th>
          <th>Reference Data</th>
          <th>Existing Data</th>
          <th>Gap</th>
          <th>Percentage HR</th>
          <th>Deviation</th>
          <th>Losses</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <React.Fragment key={item.category}>
            <tr className="border border-black">
              <td colSpan={9}>
                <strong>{item.category}</strong>
              </td>
            </tr>
            {item.data.map((dataItem) => (
              <tr key={dataItem.id} className="border border-black">
                <td></td>
                <td>{dataItem.variable.input_name}</td>
                <td>{dataItem.variable.satuan}</td>
                <td>{dataItem.reference_data?.toFixed(4)}</td>
                <td>{dataItem.existing_data?.toFixed(4)}</td>
                <td>{dataItem.gap.toFixed(4)}</td>
                <td>
                  <input defaultValue={dataItem.persen_hr} type="number" />
                </td>
                <td>
                  <input defaultValue={dataItem.deviasi} type="number" />
                </td>
                <td>{dataItem.nilai_losses.toFixed(4)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={8}>
                <strong>Total Losses</strong>
              </td>
              <td colSpan={1}>
                <strong>{item.total_losses.toFixed(4)}</strong>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
