import React from "react";
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAMA", uid: "name", sortable: true },
  { name: "JENIS PARAMETER", uid: "jenis_parameter", sortable: true },
  { name: "PERIODE", uid: "periode", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const parameterOptions = [
  { name: "Periodic", uid: "periodic" },
  { name: "Current", uid: "current" },
];
const statusOptions = [
  { name: "Pending", uid: "Pending" },
  { name: "Done", uid: "Done" },
  { name: "Processing", uid: "Processing" },
  { name: "Failed", uid: "Failed" },
];

export { columns, parameterOptions, statusOptions };
