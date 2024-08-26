import VariableOutputForm from "@/components/efficiency-app/VariableOutputForm";
import TableOutputs from "@/components/efficiency-app/TableOutputs";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { stringify } from "querystring";
import { formatFilename } from "../../../../lib/format-text";

export default async function Page({
  params,
}: {
  params: { excels_name: string };
}) {
  const variables = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/variables`,
    {
      next: { revalidate: 120 },
    }
  ).then((res) => res.json());

  const units = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units`, {
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
      {/* <VariableOutputForm variables={variables} units={units} /> */}
      <h2 className="mb-4">Output {formatFilename(params.excels_name)}</h2>
      <div>
        <TableOutputs tableData={variables.data} />
      </div>
    </section>
  );
}
