import Link from "next/link";
import { Button } from "@/components/ui/button";
import VariableOutputForm from "@/components/efficiency-app/VariableOutputForm";

export default async function Page() {
  const variables = await fetch("http://localhost:3001/api/variables", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  const units = await fetch("http://localhost:3001/api/units", {
    next: { revalidate: 120 },
  }).then((res) => res.json());

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <Button className="mb-4">
        <Link href="/">{`<`}Back to input</Link>
      </Button>
      <VariableOutputForm variables={variables} units={units} />
    </section>
  );
}
