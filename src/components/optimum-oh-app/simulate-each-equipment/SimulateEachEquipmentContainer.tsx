"use client";

import { Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useGetAvailableEquipment } from "@/lib/APIs/useGetAvailableEquipment";
import TableNewAsset from "./TableNewAsset";
import OptimumOverhaulChart from "./OptimumOverhaulChart";
import { useGetTimeConstraintCalculation } from "@/lib/APIs/useGetTimeConstraintCalculation";
import CalculateOH from "../CalculateOH";

export default function SimulateEachEquipmentContainer() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // Default page size
  });
  const [isSelected, setIsSelected] = useState(false);

  const {
    data: dataChart,
    isLoading: isLoadingChart,
    isValidating: isValidatingChart,
    mutate: mutateChart,
  } = useGetTimeConstraintCalculation(session?.user.access_token, undefined);

  const chartData = dataChart?.results ?? [];

  const { data, isLoading, isValidating, mutate } = useGetAvailableEquipment(
    session?.user.access_token,
    "A",
    pagination.pageIndex + 1, // Add 1 since API likely uses 1-based indexing
    pagination.pageSize
  );

  const totalPages = data?.totalPages ?? 0;
  const totalItems = data?.total ?? 0;
  const itemsPerPage = data?.itemsPerPage ?? 5;
  const availableEquipmentData = data?.items ?? [];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl overflow-y-auto p-2">
        <div className={`w-full flex justify-between mb-2`}>
          <h2 className={`text-xl font-semibold`}>List Equipment in Scope A</h2>
          <CalculateOH title={`Menu`} size={`sm`} />
        </div>
        <TableNewAsset
          dataTable={availableEquipmentData}
          isLoading={isLoading}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          setPagination={setPagination}
          mutate={mutate}
          filterScope={"A"}
        />
      </div>
      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl">
        {isLoading ? (
          <Spinner />
        ) : (
          <OptimumOverhaulChart chartData={chartData} />
        )}
      </div>
    </section>
  );
}
