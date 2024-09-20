import TableOutputs from "@/components/efficiency-app/TableOutputs";
import TableInputs from "@/components/efficiency-app/TableInputs";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { stringify } from "querystring";
import { formatFilename } from "@/lib/format-text";
import { Toaster } from "react-hot-toast";

export default async function Page({
  params,
}: {
  params: { data_id: string };
}) {
  const data_id = params.data_id;

  return (
    <section className="w-full flex flex-col items-center justify-center mt-12">
      <Toaster />
      <div className="flex justify-around w-full">
        <Button
          as={Link}
          href={`/efficiency-app`}
          className="mb-4"
          color="primary"
          size="sm"
          startContent={<ChevronLeftIcon size={16} />}
        >
          Back to all
        </Button>
        {/* <Button
          as={Link}
          href={`/efficiency-app/${params.data_id}/pareto`}
          className="mb-4"
          color="warning"
          size="sm"
          endContent={<ChevronRightIcon size={16} />}
        >
          To Pareto Heat Loss
        </Button> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <h2 className="mb-4">Input {formatFilename(params.data_id)}</h2>
          <div>
            <TableInputs data_id={data_id} />
          </div>
        </div>
        <div>
          <h2 className="mb-4">Output {formatFilename(params.data_id)}</h2>
          <div>
            <TableOutputs data_id={data_id} />
          </div>
        </div>
      </div>
    </section>
  );
}
