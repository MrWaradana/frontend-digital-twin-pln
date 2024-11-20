import PFILayout from "@/containers/PFILayout";
import "./index.css"
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PFILayout>{children}</PFILayout>;
}
