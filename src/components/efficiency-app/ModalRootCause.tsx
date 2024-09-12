'use client'

import {
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableRootCause from "./TableRootCause";
import { useGetVariableCauses } from "@/lib/APIs/useGetVariableCause";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useGetVariableHeaders } from "@/lib/APIs/useGetVariableHeaders";
import PreviousMap from "postcss/lib/previous-map";

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
        [headerId: string]: boolean
    }
}

const dummyRootCauses: Array<DetailRootCause> = [{
    id: "12345",
    is_repair: false,
    biaya: 10000,
    cause_id: "dsadqdwwwqdwq",
    variable_header_value: {
        ddasfassa: true
    }
}]

export interface DetailRootCause {
    id: string,
    cause_id: string,
    is_repair: boolean,
    biaya: number,
    variable_header_value: {
        [headerId: string]: boolean
    }
}



function ModalRootCause({ isOpen, onOpenChange, selectedModalId }: { isOpen: boolean, onOpenChange: any, selectedModalId: { detailId: string, variableId: string } }) {
    const { data: session } = useSession()
    const [checkRootHeaders, setCheckRootHeaders] = useState<rootCheckBox>({})
    const [rootCauseData, setRootCauseData] = useState<Array<DetailRootCause>>(dummyRootCauses)

    console.log(checkRootHeaders)

    const {
        data,
        isLoading,
        isValidating,
        mutate
    } = useGetVariableCauses(session?.user.access_token, selectedModalId.variableId, isOpen)

    const {
        data: header,
        isLoading: headerLoading,
    } = useGetVariableHeaders(session?.user.access_token, selectedModalId.variableId, isOpen)

    const variableCauses = data ?? []
    const variabelHeader = header ?? []

    // Handler for checkbox changes
    const handleCheckboxChange = (rowId: string, headerId: string, isChecked: boolean) => {
        setCheckRootHeaders(prevState => ({
            ...prevState,
            [rowId]: {
                ...prevState[rowId],
                [headerId]: isChecked
            }
        }));
    };

    // Handler to log or save the checked values
    const handleSave = () => {
        console.log(checkRootHeaders);
        // You can save the checkedValues to a backend or local storage here
    };

    return (
        <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Root Cause Checkbox
                        </ModalHeader>
                        <ModalBody>
                            {<Table>
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
                                    {variableCauses.map(node => (
                                        <TableRootCause key={node.id} node={node} headers={variabelHeader} level={0} handleCheckBox={handleCheckboxChange} rootCauseData={rootCauseData} />
                                    ))}
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
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal >
    );
}

export default ModalRootCause;
