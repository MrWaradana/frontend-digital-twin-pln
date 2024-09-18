"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/zqdqUnRSx7N
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import PlnLogo from "../../../../public/Logo_PLN.svg";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = credentials;
    if (!username || !password) {
      return toast.error(
        "unable to login, there is a mistake in username or password"
      );
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (!result) {
        return toast.error("Problem with request!");
      }
      if (result?.error) {
        return toast.error(`Invalid credentials`);
      }

      router.replace("/");
    } catch (error) {
      toast.error(`error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Toaster />
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center items-center flex flex-col gap-4">
          <Image src={PlnLogo} alt="Logo PLN" width={124} />
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            Digital Twin Dashboard
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sign in to your account
          </h1>
          {/* <p className="text-muted-foreground">Enter your credentials to access the PLN performance dashboard.</p> */}
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              value={credentials.username}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-sm font-medium underline text-primary-foreground hover:text-primary"
                prefetch={false}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
              value={credentials.password}
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="remember" className="ml-2 text-sm font-medium">
              Remember me
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full"
            color="primary"
            disabled={isLoading ? true : false}
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
