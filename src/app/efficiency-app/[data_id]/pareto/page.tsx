"use client";

import { Button, Divider, Link, Spinner } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import MultipleLineChart from "@/components/efficiency-app/pareto/MultipleLineChart";
import TableParetoHeatloss from "@/components/efficiency-app/TableParetoHeatloss";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useEffect, useMemo, useState, useRef } from "react";
import { useGetDataPareto } from "@/lib/APIs/useGetDataPareto";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TableParetoTop from "@/components/efficiency-app/pareto/TableParetoTop";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useGetRootCauseCount } from "../../../../lib/APIs/useGetRootCauseCount";

export default function Page({ params }: { params: { data_id: string } }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const percent_threshold = searchParams.get("percent-threshold");
  const [potentialTimeframe, setPotentialTimeframe]: any = useState(
    searchParams.get("potential-timeframe")
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [tableParetoData, setTableParetoData] = useState([]);
  const [dataId, setDataId]: any = useState(null);
  const [isMutating, setIsMutating] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("commision");
  const session = useSession();

  const [percentageThreshold, setPercentageThreshold] =
    useState(percent_threshold);

  const {
    data: dataRootCauseCount,
    mutate: mutateRootCauseCount,
    isLoading: isLoadingRootCauseCount,
    error: errorRootCauseCount,
    isValidating: isValidatingRootCauseCount,
  } = useGetRootCauseCount(session?.data?.user.access_token, params.data_id);

  const { data, mutate, isLoading, error, isValidating } = useGetDataPareto(
    session?.data?.user.access_token,
    params.data_id,
    percentageThreshold,
    potentialTimeframe,
    dataId
  );

  useEffect(() => {
    if (data?.commision.id && data?.commision.name) {
      setDataId(data.commision.id);
      setSelectedLabel(data.commision.name);
    }
  }, [data]);

  // console.log(data?.pareto_result, "table data pareto");

  const tableData = data?.pareto_result ?? [];
  const efficiencyData = data?.data ?? [];
  const paretoTopData = data?.pareto_uncategorized_result ?? [];
  const paretoBottomData = tableData.filter((item) => item.category != null);
  const coalPrice = data?.coal_price;

  // const tableIsPareto = filter flag is Pareto Hari Senen
  const chartRawData = data?.chart_result ?? [];
  const summaryData: any = data ?? [];
  const chartDataRef = useRef<any | null>(null);
  // Recalculate chartData every time tableData or validation state changes
  const chartData = useMemo(() => {
    const mapped_data = chartRawData
      .map((item: any, index: number) => {
        let cum_frequency = chartRawData
          .slice(0, index + 1)
          .reduce(
            (acc: number, current: { total_persen_losses: number }) =>
              acc + current.total_persen_losses,
            0
          );

        // Ensure cum_frequency is not above 100
        cum_frequency = Math.min(cum_frequency, 100);
        return {
          ...item, // Spread the original item
          cum_frequency, // Add the accumulated frequency
        };
      })
      // .filter((item: any) => item.cum_frequency <= 100 && item.category);
      .filter((item: any) => item.category)
      .map((item, index, array) => {
        // If it's the last item, set cum_frequency to 100
        if (index === array.length - 1) {
          return { ...item, cum_frequency: 100 };
        }
        return item;
      });

    // console.log(mapped_data, "mapped chart data");
    //   return mapped_data;
    // }, [tableData]);

    // Ensure that chartDataRef is always updated correctly
    if (!chartDataRef.current) {
      chartDataRef.current = mapped_data;
    } else if (chartDataRef.current.length === mapped_data.length) {
      // Preserve array length and only update necessary fields
      chartDataRef.current = chartDataRef.current.map(
        (item: any, index: number) => ({
          ...item,
          total_persen_losses: mapped_data[index].total_persen_losses,
          total_nilai_losses: mapped_data[index].total_nilai_losses,
          cum_frequency: mapped_data[index].cum_frequency,
        })
      );
    } else {
      // In case of mismatch, reset chartDataRef to match the mapped_data
      chartDataRef.current = mapped_data;
    }

    // if (chartDataRef.current != null && mapped_data.length > 0) {
    //   chartDataRef.current = mapped_data;
    // }

    return chartDataRef.current;
  }, [tableData]);

  const onMutate = () => {
    setIsMutating(true);
    mutateRootCauseCount();
    mutate();
    setIsMutating(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("percent-threshold", percentageThreshold as string);
    params.set("potential-timeframe", potentialTimeframe as string);
    router.replace(`${pathname}?${params}`, {
      scroll: false,
    });
    setIsMutating(true);
    onMutate();
    setIsMutating(false);
  }, [percentageThreshold, potentialTimeframe]);

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center mt-12">
  //       <CircularProgress color="primary" />
  //     </div>
  //   );

  useEffect(() => {
    mutate();
  }, [mutate, potentialTimeframe]);

  if (error) return <div>{error.message}</div>;

  return (
    <EfficiencyContentLayout title="Pareto Heat Loss">
      <div
        className="flex flex-col w-full items-center justify-center"
        id="root"
      >
        {/* <Button
          as={Link}
          color="primary"
          startContent={<ChevronLeftIcon size={18} />}
          className="my-2"
          href={`/efficiency-app`}
          size="sm"
        >
          Back to all data
        </Button> */}
        <div className="min-w-full h-full overflow-hidden  px-8">
          <MultipleLineChart
            data={chartData}
            setOpenDetails={setOpenDetails}
            openDetails={openDetails}
            efficiencyData={efficiencyData}
            onThresholdChange={setPercentageThreshold}
            thresholdNumber={percentageThreshold}
            summaryData={summaryData}
            totalPersen={summaryData.total_persen}
            isLoading={isLoading}
            potentialTimeframe={potentialTimeframe}
            isValidating={isValidating}
          />
        </div>
        {isLoading || isLoadingRootCauseCount ? (
          <Spinner
            color="primary"
            label="Calculating pareto..."
            className="mt-12"
          />
        ) : (
          <div
            className={`min-w-full mb-6 mt-4 overflow-hidden relative px-8 ${
              openDetails ? "" : "hidden"
            }`}
          >
            {isValidating || isMutating || isValidatingRootCauseCount ? (
              <div className="h-36 mt-4">
                <Spinner color="primary" label="validating..." />
              </div>
            ) : (
              <div className="min-w-full flex flex-col gap-1">
                <TableParetoTop
                  tableData={paretoTopData}
                  summaryData={summaryData}
                  coalPrice={coalPrice}
                />
                <Divider className="h-1 bg-neutral-500 rounded-xl" />
                <TableParetoHeatloss
                  potentialTimeframe={potentialTimeframe}
                  setDataId={setDataId}
                  dataId={dataId}
                  setSelectedLabel={setSelectedLabel}
                  selectedLabel={selectedLabel}
                  params={params.data_id}
                  setPotentialTimeframe={setPotentialTimeframe}
                  rootCauseCount={dataRootCauseCount}
                  tableData={paretoBottomData}
                  summaryData={summaryData}
                  mutate={onMutate}
                  isValidating={isValidating}
                  isLoadingRootCauseCount={isLoadingRootCauseCount}
                  isValidatingRootCauseCount={isValidatingRootCauseCount}
                  data_id={params.data_id}
                  setIsMutating={setIsMutating}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </EfficiencyContentLayout>
  );
}
