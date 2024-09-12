"use client"

import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


// Define the structure of our tree data
interface TreeNode {
    id: string
    name: string
    children?: TreeNode[]
}

// Sample data
const treeData: TreeNode[] = [
    {
        id: '1',
        name: 'Root 1',
        children: [
            {
                id: '1.1',
                name: 'Child 1.1',
                children: [
                    { id: '1.1.1', name: 'Grandchild 1.1.1' },
                    { id: '1.1.2', name: 'Grandchild 1.1.2' }
                ]
            },
            { id: '1.2', name: 'Child 1.2' }
        ]
    },
    {
        id: '2',
        name: 'Root 2',
        children: [
            { id: '2.1', name: 'Child 2.1' },
            {
                id: '2.2',
                name: 'Child 2.2',
                children: [
                    { id: '2.2.1', name: 'Grandchild 2.2.1' }
                ]
            }
        ]
    }
]


// Helper function to check if a node is a last child
const isLastChild = (node: TreeNode): boolean => {
    return !node.children || node.children.length === 0
}

// Recursive component to render each row and its children
const TableRootCause: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
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
                <TableCell>
                    {isLastChild(node) && <Checkbox />}
                </TableCell>
            </TableRow>
            {(node.children && node.children.length > 0) && node.children.map((child, index) => (
                <TableRootCause key={child.id} node={child} level={level + 1} />
            ))}
        </>
    )
}


export default TableRootCause