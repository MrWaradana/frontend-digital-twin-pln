"use client";
import { ContentLayout } from "@/containers/ContentLayout";
import VariableInputForm from "@/components/admin/VariableInputForm";
import { useSession } from "next-auth/react";
import { useGetData } from "@/lib/APIs/useGetData";
import { useExcelStore } from "@/store/excels";
import { Spinner } from "@nextui-org/react";
import TableEfficiency from "@/components/admin/TableEfficiency";

export default function Commision() {
  const { data: session, status } = useSession();

  const excels = useExcelStore((state) => state.excels);

  const {
    data: efficiencyData,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useGetData(session?.user.access_token);

  const efficiency = efficiencyData?.transactions ?? [];
  const commisionData = efficiency.filter(
    (item: any) => item.jenis_parameter.toLowerCase() === "commision"
  );

  return (
    <ContentLayout title={`Commision Data`}>
      <section className="w-full flex justify-center ">
        {isLoading ? (
          <Spinner label="Loading..." />
        ) : (
          <TableEfficiency
            tableData={commisionData}
            addNewUrl={`/admin/commision/input`}
            mutate={mutate}
            efficiencyLoading={isLoading}
            isValidating={isValidating}
          />
        )}
      </section>
    </ContentLayout>
  );
}
