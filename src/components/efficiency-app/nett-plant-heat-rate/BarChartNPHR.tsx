"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
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
import AsyncSelect from "react-select/async";

const chartConfig = {
  nphr: {
    label: "Net Plant Heat Rate",
    color: "#D4CA2F",
  },
  gap: {
    label: "Heat Loss Gap",
    color: "#42C023",
  },
} satisfies ChartConfig;

export default function BarChartNPHR({
  data,
  data_id,
  niagaLoading,
  isLoading,
  isValidating,
  error,
  isLoadingEfficiencyData,
  niagaNPHR,
  chartParetoDataWithCumFeq,
  summaryData,
  paretoData,
  nphrData,
  loadOptions,
  EfficiencyDataOptions,
  isLoadingNPHR,
  onOpenTarget,
  setDataId,
}: any) {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // console.log(selectedEfficiencyData, "selected");
  // const { data, mutate, isLoading, isValidating, error } = useGetDataNPHR(
  //   session?.data?.user.access_token,
  //   selectedEfficiencyData ? selectedEfficiencyData : data_id
  // );
  const formattedNumber = (value: any) =>
    new Intl.NumberFormat("id-ID").format(value);

  const chartData = [
    { month: "Target", nphr: niagaNPHR, gap: 0 },
    {
      month: "Current",
      nphr: Number(nphrData.current).toFixed(2),
      gap: 0,
    },
    {
      month: "Commission",
      nphr: nphrData.target,
      gap: nphrData.current - nphrData.target,
    },
  ];

  // if (isLoading) {
  //   return (
  //     <div className="w-full mt-12 flex justify-center">
  //       <Spinner label="Calculating..." />
  //     </div>
  //   );
  // }

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

      <Card className="h-full">
        <CardHeader>
          <CardTitle>{`${data ? `${data?.name} Data` : ""}`} </CardTitle>
          <CardDescription>{new Date().getFullYear()}</CardDescription>
          <div>
            <div
              className={`flex gap-12 items-center justify-between z-50 mb-2`}
            >
              <div className="flex flex-col w-1/4">
                {isLoadingEfficiencyData ? (
                  "Loading..."
                ) : (
                  <AsyncSelect
                    className="z-50 min-w-64"
                    classNamePrefix="select"
                    isClearable={true}
                    isSearchable={true}
                    loadOptions={loadOptions}
                    placeholder={`Select Data...`}
                    defaultOptions={EfficiencyDataOptions} // Optional: Show default options initially
                    defaultValue={{ value: data?.id, label: data?.name }}
                    value={{ value: data?.id, label: data?.name }}
                    cacheOptions // Caches the loaded options
                    isLoading={isLoadingEfficiencyData}
                    onChange={(e: any) => {
                      setDataId(e?.value ?? "new");
                    }}
                    name="efficiencyData"
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: 10,
                        width: 175,
                        height: 33,
                        backgroundColor: "#f3f4f6",
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: "auto",
                        minWidth: "100%", // Ensures the menu is at least as wide as the control
                        // You can set a specific width like this:
                        // width: 250, // This will make the menu 250px wide
                      }),
                    }}
                  />
                )}
                <hr />
              </div>
              <Button
                isLoading={isLoadingNPHR}
                size="sm"
                onPress={onOpenTarget}
                className={`bg-[#1C9EB6] text-white py-3 ${
                  session?.data?.user.user.role === "Management" ? "hidden" : ""
                }`}
              >
                Input Target
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || niagaLoading ? (
            <div className="w-full h-64 mt-12 flex justify-center">
              <Spinner label="Calculating..." />
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className={`h-full w-full z-0`}
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                {/* Define gradients */}
                <defs>
                  <linearGradient id="nphrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE664" />
                    <stop offset="100%" stopColor="#D4CA2F" />
                  </linearGradient>
                  <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#87E878" />
                    <stop offset="100%" stopColor="#42C023" />
                  </linearGradient>
                </defs>
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
                <ChartTooltip
                  content={<ChartTooltipContent className="z-0" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="nphr"
                  stackId="a"
                  fill="url(#nphrGradient)"
                  radius={[14, 14, 0, 0]}
                >
                  <LabelList
                    dataKey={`nphr`}
                    position="center"
                    formatter={(value) =>
                      formattedNumber(Number(value).toFixed(2))
                    }
                    className="fill-white text-2xl"
                  />{" "}
                </Bar>
                <Bar
                  dataKey="gap"
                  stackId="a"
                  fill="url(#gapGradient)"
                  radius={[14, 14, 0, 0]}
                  className="translate-y-3 transform pointer"
                  // onClick={onOpen}
                >
                  <LabelList
                    dataKey={`gap`}
                    position="center"
                    formatter={(value) =>
                      value > 0
                        ? `
              ${formattedNumber(Number(value).toFixed(2))}`
                        : ``
                    }
                    className="fill-white text-xs translate-y-3"
                  />{" "}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
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
          {/* <Button onClick={onOpen} className="bg-[#42C023] text-white">
            Open Pareto Heat Loss
          </Button> */}
        </CardFooter>
      </Card>
    </>
  );
}
