import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function EditableCell({ getValue, row, column, table }: any) {
  const initialValue = getValue();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
    setIsLoading(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      size="sm"
      variant="flat"
      className=" whitespace-nowrap overflow-hidden"
    />
  );
}
