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
import {
  VariableCause,
  VariableCauseAction,
} from "@/lib/APIs/useGetVariableCause";
import { VariableHeader } from "@/lib/APIs/useGetVariableHeaders";
import { DataRootCause } from "@/lib/APIs/useGetDataRootCause";
// import { Input } from "../ui/input";
import { Input, Textarea } from "@nextui-org/react";
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

const formatNumber = (num: number | string) => {
  // Convert the input number to a string to avoid rounding off decimals
  const parts = num.toString().split("."); // Use '.' to handle decimals correctly
  const integerPart = new Intl.NumberFormat("id-ID").format(Number(parts[0]));

  // Return the formatted number with a decimal part if present
  return parts.length > 1 ? `${integerPart},${parts[1]}` : integerPart;
};

const unformatNumber = (formattedValue: string) => {
  // Remove thousands separators (commas) and replace decimal commas with periods
  return formattedValue.replace(/\./g, "").replace(",", ".");
};
// Recursive component to render each row and its children
const TableRootCause: React.FC<{
  node: any;
  level: number;
  checkRoot: any;
  parentId: any;
  isAction: boolean;
  handleCheckBox: any;
}> = ({ node, level, checkRoot, parentId, isAction, handleCheckBox }) => {
  // const [rootCauseDataState, setRootCauseDataState] = React.useState<rootCostData | null>(null);
  // const rootData = isLastChild(node) ? rootCauseData.get(node.id) as DataRootCause : null;

  if (isAction) level += 1;

  return (
    <>
      <TableRow>
        <TableCell>
          <div
            style={{ paddingLeft: `${level * 20}px` }}
            className="flex items-center"
          >
            {level > 0 && (
              <span className="mr-2">{isAction ? "└─" : "├─"}</span>
            )}
            {node.name}
          </div>
        </TableCell>
        <TableCell className="p-0">
          {isAction && (
            <Checkbox
              checked={
                checkRoot[parentId]?.updatedRootCauses[node.id]?.isChecked ??
                false
              }
              onCheckedChange={(e) => {
                // onCheckedChange(e as boolean);
                handleCheckBox({
                  parentId: parentId,
                  rowId: node.id,
                  isChecked: e as boolean,
                });
              }}
            />
          )}
        </TableCell>

        <TableCell className="p-3">
          {isAction && (
            <Textarea
              type="text"
              placeholder="add action notes..."
              disableAutosize
              value={
                checkRoot[parentId]?.updatedRootCauses[node.id]?.notes
                  ? checkRoot[parentId]?.updatedRootCauses[node.id]?.notes
                  : ""
              }
              onChange={(e) => {
                handleCheckBox({
                  parentId: parentId,
                  rowId: node.id,
                  notes: e.target.value,
                });
              }}
            />
          )}
        </TableCell>
        <TableCell className="p-0">
          {isAction && (
            <Input
              type="text"
              startContent={`Rp.`}
              value={
                checkRoot[parentId]?.updatedRootCauses[node.id]?.biaya
                  ? formatNumber(
                      checkRoot[parentId]?.updatedRootCauses[node.id]?.biaya
                    )
                  : "0"
              }
              onChange={(e) => {
                const unformattedValue = unformatNumber(e.target.value);
                handleCheckBox({
                  parentId: parentId,
                  rowId: node.id,
                  biaya: parseInt(unformattedValue) || 0,
                });
              }}
            />
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
            checkRoot={checkRoot}
            handleCheckBox={handleCheckBox}
            parentId={parentId}
            isAction={false}
          />
        ))}
      {node.actions &&
        node.actions.length > 0 &&
        node.actions.map((child, index) => (
          <TableRootCause
            key={child.id}
            node={child}
            level={level}
            checkRoot={checkRoot}
            handleCheckBox={handleCheckBox}
            parentId={parentId}
            isAction={true}
          />
        ))}
    </>
  );
};

export default TableRootCause;
