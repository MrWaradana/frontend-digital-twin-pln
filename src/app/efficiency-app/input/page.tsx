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
import { EFFICIENCY_API_URL } from "../../../lib/api-url";
import { useExcelStore } from "../../../store/excels";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { EfficiencyContentLayout } from "../../../containers/EfficiencyContentLayout";
import { useGetVariables } from "@/lib/APIs/useGetVariables";

export default function Page({ params }: { params: { excels_name: string } }) {
  const { data: session, status } = useSession();
  const excels = useExcelStore((state) => state.excels);
  // const [variableData, setVariableData] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [selectedMasterData, setSelectedMasterData] = useState<string>("current");
  

  // useEffect(() => {
  //   if (status === "loading") {
  //     // Session is still loading
  //     console.log("Session is loading...");
  //   } else if (status === "authenticated") {
  //     console.log(session);
  //   } else {
  //     console.log("No session available");
  //   }
  // }, [status, session]);

  // useEffect(() => {
  //   const fetchVariables = async () => {
  //     setLoading(true);
  //     setError(null);

  //     // Filter excels to find the one with the matching filename
  //     const selectedExcel = excels.find(
  //       (excel) =>
  //         excel.excel_filename.toLowerCase() ===
  //         formatFilename(params.excels_name).toLocaleLowerCase()
  //     );
  //     // console.log(selectedExcel, "id excel");
  //     if (selectedExcel) {
  //       try {
  //         const response = await fetch(
  //           `${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${session?.user?.accessToken}`,
  //             },
  //           }
  //         );

  //         console.log(response, "data variable");
  //         if (!response.ok) {
  //           throw new Error(`Error: ${response.status} ${response.statusText}`);
  //         }

  //         const data = await response.json();
  //         setVariableData(data.data);
  //       } catch (error) {
  //         setError(`Failed to fetch variables: ${error}`);
  //       }
  //     } else {
  //       setError(`No excel found with the name: ${params.excels_name}`);
  //     }

  //     setLoading(false);
  //   };

  //   if (status === "loading") {
  //     // Session is still loading
  //     console.log("Session is loading...");
  //   } else if (status === "authenticated") {
  //     fetchVariables();
  //   } else {
  //     console.log("No session available");
  //   }
  // }, [excels, session, params.excels_name, status]);


  const {
    data: variableData,
    isLoading,
    error
  } = useGetVariables(session?.user.accessToken, excels[0].id, "in")

  const variable = variableData ?? []
  

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
        <h2 className="mb-4">
          Opened <span>Excel {formatFilename(excels[0].excel_filename)}</span>
        </h2>
        <SelectMasterData onMasterDataChange={setSelectedMasterData} />
        <div className="flex flex-row gap-4 lg:gap-12 items-center justify-center my-4 min-w-3xl mx-auto">
          <div className="hidden lg:block ">
            {/* {JSON.stringify(variableData.data)} */}
            {/* <VariableBestCaseForm variables={variableData} /> */}
          </div>
          <VariableInputForm excel={excels} variables={variable} selectedMasterData = {selectedMasterData} />
        </div>
      </div>
    </EfficiencyContentLayout>
  );
}
