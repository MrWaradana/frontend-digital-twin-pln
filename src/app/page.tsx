"use client";

import Image from "next/image";
import PlnLogo from "../../public/Logo_PLN.png";
import { Button, Link } from "@nextui-org/react";

// Import BG Images
import bg1 from "../../public/bg-images/bg1.jpg";
import bg2 from "../../public/bg-images/bg2.jpg";
import bg3 from "../../public/bg-images/bg3.jpg";
import bg4 from "../../public/bg-images/bg4.png";
import bg5 from "../../public/bg-images/bg5.jpg";
import bg6 from "../../public/bg-images/bg6.jpg";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function Home() {
  const bgImages = [bg1, bg2, bg3, bg4, bg5, bg6];
  const Unit = [
    {
      name: "Unit 1",
      href: "#",
      bgColor: "bg-violet-400",
    },
    {
      name: "Unit 2",
      href: "#",
      bgColor: "bg-green-400",
    },
    {
      name: "Unit 3",
      href: "unit-3",
      bgColor: "bg-blue-400",
    },
    {
      name: "Unit 4",
      href: "#",
      bgColor: "bg-yellow-400",
    },
  ];
  return (
    <div className="grid grid-cols-1 min-h-[100dvh] relative">
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
      <div className="w-full max-w-md space-y-2 py-4 absolute m-auto left-0 right-0 z-10 flex flex-col justify-end items-center">
        <div className="space-y-2 text-center items-center flex flex-col gap-4">
          <Image
            src={PlnLogo}
            alt="Logo PLN"
            width={80}
            className={`p-2 rounded-sm`}
          />
        </div>
        <div className="bg-white/80 backdrop-blue-xl rounded-xl py-8 px-10">
          <h1 className="text-xl font-bold tracking-tight dark:text-black sm:text-2xl text-center">
            Welcome to Digital Twin!
          </h1>
          <p className={`text-xs italic text-gray-600 text-center mb-4`}>
            Click link below to go to unit apps!
          </p>
          <div className={`flex flex-col gap-4`}>
            {Unit.map((item, index) => {
              return (
                <Button
                  key={`${index}`}
                  as={Link}
                  href={item.href}
                  className={`${item.bgColor} font-semibold text-xl text-neutral-800                  
                  group
                  relative
                  h-14
                  transition-all
                  duration-300
                  transform
                  hover:scale-105
                  hover:shadow-lg
                  rounded-lg
                  overflow-hidden`}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
