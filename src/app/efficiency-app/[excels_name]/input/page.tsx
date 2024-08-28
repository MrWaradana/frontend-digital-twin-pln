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
import { EFFICIENCY_API_URL } from "../../../../lib/api-url";
import { useExcelStore } from "../../../../store/excels";
import { useEffect } from "react";

export default function Page({ params }: { params: { excels_name: string } }) {
  const excels = useExcelStore((state) => state.excels);
  const [variableData, setVariableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true);
      setError(null);

      // Filter excels to find the one with the matching filename
      const selectedExcel = excels.find(
        (excel) =>
          excel.excel_filename.toLowerCase() ===
          formatFilename(params.excels_name).toLocaleLowerCase()
      );

      if (selectedExcel) {
        try {
          const response = await fetch(
            `${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}`,
            {
              next: { revalidate: 7200 },
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          setVariableData(data.data);
        } catch (error) {
          setError(`Failed to fetch variables: ${error}`);
        }
      } else {
        setError(`No excel found with the name: ${params.excels_name}`);
      }

      setLoading(false);
    };

    fetchVariables();
  }, [params.excels_name, excels]);

  if (loading)
    return (
      <div className="flex justify-center mt-12">
        <CircularProgress color="primary" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
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
        Opened <span>Excel {formatFilename(params.excels_name)}</span>
      </h2>
      <SelectMasterData />
      <div className="flex flex-row gap-4 lg:gap-12 items-center justify-center my-4 min-w-3xl mx-auto">
        <div className="hidden lg:block ">
          {/* {JSON.stringify(variableData.data)} */}
          {/* <VariableBestCaseForm variables={variableData} /> */}
        </div>
        <VariableInputForm variables={variableData} />
      </div>
    </div>
  );
}
