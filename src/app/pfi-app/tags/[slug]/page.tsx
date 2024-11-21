"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout"
import React from "react";
import { decrypt } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { isEmpty } from "lodash";

const Page = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const key = React.useMemo(() => {
    const decodedSlug = decodeURIComponent(params.slug)
    return decrypt(decodedSlug);
  }, [params.slug]);

  React.useEffect(() => {
    isEmpty(key) && router.push("/404");
  }, [key]);

  return (
    <PFIContentLayout title="i-PFI App">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
        {key}
      </div>
    </PFIContentLayout>
  )
}

export default Page