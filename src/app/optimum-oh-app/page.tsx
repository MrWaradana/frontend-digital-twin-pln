"use client";

import Image from "next/image";
import BGImage from "../../../public/optimum-oh-app/bg.jpg";
import { motion, AnimatePresence } from "framer-motion";

// Animation configurations
const ANIMATIONS = {
  title: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: {
      ease: "linear",
      duration: 3,
      type: "spring",
      stiffness: 70,
    },
  },
};

// Cloud positions configuration with individual durations
const CLOUD_POSITIONS = [
  {
    baseX: -400,
    offsetX: 2400,
    duration: 82,
    y: 50,
  },
  {
    baseX: 2000,
    offsetX: -200,
    duration: 96,
    y: 30,
  },
  {
    baseX: -400,
    offsetX: 4000,
    duration: 96,
    y: 40,
  },
  {
    baseX: 1900,
    offsetX: -500,
    duration: 96,
    y: 40,
  },
];

const links = [
  {
    name: "link1",
    href: "#",
  },
  {
    name: "link2",
    href: "#",
  },
  {
    name: "link3",
    href: "#",
  },
  {
    name: "link4",
    href: "#",
  },
  {
    name: "link5",
    href: "#",
  },
  {
    name: "link6",
    href: "#",
  },
];

// Cloud component for reusability
const FloatingCloud = ({ baseX, offsetX, duration, y }) => {
  return (
    <AnimatePresence>
      <motion.img
        src="/optimum-oh-app/cloud1.png"
        alt="Floating cloud"
        className="absolute w-80 z-10 opacity-80"
        animate={{
          x: [baseX, baseX + offsetX, baseX],
          y: [y],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </AnimatePresence>
  );
};

export default function Page() {
  return (
    <div className="relative ">
      <div className="absolute top-0  overflow-hidden bg-blue-300 min-h-[100dvh] min-w-full">
        {CLOUD_POSITIONS.map((position, index) => (
          <FloatingCloud
            key={index}
            baseX={position.baseX}
            offsetX={position.offsetX}
            duration={position.duration}
            y={position.y}
          />
        ))}
        <Image
          src={BGImage}
          alt="background image"
          className="w-[60vw] absolute right-0 h-full"
        />
      </div>
      <div className="absolute top-16 w-full max-h-[100dvh] flex flex-col justify-center items-start pt-12 px-12">
        <motion.a
          href="/"
          className="text-base cursor-pointer hover:underline text-blue-500 font-bold mb-6"
          {...ANIMATIONS.title}
        >
          {`< `} Back to all apps
        </motion.a>
        <motion.h1 className="text-4xl font-bold mb-2" {...ANIMATIONS.title}>
          Optimum OH App
        </motion.h1>
        <motion.p className="text-base w-[540px] mb-6" {...ANIMATIONS.title}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </motion.p>

        <section className={`grid grid-cols-1 lg:grid-cols-3 gap-8`}>
          {links.map((item, index) => {
            return (
              <a
                key={item.name}
                href={item.href}
                className="min-w-[150px] min-h-[120px] inline-flex justify-center items-center rounded-3xl backdrop-blur-lg bg-white/30 hover:bg-white transition ease duration-300"
              >
                {item.name}
              </a>
            );
          })}
        </section>
      </div>
    </div>
  );
}
