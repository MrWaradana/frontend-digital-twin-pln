import { Navbar } from "@/components/pfi-app/nav/Navbar";
import { Toaster } from "react-hot-toast";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function PFIContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container mx-auto sm:px-8">
        <Toaster />

        {/* {children} */}
      </div>
    </div>
  );
}
