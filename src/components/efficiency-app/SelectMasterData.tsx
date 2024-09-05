"use client";

import React from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";

const masterDataParameter = [
  { key: "current", label: "Current" },
  { key: "kpi", label: "Key Performance Indicator" },
  { key: "target", label: "Target" },
];


export default function SelectMasterData({ onMasterDataChange }: { onMasterDataChange: any }) {

  return (
    <Select
      isRequired
      label="Parameter"
      placeholder="Select Parameter"
      defaultSelectedKeys={["current"]}
      size="sm"
      className="max-w-xs"
      onChange={(e) => {
        onMasterDataChange(e.target.value)
      }}
    >
      {masterDataParameter.map((item) => (
        <SelectItem key={item.key}>{item.label}</SelectItem>
      ))}
    </Select>
  );
}
