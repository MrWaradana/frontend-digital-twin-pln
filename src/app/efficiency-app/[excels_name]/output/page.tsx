import VariableOutputForm from "@/components/efficiency-app/VariableOutputForm";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { excels_name: string };
}) {
  const variables = await fetch("http://localhost:3001/api/variables", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  const units = await fetch("http://localhost:3001/api/units", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  return (
    <section className="w-full flex flex-col items-center justify-center mt-12">
      <Button
        as={Link}
        href={`/efficiency-app/${params.excels_name}`}
        className="mb-4"
        color="primary"
        size="sm"
        startContent={<ChevronLeftIcon size={16} />}
      >
        Back to all
      </Button>
      <VariableOutputForm variables={variables} units={units} />
    </section>
  );
}
