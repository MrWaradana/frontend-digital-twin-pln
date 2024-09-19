import React from "react";
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAMA", uid: "name", sortable: true },
  { name: "JENIS PARAMETER", uid: "jenis_parameter", sortable: true },
  { name: "PERIODE", uid: "periode", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const parameterOptions = [
  { name: "Target", uid: "target" },
  { name: "Key Performance Indicator (KPI)", uid: "kpi" },
  { name: "Current", uid: "current" },
];


export { columns, parameterOptions};
