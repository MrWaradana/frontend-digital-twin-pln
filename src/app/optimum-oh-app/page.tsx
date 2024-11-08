"use client";

import Image from "next/image";
import BGImage from "../../../public/optimum-oh-app/bg.jpg";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  return (
    <div className="relative">
      <div className={`absolute top-0 -z-10`}>
        <AnimatePresence>
          <motion.img
            src="/optimum-oh-app/cloud1.png"
            alt="Floating cloud"
            className="absolute w-64"
            animate={{
              x: [500, 560, 500],
              y: [90, 20, 90],
              // opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>
        <AnimatePresence>
          <motion.img
            src="/optimum-oh-app/cloud1.png"
            alt="Floating cloud"
            className="absolute w-64"
            animate={{
              x: [700, 760, 700],
              y: [90, 20, 90],
              // opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>
        <AnimatePresence>
          <motion.img
            src="/optimum-oh-app/cloud1.png"
            alt="Floating cloud"
            className="absolute w-64"
            animate={{
              x: [1000, 1060, 1000],
              y: [90, 0, 90],
              // opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>
        <Image
          src={BGImage}
          alt={`background image`}
          className="w-[100vw] h-[100dvh]"
        />
      </div>
      <div
        className={`absolute top-0 w-full min-h-[100dvh] flex flex-col justify-center items-start pt-12 px-12`}
      >
        <motion.h1
          className={`text-4xl font-bold mb-6`}
          animate={{ x: 0, opacity: 1 }}
          initial={{ x: -100, opacity: 0 }}
          transition={{
            ease: "linear",
            duration: 2,
            type: "spring",
            stiffness: 70,
          }}
        >
          Optimum OH App
        </motion.h1>
        <div
          className={`min-w-[770px] min-h-[440px] rounded-3xl backdrop-blur-lg bg-white/30`}
        ></div>
      </div>
    </div>
  );
}
