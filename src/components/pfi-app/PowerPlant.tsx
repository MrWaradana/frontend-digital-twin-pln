import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import PowerPlantBG from "../../../public/i-PFI/bg.png";
import Image from "next/image";
import { useRouter } from "next/navigation";


const PowerPlant = ({
  equipments,
}: {
  equipments: any;
}) => {
  const router = useRouter();


  const positions = [
    {
      top: "37%",
      left: "43%",
      status: "normal",
    },
    {
      top: "56%",
      left: "63%",
      status: "warning",
    },
    {
      top: "50%",
      left: "78%",
      status: "normal",
    },
    {
      top: "72%",
      left: "79%",
      status: "normal",
    },
    {
      top: "86%",
      left: "87%",
      status: "failed",
    },
    {
      top: "82%",
      left: "63%",
      status: "warning",
    },
    {
      top: "74%",
      left: "37%",
      status: "failed",
    },
  ];

  return (
    <div className="col-span-1 md:col-span-2 px-3  relative">
      <h1 className="text-sm sm:text-2xl font-semibold text-[#303030] absolute z-10 mx-4 sm:mx-10 mt-3 sm:mt-5">
        i-PFI Health
      </h1>
      <div className="flex flex-col justify-center">
        <div className="relative w-full h-[60vh] sm:h-[80vh] md:h-[600px] lg:h-full rounded-b-3xl overflow-hidden">
          <Image
            src={PowerPlantBG}
            alt="power-plant"
            className="w-full h-full object-cover rounded-3xl shadow-xl border-[1px]"
          />
          {Object.keys(positions).map((key) => (
            <div
              key={key}
              style={{
                top: positions[key].top,
                left: positions[key].left,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-10 rounded-xl"
            >
              <button
                className={`${positions[key].status === "normal"
                  ? "bg-[#28C840]"
                  : positions[key].status === "warning"
                    ? "bg-[#F49C38]"
                    : "bg-[#D93832]"
                  } 
                px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-3 md:text-base lg:px-4 lg:py-2 lg:text-base 
                rounded-full animate-pulse hover:scale-105 transition-transform duration-1500 ease-in-out`}
                onClick={() => router.push(`/pfi-app/${positions[key].id}`)}
              >
                <div className="font-semibold text-neutral-200 flex items-center gap-2">
                  {positions[key].status === "normal" ? (
                    <CircleCheck className="inline-block " />
                  ) : positions[key].status === "warning" ? (
                    <CircleAlert className="inline-block" />
                  ) : (
                    <CircleX className="inline-block" />
                  )}
                  {positions[key].status}
                </div>
              </button>
            </div>

          ))}
        </div>
      </div>
    </div>
  )
}

export default PowerPlant