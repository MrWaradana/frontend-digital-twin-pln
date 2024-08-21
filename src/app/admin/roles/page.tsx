import TableAdmin from "@/components/admin/TableAdmin";
import { ContentLayout } from "@/containers/ContentLayout";
import { columns, users, statusOptions } from "@/lib/role-data";

export default function Page() {
  return (
    <ContentLayout title="Roles">
      <section className="relative">
        <TableAdmin tableData={{ columns, users, statusOptions }} />
      </section>
    </ContentLayout>
  );
}
