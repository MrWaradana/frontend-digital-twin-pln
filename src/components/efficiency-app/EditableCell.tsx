import { Input, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function EditableCell({
  getValue,
  row,
  column,
  table,
  mutate,
  isValidating,
  setIsMutating,
}: any) {
  const initialValue = getValue();
  const [value, setValue] = useState("");
  const [isInputLoading, setIsInputLoading] = useState(false);
  const session = useSession();

  // Function to send the update request
  const updateParetoData = async () => {
    setIsInputLoading(true);
    try {
      // Initialize an empty object for the payload
      const payload = {
        detail_id: row.original.id,
      };

      // Conditionally add either 'deviasi' or 'persen_hr' to the payload
      if (column.id.toLowerCase() === "deviasi") {
        payload.deviasi = value;
      } else if (column.id.toLowerCase() === "% hr") {
        payload.persen_hr = value;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/data/${row.original.id}/pareto`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update pareto data");
      }

      const data = await response.json();
      console.log("Update successful:", data);
    } catch (error) {
      console.error("Error updating pareto data:", error);
    } finally {
      setIsInputLoading(false);

      mutate();
    }
  };

  const onBlur = () => {
    // Check if the value has changed
    if (value !== initialValue) {
      const isDone = table.options.meta?.updateData(
        row.index,
        column.id,
        value
      );
      setIsMutating(true);
      if (isDone) {
        updateParetoData();
        setIsMutating(false);
      }
    } else {
      console.log("No changes detected, skipping update.");
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative">
      {(isInputLoading || isValidating) && <Spinner size="sm" />}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        size="sm"
        variant="flat"
        className="whitespace-nowrap overflow-hidden text-right justify-end items-end"
        style={{ textAlign: "right" }}
        disabled={isInputLoading} // Prevent input when loading
      />
    </div>
  );
}
