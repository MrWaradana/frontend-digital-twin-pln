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
  DataRootCause,
  useGetDataRootCauses,
} from "@/lib/APIs/useGetDataRootCause";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { set } from "lodash";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import React from "react";

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

function ModalActionPareto({
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
  const { data: session } = useSession();

  const {
    data: rootCause,
    isLoading: rootCauseLoading,
    isValidating: rootCauseValidating,
  } = useGetDataRootCauses(
    session?.user.access_token,
    data_id,
    selectedModalId.detailId,
    isOpen
  );

  const { data, isLoading, isValidating, mutate } = useGetVariableCauses(
    session?.user.access_token,
    selectedModalId.variableId,
    isOpen
  );

  const { data: header, isLoading: headerLoading } = useGetVariableHeaders(
    session?.user.access_token,
    selectedModalId.variableId,
    isOpen
  );

  const variableCauses = data ?? [];
  const variabelHeader = header ?? [];
  const rootCauseData = [];

  // const formInit = useForm({
  //     mode: 'onChange',
  //     defaultValues: Object.fromEntries(rootCauseData.map(root => [root.cause_id, {
  //         header_value: Object.fromEntries(variabelHeader.map(header => [header.id, root.variable_header_value?.[header.id] ?? false])),
  //         biaya: root.biaya,
  //         is_repair: root.is_repair
  //     }]))
  // })

  const dataRootCauses: Map<string, DataRootCause> = new Map(
    rootCauseData.map((root) => [root.cause_id, root])
  );

  const [checkRootHeaders, setCheckRootHeaders] = useState<any>({});

  // useEffect(() => {
  //   if (rootCauseData.length > 0) {
  //     const data = Object.fromEntries(
  //       rootCauseData.map((root) => [
  //         root.cause_id,
  //         {
  //           header_value: Object.fromEntries(
  //             variabelHeader.map((header) => [
  //               header.id,
  //               root.variable_header_value?.[header.id] ?? false,
  //             ])
  //           ),
  //           biaya: root.biaya,
  //           is_repair: root.is_repair,
  //         },
  //       ])
  //     );

  //     setCheckRootHeaders((prev) => {
  //       return {
  //         ...prev,
  //         ...data,
  //       };
  //     });
  //   }
  // }, [rootCauseData, rootCauseValidating]);

  // Handler for checkbox changes
  const handleCheckboxChange = ({
    parentId,
    rowId,
    headerId,
    isChecked,
    is_repair = false,
  }: {
    parentId: string;
    rowId: string; // This represents the cause_id for either parent or child
    headerId?: string; // Optional, for child nodes
    isChecked: boolean; // The checked state of the checkbox
    is_repair?: boolean; // Optional, for the repair status
  }) => {
    setCheckRootHeaders((prev) => {
      const updatedRootCauses = {
        ...prev[rowId]?.root_causes,
        [rowId]: isChecked, // Use headerId for child, rowId for parent
      };

      return {
        ...prev,
        [rowId]: {
          ...prev[rowId],
          updatedRootCauses,
          parentId,
          ...(typeof isChecked !== "undefined" ? { isChecked } : {}), // Set isChekced if provided
          ...(typeof is_repair !== "undefined" ? { is_repair } : {}), // Set is_repair if provided
        },
      };
    });
    console.log(checkRootHeaders, "Check Root State");
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
      data_root_causes: Object.values(checkRootHeaders).reduce(
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
            existingEntry.root_causes = {
              ...existingEntry.root_causes,
              ...root_causes,
            }; // Merge root causes
            existingEntry.is_repair = value.is_repair ? value.is_repair : false;
          } else {
            acc.push({
              parent_id: value.parentId,
              root_causes,
              is_repair: value.is_repair, // Add is_repair flag
            });
          }

          return acc;
        },
        []
      ),
    };

    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(
        `${EFFICIENCY_API_URL}/data/${data_id}/root/${selectedModalId.detailId}?is_bulk=1`,
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
      }

      const resData = await response.json();

      setCheckRootHeaders({});
      paretoMutate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
                Root Cause Checkbox
              </ModalHeader>
              <ModalBody>
                {!isLoading &&
                !rootCauseLoading &&
                !headerLoading &&
                !rootCauseValidating ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Heat Loss Caused</TableHead>
                        {/* Dynamically generated headers */}
                        {variabelHeader.map((header) => (
                          <TableHead key={header.id}>{header.name}</TableHead>
                        ))}
                        <TableHead>Need Repair</TableHead>
                        {/* <TableHead>Cost</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* <Form {...formInit}>
                                        <form
                                            onSubmit={formInit.handleSubmit(handleSave)}
                                        > */}
                      {variableCauses.map((node) => (
                        <TableRootCause
                          key={node.id}
                          parentId={node.id}
                          node={node}
                          headers={variabelHeader}
                          level={0}
                          handleCheckBox={handleCheckboxChange}
                          rootCauseData={dataRootCauses}
                          checkRoot={checkRootHeaders}
                        />
                      ))}
                      {/* </form>
                                    </Form> */}
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
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="light"
                  onClick={() => {
                    handleSave();
                    onClose();
                  }}
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

export default ModalRootCause;
