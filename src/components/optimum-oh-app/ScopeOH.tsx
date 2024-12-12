"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Selection,
} from "@nextui-org/react";
import { Crosshair } from "lucide-react";
import TableScope from "@/components/optimum-oh-app/TableScope";
import { useState, useMemo, useEffect } from "react";
import { useGetScopeOH } from "@/lib/APIs/useGetScopeOH";
import { useSession } from "next-auth/react";
import { isValid } from "date-fns";
import { useGetAvailableEquipment } from "@/lib/APIs/useGetAvailableEquipment";

export default function ScopeOH() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterParameter, setFilterParameter] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterScope, setFilterScope] = useState("A");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
  });

  const [statusFilter, setStatusFilter] = useState<Selection>(
    // new Set(INITIAL_VISIBLE_STATUS)
    "all"
  );
  const [scopeFilter, setScopeFilter] = useState<Selection>(
    new Set([])
    // "all"
  );

  const scopeValue = useMemo(
    () => Array.from(scopeFilter).join(", ").replaceAll("_", " "),
    [scopeFilter]
  );

  const { data, error, isLoading, isValidating, mutate } = useGetScopeOH(
    session?.user.access_token,
    filterScope,
    page,
    rowsPerPage
  );

  const {
    data: dataAvailableEquipment,
    isLoading: isLoadingAvailableEquipment,
    isValidating: isValidatingAvailableEquipment,
    mutate: mutateAvailableEquipment,
  } = useGetAvailableEquipment(
    session?.user.access_token,
    filterScope,
    pagination.pageIndex + 1, // Add 1 since API likely uses 1-based indexing
    pagination.pageSize
  );

  const availableData = useMemo(() => {
    if (!dataAvailableEquipment) {
      return [];
    }
    return dataAvailableEquipment;
  }, [dataAvailableEquipment]);

  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.total ?? 1;
  const currentPage = data?.page;
  const tableData = data?.items ?? [];

  const allMutate = () => {
    mutate();
    mutateAvailableEquipment();
  };

  useEffect(() => {
    if (data) {
      setPage(data?.page);
    }
  }, [data, page]);

  return (
    <div>
      <Button
        className={`bg-[#1C9EB6] text-white`}
        startContent={<Crosshair />}
        size={"lg"}
        onPress={onOpen}
        isLoading={isLoading}
      >
        Scope OH
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={`5xl`}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Scope OH
              </ModalHeader>
              <ModalBody>
                {isLoadingAvailableEquipment ||
                isValidatingAvailableEquipment ? (
                  "Loading..."
                ) : (
                  <TableScope
                    tableData={tableData}
                    availableEquipmentData={availableData}
                    pagination={pagination}
                    setPagination={setPagination}
                    thermoStatus={false}
                    addNewUrl={`/efficiency-app/input`}
                    isLoading={isLoading}
                    isValidating={isValidating}
                    page={currentPage}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    pages={totalPages}
                    total_items={totalItems}
                    // filterSearch
                    setFilterSearch={setFilterSearch}
                    // filterParameter
                    setFilterParameter={setFilterParameter}
                    // filterStatus
                    setFilterStatus={setFilterStatus}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    scopeFilter={scopeFilter}
                    setScopeFilter={setScopeFilter}
                    filterScope={filterScope}
                    setFilterScope={setFilterScope}
                    mutate={allMutate}
                    isLoadingAvailableEquipment={isLoadingAvailableEquipment}
                    isValidatingAvailableEquipment={
                      isValidatingAvailableEquipment
                    }
                  />
                )}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
