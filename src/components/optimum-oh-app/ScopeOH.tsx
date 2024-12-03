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

export default function ScopeOH() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterParameter, setFilterParameter] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterScope, setFilterScope] = useState("A");
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
    scopeValue,
    page,
    rowsPerPage
  );

  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.total ?? 1;
  const currentPage = data?.page;
  const tableData = data?.items ?? [];

  useEffect(() => {
    if (data) {
      setPage(data?.page);
    }
  }, [data]);

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
                <TableScope
                  tableData={tableData}
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
                  mutate={mutate}
                />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
