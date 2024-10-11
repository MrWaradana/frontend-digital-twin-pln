"use client";

import { Router, TrendingUp } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Legend,
  ComposedChart,
  BarChart,
  Tooltip,
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
  SliderValue,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import TableParetoHeatlossNPHR from "./TableParetoHeatlossNPHR";

const chartConfig = {
  category: {
    label: "category",
    color: "hsl(var(--chart-1))",
  },
  cum_frequency: {
    label: "cum_frequency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MultipleLineChart({
  data,
  summaryData,
  thresholdNumber,
  paretoData,
}: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState<SliderValue>(thresholdNumber);
  const [internalSliderValue, setInternalSliderValue] =
    useState<SliderValue>(thresholdNumber); // Holds the immediate value

  const handleBarClick = (data: any) => {
    // setSelectedBar(data.category);
    const dataParetoShow = paretoData.filter(
      (item) => item.category == data.category
    );
    setSelectedCategory(dataParetoShow[0]);
    onOpen();
  };

  // console.log(data, "data pareto chart heat loss");
  const renderValue = (key: string, value: unknown): ReactNode => {
    if (typeof value === "object" && value !== null) {
      return <pre>{JSON.stringify(value, null, 2)}</pre>; // For object rendering, stringify the object
    }
    return value as ReactNode; // Render other types (string, number, etc.) directly
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedCategory?.category == null
                  ? "Uncategorized"
                  : selectedCategory?.category}
              </ModalHeader>
              <ModalBody className="flex justify-center items-center">
                <div className="max-w-full">
                  <TableParetoHeatlossNPHR
                    tableData={selectedCategory.data}
                    summaryData={selectedCategory}
                  />
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
          <CardTitle>Pareto Heat Loss</CardTitle>
          <CardDescription>{new Date().getFullYear()}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1">
          <ChartContainer config={chartConfig} className="col-span-2">
            <ComposedChart
              accessibilityLayer
              data={data}
              margin={{
                top: 12,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  value ? value.slice(0, 4) : "Uncategorized"
                }
              />
              <YAxis domain={[0, 100]} />
              <Legend />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey={"total_persen_losses"}
                name={"Total Persen Loss"}
                fill="#ffcaaf"
                className="hover:cursor-pointer"
                barSize={20}
                onClick={(e) => handleBarClick(e)}
              />
              <Bar
                dataKey={"total_nilai_losses"}
                name={"Total Nilai Loss"}
                fill="#a7bed3"
                className="hover:cursor-pointer"
                barSize={20}
                onClick={(e) => handleBarClick(e)}
              />
              <ReferenceLine
                x="Miscellaneous auxiliary load"
                stroke="#00b0f0"
                label="VITAL FEW"
                strokeDasharray={5}
                strokeWidth={2}
                strokeDashoffset={1}
              />
              <ReferenceLine
                y={Number(internalSliderValue)}
                label="Cost Threshold"
                stroke="#00b0f0"
                strokeDasharray={5}
                strokeWidth={2}
                strokeDashoffset={1}
              />
              <Line
                name={"Total Persen Loss"}
                dataKey="total_persen_losses"
                type="monotone"
                stroke="var(--color-category)"
                strokeWidth={2}
                dot={true}
              />
              <Line
                name={`Cummulative Frequency`}
                dataKey="cum_frequency"
                type="monotone"
                stroke="var(--color-cum_frequency)"
                strokeWidth={2}
                dot={true}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
