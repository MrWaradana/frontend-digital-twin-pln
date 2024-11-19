"use client";

import ListTag from "@/components/pfi-app/ListTag";
import Analytics from "@/components/pfi-app/tags/Analytics";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetDataTag } from "@/lib/APIs/useGetDataTag";
import { useSelectedPaginationTagsStore } from "@/store/iPFI/setPaginationTags";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [selectedKeys, setSelectedKeys]: any = React.useState(new Set(["1"]));


  const selectedPaginationTags = useSelectedPaginationTagsStore(
    (state) => state.selectedPaginationTagState
  )

  const selectedLimitTags = useSelectedPaginationTagsStore(
    (state) => state.setLimitPaginationTagState
  );

  const [page, setPage] = React.useState(selectedPaginationTags);
  // const [limit, setLimit] = React.useState(selectedLimitTags);

  useEffect(() => {
    setPage(selectedPaginationTags);
  }, [selectedPaginationTags]);


  const {
    data: tagData,
    isLoading,
    mutate,
  } = useGetDataTag(session?.user?.access_token, page)

  // if (isLoading) {
  //   return (
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <CircularProgress
  //         color="primary"
  //         label={isLoading ? "Loading..." : "Validating..."}
  //       />
  //     </div>
  //   );
  // }
  const tags = tagData?.tags ?? [];
  const pagination = tagData?.pagination ?? {};

  const data = React.useMemo(() => {
    return tags.map(((item, index) => {
      return { ...item, index: index + 1 }
    }))
  }, [tags]);

  const tagValues = [{
    name: "Tag 1",
    values: [
      { time_stamp: "2021-10-01T00:00:00.000Z", value: 10 },
      { time_stamp: "2021-10-02T00:00:00.000Z", value: 20 },
      { time_stamp: "2021-10-03T00:00:00.000Z", value: 30 },
      { time_stamp: "2021-10-04T00:00:00.000Z", value: 40 },
      { time_stamp: "2021-10-05T00:00:00.000Z", value: 50 },
    ]
  }]

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
