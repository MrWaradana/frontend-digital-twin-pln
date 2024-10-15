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
import TableRootCause from "./TableRootCause";
import { useGetVariableCauses } from "@/lib/APIs/useGetVariableCause";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  useGetVariableHeaders,
  VariableHeader,
} from "@/lib/APIs/useGetVariableHeaders";
import PreviousMap from "postcss/lib/previous-map";
import {
  DataRootCauseAction,
  useGetDataRootCausesAction,
} from "@/lib/APIs/useGetDataRootCauseAction";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { set } from "lodash";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import React from "react";
import toast from "react-hot-toast";
import { useGetVariableCauseActions } from "@/lib/APIs/useGetVariableCauseActions";
import TableRootCauseAction from "./TableRootCauseAction";

const checkboxColumn = [
  "Macrofouling",
  "Microfouling",
  "Excessive Air in leakage",
  "Inadequate air removal capacity",
  "Increase CW System Resistance",
  "- Air binding cond. Disch. Pipe/tunnel",
  "- Macrofouling at CW pump disch. Piping",
  "- Plugged condenser tube",
  "- Condenser inlet/outlet valve not open",
  "- Air binding condensor inlet-outlet waterbox (low waterbox level)",
  "Decrease CW Pump Performance",
  "- Pump casing or impeller wear/corrosion",
  "- Damaged casing or impeller",
  "- Pump cavitation",
  "- Macrofouling / siltation of intake/struct",
  "- Low inlet pump level",
  "Decrease Ejector/Vacuum pump performance",
  "Instrument Error",
];

// Define the structure of our tree data
// interface TreeNode {
//     id: string
//     name: string
//     children?: TreeNode[]
// }

// Sample data
// const treeData: TreeNode[] = [
//     {
//         id: '1',
//         name: 'Root 1',
//         children: [
//             {
//                 id: '1.1',
//                 name: 'Child 1.1',
//                 children: [
//                     { id: '1.1.1', name: 'Grandchild 1.1.1' },
//                     { id: '1.1.2', name: 'Grandchild 1.1.2' }
//                 ]
//             },
//             { id: '1.2', name: 'Child 1.2' }
//         ]
//     },
//     {
//         id: '2',
//         name: 'Root 2',
//         children: [
//             { id: '2.1', name: 'Child 2.1' },
//             {
//                 id: '2.2',
//                 name: 'Child 2.2',
//                 children: [
//                     { id: '2.2.1', name: 'Grandchild 2.2.1' }
//                 ]
//             }
//         ]
//     }
// ]

interface rootCheckBox {
  [rowId: string]: {
    header_value: {
      [headerId: string]: boolean;
    };
    biaya: number;
    is_repair: boolean;
  };
}

interface rootRepairCost {
  [rowId: string]: {
    is_repair: boolean;
    biaya: number;
  };
}

