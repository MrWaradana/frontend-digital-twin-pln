"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";

import MultipleLineChart from "./MultipleLineChart";
import { useGetDataNPHR } from "@/lib/APIs/useGetDataNPHR";
import { useSession } from "next-auth/react";
import { useMemo, useRef } from "react";

import React from "react";
import toast from "react-hot-toast";

const chartConfig = {
  nphr: {
    label: "Net Plant Heat Rate",
    color: "hsl(var(--chart-1))",
  },
  gap: {
    label: "Heat Loss Gap",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BarChartNPHR({
  data,
  data_id,
  niagaLoading,
  isLoading,
  isValidating,
  error,
  niagaNPHR,
}: any) {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log(selectedEfficiencyData, "selected");
  // const { data, mutate, isLoading, isValidating, error } = useGetDataNPHR(
  //   session?.data?.user.access_token,
  //   selectedEfficiencyData ? selectedEfficiencyData : data_id
  // );

  const summaryData = data ?? [];
  const chartParetoData = data?.chart_result ?? [];
  const nphrData: any = data?.nphr_result ?? [];
  const paretoData: any = data?.pareto_result ?? [];
  const chartDataRef = useRef<any | null>(null);
  const chartParetoDataWithCumFeq = useMemo(() => {
    const mapped_data = chartParetoData
      .map((item: any, index: number) => {
        const cum_frequency = chartParetoData
          .slice(0, index + 1) // Get all previous items up to the current index
          .reduce(
            (acc: any, current: { total_persen_losses: any }) =>
              acc + current.total_persen_losses,
            0
          ); // Accumulate total_persen_losses
        return {
          ...item, // Spread the original item
          cum_frequency, // Add the accumulated frequency
        };
      })
      // .filter((item: any) => item.cum_frequency <= 300 && );
      .filter((item: any) => item.category);

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
  }, [chartParetoData]);

  const chartData = [
    { month: "Niaga", nphr: niagaNPHR, gap: 0 },
    { month: "Current", nphr: nphrData.current, gap: 0 },
    {
      month: "Commission",
      nphr: nphrData.target,
      gap: nphrData.current - nphrData.target,
    },
  ];

  if (isLoading || isValidating || niagaLoading) {
    return (
      <div className="w-full mt-12 flex justify-center">
        <Spinner label="Calculating..." />
      </div>
    );
  }

  // if (error) {
  //   //@ts-ignore
  //   setSelectedEfficiencyData("new");
  // }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent className={`min-h-[100dvh]`}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="flex justify-start items-start min-h-[70dvh]">
                <div className="min-h-full min-w-[968px] overflow-hidden">
                  <MultipleLineChart
                    data={chartParetoDataWithCumFeq}
                    summaryData={summaryData}
                    paretoData={paretoData}
                  />
                  {/* <TableParetoHeatloss /> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Card>
        <CardHeader>
          <CardTitle>{`${data?.name}`} Data</CardTitle>
          <CardDescription>{new Date().getFullYear()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className={`max-h-[408px] w-full z-0`}
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 12)}
              />
              <YAxis
                label={{
                  value: "Nett Plant Heat Rate",
                  angle: -90,
                  position: "outsideLeft",
                  dx: -20,
                }}
              />
              <ChartTooltip content={<ChartTooltipContent className="z-0" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="nphr"
                stackId="a"
                fill="#8daed9"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="gap"
                stackId="a"
                fill="#FF6961"
                radius={[4, 4, 0, 0]}
                className="hover:cursor-pointer"
                onClick={onOpen}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-row items-start justify-between gap-2 text-sm">
          <div>
            <div className="flex gap-2 font-medium leading-none">
              Nett Plant Heat Rate Gap reached{" "}
              <span className="italic color-[#FF6961]">
                {chartData[2].gap.toFixed(0)}
              </span>
            </div>
            <div className="leading-none text-muted-foreground">
              Showing {`${data?.name}`} Nett Plant Heat Rate Data
            </div>
          </div>
          <Button onClick={onOpen} className="bg-[#FF6961] text-white">
            Open Pareto Heat Loss
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
