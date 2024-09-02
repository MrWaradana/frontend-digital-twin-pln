import VariableOutputForm from "@/components/efficiency-app/VariableOutputForm";
import TableOutputs from "@/components/efficiency-app/TableOutputs";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { stringify } from "querystring";
import { formatFilename } from "../../../../lib/format-text";
import { Toaster } from "react-hot-toast";

export default async function Page({
  params,
}: {
  params: { excels_name: string };
}) {
  return (
    <section className="w-full flex flex-col items-center justify-center mt-12">
      <Toaster />
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
        <TableOutputs />
      </div>
    </section>
  );
}
