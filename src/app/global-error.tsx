"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className="flex w-full justify-center items-center mt-12">
        <h2 className="font-bold">Something went wrong!</h2>
        <h3 className="font-semibold text-red-400">{error.message}</h3>
        <button onClick={() => reset()}>Try again</button>
        <a href="/" className="text-blue hover:underline">
          Back to all apps
        </a>
      </body>
    </html>
  );
}