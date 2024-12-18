'use client';

import { Box, Text } from '@mantine/core';
import { MRT_ColumnDef } from 'mantine-react-table';


export interface ActivitiyColumn {
    id: string
    name: string,
    assetnum: string,
    cost: number
}

interface GetActivitiesProps { }

export function getColumns(props: GetActivitiesProps): MRT_ColumnDef<ActivitiyColumn>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            size: 300,
            Cell: ({ row }) => (
                <Box>
                    <Text className="whitespace-pre-wrap break-words">
                        {row.original.name}
                    </Text>
                </Box>
            ),
        },
        {
            accessorKey: "Cost",
            header: "Cost",
            size: 300,
            Cell: ({ row }) => (
                <Box>
                    <Text className={`whitespace-pre-wrap break-words`}>
                        {row.original.cost}
                    </Text>
                </Box>
            ),
        },
    ]
    //     {
    //         accessorKey: "name",
    //         header: "Name",
    //         size: 300,
    //         Cell: ({ row }) => (
    //             <Box>
    //                 <Text className="whitespace-pre-wrap break-words">
    //                     {row.original.name}
    //                 </Text>
    //             </Box>
    //         ),
    //     },
    //     {
    //         accessorKey: 'id',
    //         header: ({ column }) => (
    //             <DataTableColumnHeader column={column} title="Job Id" />
    //         ),
    //         cell: ({ row }) => {
    //             return (
    //                 <div>
    //                     <NextLink
    //                         className="hover:underline"
    //                         href={`/dashboard/${accountName}/jobs/${row.getValue('id')}`}
    //                     >
    //                         <span>{row.getValue('id')}</span>
    //                     </NextLink>
    //                 </div>
    //             );
    //         },
    //         enableSorting: false,
    //         enableHiding: false,
    //     },
    //     {
    //         accessorKey: 'name',
    //         header: ({ column }) => (
    //             <DataTableColumnHeader column={column} title="Name" />
    //         ),
    //         cell: ({ row }) => {
    //             return (
    //                 <div className="flex space-x-2">
    //                     <span className="max-w-[500px] truncate font-medium">
    //                         <div>
    //                             <NextLink
    //                                 className="hover:underline"
    //                                 href={`/dashboard/${accountName}/jobs/${row.getValue('id')}`}
    //                             >
    //                                 {row.getValue('name')}
    //                             </NextLink>
    //                         </div>
    //                     </span>
    //                 </div>
    //             );
    //         },
    //     },
    //     {
    //         accessorKey: 'type',
    //         header: ({ column }) => (
    //             <DataTableColumnHeader column={column} title="Type" />
    //         ),
    //         cell: ({ row }) => {
    //             return (
    //                 <div className="flex space-x-2">
    //                     <span className="max-w-[500px] truncate font-medium">
    //                         <Badge variant="outline">{row.getValue('type')}</Badge>
    //                     </span>
    //                 </div>
    //             );
    //         },
    //     },
    //     {
    //         accessorKey: 'createdAt',
    //         header: ({ column }) => (
    //             <DataTableColumnHeader column={column} title="Created At" />
    //         ),
    //         cell: ({ row }) => {
    //             return (
    //                 <div className="flex space-x-2">
    //                     <span className="max-w-[500px] truncate font-medium">
    //                         {row.getValue('createdAt')}
    //                     </span>
    //                 </div>
    //             );
    //         },
    //         filterFn: (row, id, value) => {
    //             return value.includes(row.getValue(id));
    //         },
    //     },
    //     {
    //         accessorKey: 'updatedAt',
    //         header: ({ column }) => (
    //             <DataTableColumnHeader column={column} title="Updated At" />
    //         ),
    //         cell: ({ row }) => {
    //             return (
    //                 <div className="flex space-x-2">
    //                     <span className="max-w-[500px] truncate font-medium">
    //                         {row.getValue('updatedAt')}
    //                     </span>
    //                 </div>
    //             );
    //         },
    //         filterFn: (row, id, value) => {
    //             return value.includes(row.getValue(id));
    //         },
    //     },
    //     {
    //         id: 'actions',
    //         cell: ({ row }) => (
    //             <DataTableRowActions row={row} onDeleted={() => onDeleted(row.id)} />
    //         ),
    //     },
    // ];
}