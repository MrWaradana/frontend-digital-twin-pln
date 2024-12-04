"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import TableNewAsset from "@/components/optimum-oh-app/TableNewAsset";
import { useGetAvailableEquipment } from "@/lib/APIs/useGetAvailableEquipment";
import { useState } from "react";

export default function AddNewAssetModal({ filterScope }: any) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
  });

  const { data, isLoading, isValidating, mutate } = useGetAvailableEquipment(
    session?.user.access_token,
    filterScope,
    pagination.pageIndex + 1, // Add 1 since API likely uses 1-based indexing
    pagination.pageSize
  );

  const totalPages = data?.totalPages ?? 0;
  const totalItems = data?.total ?? 0;
  const itemsPerPage = data?.itemsPerPage ?? 10;
  const availableEquipmentData = data?.items ?? [];

  return (
    <>
      <Button
        color="default"
        className={`bg-[#1C9EB6] text-white ${
          session?.user.user.role === "Management" ? "hidden" : ""
        } `}
        onPress={onOpen}
      >
        Add New Asset
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={`5xl`}
        isDismissable={false} // Prevent closing when clicking outside
        hideCloseButton={false} // Keep the close button
        scrollBehavior="inside"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Asset
            </ModalHeader>
            <ModalBody>
              <p>List assets can be added to: Scope {filterScope}</p>
              <div className={`overflow-y-auto`}>
                <TableNewAsset
                  dataTable={availableEquipmentData}
                  isLoading={isLoading}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  pagination={pagination}
                  setPagination={setPagination}
                  mutate={mutate}
                  filterScope={filterScope}
                />
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
