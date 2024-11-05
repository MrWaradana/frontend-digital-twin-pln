"use client";
import { ContentLayout } from "@/containers/ContentLayout";
import VariableInputForm from "@/components/admin/MasterDataTable";
import { useSession } from "next-auth/react";
import { useGetData } from "@/lib/APIs/useGetData";
import { useExcelStore } from "@/store/excels";
import { Spinner } from "@nextui-org/react";
import TableEfficiency from "@/components/admin/TableEfficiency";
import MasterDataTable from "@/components/admin/MasterDataTable";

export default function Masterdata() {

  return (
    <ContentLayout title={`Master Data`}>
      <section>
        <MasterDataTable/>
      </section>
    </ContentLayout>
  );
}
