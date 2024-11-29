import { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import "../efficiency-app/index.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
      <Toaster />
    </main>
  );
}
