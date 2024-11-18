import { Navbar } from "@/components/reliability-app/nav/Navbar";
import { Toaster } from "react-hot-toast";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function RPContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <Toaster />

      <div className="mx-4 sm:mx-8 p-1">{children}</div>
    </div>
  );
}
