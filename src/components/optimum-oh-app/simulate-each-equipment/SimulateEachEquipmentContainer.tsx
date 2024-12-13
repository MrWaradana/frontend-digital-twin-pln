"use client";

import { Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { useGetAvailableEquipment } from "@/lib/APIs/useGetAvailableEquipment";
import TableNewAsset from "./TableNewAsset";
import OptimumOverhaulChart from "./OptimumOverhaulChart";
import { useGetTimeConstraintCalculation } from "@/lib/APIs/useGetTimeConstraintCalculation";
import CalculateOH from "../CalculateOH";
import { useGetScopeOH } from "@/lib/APIs/useGetScopeOH";
import { useSearchParams } from "next/navigation";
import TableSelectAsset from "./TableSelectAsset";
import { usePostSelectEquipment } from "@/lib/APIs/mutation/usePostSelectEquipment";

export default function SimulateEachEquipmentContainer() {
  const query = useSearchParams();
  const { data: session } = useSession();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [isSelected, setIsSelected] = useState(false);
  let calculation_id = query.get("calculation_id") || "";
  let scope = query.get("scope") || undefined;

  const {
    trigger,
    isLoading: isLoadingPost,
    data: dataChart,
  } = usePostSelectEquipment(session?.user.access_token, calculation_id);

  const chartData = useMemo(() => {
    let results = dataChart?.data?.results;
    if (!dataChart || !results) {
      return [];
    }

    return dataChart?.data?.results;
  }, [dataChart]);

  const { data, error, isLoading, isValidating, mutate } = useGetScopeOH(
    session?.user.access_token,
    scope,
    page,
    rowsPerPage
  );

  const totalPages = data?.totalPages ?? 0;
  const totalItems = data?.total ?? 0;
  const itemsPerPage = data?.itemsPerPage ?? 5;
  const availableEquipmentData = data?.items ?? [];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="w-full  h-[78dvh] bg-white rounded-2xl shadow-xl overflow-y-auto p-6">
        <div className={`w-full flex justify-between mb-2`}>
          <h2 className={`text-xl font-semibold`}>List Equipment in Scope A</h2>
          <CalculateOH title={`Menu`} size={`sm`} />
        </div>
        <TableSelectAsset
          tableData={availableEquipmentData}
          isLoading={isLoading}
          isValidating={isValidating}
          mutate={mutate}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total_items={totalItems}
          pages={totalPages}
          calculationId={calculation_id}
          trigger={trigger}
        />
        {/* <TableNewAsset
          dataTable={availableEquipmentData}
          isLoading={isLoading}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          pagination={pagination}
          setPagination={setPagination}
          mutate={mutate}
          filterScope={"A"}
        /> */}
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
