"use client";

import { useEffect, useMemo, useState } from "react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { Button, DateRangePicker, Spinner } from "@nextui-org/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { DateValue } from "@react-types/datepicker";
import { RangeValue } from "@react-types/shared";
// import EChartsStackedLine from "@/components/efficiency-app/efficiency-trending/EChartsStackedLine";
import { useGetDataParetoTrending } from "@/lib/APIs/useGetDataParetoTrending";
import { useSession } from "next-auth/react";
import DateShortcutPicker from "@/components/efficiency-app/efficiency-trending/DateShortcutPicker";
import dynamic from "next/dynamic";

const EChartsStackedLine = dynamic(
  () =>
    import(
      "@/components/efficiency-app/efficiency-trending/EChartsStackedLine"
    ),
  { ssr: false }
);

export default function EfficiencyTrending() {
  const [selectedSeries, setSelectedSeries]: any = useState(null);
  const [periodValue, setPeriodValue] = useState<RangeValue<DateValue>>({
    start: parseDate("2024-09-18"),
    end: today(getLocalTimeZone()),
  });

  const { data: session } = useSession();

  const {
    data: paretoTrendingData,
    isLoading: isLoadingParetoTrending,
    isValidating,
    mutate,
  } = useGetDataParetoTrending(
    session?.user.access_token,
    periodValue.start,
    periodValue.end
  );

  const paretoTrendingChart = useMemo(() => {
    // Return empty array if loading or no data
    if (isLoadingParetoTrending || !paretoTrendingData) {
      return [];
    }

    // Ensure paretoTrendingData is an array
    if (!Array.isArray(paretoTrendingData)) {
      console.warn("paretoTrendingData is not an array");
      return [];
    }

    // console.log(paretoTrendingData)

    return paretoTrendingData
      .map((data) => {
        try {
          // Initialize transformed data with basic properties
          const transformedData = {
            data: {
              id: data?.id || "",
              name: data?.name || "",
              periode: data?.periode || "",
            },
            total_nilai: data?.pareto?.total_nilai || 0,
          };

          // Safely handle pareto_result mapping
          if (data?.pareto.pareto_result) {
            Object.entries(data.pareto.pareto_result).forEach(([_, pareto]) => {
              if (
                pareto?.category &&
                typeof pareto.total_nilai_losses !== "undefined"
              ) {
                transformedData[pareto.category] = pareto;
              }
            });
          }

          return transformedData;
        } catch (error) {
          console.error("Error transforming pareto data:", error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries from failed transformations
  }, [paretoTrendingData, isLoadingParetoTrending]);

  const listCategories = useMemo(() => {
    const categories = new Set<string>();
    paretoTrendingChart.forEach((pareto: any) => {
      Object.keys(pareto).forEach((key) => {
        if (key !== "data") {
          categories.add(key);
        }
      });
    });
    return Array.from(categories);
  }, [paretoTrendingChart]);

  // Extract categories for the x-axis
  // const categories = dataChart.map((item) => item.period);
  const periode = paretoTrendingChart.map((item: any) => item.data.periode);

  // Event handler for button detailed analysis clicks
  const onDetailedAnalysisClicked = () => {
    // Get the index of the clicked point
    const clickedSeriesName = "Total Nilai Heatloss";

    // Prepare data for all categories at this point
    const allSeriesData = listCategories
      .map((category) => ({
        name: category,
        data: paretoTrendingChart.map((point: any, index: any) => ({
          period: periode[index],
          value: point[category].total_nilai_losses,
        })),
        isClickedSeries: category === clickedSeriesName,
      }))
      .filter((item: any) => item.name != "total_nilai");

    setSelectedSeries({
      clickedName: clickedSeriesName,
      allSeries: allSeriesData,
    });
  };

  // Handler for shortcut selection
  const handleShortcutSelect = (interval: {
    unit: "days" | "months";
    value: number;
  }) => {
    const endDate = today(getLocalTimeZone());
    const startDate =
      interval.unit === "months"
        ? endDate.subtract({ months: interval.value })
        : endDate.subtract({ days: interval.value });

    setPeriodValue({
      start: startDate,
      end: endDate,
    });
  };

  // Handler for manual date range changes
  const handleDateRangeChange = (range: RangeValue<DateValue>) => {
    if (!range?.start || !range?.end) return;
    setPeriodValue(range);
  };

  useEffect(() => {
    mutate();
  }, [periodValue]);

  // if (isLoadingParetoTrending || isValidating)
  //   return (
  //     <EfficiencyContentLayout title="Efficiency Trending">
  //       <div className="flex justify-center mt-12">
  //         <Spinner color="primary" />
  //       </div>
  //     </EfficiencyContentLayout>
  //   );

  return (
    <EfficiencyContentLayout title={`Efficiency Trending`}>
      <section
        className={`flex flex-row justify-start items-start w-full h-[90dvh] gap-4`}
      >
        <div className={`flex flex-col gap-5 items-center justify-start`}>
          <DateShortcutPicker
            onShortcutSelect={handleShortcutSelect}
            currentStartDate={periodValue?.start}
            currentEndDate={periodValue?.end}
          />
          <DateRangePicker
            className="max-w-xs"
            label={`Choose period`}
            onChange={handleDateRangeChange}
            value={periodValue}
            size="sm"
          />
          <Button
            color={`primary`}
            variant={`solid`}
            size={`sm`}
            className="w-full"
            onClick={onDetailedAnalysisClicked}
          >
            Open Detailed per Category
          </Button>
        </div>

        {isLoadingParetoTrending || isValidating ? (
          <div className="flex justify-center mt-12 w-full">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className={`w-full h-full`}>
            <EChartsStackedLine
              chartData={paretoTrendingChart}
              selectedSeries={selectedSeries}
              setSelectedSeries={setSelectedSeries}
            />
          </div>
        )}
      </section>
    </EfficiencyContentLayout>
  );
}
