"use client";

import { ContentLayout } from "@/containers/ContentLayout";
import VariableInputForm from "@/components/admin/VariableInputForm";
import { useSession } from "next-auth/react";
import { useGetVariables } from "@/lib/APIs/useGetVariables";
import { useExcelStore } from "@/store/excels";
import { Spinner } from "@nextui-org/react";

export default function Input() {
  const { data: session, status } = useSession();

  const excels = useExcelStore((state) => state.excels);

  const {
    data: variableData,
    isLoading,
    error,
  } = useGetVariables(session?.user.access_token, excels[0].id, "out");

  const variable = variableData ?? [];
  return (
    <ContentLayout title={`Input Commision Data`}>
      <section className="w-full flex justify-center ">
        {isLoading ? (
          <Spinner label="Loading..." />
        ) : (
          <VariableInputForm
            excel={excels}
            variables={variable}
            selectedMasterData={`commision`}
          />
        )}
      </section>
    </ContentLayout>
  );
}
