import TableOutputs from "@/components/efficiency-app/TableOutputs";
import TableInputs from "@/components/efficiency-app/TableInputs";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { stringify } from "querystring";
import { formatFilename } from "@/lib/format-text";
import { Toaster } from "react-hot-toast";
import { EfficiencyContentLayout } from "../../../../containers/EfficiencyContentLayout";

export default async function Page({
  params,
}: {
  params: { data_id: string };
}) {
  const data_id = params.data_id;

  return (
    <EfficiencyContentLayout title={`Output Efficiency Data`}>
      <section className="w-full flex flex-col items-center justify-center">
        <Toaster />
        <div className="flex justify-around w-full"></div>
        <div className="grid grid-cols-1 p-1 w-full">
          {/* <div> */}
          {/* <h2 className="mb-4">Input {formatFilename(params.data_id)}</h2> */}
          {/* <div>
              <TableInputs data_id={data_id} />
            </div> */}
          {/* </div> */}
          {/* <h2 className="mb-4">Output {formatFilename(params.data_id)}</h2> */}
          <TableOutputs data_id={data_id} />
        </div>
      </section>
    </EfficiencyContentLayout>
  );
}
