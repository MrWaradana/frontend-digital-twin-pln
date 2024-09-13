"use client";

import {
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
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
import { useGetVariableHeaders, VariableHeader } from "@/lib/APIs/useGetVariableHeaders";
import PreviousMap from "postcss/lib/previous-map";
import { DataRootCause, useGetDataRootCauses } from "@/lib/APIs/useGetDataRootCause";
import { EFFICIENCY_API_URL } from "@/lib/api-url";
import { set } from "lodash";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";

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
            [headerId: string]: boolean
        }
        biaya: number,
        is_repair: boolean
    }
}

interface rootRepairCost {
    [rowId: string]: {
        is_repair: boolean,
        biaya: number
    }
}


function ModalRootCause({ isOpen, onOpenChange, selectedModalId, data_id }: { isOpen: boolean, onOpenChange: any, selectedModalId: { detailId: string, variableId: string }, data_id: string }) {
    const { data: session } = useSession()

    const { data: rootCause, isLoading: rootCauseLoading, isValidating: rootCauseValidating } = useGetDataRootCauses(
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


    const variableCauses = data ?? []
    const variabelHeader = header ?? []
    const rootCauseData = rootCause ?? []

    // const formInit = useForm({
    //     mode: 'onChange',
    //     defaultValues: Object.fromEntries(rootCauseData.map(root => [root.cause_id, {
    //         header_value: Object.fromEntries(variabelHeader.map(header => [header.id, root.variable_header_value?.[header.id] ?? false])),
    //         biaya: root.biaya,
    //         is_repair: root.is_repair
    //     }]))
    // })

    const dataRootCauses: Map<string, DataRootCause> = new Map(rootCauseData.map(root => [root.cause_id, root]));

    const [checkRootHeaders, setCheckRootHeaders] = useState<rootCheckBox>({});

    useEffect(() => {
        if (rootCauseData.length > 0) {
            const data = Object.fromEntries(rootCauseData.map(root => [root.cause_id, {
                header_value: Object.fromEntries(variabelHeader.map(header => [header.id, root.variable_header_value?.[header.id] ?? false])),
                biaya: root.biaya,
                is_repair: root.is_repair
            }]));

            setCheckRootHeaders(data);
        }
    }, [rootCauseData]);

    // Handler for checkbox changes
    const handleCheckboxChange = ({ rowId, headerId = undefined, isChecked = false, is_repair = false, biaya = 0 }: { rowId: string, headerId: string | undefined, isChecked: boolean, is_repair: boolean, biaya: number }) => {
        setCheckRootHeaders((prev) => {
            return {
                ...prev,
                [rowId]: {
                    ...prev[rowId],
                    header_value: {
                        ...prev[rowId]?.header_value,
                        ...(headerId ? { [headerId]: isChecked ?? prev[rowId].header_value?.[headerId] ?? false } : {})
                    },
                    ...(biaya > 0 ? { biaya } : is_repair ? { is_repair } : {})
                }
            }
        })
    };

    // Handler to log or save the checked values
    const handleSave = async () => {
        // console.log(rootRepairCost);
        // You can save the checkedValues to a backend or local storage here


        const payload = {
            data_root_causes: Object.entries(checkRootHeaders).map(([cause_id, value]) => {
                return {
                    cause_id,
                    is_repair: value.is_repair,
                    biaya: value.biaya,
                    variable_header_value: value.header_value
                }
            })
        }

        try {
            const response = await fetch(`${EFFICIENCY_API_URL}/data/${data_id}/root/${selectedModalId.detailId}?is_bulk=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.access_token}`,
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }

            const resData = await response.json();

            console.log(resData);
            setCheckRootHeaders({});
        }

        catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
            {<ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Root Cause Checkbox
                        </ModalHeader>
                        <ModalBody>
                            {(!isLoading && !rootCauseLoading && !headerLoading) && <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Heat Loss Caused</TableHead>
                                        {/* Dynamically generated headers */}
                                        {variabelHeader.map(header => (
                                            <TableHead key={header.id}>{header.name}</TableHead>
                                        ))}
                                        <TableHead>Repair</TableHead>
                                        <TableHead>Cost</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* <Form {...formInit}>
                                        <form
                                            onSubmit={formInit.handleSubmit(handleSave)}
                                        > */}
                                    {variableCauses.map(node => (
                                        <TableRootCause key={node.id} node={node} headers={variabelHeader} level={0} handleCheckBox={handleCheckboxChange} rootCauseData={dataRootCauses} checkRoot={checkRootHeaders} />
                                    ))}
                                    {/* </form>
                                    </Form> */}
                                </TableBody>
                            </Table>}

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
                            <Button color="success" variant="light" onClick={() => {
                                handleSave()
                                onClose()
                            }}>
                                Submit
                            </Button>
                            <Button color="danger" variant="light" onPress={() => {
                                onClose()
                            }}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
            }
        </Modal >
    );
}

export default ModalRootCause;
