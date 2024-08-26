"use client";

import { formatFilename } from "@/lib/format-text";
import { Button, Link } from "@nextui-org/react";
import { PlusIcon } from "@radix-ui/react-icons";
import TableEfficiency from "@/components/efficiency-app/TableEfficiency";
import { columns, users, statusOptions } from "@/lib/efficiency-data";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useExcelStore } from "../../../store/excels";

export default function Page({ params }: { params: { excels_name: string } }) {
  const excels = useExcelStore((state) => state.excels);

  return (
    <div className="flex flex-col gap-8 justify-center items-center w-full mt-24">
      <div className="w-full px-96 flex justify-between mx-24">
        <Button
          as={Link}
          color="primary"
          startContent={<ChevronLeftIcon size={18} />}
          href={`/efficiency-app`}
          size="sm"
        >
          Back to select excel
        </Button>
        {/* <Button
          as={Link}
          color="primary"
          endContent={<ChevronRightIcon size={18} />}
          href={`/efficiency-app/${params.excels_name}/heat-rate`}
          size="sm"
        >
          Heat Rate
        </Button> */}
      </div>
      {/* {JSON.stringify(excels)} */}
      <h1>{formatFilename(params.excels_name)}</h1>
      <div>
        <TableEfficiency
          tableData={{ columns, users, statusOptions }}
          addNewUrl={`/efficiency-app/${params.excels_name}/input`}
          params={params.excels_name}
        />
      </div>
    </div>
  );
}
