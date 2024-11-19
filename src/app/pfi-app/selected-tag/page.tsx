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
  } = useGetDataTag(session?.user?.access_token, 1)


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
      <div className="container mx-auto">
        <div className="w-full text-left">
          <Button
            as={Link}
            onPress={() => router.back()}
            color="primary"
            size="sm"
            className="mb-10"
          >
            <ChevronLeftIcon size={12} />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-gray-800">Equipment Lists</h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage your equipment efficiently by viewing the list below.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-[50px] md:grid-cols-3 sm:grid-cols-1">
          <div className="container items-center justify-center text-left">
            <h3 className="text-black-500 mb-5">Overall Observation</h3>
            <Image src={boiler} alt="Boiler system" className="text-center" />
          </div>
          <div className="col-span-2 md:col-span-2 sm:col">
            <TableTag
              dataRow={tags}
              mutate={mutate}
              isValidating={isValidating}
            />
          </div>
        </div>


      </div>
    </PFIContentLayout>
  );
}
