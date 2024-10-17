"use client";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableRootCause from "../TableRootCause";
import { useGetVariableCauses } from "@/lib/APIs/useGetVariableCause";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import toast from "react-hot-toast";

function ModalNPHRInput({
  isOpen,
  onOpenChange,
  niagaData,
  setNiagaValue,
  niagaValue,
}: {
  isOpen: boolean;
  onOpenChange: any;
  niagaData: any;
  setNiagaValue: any;
  niagaValue: number;
}) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [nphr, setNphr] = useState("");
  const { data: session } = useSession();

  const makeApiRequest = async (url, method, body) => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${method} data`);
    }

    return response.json();
  };

  const handleSave = async () => {
    setLoadingSubmit(true);

    try {
      let resData;

      if (niagaData) {
        const nphrId = niagaData.find((item) => item.name === "Niaga")?.id;
        if (!nphrId) throw new Error("Niaga ID not found");

        if (parseInt(nphr) < 0) {
          toast.error("NPHR cannot be negative");
          return;
        }

        resData = await makeApiRequest(
          `${EFFICIENCY_API_URL}/cases/${nphrId}`,
          "PUT",
          { nphr_value: nphr }
        );
        setNiagaValue(parseInt(nphr));
      } else {
        resData = await makeApiRequest(`${EFFICIENCY_API_URL}/cases`, "POST", {
          name: "Niaga",
          nphr_value: nphr,
        });
      }

      console.log("Data saved successfully:", resData);
      // You can add a success toast here if needed
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving data:", error);
      // Uncomment the following line to show error toast
      // toast.error(`Error saving data: ${error.message}`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      scrollBehavior={"inside"}
      onOpenChange={onOpenChange}
    >
      {
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Input NPHR Niaga Value
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Net Plant Heat Rate"
                  placeholder="Enter NPHR value"
                  value={nphr}
                  onChange={(e) => setNphr(e.target.value)}
                  type="number"
                  //   step="0.01"
                  min="0"
                  pattern=""
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                  }}
                  isLoading={loadingSubmit}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="light"
                  onClick={() => {
                    handleSave();
                    // onClose();
                  }}
                  isLoading={loadingSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      }
    </Modal>
  );
}

export default ModalNPHRInput;
