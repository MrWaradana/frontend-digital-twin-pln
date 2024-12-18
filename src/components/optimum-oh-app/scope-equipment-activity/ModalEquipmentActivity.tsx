"use client";

import { useGetEquipmentActivities } from "@/lib/APIs/UseGetEquipmentActivities";
import {
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
    useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { ActivitiyColumn, getColumns } from "./table/column";
import { MantineTable } from "./table/mantine-table";
import { MRT_ColumnDef } from "mantine-react-table";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import { usePostNewEquipmentActivity } from "@/lib/APIs/mutation/usePostNewEquipmentActivity";


interface ModalEquipmentActivityProps {
    isOpen: boolean,
    onOpenChange: any
    selectedRowId: string
}


export default function ModalEquipmentActivity(props: ModalEquipmentActivityProps) {
    const { isOpen, onOpenChange, selectedRowId } = props
    const { data: session } = useSession();
    const [pagination, setPagination] = useState({
        page: 1,
        itemsPerPage: 5,
        totalPages: 1
    })

    const { isLoading, data, mutate } = useGetEquipmentActivities(session?.user.access_token, selectedRowId, pagination.page, pagination.itemsPerPage);

    const columns = useMemo<MRT_ColumnDef<ActivitiyColumn>[]>(
        () =>
            getColumns({}),
        [mutate]
    );

    const activities = data?.items ?? []

    useEffect(() => {
        if (!data) return

        setPagination({
            page: data.page,
            itemsPerPage: data.itemsPerPage,
            totalPages: data.totalPages
        })
    }, [data])


    return (
        <>
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
                                    Scope Equipment Activity
                                </ModalHeader>
                                <ModalBody>
                                    {
                                        isLoading ? <SkeletonTable /> : (
                                            <>
                                                <p>List activities from assetnum : {selectedRowId}</p>
                                                <MantineTable columns={columns} data={activities} assetnum={selectedRowId} tableMutate={mutate}/>
                                            </>

                                        )
                                    }
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="primary"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Close
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

