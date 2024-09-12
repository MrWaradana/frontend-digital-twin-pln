"use client"

import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VariableCause } from '@/lib/APIs/useGetVariableCause'
import { VariableHeader } from '@/lib/APIs/useGetVariableHeaders'
import { DetailRootCause } from './ModalRootCause'
import { DataRootCause } from '@/lib/APIs/useGetDataRootCause'


// // Define the structure of our tree data
// interface TreeNode {
//     id: string
//     name: string
//     children?: TreeNode[]
// }

// // Sample data
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


// Helper function to check if a node is a last child
const isLastChild = (node: VariableCause): boolean => {
    return !node.children || node.children.length === 0
}

// Recursive component to render each row and its children
const TableRootCause: React.FC<{ node: VariableCause; level: number; headers: Array<VariableHeader>, handleCheckBox: any, rootCauseData: Array<DataRootCause> }> = ({ node, level, headers, handleCheckBox, rootCauseData }) => {
    // Convert rootCauseData to a lookup map for efficient access
    const rootCauseMap = new Map(rootCauseData.map(root => [root.id, root]));

    // Map headers and check if node is the last child
    const headerCheck = headers.map(header => {
        const rootData = isLastChild(node) ? rootCauseMap.get(node.id) : null;

        return {
            id: header.id,
            name: header.name,
            isChecked: rootData ? rootData.variable_header_value[header.id] : false
        };
    });

    return (
        <>
            <TableRow>
                <TableCell>
                    <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center">
                        {level > 0 && (
                            <span className="mr-2">
                                {isLastChild(node) ? "└─" : "├─"}
                            </span>
                        )}
                        {node.name}
                    </div>
                </TableCell>
                {headerCheck.map(header => (
                    <TableCell key={header.id}>{isLastChild(node) && <Checkbox checked={header.isChecked} onCheckedChange={(e) => {
                        handleCheckBox(node.id, header.id, e)
                    }} />}</TableCell>
                ))}
                <TableCell>
                    {isLastChild(node) && <Checkbox />}
                </TableCell>
                <TableCell>
                    {isLastChild(node) && <input></input>}
                </TableCell>
            </TableRow>
            {(node.children && node.children.length > 0) && node.children.map((child, index) => (
                <TableRootCause key={child.id} node={child} level={level + 1} headers={headers} handleCheckBox={handleCheckBox} rootCauseData={rootCauseData} />
            ))}
        </>
    )
}


export default TableRootCause