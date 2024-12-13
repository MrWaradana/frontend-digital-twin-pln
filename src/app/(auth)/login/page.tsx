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
import PlnLogo from "../../../../public/Logo_PLN.png";
import { useSession } from "next-auth/react";
import useCaptcha from "use-offline-captcha";
import { AUTH_API_URL } from "../../../lib/api-url";

// Import BG Images
import bg1 from "../../../../public/bg-images/bg1.jpg";
import bg2 from "../../../../public/bg-images/bg2.jpg";
import bg3 from "../../../../public/bg-images/bg3.jpg";
import bg4 from "../../../../public/bg-images/bg4.png";
import bg5 from "../../../../public/bg-images/bg5.jpg";
import bg6 from "../../../../public/bg-images/bg6.jpg";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function Login() {
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
    width: 300, // Canvas width. default is 200
    height: 50, // Canvas height. default is 50
    fontColor: "rgba(255, 255, 255, .9)",
    background: "#000",
  };

  const bgImages = [bg1, bg2, bg3, bg4, bg5, bg6];
  //@ts-ignore
  const { gen, validate } = useCaptcha(captchaRef, userOpt);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const preventPaste = (e) => {
    e.preventDefault();
    // Optional: Tampilkan pesan ke user
    toast.error("Paste is not allowed for security reasons");
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
    <>
      <div className="grid grid-cols-1 min-h-[100dvh] relative">
        <Toaster />
        <div className={`h-full relative`}>
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              type: "bullets",
            }}
            navigation={false}
            modules={[Autoplay, Pagination, Navigation]}
            className={`custom-swiper w-full h-full`}
          >
            {bgImages.map((item, index) => {
              return (
                <SwiperSlide className="relative" key={`${item}-${index}`}>
                  <Image
                    src={item}
                    alt={`login-background`}
                    className="absolute w-full top-0 left-0 h-full -z-10"
                  />
                  <div className="absolute inset-0 w-full h-full bg-black/30 -z-10"></div>
                </SwiperSlide>
              );
            })}
            <style jsx global>{`
              .custom-swiper .swiper-pagination-bullet {
                width: 40px;
                height: 4px;
                border-radius: 0;
                background: white;
                opacity: 0.5;
                transition: all 0.3s ease;
              }

              .custom-swiper .swiper-pagination-bullet-active {
                background: #ffd700;
                opacity: 1;
              }
            `}</style>
          </Swiper>
        </div>
        <div className="w-full max-w-md space-y-2 py-4 absolute m-auto left-0 right-0 z-10 flex flex-col justify-center items-center">
          <div className="space-y-2 text-center items-center flex flex-col gap-4">
            <Image
              src={PlnLogo}
              alt="Logo PLN"
              width={80}
              className={`p-2 rounded-sm`}
            />
          </div>
          <div className="bg-white/80 backdrop-blue-xl rounded-xl py-8 px-10">
            <h1 className="text-xl font-bold tracking-tight dark:text-black sm:text-2xl text-center mb-8">
              Welcome to Digital Twin!
            </h1>
            <form
              ref={formRef}
              className="space-y-4 flex flex-col justify-center items-center"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <Label htmlFor="username" className={`dark:text-black`}>
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                  required
                  value={credentials.username}
                  className={`rounded-sm w-72 lg:w-96`}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={`dark:text-black`}>
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  onPaste={() => preventPaste}
                  onChange={handleChange}
                  value={credentials.password}
                  className={`rounded-none w-72 lg:w-96`}
                />
              </div>
              {/* <div className="flex items-center">
            <Label htmlFor="remember" className="ml-2 text-sm font-medium">
              Remember me
            </Label>
          </div> */}

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <div
                    className={`flex flex-row justify-between items-center w-full`}
                  >
                    <p className="text-xs dark:text-black">Captcha</p>
                    <Button
                      onClick={handleRefresh}
                      color="secondary"
                      size="sm"
                      className={`rounded-xl max-w-sm text-blue-500 bg-transparent hover:underline p-0`}
                    >
                      Refresh Captcha
                    </Button>
                  </div>
                  <div className="w-full bg-transparent flex justify-center items-center">
                    {/* @ts-ignore */}
                    <div ref={captchaRef} className="min-w-full" />
                  </div>
                </div>
                <p className="text-xs dark:text-black">
                  Fill the captcha above before sign in!
                </p>
                <Input
                  onChange={(e) => setValue(e.target.value)}
                  value={captchaValue}
                  isDisabled={isCaptchaValidated}
                  maxLength={5}
                  placeholder="Enter the captcha"
                  className={`rounded-xl w-72 lg:w-96`}
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
                className="w-72 lg:w-96 rounded-xl bg-black text-white"
                color="primary"
                disabled={isLoading || mistakeCount > 3 ? true : false}
                isLoading={isLoading}
                onKeyDown={handleValidate}
              >
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
