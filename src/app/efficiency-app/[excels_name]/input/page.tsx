import VariableBestCaseForm from "@/components/efficiency-app/VariableBestCaseForm";
import VariableInputForm from "@/components/efficiency-app/VariableInputForm";
import MasterDataRadioGroup from "@/components/efficiency-app/MasterDataRadioGroup";
import SelectMasterData from "@/components/efficiency-app/SelectMasterData";
import { Link, Button } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { formatFilename } from "@/lib/format-text";

export default async function Page({
  params,
}: {
  params: { excels_name: string };
}) {
  const variables = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variables`, {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  const units = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units`, {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  const excels = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/excels`, {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  return (
    <div className="flex flex-col items-center justify-center my-12 relative">
      {/* <MasterDataRadioGroup /> */}
      <Button
        as={Link}
        href={`/efficiency-app/${params.excels_name}`}
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
      <div className="flex flex-row gap-4 lg:gap-12 items-start justify-center my-4">
        <div className="hidden lg:block ">
          <VariableBestCaseForm variables={variables} units={units} />
        </div>
        <VariableInputForm variables={variables} units={units} />
      </div>
    </div>
  );
}
