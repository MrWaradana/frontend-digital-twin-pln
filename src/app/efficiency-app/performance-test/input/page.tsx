"use client";

import { useState } from "react";
import VariableBestCaseForm from "@/components/efficiency-app/VariableBestCaseForm";
import VariableInputForm from "@/components/efficiency-app/performance-test/VariableInputForm";
import MasterDataRadioGroup from "@/components/efficiency-app/MasterDataRadioGroup";
import SelectMasterData from "@/components/efficiency-app/SelectMasterData";
import { Link, Button, CircularProgress } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { formatFilename } from "@/lib/format-text";
import toast, { Toaster } from "react-hot-toast";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { useExcelStore } from "@/store/excels";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetVariables } from "@/lib/APIs/useGetVariables";

export default function Page() {
  const { data: session, status } = useSession();
  const excels = useExcelStore((state) => state.excels);
  const [selectedMasterData, setSelectedMasterData] =
    useState<string>("current");

  const {
    data: variableData,
    isLoading,
    error,
  } = useGetVariables(session?.user.access_token, excels[0].id, "in");

  const variable = variableData ?? [];

  if (isLoading)
    return (
      <div className="flex justify-center mt-12">
        <CircularProgress color="primary" />
      </div>
    );
  if (error) return <div>{error.message}</div>;

  return (
    <EfficiencyContentLayout title="Input Form">
      <div className="flex flex-col items-center justify-center my-12 relative">
        {/* <MasterDataRadioGroup /> */}
        <Button
          as={Link}
          href={`/efficiency-app`}
          color="primary"
          size="sm"
          className="lg:absolute top-0 lg:left-72 mb-4"
        >
          <ChevronLeftIcon size={12} />
          Back to all
        </Button>
        <h1 className="text-3xl font-bold mb-8">Performance Test Input</h1>
        <h2 className="mb-4">
          Opened <span>Excel {formatFilename(excels[0].excel_filename)}</span>
        </h2>
        <SelectMasterData onMasterDataChange={setSelectedMasterData} />
        <div className="flex flex-row gap-4 lg:gap-12 items-center justify-center my-4 min-w-3xl mx-auto">
          <div className="hidden lg:block ">
            {/* {JSON.stringify(variableData.data)} */}
            {/* <VariableBestCaseForm variables={variableData} /> */}
          </div>
          <VariableInputForm
            excel={excels}
            variables={variable}
            selectedMasterData={selectedMasterData}
          />
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
