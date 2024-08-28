import TablePareto from "@/components/efficiency-app/TablePareto";
import TableParetoEdit from "@/components/efficiency-app/TableParetoEdit";
import { Button, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import MultipleLineChart from "../../../../components/MultipleLineChart";
import LineBarAreaComposedChart from "../../../../components/LineBarAreaComposedChart";
import { columns, users, statusOptions } from "@/lib/pareto-data";

export default function Page({ params }: { params: { excels_name: string } }) {
  return (
    <div
      className="flex flex-col w-full items-center justify-center mt-24"
      id="root"
    >
      Pareto Page
      <Button
        as={Link}
        color="primary"
        startContent={<ChevronLeftIcon size={18} />}
        href={`/efficiency-app`}
        size="sm"
      >
        Back to all data
      </Button>
      <MultipleLineChart />
      <LineBarAreaComposedChart />
      <div className="max-w-full px-8">
        {/* <TablePareto tableData={{ columns, users, statusOptions }} /> */}
        <TableParetoEdit />
      </div>
    </div>
  );
}
