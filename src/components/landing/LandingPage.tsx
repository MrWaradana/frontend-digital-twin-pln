import Image from "next/image";
import { Button, Link } from "@nextui-org/react";
import { CaretLeftIcon } from "@radix-ui/react-icons";

export default function LandingPage({
  title,
  img,
  bg,
  description,
  href,
}: {
  title: string;
  img: any;
  bg: string; // bg-[url('/[nama aplikasi]/landing.png')]
  description: string;
  href: string;
}) {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#0099AD] to-[#D9E9EE]">
      <div
        className={`w-screen h-screen ${bg} bg-cover relative flex items-center`}
      >
        <div className="h-fit w-full lg:w-[30dvw] bg-white/70 backdrop-blur-xl rounded-2xl mx-6 lg:ml-24 flex flex-col gap-6 p-6 lg:p-12 mt-12">
          <div className={`w-full flex flex-row justify-between`}>
            <Button
              as={Link}
              href="/"
              startContent={<CaretLeftIcon />}
              className={`bg-transparent text-neutral-500`}
              size="lg"
            >
              Back to all apps
            </Button>
            <div className="w-40">
              <Image src={img} alt={`${title}`} className={`w-full`} />
            </div>
          </div>
          <div className="flex flex-col justify-between items-start gap-3">
            <h2 className="text-[#0099AD] text-4xl font-medium ">{title}</h2>
            <p className={`text-neutral-500`}>{description}</p>
            <Button
              as={Link}
              href={href}
              radius="full"
              endContent={
                <CaretLeftIcon
                  className={`rotate-180 h-24 w-24 ml-24`}
                  fontSize={72}
                />
              }
              className={`bg-[#0099AD] text-white text-start`}
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
