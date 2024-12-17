"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HeaderCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeaderCard(HeaderCardProps) {
  const { children, className } = HeaderCardProps;
  {
    `shadow-2xl w-full bg-white rounded-3xl hover:-translate-y-1 transition ease-soft-spring`;
  }

  return (
    <Card
      className={cn(
        "shadow-2xl w-full bg-white rounded-3xl hover:-translate-y-1 transition ease-soft-spring",
        `${className}`
      )}
    >
      <CardContent className="flex flex-col justify-around pt-5 gap-4">
        {/* <p className="text-sm font-semibold">
                        Revenue
                    </p>
                    <span
                        className={`border-l-4 pl-3 border-blue-400 flex flex-col`}
                    >
                        <h2 className="text-5xl font-bold">10</h2>
                        <small className={`text-xs text-neutral-400`}>Tahun</small>
                    </span> */}
        {children}
      </CardContent>
    </Card>
  );
}
