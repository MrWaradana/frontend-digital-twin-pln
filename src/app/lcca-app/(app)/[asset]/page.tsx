"use client";

import OverviewContainer from "@/components/containers/OverviewContainer";
import ChartLineBar from "@/components/lcca-app/ChartLineBar";
import HeaderCard from "@/components/lcca-app/HeaderCard";
import { formatUrlText } from "@/lib/format-text";
import { Input, Skeleton } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useGetDataEquipmentById } from "@/lib/APIs/lcca-app/useGetDataEquipmentById";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/formattedNumber";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page({ params }: { params: { asset: string } }) {
  const { data: session } = useSession();

  const { data, mutate, isLoading, isValidating } = useGetDataEquipmentById(
    session?.user.access_token,
    params.asset
  );

  const assetName = data?.equipment_master_record.name ?? "";
  const minEac = data?.min_eac_value ?? 0;
  const minSeq = data?.min_seq ?? 0;
  const equipmentData = data?.equipment_data ?? [];
  const chartData = data?.chart_data ?? [];

  const headerCardsData = [
    {
      title: "Minimum EAC",
      value: formatCurrency(minEac.toFixed(2)),
      unit: "Juta",
      variant: "green",
    },
    {
      title: "Economic Life",
      value: minSeq.toFixed(0),
      unit: "Tahun",
      variant: "green",
    },
    {
      title: "Acquisition Year",
      value: equipmentData.acquisition_year,
      variant: "gradient",
    },
    {
      title: "Capital Cost (Rp.)",
      value: formatCurrency(equipmentData.acquisition_cost),
      unit: "Juta",
      variant: "gradient",
    },
    {
      title: "Capital Cost Record Time (Year)",
      value: equipmentData.capital_cost_record_time,
      variant: "gradient",
    },
    {
      title: "Design Life",
      value: equipmentData.design_life,
      unit: "Tahun",
      variant: "gradient",
    },
    {
      title: "Forecasting Target",
      value: equipmentData.forecasting_target_year,
      variant: "gradient",
    },
  ];

  const HeaderCardComponent = ({ data }) => {
    const { title, value, unit, variant } = data;

    const getCardStyles = () => {
      if (variant === "green") {
        return "bg-[#28C840] text-white min-h-[18dvh]";
      }
      return "min-h-[18dvh]";
    };

    const getContentStyles = () => {
      if (variant === "gradient") {
        return "pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col";
      }
      return "pl-3";
    };

    return (
      <HeaderCard className={getCardStyles()}>
        <p className="text-sm font-semibold">{title}</p>
        {variant === "gradient" ? (
          <div className={getContentStyles()}>
            <div className="bg-white pl-3">
              <h2 className="text-5xl font-bold">{value}</h2>
              {unit && (
                <small className="text-xs text-neutral-400">{unit}</small>
              )}
            </div>
          </div>
        ) : (
          <div className={getContentStyles()}>
            <h2 className="text-5xl font-bold">{value}</h2>
            {unit && <small className="text-xs text-white">{unit}</small>}
          </div>
        )}
      </HeaderCard>
    );
  };

  return (
    <OverviewContainer
      containerClassName="main-container"
      navbarTitle="Life Cycle Cost Analytics"
    >
      <div className="flex justify-between">
        <div className="bg-white w-full px-8 py-7 shadow-lg rounded-lg">
          <div className="flex flex-row justify-between">
            <div className={`flex items-center justify-center gap-3`}>
              <Link href={`/lcca-app`}>
                <ChevronLeft />
              </Link>
              <h1 className="font-bold text-2xl">{formatUrlText(assetName)}</h1>
            </div>
            <Input
              isClearable
              className="w-full sm:max-w-[44%] bg-white rounded-full hidden"
              classNames={{
                mainWrapper: ["!rounded-full"],
              }}
              placeholder="Search by name..."
              startContent={<MagnifyingGlassIcon />}
              // value={filterValue}
              // onClear={() => onClear()}
              // onValueChange={(value) => {
              //   onSearchChange(value);
              //   debouncedSetFilterSearch(value);
              // }}
            />
          </div>
          <div className={`flex flex-row gap-3 my-3`}>
            {headerCardsData.map((cardData, index) => (
              <Skeleton
                key={index}
                isLoaded={!isLoading}
                className="rounded-2xl w-full"
              >
                <HeaderCardComponent data={cardData} />
              </Skeleton>
            ))}
          </div>
          <ChartLineBar
            chartData={chartData}
            minSeq={minSeq}
            assetName={assetName}
          />
        </div>
      </div>
    </OverviewContainer>
  );
}
