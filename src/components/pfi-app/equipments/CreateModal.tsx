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
  mutate,
  parent_id,
}: {
  categories: any;
  mutate: any;
  parent_id?: string | null;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  const session = useSession();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        description,
        category_id: categoryId,
        parent_id: parent_id,
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
        setDescription("");
        setCategoryId("");
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
                    <Textarea
                      label="Deskripsi"
                      placeholder="Masukkan deskripsi equipment"
                      labelPlacement="outside"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
