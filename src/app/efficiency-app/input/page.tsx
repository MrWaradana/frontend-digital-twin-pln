"use client";

import { useState } from "react";
import VariableBestCaseForm from "@/components/efficiency-app/VariableBestCaseForm";
import VariableInputForm from "@/components/efficiency-app/VariableInputForm";
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
import { useGetThermoStatus } from "@/lib/APIs/useGetThermoStatus";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const excels = useExcelStore((state) => state.excels);
  const [selectedMasterData, setSelectedMasterData] =
    useState<string>("current");

  const {
    data: thermoStatusData,
    isLoading: isLoadingThermoStatus,
    isValidating: isValidatingThermoStatus,
    error: errorThermoStatus,
    mutate: mutateThermoStatus,
  } = useGetThermoStatus();

  const {
    data: variableData,
    isLoading,
    error,
  } = useGetVariables(session?.user.access_token, excels[0].id, "in");

  const variable = variableData ?? [];

  // if (thermoStatusData?.thermo_status ) {
  //   setTimeout(() => router.push("/efficiency-app"), 2000);
  //   return (
  //     <EfficiencyContentLayout title="Input Form">
  //       <div className="flex justify-center mt-12">
  //         <CircularProgress
  //           color="primary"
  //           label="Thermoflow is processing data, redirecting to all efficiency data..."
  //         />
  //       </div>
  //     </EfficiencyContentLayout>
  //   );
  // }

  if (isLoading)
    return (
      <EfficiencyContentLayout title="Input Form">
        <div className="flex justify-center mt-12">
          <CircularProgress color="primary" />
        </div>
      </EfficiencyContentLayout>
    );
  if (error)
    return (
      <EfficiencyContentLayout title="Input Form">
        <div className="m-24">Error! : {error.message}</div>{" "}
      </EfficiencyContentLayout>
    );

  return (
    <EfficiencyContentLayout title="Input Form">
      <div className="flex flex-col items-center justify-center my-12 relative">
        {/* <MasterDataRadioGroup /> */}
        <Button
          as={Link}
          href={`/efficiency-app`}
          color="primary"
          size="sm"
          className=" mb-4"
        >
          <ChevronLeftIcon size={12} />
          Back to all
        </Button>
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
