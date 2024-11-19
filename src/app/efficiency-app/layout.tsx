import EfficiencyLayout from "@/containers/EfficiencyLayout";
import { Toaster } from "react-hot-toast";
import "./index.css"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <EfficiencyLayout>
      {children}
      <Toaster />
    </EfficiencyLayout>
  );
}
