import OptimumOHLayout from "@/containers/OptimumOHLayout";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OptimumOHLayout
      className={`bg-gradient-to-b from-[#D9E9EE] to-[#FFFFFF] to-[45%]`}
    >
      {children}
      <Toaster />
    </OptimumOHLayout>
  );
}
