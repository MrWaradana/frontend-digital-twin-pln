"use client";

import React from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";

const masterDataParameter = [
  { key: "current", label: "Current" },
  // { key: "Niaga", label: "Niaga" },
  // { key: "Commision", label: "Commision" },
];

export default function SelectMasterData({
  onMasterDataChange,
}: {
  onMasterDataChange: any;
}) {
  const { data: session } = useSession();

  return (
    <Select
      isRequired
      label="Parameter"
      placeholder="Select Parameter"
      defaultSelectedKeys={["current"]}
      size="sm"
      className="max-w-xs"
      onChange={(e) => {
        onMasterDataChange(e.target.value);
      }}
    >
      {session?.user.user.role === "Admin" ? (
        masterDataParameter.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))
      ) : (
        <SelectItem key={"current"}>Current</SelectItem>
      )}
    </Select>
  );
}
