"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { PlusIcon } from "@radix-ui/react-icons";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

const CreateModal = ({
  categories,
  eqTrees,
  mutate,
  parent_id,
}: {
  categories: any;
  eqTrees: any;
  mutate: any;
  parent_id?: string | null;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [eqTreeId, setEqTreeId] = React.useState("");
  const [systemTag, setSystemTag] = React.useState("");
  const [assetNum, setAssetNum] = React.useState("");
  const [locationTag, setLocationTag] = React.useState("");

  const session = useSession();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        category_id: categoryId,
        parent_id: parent_id,
        equipment_tree_id: eqTreeId,
        system_tag: systemTag,
        assetnum: assetNum,
        location_tag: locationTag,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PFI_APP_URL}/equipments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.status === 201) {
        toast.success("Equipment berhasil ditambahkan");
        mutate();

        setName("");
        setCategoryId("");
        setEqTreeId("");
        setSystemTag("");
        setAssetNum("");
        setLocationTag("");
        onOpenChange();
        setLoading(false);
      } else {
        toast.error("Terjadi kesalahan");
      }

      // API request here
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <>
      <Toaster />

      <Button onPress={onOpen} color="primary" startContent={<PlusIcon />}>
        Add New
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={submitHandler}>
                <ModalHeader className="flex flex-col gap-1">
                  Tambah Equipment
                </ModalHeader>
                <ModalBody>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      type="text"
                      label="Nama"
                      placeholder="Masukkan nama equipment"
                      labelPlacement="outside"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                      label="Kategori"
                      labelPlacement="outside"
                      placeholder="Pilih kategori"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((ctg: any) => (
                        <SelectItem key={ctg.id} value={ctg.id}>
                          {ctg.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                      label="Equipment Level"
                      labelPlacement="outside"
                      placeholder="Pilih Equipment Level"
                      value={eqTreeId}
                      onChange={(e) => setEqTreeId(e.target.value)}
                    >
                      {eqTrees.map((eq: any) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      type="text"
                      label="System Tag"
                      placeholder="Masukkan System Tag"
                      labelPlacement="outside"
                      value={systemTag}
                      onChange={(e) => setSystemTag(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      type="text"
                      label="Asset Number"
                      placeholder="Masukkan Asset Number"
                      labelPlacement="outside"
                      value={assetNum}
                      onChange={(e) => setAssetNum(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      type="text"
                      label="Location Tag" // Corrected label here
                      placeholder="Masukkan Location Tag"
                      labelPlacement="outside"
                      value={locationTag}
                      onChange={(e) => setLocationTag(e.target.value)}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Batal
                  </Button>
                  <Button color="primary" type="submit">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="w-4 h-4 border-2 border-t-2 border-white-800 rounded-full animate-spin me-2" />
                        Loading ...
                      </div>
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateModal;
