"use client";

import { useSession } from "next-auth/react";
import { useGetVariables } from "@/lib/APIs/useGetVariables";

export default function Page() {
  const excelId = "add1cefb-1231-423c-8942-6bcd56998106";
  const session = useSession();
  const type = "out";

  const {
    data: trendingData,
    isLoading,
    mutate,
  } = useGetVariables(session?.data?.user.accessToken, excelId, type);

  if (isLoading) return <p>Loading...</p>; // Show a loading state
  // if (error) return <p>Error: {error}</p>; // Show error message if there's an error

  return (
    <div>
      {trendingData?.map((data) => {
        return <pre key={data.id}>{JSON.stringify(data, null, 2)}</pre>;
      })}
    </div>
  );
}
