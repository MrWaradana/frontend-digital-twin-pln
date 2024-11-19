"use client";

import ListTag from "@/components/pfi-app/ListTag";
// import Analytics from "@/components/pfi-app/tags/Analytics";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetDataTag } from "@/lib/APIs/useGetDataTag";
import { useSelectedPaginationTagsStore } from "@/store/iPFI/setPaginationTags";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

interface TagValue {
  time_stamp: string;
  value: number;
}

const Analytics = dynamic(
  () =>
    import(
      "@/components/pfi-app/tags/Analytics"
    ),
  { ssr: false }
);


export default function Page() {
  const { data: session } = useSession();
  const [selectedKeys, setSelectedKeys]: any = React.useState(new Set(["1"]));


  const selectedPaginationTags = useSelectedPaginationTagsStore(
    (state) => state.selectedPaginationTagState
  )
  const limitPaginationTags = useSelectedPaginationTagsStore(
    (state) => state.limitPaginationTagState
  )


  const [page, setPage] = React.useState(selectedPaginationTags);
  const [limit, setLimit] = React.useState(limitPaginationTags);

  useEffect(() => {
    setPage(selectedPaginationTags);
    setLimit(limitPaginationTags);
  }, [selectedPaginationTags, limitPaginationTags]);


  const {
    data: tagData,
    isLoading,
    mutate,
  } = useGetDataTag(session?.user?.access_token, page, limit)

  const tags = tagData?.tags ?? [];
  const pagination = tagData?.pagination ?? {};

  const data = React.useMemo(() => {
    return tags.map(((item, index) => {
      return { ...item, index: index + 1 }
    }))
  }, [tags]);

  const tagValues: { name: string; values: TagValue[] }[] = [
    {
      name: "Tag 1 (Original)",
      values: [] // Data asli
    },
    {
      name: "Tag 1 (Predicted)",
      values: [] // Data prediksi
    }
  ];

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Tanggal awal untuk data asli (7 hari ke belakang)
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // Mengisi data asli selama 7 hari terakhir
  for (let i = 0; i < 7; i++) {
    let newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + i);

    tagValues[0].values.push({
      time_stamp: newDate.toISOString(),
      value: getRandomValue(1, 100)
    });
  }

  // Tanggal awal untuk data prediksi (hari setelah data asli berakhir)
  let predictionStartDate = new Date(startDate);
  predictionStartDate.setDate(predictionStartDate.getDate() + 7);

  // Mengisi data prediksi selama 7 hari ke depan
  for (let i = 0; i < 7; i++) {
    let newDate = new Date(predictionStartDate);
    newDate.setDate(newDate.getDate() + i);

    tagValues[1].values.push({
      time_stamp: newDate.toISOString(),
      value: getRandomValue(5, 105)
    });
  }

  console.log(tagValues)

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
        <ListTag
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          dataRow={data}
          mutate={mutate}
          pagination={pagination}
          isLoading={isLoading} />

        <Analytics selectedKeys={selectedKeys} tagValues={tagValues} />
      </div>
    </PFIContentLayout>
  );
}
