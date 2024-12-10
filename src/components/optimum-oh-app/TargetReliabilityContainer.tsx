"use client";

import { useSession } from "next-auth/react";
import MultipleLineChart from "@/components/optimum-oh-app/target-reliability/MultipleLineChart";
import TableTargetReliability from "./target-reliability/TableTargetReliability";

export default function TargetReliabilityContainer() {
  const { data: session } = useSession();

  const data = [
    {
      category: "UNIT_CONTROLLABLE",
      total_nilai_losses: 641.8566630219076,
      total_persen_losses: 83.939868,
      cum_frequency: 83.939868,
    },
    {
      category: "TURBINE_CYCLE_COMPONENT",
      total_nilai_losses: 76.43772371517194,
      total_persen_losses: 9.99627,
      cum_frequency: 93.936138,
    },
    {
      category: "OPERATOR_CONTROLABLE",
      total_nilai_losses: 36.044114580677665,
      total_persen_losses: 4.713729,
      cum_frequency: 98.649867,
    },
    {
      category: "BOILER_COMPONENT",
      total_nilai_losses: 9.950750886753237,
      total_persen_losses: 1.301326,
      cum_frequency: 99.951193,
    },
    {
      category: "MAKE_UP_WATER",
      total_nilai_losses: 0.373212024,
      total_persen_losses: 0.048807,
      cum_frequency: 100,
    },
  ];

  const tableData = [
    {
      scope_id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      id: "d3c48a5c-b82d-48a1-adf5-17b808dc5b8d",
      assetnum: "A22503",
      scope: {
        scope_name: "B",
        duration_oh: 30,
        crew: 10,
        id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      },
      master_equipment: {
        name: "FDF B INLET GUIDE VANE CONTROL DRIVE",
        location_tag: "3AF-FCV501B",
      },
      total_cost: 0,
    },
    {
      scope_id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      id: "1a92faad-d830-454e-9423-5c61c2824801",
      assetnum: "A22511",
      scope: {
        scope_name: "B",
        duration_oh: 30,
        crew: 10,
        id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      },
      master_equipment: {
        name: "FORCED DRAFT FAN B MOTOR",
        location_tag: "3AF-M501B",
      },
      total_cost: 77834987,
    },
    {
      scope_id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      id: "1206f2d5-cc11-49d4-8171-1384fc255be2",
      assetnum: "A22497",
      scope: {
        scope_name: "B",
        duration_oh: 30,
        crew: 10,
        id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      },
      master_equipment: {
        name: "FDF B SUCTION SILENCER",
        location_tag: "3AF-BS501B",
      },
      total_cost: 0,
    },
    {
      scope_id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      id: "0761c991-c975-4096-9193-6f7a38e0a490",
      assetnum: "A22501",
      scope: {
        scope_name: "B",
        duration_oh: 30,
        crew: 10,
        id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      },
      master_equipment: {
        name: "FORCED DRAFT FAN B",
        location_tag: "3AF-F501B",
      },
      total_cost: 0,
    },
    {
      scope_id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      id: "60a60624-065e-4a46-9d86-3f8b1f2e2147",
      assetnum: "A40681",
      scope: {
        scope_name: "B",
        duration_oh: 30,
        crew: 10,
        id: "e86e7176-e3f9-4ab2-810d-d3e1f46a57e5",
      },
      master_equipment: {
        name: "FORCED DRAFT FAN B MOTOR HOIST",
        location_tag: "3AF-M501B",
      },
      total_cost: 0,
    },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl">
        <MultipleLineChart
          data={data}
          setOpenDetails
          onThresholdChange
          thresholdNumber
          onBarClick
          totalPersen
          efficiencyData
          openDetails
          summaryData
          isValidating={false}
          isLoading={false}
        />
      </div>
      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl">
        <TableTargetReliability
          tableData={tableData}
          addNewUrl="#"
          mutate
          isLoading={false}
          isValidating={false}
          thermoStatus
          page
          setPage
          rowsPerPage
          setRowsPerPage
          pages
          total_items={1}
          setFilterSearch
          setFilterParameter
          setFilterStatus
          statusFilter
          setStatusFilter
          scopeFilter
          setScopeFilter
          filterScope
          setFilterScope
        />
      </div>
    </section>
  );
}
