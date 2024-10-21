"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/zqdqUnRSx7N
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button, Input } from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import PlnLogo from "../../../../public/Logo_PLN.svg";
import { useSession } from "next-auth/react";
import useCaptcha from "use-offline-captcha";
import { AUTH_API_URL } from "../../../lib/api-url";

export default function Component() {
  const captchaRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [captchaValue, setValue] = useState("");
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isCaptchaValidated, setIsCaptchaValidated] = useState(false);
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userOpt = {
    type: "mixed", // "mixed"(default) | "numeric" | "alpha"
    length: 5, // 4 to 8 number. default is 5
    sensitive: true, // Case sensitivity. default is false
    width: 200, // Canvas width. default is 200
    height: 50, // Canvas height. default is 50
    fontColor: "#000",
    background: "rgba(255, 255, 255, .2)",
  };

  //@ts-ignore
  const { gen, validate } = useCaptcha(captchaRef, userOpt);

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
        setIsLoading(false);
        return toast.error("Problem with request!");
      }
      if (result?.error) {
        if (mistakeCount + 1 > 3) {
          toast.error("Too many login attempts, please wait 15 min");
          setTimeout(() => {
            setMistakeCount(0);
          }, 900000);
        }
        setIsLoading(false);
        setMistakeCount(mistakeCount + 1);
        console.log(result, "result");
        return toast.error(`Invalid credentials`);
      }

      router.replace("/");
    } catch (error) {
      toast.error(`error: ${error}`);
      console.log(error);
    }
  };

  const handleValidate = () => {
    setIsLoading(true);
    const isValid = validate(captchaValue);
    // formRef.current?.requestSubmit();
    if (isValid) {
      // toast.success("Captcha is validated, you can sign in!");
      setIsCaptchaValidated(true);
      formRef.current?.requestSubmit();
    } else {
      toast.error("Captcha is wrong!");
      setIsLoading(false);
    }
  };

  const handleRefresh = () => gen();

  useEffect(() => {
    if (gen) gen();
  }, [gen]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[100dvh]">
      <Toaster />

      <div
        className={`h-full w-full px-28 flex flex-col text-white justify-center items-start gap-6 bg-blue-400`}
      >
        <div>
          <h1 className={`text-3xl font-bold`}>Digital Twin</h1>
          <h2 className={`text-lg font-normal`}>Dashboard</h2>
        </div>
        <p className={`text-justify`}>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Tempor bibendum
          eros neque euismod et sodales dis aliquam. Fusce platea phasellus
          suscipit placerat scelerisque dictum consectetur. Sociosqu ultricies
          taciti lorem laoreet rhoncus est interdum aliquam ipsum. Aptent augue
          fermentum conubia porta in. Bibendum morbi sollicitudin sit ultricies
          quis nascetur. Augue phasellus tortor per non nostra sit. Natoque
          fringilla euismod integer commodo leo; ornare faucibus fringilla
          aptent? Erat mattis posuere habitant sollicitudin ornare maximus
          praesent eleifend. Ornare cras nascetur mattis luctus, suspendisse non
          luctus. Congue cras a imperdiet pretium dapibus sollicitudin. Ipsum
          ultrices libero facilisi habitant consectetur tellus sagittis. Montes
          mollis massa; justo platea fames mollis. Ipsum vitae viverra, cubilia
          mi hendrerit enim consectetur cursus. Amet phasellus aenean penatibus
          metus luctus aliquet.
        </p>
        <Button
          color={`primary`}
          variant={`bordered`}
          className={`text-white border-white`}
        >
          Silahkan login terlebih dahulu {`>>>`}
        </Button>
      </div>
      <div className="mx-auto w-full max-w-md space-y-6 py-20">
        <div className="space-y-2 text-center items-center flex flex-col gap-4">
          <Image
            src={PlnLogo}
            alt="Logo PLN"
            width={124}
            className={`bg-white p-2 rounded-sm`}
          />
          {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            Digital Twin Dashboard
          </div> */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sign in to your account
          </h1>
          {/* <p className="text-muted-foreground">Enter your credentials to access the PLN performance dashboard.</p> */}
        </div>
        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              value={credentials.username}
              className={`rounded-sm`}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
              value={credentials.password}
              className={`rounded-none`}
            />
          </div>
          {/* <div className="flex items-center">
            <Label htmlFor="remember" className="ml-2 text-sm font-medium">
              Remember me
            </Label>
          </div> */}

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-3 items-end">
              <div>
                <p className="text-xs">Captcha</p>
                {/* @ts-ignore */}
                <div ref={captchaRef} />
              </div>
              <Button
                onClick={handleRefresh}
                color="secondary"
                size="sm"
                className={`rounded-sm`}
              >
                Refresh Captcha
              </Button>
            </div>
            <p className="text-xs">Fill the captcha above before sign in!</p>
            <Input
              onChange={(e) => setValue(e.target.value)}
              value={captchaValue}
              isDisabled={isCaptchaValidated}
              maxLength={5}
              className={`rounded-sm`}
              // endContent={
              //   <>
              //     <Button onClick={handleValidate} color="success" size="sm">
              //       Validate
              //     </Button>
              //   </>
              // }
            />
          </div>
          <Button
            type="button"
            onClick={handleValidate}
            className="w-full rounded-sm"
            color="primary"
            disabled={isLoading || mistakeCount > 3 ? true : false}
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
