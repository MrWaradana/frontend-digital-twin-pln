import { formatFilename } from "../../../../lib/format-text";
import TableHeatRate from "../../../../components/efficiency-app/TableHeatRate";
import { columns, users, statusOptions } from "@/lib/heat-rate-data";

export default function Page({ params }: { params: { excels_name: string } }) {
  return (
    <div className="flex flex-col items-center justify-center mt-12 mx-24 gap-8">
      <p>{formatFilename(params.excels_name)}</p>
      <div>
        <TableHeatRate
          tableData={{ columns, users, statusOptions }}
          addNewUrl="false"
        />
      </div>
    </div>
  );
}
