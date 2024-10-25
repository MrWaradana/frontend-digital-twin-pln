"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

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

  const [formData, setFormData] = React.useState({
    name: "",
    category_id: "",
    equipment_tree_id: "",
    system_tag: "",
    assetnum: "",
    location_tag: "",
    parent_id,
  });

  const [errors, setErrors] = React.useState({
    name: "",
    category_id: "",
    equipment_tree_id: "",
    system_tag: "",
    assetnum: "",
    location_tag: "",
  });

  const session = useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name) newErrors.name = "Nama tidak boleh kosong";
    if (!formData.category_id)
      newErrors.category_id = "Kategori tidak boleh kosong";
    if (!formData.equipment_tree_id)
      newErrors.equipment_tree_id = "Equipment Level tidak boleh kosong";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Silakan perbaiki input yang salah");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PFI_APP_URL}/equipments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.access_token}`,
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      if (response.status === 201) {
        toast.success("Equipment berhasil ditambahkan");
        mutate();
        setFormData({
          name: "",
          category_id: "",
          equipment_tree_id: "",
          system_tag: "",
          assetnum: "",
          location_tag: "",
          parent_id,
        });
        setErrors({
          name: "",
          category_id: "",
          equipment_tree_id: "",
          system_tag: "",
          assetnum: "",
          location_tag: "",
        });
        onOpenChange();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
                  <div className="flex flex-row mb-3">
                    <Input
                      type="text"
                      name="name"
                      label="Nama"
                      placeholder="Masukkan nama equipment"
                      labelPlacement="outside"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name}
                    />
                  </div>
                  <div className="flex flex-row mb-3 gap-4">
                    <Select
                      label="Kategori"
                      name="category_id"
                      labelPlacement="outside"
                      placeholder="Pilih kategori"
                      value={formData.category_id}
                      onChange={handleChange}
                      isInvalid={!!errors.category_id}
                      errorMessage={errors.category_id}
                    >
                      {categories.map((ctg: any) => (
                        <SelectItem key={ctg.id} value={ctg.id}>
                          {ctg.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Equipment Level"
                      name="equipment_tree_id"
                      labelPlacement="outside"
                      placeholder="Pilih Equipment Level"
                      value={formData.equipment_tree_id}
                      onChange={handleChange}
                      isInvalid={!!errors.equipment_tree_id}
                      errorMessage={errors.equipment_tree_id}
                    >
                      {eqTrees.map((eq: any) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-row mb-3 gap-4">
                    <Input
                      type="text"
                      name="system_tag"
                      label="System Tag"
                      placeholder="Masukkan System Tag"
                      labelPlacement="outside"
                      value={formData.system_tag}
                      onChange={handleChange}
                      isInvalid={!!errors.system_tag}
                      errorMessage={errors.system_tag}
                    />
                    <Input
                      type="text"
                      name="assetnum"
                      label="Asset Number"
                      placeholder="Masukkan Asset Number"
                      labelPlacement="outside"
                      value={formData.assetnum}
                      onChange={handleChange}
                      isInvalid={!!errors.assetnum}
                      errorMessage={errors.assetnum}
                    />
                  </div>
                  <Input
                    type="text"
                    name="location_tag"
                    label="Location Tag"
                    placeholder="Masukkan Location Tag"
                    labelPlacement="outside"
                    value={formData.location_tag}
                    onChange={handleChange}
                    isInvalid={!!errors.location_tag}
                    errorMessage={errors.location_tag}
                  />
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
