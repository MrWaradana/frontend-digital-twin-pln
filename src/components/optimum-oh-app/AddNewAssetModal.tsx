"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import TableNewAsset from "@/components/optimum-oh-app/TableNewAsset";
import { useGetAvailableEquipment } from "@/lib/APIs/useGetAvailableEquipment";
import { useMemo, useState } from "react";

export default function AddNewAssetModal({
  availableEquipmentData,
  filterScope,
  pagination,
  setPagination,
  mutateScopeEquipment,
}: any) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const totalPages = availableEquipmentData?.totalPages ?? 0;
  const totalItems = availableEquipmentData?.total ?? 0;
  const itemsPerPage = availableEquipmentData?.itemsPerPage ?? 10;
  const availableData = availableEquipmentData?.items ?? [];

  return (
    <>
      <Button
        color="default"
        className={`bg-[#1C9EB6] text-white ${
          session?.user.user.role === "Management" ? "hidden" : ""
        } `}
        onPress={() => {
          // mutateScopeEquipment();
          onOpen();
        }}
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
                  dataTable={availableData}
                  isLoading={false}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  pagination={pagination}
                  setPagination={setPagination}
                  mutateScopeEquipment={mutateScopeEquipment}
                  filterScope={filterScope}
                  onOpenChange={onOpenChange}
                  isOpen={isOpen}
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
