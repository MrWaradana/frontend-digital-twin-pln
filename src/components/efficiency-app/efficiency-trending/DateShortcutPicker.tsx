import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { DateValue } from "@react-types/datepicker";

interface DateShortcutPickerProps {
  onShortcutSelect: (interval: {
    unit: "days" | "months";
    value: number;
  }) => void;
  currentStartDate?: DateValue;
  currentEndDate?: DateValue;
}

interface Shortcut {
  label: string;
  unit: "days" | "months";
  value: number;
}

const DateShortcutPicker: React.FC<DateShortcutPickerProps> = ({
  onShortcutSelect,
  currentStartDate,
  currentEndDate,
}) => {
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  const shortcuts: Shortcut[] = [
    { label: "Last 7 Days", unit: "days", value: 7 },
    { label: "Last 1 Month", unit: "months", value: 1 },
    { label: "Last 3 Month", unit: "months", value: 3 },
    { label: "Last 6 Month", unit: "months", value: 6 },
    { label: "Last 1 Year", unit: "months", value: 12 },
    { label: "Last 5 Year", unit: "months", value: 60 },
  ];

  // Effect to check if current date range matches any shortcut
  useEffect(() => {
    if (!currentStartDate || !currentEndDate) {
      setActiveShortcut(null);
      return;
    }

    const endDate = today(getLocalTimeZone());

    // Find matching shortcut
    const matchingShortcut = shortcuts.find((shortcut) => {
      const shortcutStartDate =
        shortcut.unit === "months"
          ? endDate.subtract({ months: shortcut.value })
          : endDate.subtract({ days: shortcut.value });

      return (
        currentStartDate.compare(shortcutStartDate) === 0 &&
        currentEndDate.compare(endDate) === 0
      );
    });
    setActiveShortcut(
      matchingShortcut
        ? `${matchingShortcut.unit}-${matchingShortcut.value}`
        : null
    );
  }, [currentStartDate, currentEndDate]);

  const handleShortcutClick = (shortcut: Shortcut) => {
    setActiveShortcut(`${shortcut.unit}-${shortcut.value}`);
    onShortcutSelect({ unit: shortcut.unit, value: shortcut.value });
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full">
      {shortcuts.map((shortcut) => (
        <Button
          key={shortcut.label}
          size="sm"
          variant={
            activeShortcut === `${shortcut.unit}-${shortcut.value}`
              ? "solid"
              : "flat"
          }
          color={
            activeShortcut === `${shortcut.unit}-${shortcut.value}`
              ? "primary"
              : "default"
          }
          className={`px-3 py-1 w-full ${
            activeShortcut === `${shortcut.unit}-${shortcut.value}`
              ? "bg-[#D4CA2F]"
              : ""
          }`}
          onClick={() => handleShortcutClick(shortcut)}
        >
          {shortcut.label}
        </Button>
      ))}
    </div>
  );
};

export default DateShortcutPicker;
