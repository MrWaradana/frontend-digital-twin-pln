import { ContentLayout } from "@/containers/ContentLayout";
import RootCauseTable from "@/components/admin/RootCauseTable";

export default function RootCause() {
  return (
    <ContentLayout title={`Root Cause Data`}>
      <section>
        <RootCauseTable />
      </section>
    </ContentLayout>
  );
}
