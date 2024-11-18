import { CircleAlert, CircleCheck } from "lucide-react";
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
      status: "Normal",
    },
    {
      top: "56%",
      left: "63%",
      status: "Warning",
    },
    {
      top: "50%",
      left: "78%",
      status: "Normal",
    },
    {
      top: "72%",
      left: "79%",
      status: "Normal",
    },
    {
      top: "86%",
      left: "87%",
      status: "Normal",
    },
    {
      top: "82%",
      left: "63%",
      status: "Warning",
    },
    {
      top: "74%",
      left: "37%",
      status: "Normal",
    },
  ];

  const combinedEquipments = equipments.map((equipment, index) => {
    const position = positions[index] || { top: "0%", left: "0%" };
    return {
      ...equipment,
      position,
    };
  });


  return (
    <div className="col-span-1 md:col-span-2 px-3 rounded-3xl relative">
      <h1 className="text-sm sm:text-2xl font-semibold text-[#303030] absolute z-10 mx-4 sm:mx-10 mt-3 sm:mt-5">
        i-PFI Health
      </h1>
      <div className="flex flex-col justify-center">
        <div className="relative w-full h-[60vh] sm:h-[80vh] md:h-[600px] lg:h-full rounded-b-3xl overflow-hidden">
          <Image
            src={PowerPlantBG}
            alt="power-plant"
            className="w-full h-full object-cover rounded-3xl"
          />
          {Object.keys(combinedEquipments).map((key) => (
            <div
              key={key}
              style={{
                top: combinedEquipments[key].position.top,
                left: combinedEquipments[key].position.left,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-10 rounded-xl"
            >
              <button
                className={`${combinedEquipments[key].position.status === "Normal"
                  ? "bg-[#1C9EB6]"
                  : "bg-red-500"
                  } px-2 py-1 sm:px-5 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg rounded-full animate-pulse hover:scale-105 transition-transform duration-1500 ease-in-out`}
                onClick={() =>
                  router.push(`/pfi-app/${combinedEquipments[key].id}`)
                }
              >
                <div className="font-semibold text-neutral-200 flex items-center gap-2">
                  {combinedEquipments[key].position.status === "Normal" ? (
                    <CircleCheck className="inline-block" />
                  ) : (
                    <CircleAlert className="inline-block" />
                  )}
                  {combinedEquipments[key].position.status}
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