import VariableBestCaseForm from "@/components/efficiency-app/VariableBestCaseForm";
import VariableInputForm from "@/components/efficiency-app/VariableInputForm";
import MasterDataRadioGroup from "@/components/efficiency-app/MasterDataRadioGroup";

export default async function Page() {
  const variables = await fetch("http://localhost:3001/api/variables", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  const units = await fetch("http://localhost:3001/api/units", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  const excels = await fetch("http://localhost:3001/api/excels", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  return (
    <div className="flex flex-row gap-4 lg:gap-12 items-start justify-center my-20">
      <MasterDataRadioGroup />
      <VariableBestCaseForm variables={variables} units={units} />
      <VariableInputForm variables={variables} units={units} />
    </div>
  );
}
