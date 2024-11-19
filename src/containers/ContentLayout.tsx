import { Navbar } from "@/components/admin/Navbar";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import { Toaster } from "react-hot-toast";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Toaster />
      <Navbar title={title} />
      <div className="mx-4 sm:mx-8 p-1">{children}</div>
    </div>
  );
}
