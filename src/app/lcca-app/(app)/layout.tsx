import LCCALayout from "@/containers/LCCALayout";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LCCALayout>
      {children}
    </LCCALayout>
  );
}
