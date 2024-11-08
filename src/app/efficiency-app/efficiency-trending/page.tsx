"use client";

import { useMemo, useState } from "react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { CircularProgress, DateRangePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { DateValue } from "@react-types/datepicker";
import { RangeValue } from "@react-types/shared";
import EChartsStackedLine from "@/components/efficiency-app/efficiency-trending/EChartsStackedLine";
import { useGetDataParetoTrending } from "@/lib/APIs/useGetDataParetoTrending";
import { useSession } from "next-auth/react";

export default function Page() {
  const [periodValue, setPeriodValue] = useState<RangeValue<DateValue>>({
    start: parseDate("2024-09-18"),
    end: today(getLocalTimeZone()),
  });

  const { data: session } = useSession();

  const {
    data: paretoTrendingData,
    isLoading: isLoadingParetoTrending,
  } = useGetDataParetoTrending(session?.user.access_token);

  const paretoTrendingChart = useMemo(() => {
    // Return empty array if loading or no data
    if (isLoadingParetoTrending || !paretoTrendingData) {
      return [];
    }

    // Ensure paretoTrendingData is an array
    if (!Array.isArray(paretoTrendingData)) {
      console.warn('paretoTrendingData is not an array');
      return [];
    }

    // console.log(paretoTrendingData)

    return paretoTrendingData.map((data) => {
      try {
        // Initialize transformed data with basic properties
        const transformedData = {
          data: {
            id: data?.id || '',
            name: data?.name || '',
            periode: data?.periode || '',
          },
          total_nilai: data?.pareto?.total_nilai || 0
        };

        // Safely handle pareto_result mapping
        if (data?.pareto.pareto_result) {
          Object.entries(data.pareto.pareto_result).forEach(([_, pareto]) => {
            if (pareto?.category && typeof pareto.total_nilai_losses !== 'undefined') {
              transformedData[pareto.category] = pareto.total_nilai_losses;
            }
          });
        }

        return transformedData;
      } catch (error) {
        console.error('Error transforming pareto data:', error);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from failed transformations
  }, [paretoTrendingData, isLoadingParetoTrending]);


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

  if (isLoadingParetoTrending)
    return (
      <EfficiencyContentLayout title="Efficiency Trending">
        <div className="flex justify-center mt-12">
          <CircularProgress color="primary" />
        </div>
      </EfficiencyContentLayout>
    );

  return (
    <EfficiencyContentLayout title={`Efficiency Trending`}>
      <section
        className={`flex flex-col justify-start items-center w-full h-[100dvh] gap-4`}
      >
        <DateRangePicker className="max-w-xs" label={`Choose period`} />
        <div className={`w-full`}>
          <EChartsStackedLine chartData={paretoTrendingChart} />
        </div>
      </section>
    </EfficiencyContentLayout>
  );
}
