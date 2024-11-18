"use client";

import ListTag from "@/components/pfi-app/ListTag";
import Analytics from "@/components/pfi-app/tags/Analytics";
import ShowPredict from "@/components/pfi-app/tags/ShowPredict";
import { PFIContentLayout } from "@/containers/PFIContentLayout";
import { useGetDataTag } from "@/lib/APIs/useGetDataTag";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";

export default function Page() {
  const { data: session } = useSession();
  const [selectedKeys, setSelectedKeys]: any = React.useState(new Set(["1"]));


  const {
    data: tagData,
    isLoading,
    isValidating,
    mutate,
  } = useGetDataTag(session?.user?.access_token)

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress
          color="primary"
          label={isLoading ? "Loading..." : "Validating..."}
        />
      </div>
    );
  }
  const tags = tagData?.tags ?? [];

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
        <ListTag
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          dataRow={tags}
          mutate={mutate}
          isValidating={isValidating} />

        <Analytics selectedKeys={selectedKeys} />
      </div>
    </PFIContentLayout>
  );
}
