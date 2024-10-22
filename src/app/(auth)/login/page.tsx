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
import BGLogin from "../../../../public/bg-login.jpg";
import { useSession } from "next-auth/react";
import useCaptcha from "use-offline-captcha";
import { AUTH_API_URL } from "../../../lib/api-url";

// Import BG Images
import bg1 from "../../../../public/bg-images/6 (11).jpg";
import bg2 from "../../../../public/bg-images/apik.jpg";
import bg3 from "../../../../public/bg-images/AZM03189.jpg";
import bg4 from "../../../../public/bg-images/AZM03441.jpg";
import bg5 from "../../../../public/bg-images/DJI_0029.jpg";
import bg6 from "../../../../public/bg-images/DJI_0031.jpg";
import bg7 from "../../../../public/bg-images/DSC06770.jpg";
import bg8 from "../../../../public/bg-images/DSC06779.jpg";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

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

  const bgImages = [BGLogin, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8];
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[100dvh]">
        <Toaster />
        <div className={`col-span-2 h-full relative`}>
          <div
            className={`z-10 flex flex-col gap-6 text-white absolute  px-12 py-20`}
          >
            <div>
              <h1 className={`text-3xl font-bold`}>Digital Twin</h1>
              <h2 className={`text-lg font-normal`}>Dashboard</h2>
            </div>
            <p className={`text-justify text-sm`}>
              Manajemen kesehatan aset pada pembangkit listrik adalah proses
              yang sangat penting untuk memastikan operasional yang efisien dan
              berkelanjutan dari seluruh sistem pembangkit. Ini melibatkan
              pemantauan kondisi aset-aset utama seperti turbin, generator,
              transformator, dan peralatan penting lainnya yang digunakan dalam
              produksi dan distribusi energi. Melalui analisis data yang
              dikumpulkan dari sensor dan perangkat monitoring, tim manajemen
              dapat mengidentifikasi potensi masalah lebih awal sebelum terjadi
              kerusakan serius yang dapat mengakibatkan downtime atau gangguan
              layanan. Hal ini tidak hanya mengurangi biaya perbaikan darurat
              tetapi juga memperpanjang umur aset dan memastikan kinerja
              optimal.
              <br /> <br />
              Selain itu, manajemen kesehatan aset memungkinkan pembangkit
              listrik untuk merencanakan pemeliharaan secara lebih efektif.
              Dengan memahami kondisi nyata dari peralatan, keputusan terkait
              pemeliharaan dapat dibuat berdasarkan data, bukan asumsi. Ini
              termasuk penjadwalan perawatan preventif, prediktif, atau korektif
              yang tepat waktu untuk meminimalkan dampak terhadap operasi
              sehari-hari. Dengan demikian, manajemen kesehatan aset berperan
              penting dalam meningkatkan keandalan pembangkit listrik,
              mengurangi risiko kegagalan, dan pada akhirnya memastikan pasokan
              energi yang stabil bagi konsumen.
            </p>
            <Button
              color={`primary`}
              variant={`bordered`}
              className={`text-white border-white`}
              disabled={true}
            >
              Silahkan sign in terlebih dahulu {`>>>`}
            </Button>
          </div>
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={false}
            modules={[Autoplay, Pagination, Navigation]}
            className={`mySwiper h-full`}
          >
            {bgImages.map((item, index) => {
              return (
                <SwiperSlide className="relative" key={`${item}-${index}`}>
                  <Image
                    src={item}
                    alt={`login-background`}
                    className="absolute w-full top-0 left-0 h-full -z-10"
                  />
                  <div className="absolute inset-0 w-full h-full bg-black/60 -z-10"></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6 py-12">
          <div className="space-y-2 text-center items-center flex flex-col gap-4">
            <Image
              src={PlnLogo}
              alt="Logo PLN"
              width={240}
              className={`bg-white p-2 rounded-sm`}
            />
            {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            Digital Twin Dashboard
          </div> */}
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Sign in to your account
            </h1>
            {/* <p className="text-muted-foreground">Enter your credentials to access the PLN performance dashboard.</p> */}
          </div>
          <form
            ref={formRef}
            className="space-y-4 flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                required
                value={credentials.username}
                className={`rounded-sm w-72`}
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
                className={`rounded-none w-72`}
              />
            </div>
            {/* <div className="flex items-center">
            <Label htmlFor="remember" className="ml-2 text-sm font-medium">
              Remember me
            </Label>
          </div> */}

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-3 items-start justify-center">
                <div>
                  <p className="text-xs">Captcha</p>
                  {/* @ts-ignore */}
                  <div ref={captchaRef} className="min-w-xs" />
                </div>
                <Button
                  onClick={handleRefresh}
                  color="secondary"
                  size="sm"
                  className={`rounded-sm w-full`}
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
                className={`rounded-sm w-72`}
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
              className="w-72 rounded-sm"
              color="primary"
              disabled={isLoading || mistakeCount > 3 ? true : false}
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
