"use client";

import React, { SetStateAction } from "react";
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
  level: number;
  headers: Array<VariableHeader>;
  handleCheckBox: any;
  rootCauseData: Map<string, DataRootCause>;
  checkRoot: any;
}> = ({ node, level, headers, handleCheckBox, rootCauseData, checkRoot }) => {
  // const [rootCauseDataState, setRootCauseDataState] = React.useState<rootCostData | null>(null);
  const rootData = isLastChild(node)
    ? (rootCauseData.get(node.id) as DataRootCause)
    : null;

  // Convert rootCauseData to a lookup map for efficient access
  const [headerCheck, setHeaderCheck] = React.useState(
    headers.map((header) => {
      return {
        id: header.id,
        name: header.name,
        isChecked: rootData?.variable_header_value?.[header.id] ?? false,
      };
    })
  );

  // setRootCauseDataState(rootData ? {
  //     is_repair: rootData.is_repair,
  //     biaya: rootData.biaya
  // } : null);

  const onCheckedChange = (e: CheckedState, headerId: string) => {
    const newHeaderCheck = headerCheck.map((header) => {
      if (header.id === headerId) {
        header.isChecked = e as boolean;
      }
      return header;
    });
    setHeaderCheck(newHeaderCheck);
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
        {headerCheck.map((header) => (
          <TableCell key={header.id} className="p-0">
            {isLastChild(node) && (
              <Checkbox
                checked={header.isChecked}
                onCheckedChange={(e) => {
                  onCheckedChange(e, header.id);
                  handleCheckBox({
                    rowId: node.id,
                    headerId: header.id,
                    isChecked: e as boolean,
                  });
                }}
              />
            )}
          </TableCell>
        ))}
        <TableCell className="p-0">
          {isLastChild(node) && (
            <Checkbox
              checked={
                checkRoot[node.id] ? checkRoot[node.id].is_repair : false
              }
              onCheckedChange={(e: boolean) => {
                // setRootCauseDataState((prev) => {
                //     return {
                //         is_repair: e,
                //         biaya: prev?.biaya && 0
                //     }
                // });
                handleCheckBox({ rowId: node.id, is_repair: e as boolean });
              }}
            />
          )}
        </TableCell>
        <TableCell className="p-0">
          {isLastChild(node) && (
            <Input
              type="number"
              value={checkRoot[node.id] ? checkRoot[node.id].biaya : 0}
              onChange={(e) => {
                // setRootCauseDataState((prev) => {
                //     return {
                //         is_repair: prev?.is_repair && false,
                //         biaya: e.target.value ? parseInt(e.target.value) : 0
                //     }
                // });
                handleCheckBox({ rowId: node.id, biaya: e.target.value });
              }}
            ></Input>
          )}
        </TableCell>
      </TableRow>
      {node.children &&
        node.children.length > 0 &&
        node.children.map((child, index) => (
          <TableRootCause
            key={child.id}
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
