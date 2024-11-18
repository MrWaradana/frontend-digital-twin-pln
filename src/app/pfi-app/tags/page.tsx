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
import ListTag from "@/components/pfi-app/ListTag";

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
        <ListTag dataRow={tags}
          mutate={mutate}
          isValidating={isValidating} />
        <div className="bg-white rounded-3xl p-3 sm:p-5 mx-2 sm:mx-4 border border-gray-200 shadow-xl col-span-1 md:col-span-2">
          TEST
        </div>
      </div>
    </PFIContentLayout>
  );
}
