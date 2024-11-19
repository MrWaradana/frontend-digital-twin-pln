import LCCALayout from "@/containers/LCCALayout.tsx";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LCCALayout>
      {children}
    </LCCALayout>
  );
}
