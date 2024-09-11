import { Input, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function EditableCell({
  getValue,
  row,
  column,
  table,
  mutate,
}: any) {
  const initialValue = getValue();
  const [value, setValue] = useState("");
  const [isInputLoading, setIsInputLoading] = useState(false);
  const session = useSession();

  // Function to send the update request
  const updateParetoData = async () => {
    setIsInputLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EFFICIENCY_APP_URL}/data/${row.original.id}/pareto`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
          body: JSON.stringify(
            {
              detail_id: row.original.id,
              deviasi:
                column.id.toLowerCase() === "deviasi"
                  ? value
                  : row.original.deviasi, // Assuming this field should contain the updated value
              persen_hr:
                column.id.toLowerCase() === "% hr"
                  ? value
                  : row.original.persen_hr, // You can adjust these values as needed
            }
            // Add more objects if needed
          ),
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
    table.options.meta?.updateData(row.index, column.id, value);
    // console.log(value, "value");
    // console.log(column.id.toLowerCase() === "deviasi");
    updateParetoData();
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative">
      {isInputLoading && <Spinner size="lg" />}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        size="sm"
        variant="flat"
        className="whitespace-nowrap overflow-hidden"
        disabled={isInputLoading} // Prevent input when loading
      />
    </div>
  );
}
