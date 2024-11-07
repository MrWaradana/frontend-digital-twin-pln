"use client";

import { useMemo, useState } from "react";
import VariableBestCaseForm from "@/components/efficiency-app/VariableBestCaseForm";
import VariableInputForm from "@/components/efficiency-app/VariableInputForm";
import MasterDataRadioGroup from "@/components/efficiency-app/MasterDataRadioGroup";
import SelectMasterData from "@/components/efficiency-app/SelectMasterData";
import { Link, Button, CircularProgress, Input } from "@nextui-org/react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useGetMasterData } from "@/lib/APIs/useGetMasterData";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const excels = useExcelStore((state) => state.excels);
  const [selectedMasterData, setSelectedMasterData] =
    useState<string>("current");

  // const {
  //   data: thermoStatusData,
  //   isLoading: isLoadingThermoStatus,
  //   isValidating: isValidatingThermoStatus,
  //   error: errorThermoStatus,
  //   mutate: mutateThermoStatus,
  // } = useGetThermoStatus();

  const parameter = params.get("parameter") ?? "";
  const start_date = params.get("start_date") ?? "";
  const end_date = params.get("end_date") ?? "";

  const {
    data: variableData,
    isLoading,
    error,
  } = useGetVariables(
    session?.user.access_token,
    excels[0].id,
    "in",
    parameter,
    start_date,
    end_date
  );

  const {
    data: masterData,
    isLoading: isLoadingMasterData,
    isValidating: isValidatingMasterData,
    mutate: mutateMasterData,
    error: errorMasterData,
  } = useGetMasterData(session?.user.access_token);

  const formatNumber = (num: number | string) => {
    // Convert the input number to a string to avoid rounding off decimals
    const parts = num.toString().split("."); // Use '.' to handle decimals correctly
    const integerPart = new Intl.NumberFormat("id-ID").format(Number(parts[0]));

    // Return the formatted number with a decimal part if present
    return parts.length > 1 ? `${integerPart},${parts[1]}` : integerPart;
  };

  const unformatNumber = (formattedValue: string) => {
    // Remove thousands separators (commas) and replace decimal commas with periods
    return formattedValue.replace(/\./g, "").replace(",", ".");
  };

  const variable = variableData ?? [];
  const coalPriceData = masterData?.find(
    (item: any) => item.name === "Coal Price"
  );

  const [coalPrice, setCoalPrice] = useState(`${coalPriceData?.nphr_value}`);

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

  useEffect(() => {
    if (coalPriceData?.nphr_value) {
      setCoalPrice(`${coalPriceData?.nphr_value}`);
    }
  }, [coalPriceData]);

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
        <h2 className="mb-2">
          Opened <span>Excel {formatFilename(excels[0].excel_filename)}</span>
        </h2>
        <h2 className={`mb-2 ${start_date && end_date ? "" : "hidden"}`}>
          Period {start_date} until {end_date} Data
        </h2>
        <SelectMasterData onMasterDataChange={setSelectedMasterData} />
        <Input
          type={`text`}
          label={`Coal Price`}
          value={formatNumber(coalPrice)}
          required
          startContent={`Rp.`}
          endContent={`per KG`}
          className={`max-w-xs mt-4`}
          onChange={(e) => {
            const unformattedValue = unformatNumber(e.target.value);
            setCoalPrice(unformattedValue);
          }}
        />
        <div className="flex flex-row gap-4 lg:gap-12 items-center justify-center my-4 min-w-3xl mx-auto">
          <div className="hidden lg:block ">
            {/* {JSON.stringify(variableData.data)} */}
            {/* <VariableBestCaseForm variables={variableData} /> */}
          </div>
          <VariableInputForm
            excel={excels}
            variables={variable}
            selectedMasterData={selectedMasterData}
            coalPrice={coalPrice}
          />
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
