"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";

export default function Page() {
  return (
    <PFIContentLayout title="All PFI Data">
      <div className="flex flex-col items-center justify-center mt-24">
        {/* Content */}
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          <div className="w-full text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              Equipment Lists
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage your equipment efficiently by viewing the list below.
            </p>
          </div>

          {/* Table disini */}
        </div>
      </div>
    </PFIContentLayout>
  );
}
