import { Navbar } from "@/components/risk-matrix-app/nav/Navbar";
import { Toaster } from "react-hot-toast";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function RiskMatrixContentLayout({
  title,
  children,
}: ContentLayoutProps) {
  return (
    <div>
      <Toaster />
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
}
