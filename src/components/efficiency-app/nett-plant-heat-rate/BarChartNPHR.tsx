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
} from "@nextui-org/react";

import MultipleLineChart from "./MultipleLineChart";

export const description = "A stacked bar chart with a legend";

const chartData = [
  { month: "Niaga", nphr: 500, gap: 0 },
  { month: "Current", nphr: 350, gap: 0 },
  { month: "Commission", nphr: 100, gap: 250 },
];

const chartConfig = {
  nphr: {
    label: "NPHR",
    color: "hsl(var(--chart-1))",
  },
  gap: {
    label: "GAP",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BarChartNPHR() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
                
              </ModalHeader>
              <ModalBody className="flex justify-center items-center">
                <div className="min-h-full min-w-[968px] overflow-hidden">
                  <MultipleLineChart />
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
          <CardTitle>Nett Plant Heat Rate</CardTitle>
          <CardDescription>{new Date().getFullYear()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 12)}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
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
                fill="#e2cf9d"
                radius={[4, 4, 0, 0]}
                className="hover:cursor-pointer"
                onClick={onOpen}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Nett Plant Heat Rate Gap reached 250
          </div>
          <div className="leading-none text-muted-foreground">
            Showing latest Nett Plant Heat Rate Data
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
