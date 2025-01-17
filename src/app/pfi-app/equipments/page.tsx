"use client";

import NotSelected from "@/components/pfi-app/equipments/NotSelected";
import ListTag from "@/components/pfi-app/ListTag";
import Analytics from "@/components/pfi-app/tags/Analytics";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetEquipments } from "@/lib/APIs/useGetEquipments";
import { useSelectedPaginationTagsStore } from "@/store/iPFI/setPaginationTags";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const Page = () => {
  const { data: session } = useSession();
  const [selectedKeys, setSelectedKeys]: any = React.useState(null);

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
  } = useGetEquipments(session?.user?.access_token, page, limit)

  const tags = tagData?.equipments ?? [];
  const pagination = tagData?.pagination ?? {};

  const data = React.useMemo(() => {
    return tags.map(((item, index) => {
      return { ...item, index: index + 1 }
    }))
  }, [tags]);

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


        {
          selectedKeys === null || selectedKeys.size == 0 ? (
            <div className="bg-white rounded-3xl p-3 pt-6 sm:p-5 sm:px-12 mx-2 sm:mx-4 border border-gray-200 shadow-xl col-span-1 md:col-span-2">
              <NotSelected />
            </div>) : (
            <Analytics selectedKeys={selectedKeys} />
          )
        }
      </div>
    </PFIContentLayout>
  );
}

export default Page