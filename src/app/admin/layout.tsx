import AdminLayout from "@/containers/AdminLayout";
import { auth } from "@/auth";
import { Button, Link } from "@nextui-org/react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.user.role != "Admin") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full pt-12">
        <p className="">You are not an Admin, cannot access this page!</p>
        <Button as={Link} color="primary" href="/">
          Back to All Apps
        </Button>
      </div>
    );
  }
  return <AdminLayout>{children}</AdminLayout>;
}
