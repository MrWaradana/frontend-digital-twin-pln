"use client";

import TablePerformanceTest from "@/components/efficiency-app/nett-plant-heat-rate/TablePerformanceTest";
import { EfficiencyContentLayout } from "@/containers/EfficiencyContentLayout";
import { useGetData } from "../../../lib/APIs/useGetData";
import { useSession } from "next-auth/react";

const transactions = [
  {
    created_at: "2024-09-23T10:56:28.731687",
    created_by: "66428025-c42c-4d2f-a092-9d025868266d",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "f8417628-ab52-4584-88ae-e475e28a4fdb",
    jenis_parameter: "current",
    name: "Data",
    periode: "2024-09-23 | 1",
    beban: 50,
    flag: false,
    persen_threshold: 77,
    sequence: 1,
    updated_at: "2024-09-23T13:04:29.782216",
    updated_by: null,
  },
  {
    created_at: "2024-09-19T14:05:32.313225",
    created_by: "66428025-c42c-4d2f-a092-9d025868266d",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "b3a39990-7289-4ddc-9bea-69556e42f0b4",
    jenis_parameter: "current",
    name: "Data Hari Kamis",
    periode: "2024-09-19 | 1",
    beban: 60,
    flag: true,
    persen_threshold: 85,
    sequence: 1,
    updated_at: "2024-09-23T09:58:23.779219",
    updated_by: null,
  },
  {
    created_at: "2024-09-18T18:06:41.436420",
    created_by: "04ba3166-6762-489a-b458-6505015406aa",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "5c959974-0f61-465a-8653-507cc8c3a9e2",
    jenis_parameter: "current",
    name: "Xx xxx",
    periode: "2024-09-18 | 3",
    beban: 70,
    flag: false,
    persen_threshold: 100,
    sequence: 3,
    updated_at: "2024-09-20T16:39:41.780877",
    updated_by: null,
  },
  {
    created_at: "2024-09-17T11:47:38.603096",
    created_by: "66428025-c42c-4d2f-a092-9d025868266d",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "9da54a4c-b521-48b5-b901-843d430a3c31",
    jenis_parameter: "target",
    name: "Target September",
    periode: "2024-09-17 | 6",
    beban: 80,
    flag: false,
    persen_threshold: 74,
    sequence: 6,
    updated_at: "2024-09-17T12:17:59.232153",
    updated_by: null,
  },
  {
    created_at: "2024-09-17T11:13:51.271734",
    created_by: "66428025-c42c-4d2f-a092-9d025868266d",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "defda04b-27e6-47f5-9d47-17b385b2172b",
    jenis_parameter: "current",
    name: "Selasa2",
    periode: "2024-09-17 | 5",
    beban: 85,
    flag: false,
    persen_threshold: 59,
    sequence: 5,
    updated_at: "2024-09-23T16:45:52.506550",
    updated_by: null,
  },
  {
    created_at: "2024-09-17T11:12:06.646758",
    created_by: "66428025-c42c-4d2f-a092-9d025868266d",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "6db681d8-91fc-4b67-b6f7-c96dda1dd390",
    jenis_parameter: "current",
    name: "Terbaru Selasa ",
    periode: "2024-09-17 | 4",
    beban: 90,
    flag: false,
    persen_threshold: 63,
    sequence: 4,
    updated_at: "2024-09-20T15:28:13.024842",
    updated_by: null,
  },
  {
    created_at: "2024-09-17T10:42:52.547756",
    created_by: "a9bf0067-6b51-4722-b6aa-cc5939fc534a",
    excel_id: "add1cefb-1231-423c-8942-6bcd56998106",
    id: "aa4606f8-d4d9-429c-b3aa-7e951c73e427",
    jenis_parameter: "current",
    name: "Data current 1",
    periode: "2024-09-17 | 3",
    beban: 95,
    flag: false,
    persen_threshold: 100,
    sequence: 3,
    updated_at: "2024-09-19T14:41:50.429504",
    updated_by: null,
  },
];
export default function Page() {
  const session = useSession();
  const { data, isLoading, isValidating, mutate } = useGetData(
    session?.data?.user.access_token,
    1
  );

  const performanceData = data?.transactions ?? [];

  return (
    <EfficiencyContentLayout title="Performance Test">
      <section>
        <TablePerformanceTest
          tableData={performanceData}
          isLoading={isLoading}
          addNewUrl="/efficiency-app/performance-test/input"
        />
      </section>
    </EfficiencyContentLayout>
  );
}
