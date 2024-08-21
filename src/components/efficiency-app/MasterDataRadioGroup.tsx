"use client";

import React from "react";
import { RadioGroup, Radio } from "@nextui-org/react";

export default function MasterDataRadioGroup() {
  const [selected, setSelected] = React.useState("target");

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup
        label="Select master data"
        value={selected}
        onValueChange={setSelected}
      >
        <Radio value="target">Target</Radio>
        <Radio value="kpi">KPI</Radio>
        <Radio value="current">Current</Radio>
      </RadioGroup>
      <p className="text-default-500 text-small">Selected: {selected}</p>
    </div>
  );
}