function ModalRootCause({
  isOpen,
  onOpenChange,
  selectedModalId,
  data_id,
  paretoMutate,
}: {
  isOpen: boolean;
  onOpenChange: any;
  selectedModalId: { detailId: string; variableId: string };
  data_id: string;
  paretoMutate: any;
}) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { data: session } = useSession();
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);

  const {
    data: rootCauseAction,
    isLoading: rootCauseActionLoading,
    isValidating: rootCauseActionValidating,
  } = useGetDataRootCausesAction(
    session?.user.access_token,
    data_id,
    selectedModalId.detailId,
    isOpen
  );

  // console.log(rootCauseAction, "action data");

  const { data, isLoading, isValidating, mutate } = useGetVariableCauseActions(
    session?.user.access_token,
    selectedModalId.variableId,
    selectedModalId.detailId,
    isOpen
  );

  // const { data: header, isLoading: headerLoading } = useGetVariableHeaders(
  //   session?.user.access_token,
  //   selectedModalId.variableId,
  //   isOpen
  // );

  const variableCauseActions = data ?? [];
  const dataRootCauseAction = rootCauseAction ?? [];

  // const formInit = useForm({
  //     mode: 'onChange',
  //     defaultValues: Object.fromEntries(rootCauseData.map(root => [root.cause_id, {
  //         header_value: Object.fromEntries(variabelHeader.map(header => [header.id, root.variable_header_value?.[header.id] ?? false])),
  //         biaya: root.biaya,
  //         is_repair: root.is_repair
  //     }]))
  // })
  // console.log(rootCauseData, "data root cause");
  //   const dataRootCauses: Map<string, DataRootCause> = new Map(
  //     rootCauseData.map((root) => [root.id, root])
  //   );
  // console.log(dataRootCauses, "data root cause");

  const [checkRootActions, setCheckRootActions] = useState<any>({});

  // console.log(checkRootActions, "check root state");

  useEffect(() => {
    if (dataRootCauseAction.length > 0) {
      const data = Object.fromEntries(
        dataRootCauseAction.map((root) => {
          const stateRootCause = root.actions?.reduce((acc, action) => {
            acc[action.action_id] = {
              biaya: action.biaya,
              isChecked: action.is_checked,
            };
            return acc;
          }, {});

          return [
            root.parent_cause_id,
            {
              updatedRootCauses: stateRootCause,
              parentId: root.parent_cause_id,
            },
          ];
        })
      );

      setCheckRootActions((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
    }
    // console.log(checkRootActions);
  }, [dataRootCauseAction, rootCauseAction, rootCauseActionValidating]);

  //Handler for checkbox changes
  const handleCheckboxChange = ({
    parentId,
    rowId,
    headerId,
    isChecked,
    is_repair = false,
    biaya,
  }: {
    parentId: string;
    rowId: string; // This represents the cause_id for either parent or child
    headerId?: string; // Optional, for child nodes
    isChecked?: boolean; // The checked state of the checkbox
    is_repair?: boolean; // Optional, for the repair status
    biaya?: number;
  }) => {
    setCheckRootActions((prev) => {
      const updatedRootCauses = {
        ...prev[parentId]?.updatedRootCauses,
        // [rowId]: typeof isChecked !== "undefined" ? isChecked : false, // Use headerId for child, rowId for parent
        [rowId]: {
          ...prev[parentId]?.updatedRootCauses[rowId],
          ...(typeof isChecked !== "undefined" ? { isChecked } : {}),
          ...(typeof biaya !== "undefined" ? { biaya } : {}),
        },
      };
      return {
        ...prev,
        [parentId]: {
          ...prev[parentId],
          updatedRootCauses,
          parentId,
        },
      };
    });
  };

  // Handler to log or save the checked values
  const handleSave = async () => {
    // console.log(rootRepairCost);
    // You can save the checkedValues to a backend or local storage here

    //   {
    //     "data_root_causes": [
    //         {
    //             "parent_id": "c81e090a-090f-4508-83f1-424f4195a339",
    //             "root_causes": {
    //                 "c81e090a-090f-4508-83f1-424f4195a339": true,
    //                 "5d71727a-28e8-4232-9a1f-4d4d9bed096c": true,
    //                 "74cd8dff-a469-4c48-8c4f-4fc9534b49fd":true
    //             },
    //             "is_repair":true
    //         }
    //     ]
    // }

    // Create the payload
    const payload = {
      data_actions: Object.values(checkRootActions).reduce(
        (acc: any, value: any) => {
          // Create the root_causes object
          const root_causes = {
            ...value.updatedRootCauses,
          };

          // Check if the parentId is already in the accumulator
          const existingEntry = acc.find(
            (entry) => entry.parent_id === value.parentId
          );
          if (existingEntry) {
            existingEntry.actions = {
              ...existingEntry.root_causes,
              ...root_causes,
            }; // Merge root causes
          } else {
            acc.push({
              parent_id: value.parentId,
              actions: root_causes,
            });
          }

          return acc;
        },
        []
      ),
    };

    // console.log(JSON.stringify(payload, null, 2));
    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/data/${data_id}/root/${selectedModalId.detailId}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save data");
        setLoadingSubmit(false);
      }

      const resData = await response.json();

      toast.success("Data input succesfuly!");
      setCheckRootActions({});
      setLoadingSubmit(false);
      paretoMutate();
    } catch (error) {
      toast.error(`Something wrong: ${error}`);
      setLoadingSubmit(false);
      console.error(error);
    }
  };

  // The modal that shows up when attempting to submit an item
  const ConfirmationModal = (
    <Modal
      isOpen={confirmationModalOpen}
      onOpenChange={setConfirmationModalOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirm Submission</ModalHeader>
            <ModalBody>Are you sure you want to submit this data?</ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                color="danger"
                isLoading={loadingSubmit}
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="success"
                // type="submit" // This submits the form
                isLoading={loadingSubmit}
                onPress={() => {
                  handleSave();
                  // formRef.current?.requestSubmit(); // Programmatically submit the form
                  // onClose(); // Close modal after submission
                }}
              >
                Confirm Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return (
    <>
      {ConfirmationModal}
      <Modal
        isOpen={isOpen}
        size="5xl"
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
      >
        {
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Corrective Action Checkbox
                </ModalHeader>
                <ModalBody>
                  {/* {JSON.stringify(checkRootHeaders)} */}
                  {!isLoading && !rootCauseActionLoading ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Heat Loss Caused</TableHead>
                          {/* Dynamically generated headers */}
                          {/* {variabelHeader.map((header) => (
                          <TableHead key={header.id}>{header.name}</TableHead>
                        ))} */}
                          <TableHead>Corrective Action</TableHead>
                          <TableHead>Cost</TableHead>
                          {/* <TableHead>Need Corrective Action</TableHead> */}
                          {/* <TableHead>Cost</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* <Form {...formInit}>
                                        <form
                                            onSubmit={formInit.handleSubmit(handleSave)}
                                        > */}
                        {variableCauseActions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4">
                              There is no corrective action needed.
                            </TableCell>
                          </TableRow>
                        ) : (
                          variableCauseActions.map((node) => (
                            <TableRootCauseAction
                              key={node.id}
                              parentId={node.id}
                              node={node}
                              level={0}
                              checkRoot={checkRootActions}
                              handleCheckBox={handleCheckboxChange}
                              isAction={false}
                            />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <Spinner label="Loading..." />
                  )}
                  {/* <NextTable
                                aria-label="Root Cause Checkbox"
                                className="h-[360px]"
                            >
                                <TableHeader>
                                    <TableColumn>Heat Loss Caused </TableColumn>
                                    <TableColumn>Kondensor TTD dan ∆ P naik </TableColumn>
                                    <TableColumn>∆ T Kondensor naik</TableColumn>
                                    <TableColumn>High O2 in condensate water</TableColumn>
                                    <TableColumn>Repair</TableColumn>
                                    <TableColumn>Biaya</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {checkboxColumn.map((_, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {[1, 2, 3, 4, 5, 6].map((colIndex) => (
                                                <TableCell key={colIndex} className="text-center">
                                                    {colIndex === 1 ? (
                                                        rowIndex === 0 ? (
                                                            "" // Leave the first cell of the first row empty
                                                        ) : (
                                                            `${_}` // Render a string for other rows in the first column
                                                        )
                                                    ) : colIndex === 6 ? (
                                                        rowIndex != 0 ? (
                                                            <>
                                                                <input className="border bg-neutral-200 py-1 px-1 rounded-md" />
                                                            </>
                                                        ) : (
                                                            `` // Render a string for other rows in the first column
                                                        )
                                                    ) : (
                                                        <>
                                                            <Checkbox
                                                                defaultChecked
                                                                name={`${rowIndex * 5 + colIndex}`}
                                                                className={`${rowIndex === 0 ? "hidden" : ""
                                                                    }`}
                                                            />
                                                            <p
                                                                className={`${rowIndex != 0 ? "hidden" : ""}`}
                                                            >
                                                                {``}
                                                            </p>
                                                        </>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </NextTable> */}
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
                      // handleSave();
                      setConfirmationModalOpen(true);
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
    </>
  );
}

export default ModalRootCause;
