import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex w-full justify-center mt-12">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return to all apps</Link>
    </div>
  );
}
