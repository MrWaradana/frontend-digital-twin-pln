"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Cog, LucideCalendarClock, Target, Calculator } from "lucide-react";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className={`bg-[#1C9EB6] text-white`}
        startContent={<Cog />}
        size={"lg"}
        onPress={onOpen}
      >
        Calculate OH
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={`5xl`}
        radius="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Calculate Overhaul
              </ModalHeader>
              <ModalBody>
                <div className={`w-full flex flex-row gap-6 p-4`}>
                  <div className="w-1/3 bg-gradient-to-b from-[#56ADBC] to-[#1C9EB6] rounded-3xl h-[42dvh] flex flex-col justify-between p-8">
                    <p className={`text-2xl text-white`}>Time Constraint</p>
                    <div
                      className={`flex justify-between items-end text-white`}
                    >
                      <LucideCalendarClock size={138} />
                      <Button
                        size={`sm`}
                        variant={`flat`}
                        className={`text-white`}
                      >
                        See details
                      </Button>
                    </div>
                  </div>
                  <div className="w-1/3 bg-gradient-to-b from-[#A2DE32] to-[#42C023] rounded-3xl h-[42dvh] flex flex-col justify-between p-8">
                    <p className={`text-2xl text-white`}>Target Reliability</p>
                    <div
                      className={`flex justify-between items-end text-white`}
                    >
                      <Target size={138} />
                      <Button
                        size={`sm`}
                        variant={`flat`}
                        className={`text-white`}
                      >
                        See details
                      </Button>
                    </div>
                  </div>
                  <div className="w-1/3 bg-gradient-to-b from-[#F49C38] to-[#DE7C0C] rounded-3xl h-[42dvh] flex flex-col justify-between p-8">
                    <p className={`text-2xl text-white`}>Budget Constraint</p>
                    <div
                      className={`flex justify-between items-end text-white`}
                    >
                      <Calculator size={138} />
                      <Button
                        size={`sm`}
                        variant={`flat`}
                        className={`text-white`}
                      >
                        See details
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
