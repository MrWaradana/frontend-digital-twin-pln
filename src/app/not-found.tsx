import { Link } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <h2 className="text-red-600 font-bold text-4xl">404 Not Found!</h2>
      <p>Could not find page!</p>
      <Link href="/" underline="hover">
        Return to all apps
      </Link>
    </div>
  );
}
