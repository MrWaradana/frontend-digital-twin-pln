import { formatFilename } from "@/lib/format-text";
import { Button, Link } from "@nextui-org/react";
import { PlusIcon } from "@radix-ui/react-icons";
import TableAdmin from "@/components/admin/TableAdmin";
import { columns, users, statusOptions } from "@/lib/data";
import { ChevronLeftIcon } from "lucide-react";

export default function Page({ params }: { params: { excels_name: string } }) {
  return (
    <div className="flex flex-col gap-8 justify-center items-center w-full mt-24">
      <div className="w-full ml-96">
        <Button
          as={Link}
          color="primary"
          startContent={<ChevronLeftIcon size={18} />}
          href={`/efficiency-app`}
          size="sm"
        >
          Back to select excel
        </Button>
      </div>
      <h1>{formatFilename(params.excels_name)}</h1>
      <div>
        <TableAdmin
          tableData={{ columns, users, statusOptions }}
          addNewUrl={`/efficiency-app/${params.excels_name}/input`}
        />
      </div>
    </div>
  );
}
