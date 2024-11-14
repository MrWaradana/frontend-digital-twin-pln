"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import boiler from "../../../../public/boiler-system.png";
import Image from "next/image";
import TableTag from "@/components/pfi-app/TableTag";
import { Button, CircularProgress, Link } from "@nextui-org/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetDataTag } from "@/lib/APIs/useGetDataTag";

export default function Page() {
  const router = useRouter()
  const { data: session } = useSession();

  const {
    data: tagData,
    isLoading,
    isValidating,
    mutate,
  } = useGetDataTag(session?.user?.access_token)


  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center items-center">
        <CircularProgress color="primary" />
        Loading ...
      </div>
    );
  }
  const tags = tagData?.tags ?? [];

  return (
    <PFIContentLayout title="Intelligent P-F Interval Equipments">
      <div className="flex flex-col items-center justify-center mt-8">
        {/* Content */}
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          <div className="w-full text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              Tags Lists
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage your tags efficiently by viewing the list below.
            </p>
          </div>

          <TableTag
            dataRow={tags}
            mutate={mutate}
            isValidating={isValidating}
          />
        </div>
      </div>

    </PFIContentLayout>
  );
}
