import OverviewContainer from "@/components/containers/OverviewContainer";
import TableBudgetConstraint from "@/components/optimum-oh-app/budget-constraint/TableBudgetConstraint";
import { useState } from "react";

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

export default function BudgetConstraintPage() {
  return (
    <OverviewContainer navbarTitle={`Budget Constraint`}>
      <TableBudgetConstraint tableData={tableData} />
    </OverviewContainer>
  );
}
