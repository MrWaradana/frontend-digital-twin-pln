import TableAdmin from "@/components/admin/TableAdmin";
import { ContentLayout } from "@/containers/ContentLayout";
import { columns, users, statusOptions } from "@/lib/data";

export default function Page() {
  return (
    <ContentLayout title="Users">
      <section className="relative">
        <TableAdmin tableData={{ columns, users, statusOptions }} />
      </section>
    </ContentLayout>
  );
}
