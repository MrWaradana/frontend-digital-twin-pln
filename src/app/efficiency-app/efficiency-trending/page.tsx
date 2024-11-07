"use client";

import { useState } from "react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { DateRangePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { DateValue } from "@react-types/datepicker";
import { RangeValue } from "@react-types/shared";
import EChartsStackedLine from "@/components/efficiency-app/efficiency-trending/EChartsStackedLine";

export default function Page() {
  const [periodValue, setPeriodValue] = useState<RangeValue<DateValue>>({
    start: parseDate("2024-09-18"),
    end: today(getLocalTimeZone()),
  });

  // Handler for date range changes
  const handleDateRangeChange = (range) => {
    if (!range.start || !range.end) return;

    const daysDifference = Math.abs(Number(range.end) - Number(range.start));

    if (daysDifference > 30) {
      // If selected range is more than 30 days, adjust the start date
      setPeriodValue({
        //@ts-ignore
        start: Number(range.end) - 30,
        end: range.end,
      });
    } else {
      setPeriodValue(range);
    }
  };

  return (
    <EfficiencyContentLayout title={`Efficiency Trending`}>
      <section
        className={`flex flex-col justify-start items-center w-full h-[100dvh] gap-4`}
      >
        <DateRangePicker className="max-w-xs" label={`Choose period`} />
        <div className={`w-full`}>
          <EChartsStackedLine />
        </div>
      </section>
    </EfficiencyContentLayout>
  );
}
