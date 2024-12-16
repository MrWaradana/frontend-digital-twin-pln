import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface PredictionCalendarProps {
  onDateSelect: (date: Date | undefined) => void;
  selected: Date | undefined;
}

const PredictionCalendar: React.FC<PredictionCalendarProps> = ({
  onDateSelect,
  selected,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);

  useEffect(() => {
    setSelectedDate(selected);
  }, [selected]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const handleMonthChange = (month: Date) => {
    setSelectedDate((prevSelectedDate) => {
      const newDate = prevSelectedDate
        ? new Date(
            month.getFullYear(),
            month.getMonth(),
            prevSelectedDate.getDate()
          )
        : new Date(month);
      onDateSelect(newDate);
      return newDate;
    });
  };

  const styles = {
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
    },
    calendar: {
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
    },
    table: {
      width: "100%",
      borderSpacing: "10px",
    },
    headerCell: {
      fontSize: "1.2rem",
      textAlign: "center" as const,
    },
    day: {
      padding: "5px 10px",
      borderRadius: "50%",
      textAlign: "center" as const,
    },
  };

  return (
    <div style={styles.container}>
      <DayPicker
        startMonth={new Date(1945, 12)}
        endMonth={new Date(2050, 12)}
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        month={selectedDate}
        onMonthChange={handleMonthChange}
        required={true}
        styles={{
          head: styles.headerCell,
          table: styles.table,
          day: styles.day,
        }}
        classNames={{
          today: `text-[#1C9EB6] font-semibold`,
          selected: `bg-[#1C9EB6] text-white rounded-full flex items-center justify-center m-auto !transition-none`,
          chevron: `fill-gray-500 font-thin`,
        }}
      />
    </div>
  );
};

export default PredictionCalendar;
