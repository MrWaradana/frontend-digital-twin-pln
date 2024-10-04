"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VariableCause } from "@/lib/APIs/useGetVariableCause";
import { VariableHeader } from "@/lib/APIs/useGetVariableHeaders";
import { DataRootCause } from "@/lib/APIs/useGetDataRootCause";
import { Input } from "../ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";

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
  return !node.children || node.children.length === 0;
};

interface rootCostData {
  is_repair: boolean | undefined;
  biaya: number | undefined;
}

// Recursive component to render each row and its children
const TableRootCause: React.FC<{
  node: VariableCause;
  parentId: any;
  level: number;
  headers: Array<VariableHeader>;
  handleCheckBox: any;
  rootCauseData: Map<string, DataRootCause>;
  checkRoot: any;
}> = ({
  node,
  parentId,
  level,
  headers,
  handleCheckBox,
  rootCauseData,
  checkRoot,
}) => {
  // const [rootCauseDataState, setRootCauseDataState] = React.useState<rootCostData | null>(null);
  const rootData = isLastChild(node)
    ? (rootCauseData.get(node.id) as DataRootCause)
    : null;

  // Convert rootCauseData to a lookup map for efficient access
  // const [headerCheck, setHeaderCheck] = React.useState(
  //   headers.map((header) => {
  //     return {
  //       id: header.id,
  //       name: header.name,
  //       isChecked: rootData?.variable_header_value?.[header.id] ?? false,
  //     };
  //   })
  // );

  // setRootCauseDataState(rootData ? {
  //     is_repair: rootData.is_repair,
  //     biaya: rootData.biaya
  // } : null);
  // State to track whether the row is expanded (to show children)
  const [isExpanded, setIsExpanded] = useState(false);
  const [parentCheckState, setParentCheckState] = useState([]);

  const onCheckedChange = (e: boolean) => {
    // If the checkbox is checked, expand the row to show children
    if (e && node.children && node.children.length > 0) {
      setIsExpanded(true);
    } else if (!e) {
      setIsExpanded(false); // Collapse children if unchecked
    }
  };

  // New function to toggle the expansion state when the parent checkbox is checked/unchecked
  const toggleExpand = (e: any) => {
    setIsExpanded(e);
  };

  return (
    <>
      <TableRow>
        <TableCell className="p-0">
          <div
            style={{ paddingLeft: `${level * 20}px` }}
            className="flex items-center"
          >
            {level > 0 && (
              <span className="mr-2">{isLastChild(node) ? "└─" : "├─"}</span>
            )}
            {node.name}
          </div>
        </TableCell>

        {/* Checkbox Column - Only for non-last child nodes */}
        {!isLastChild(node) && (
          <TableCell className="p-0">
            <Checkbox
              checked={isExpanded && (checkRoot[node.id]?.isChecked ?? false)} // Combine both isExpanded and is_checked
              onCheckedChange={(e) => {
                toggleExpand(e);
                handleCheckBox({
                  parentId: parentId,
                  rowId: node.id,
                  isChecked: e as boolean, // The checkbox state
                });
              }}
            />
          </TableCell>
        )}

        <TableCell className="p-0">
          {isLastChild(node) && (
            <Checkbox
              checked={checkRoot[node.id]?.isChecked ?? false}
              onCheckedChange={(e) => {
                // onCheckedChange(e as boolean);
                handleCheckBox({
                  parentId: parentId,
                  rowId: node.id,
                  isChecked: e as boolean,
                  is_repair: checkRoot[node.id]?.is_repair,
                });
              }}
            />
          )}
        </TableCell>
        <TableCell className="p-0">
          {isLastChild(node) && (
            <Checkbox
              checked={
                checkRoot[node.id] ? checkRoot[node.id].is_repair : false
              }
              onCheckedChange={(e: boolean) => {
                // onCheckedChange(e, header.id);
                handleCheckBox({
                  parentId: parentId,
                  rowId: node.id,
                  isChecked: true,
                  is_repair: e as boolean,
                });
              }}
            />
          )}
        </TableCell>
        {/* <TableCell className="p-0">
          {isLastChild(node) && (
            <Input
              type="number"
              value={checkRoot[node.id]?.biaya || 0}
              onChange={(e) =>
                handleCheckBox({
                  rowId: node.id,
                  biaya: parseInt(e.target.value) || 0,
                })
              }
            />
          )}
        </TableCell> */}
      </TableRow>

      {/* Conditionally render children rows based on isExpanded */}
      {isExpanded &&
        node.children &&
        node.children.length > 0 &&
        node.children.map((child) => (
          <TableRootCause
            key={child.id}
            parentId={parentId}
            node={child}
            level={level + 1}
            headers={headers}
            handleCheckBox={handleCheckBox}
            rootCauseData={rootCauseData}
            checkRoot={checkRoot}
          />
        ))}
    </>
  );
};

export default TableRootCause;
