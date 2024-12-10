"use client";
import { usePostNewTimeConstrainParameter } from "@/lib/APIs/mutation/usePostNewTimeConstrainParameter";
import { useGetCalculationTimeConstrainParameter } from "@/lib/APIs/useGetCalculationTimeConstrainParameter";
import { formattedNumber } from "@/lib/formattedNumber";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Spinner,
  select,
} from "@nextui-org/react";
import { Cog, LucideCalendarClock, Target, Calculator } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function CalculateOH({
  size = "lg",
  title = "Calculate OH",
  radius = "md",
}: any) {
  const {
    isOpen: calculateOhIsOpen,
    onOpen: calculateOhOnOpen,
    onOpenChange: calculateOhOnOpenChange,
  } = useDisclosure();
  const {
    isOpen: calculateTimeConstrainsIsOpen,
    onOpen: calculateTimeConstrainsOnOpen,
    onOpenChange: calculateTimeConstrainsOnOpenChange,
    onClose,
  } = useDisclosure();

  return (
    <>
      <Button
        className={`bg-[#1C9EB6] text-white`}
        startContent={<Cog />}
        size={size}
        radius={radius}
        onPress={calculateOhOnOpen}
      >
        {title}
      </Button>
      <Modal
        isOpen={calculateOhIsOpen}
        onOpenChange={calculateOhOnOpenChange}
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
                  <div
                    className="w-1/3 bg-gradient-to-b from-[#56ADBC] to-[#1C9EB6] rounded-3xl h-[42dvh] flex flex-col justify-between p-8 cursor-pointer"
                    onClick={calculateTimeConstrainsOnOpen}
                  >
                    <p className={`text-2xl text-white`}>Time Constraint</p>
                    <div
                      className={`flex justify-between items-end text-white`}
                    >
                      <LucideCalendarClock size={138} />
                      <Button
                        size={`sm`}
                        variant={`flat`}
                        className={`text-white`}
                        onPress={calculateTimeConstrainsOnOpen}
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
      <ModalTimeConstrainsInput
        isOpen={calculateTimeConstrainsIsOpen}
        onOpenChange={calculateTimeConstrainsOnOpenChange}
      />
    </>
  );
}

interface ModalTimeConstrainsInputProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ModalTimeConstrainsInput(props: ModalTimeConstrainsInputProps) {
  const { isOpen, onOpenChange } = props;
  const { data: session } = useSession();
  const { data: timeConstrainParameter, isLoading } =
    useGetCalculationTimeConstrainParameter(session?.user.access_token, isOpen);
  const { trigger, isLoading: postLoading, data } = usePostNewTimeConstrainParameter(
    session?.user.access_token
  );

  const router = useRouter()

  const [costPerFailure, setCostPerFailure] = useState("");
  const [selectedScope, setSelectedScope] = useState("");
  const [overhaulCost, setOverhaulCost] = useState("0");
  const availableScopes = useRef<string[]>([]);

  const parameter = timeConstrainParameter ?? {
    costPerFailure: {},
    availableScopes: [],
    recommendedScope: "",
  };

  useMemo(() => {
    if (!timeConstrainParameter) return;

    const {
      costPerFailure,
      availableScopes: scopes,
      recommendedScope,
    } = parameter;
    availableScopes.current = scopes;
    setSelectedScope(recommendedScope);
    setCostPerFailure(formattedNumber(costPerFailure[recommendedScope]));
  }, [timeConstrainParameter]);

  const handleParameterSubmit = async () => {
    try {
      await trigger({
        token: session?.user.access_token,
        body: {
          overhaulCost: Number(
            overhaulCost.replace(/\./g, "").replace(",", ".")
          ),
          scopeOH: selectedScope,
          costPerFailure: Number(
            costPerFailure.replace(/\./g, "").replace(",", ".")
          ),
        },
      });

      if (data) {
        setTimeout(() => {
          router.push(`/chart?calculation_id=${data.data}`);
        }, 1000)

      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={`2xl`} radius="lg">
      <ModalContent>
        {isLoading || postLoading ? (
          <div className="flex flex-col justify-between items-center p-6">
            <Spinner></Spinner>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Time Constraints
            </ModalHeader>
            <ModalBody>
              <div className="w-full">
                <div className="flex gap-4 justify-between">
                  <div className="items-center w-1/3">
                    <Select
                      labelPlacement={`outside-left`}
                      disallowEmptySelection
                      size="sm"
                      label="Scope"
                      className="max-w-xs items-center"
                      selectedKeys={[selectedScope]}
                      onChange={(e) => {
                        setSelectedScope(e.target.value);
                        setCostPerFailure(
                          formattedNumber(
                            parameter.costPerFailure[e.target.value]
                          )
                        );
                      }}
                    >
                      {
                        //@ts-ignore
                        availableScopes.current.map((scope) => (
                          <SelectItem key={scope}>{scope}</SelectItem>
                        ))
                      }
                    </Select>
                  </div>
                  <div className="flex flex-col w-2/3 gap-3">
                    <div className="grid grid-cols-3">
                      <label className="text-sm text-nowrap" htmlFor="">
                        Cost Per Failure
                      </label>
                      <div className="col-span-2">
                        <Input
                          size="lg"
                          value={costPerFailure}
                          onValueChange={setCostPerFailure}
                          onBlur={() => {
                            setCostPerFailure(
                              formattedNumber(
                                Number(
                                  costPerFailure
                                    .replace(/\./g, "")
                                    .replace(",", ".")
                                )
                              )
                            );
                          }}
                          description="Calculated from the total cost divided by number of failures from MAXIMO"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <label className="text-sm text-nowrap" htmlFor="">
                        Overhaul Cost
                      </label>
                      <div className="col-span-2">
                        <Input
                          size="lg"
                          value={overhaulCost}
                          onValueChange={setOverhaulCost}
                          onBlur={(e) => {
                            setOverhaulCost(
                              formattedNumber(
                                Number(
                                  overhaulCost
                                    .replace(/\./g, "")
                                    .replace(",", ".")
                                )
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={handleParameterSubmit}
                isLoading={postLoading}
              >
                Calculate OH
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
