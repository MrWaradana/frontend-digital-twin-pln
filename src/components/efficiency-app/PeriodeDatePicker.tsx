// import React, { useState } from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

// export default function PeriodeDatePicker({ startDate, endDate }) {
//     const [startDateValue, setStartDateValue] = useState(startDate);
//     const [endDateValue, setEndDateValue] = useState(endDate);

// };

// ("use client");

import React, { useState } from "react";
import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isAfter, isBefore, isValid } from "date-fns";

export default function PeriodeDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (isValid(date)) {
      setStartDate(date);
      if (endDate && isAfter(date, endDate)) {
        setEndDate(null);
      }
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (isValid(date) && startDate && !isBefore(date, startDate)) {
      setEndDate(date);
    }
  };

  const formatDate = (date: Date | null) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Select Date Range
      </h2>
      <div className="space-y-4">
        <Input
          type="date"
          label="Start Date"
          placeholder="Select start date"
          value={formatDate(startDate)}
          onChange={handleStartDateChange}
          startContent={<CalendarIcon className="text-gray-400" size={20} />}
        />
        <Input
          type="date"
          label="End Date"
          placeholder="Select end date"
          value={formatDate(endDate)}
          onChange={handleEndDateChange}
          startContent={<CalendarIcon className="text-gray-400" size={20} />}
          isDisabled={!startDate}
        />
      </div>
      {startDate && endDate && (
        <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <Button className="mt-4 w-full" color="primary">
              View Selected Range
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <p className="text-sm">
                Selected Range: {format(startDate, "MMM dd, yyyy")} -{" "}
                {format(endDate, "MMM dd, yyyy")}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
