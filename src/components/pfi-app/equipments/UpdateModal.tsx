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
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const UpdateModal = ({
  categories,
  eqTrees,
  mutate,
  isOpen,
  handleModal,
  selectedData,
}: {
  categories: any;
  eqTrees: any;
  mutate: any;
  isOpen: boolean;
  handleModal: any;
  selectedData: any; // Accepting the selected data
}) => {
  const [loading, setLoading] = React.useState(false);
  const [id, setId] = React.useState<string>("");

  const [formData, setFormData] = React.useState({
    name: "",
    category_id: "",
    equipment_tree_id: "",
    system_tag: "",
    assetnum: "",
    location_tag: "",
    parent_id: "",
  });

  const [errors, setErrors] = React.useState({
    name: "",
    category_id: "",
    equipment_tree_id: "",
  });

  const { data: session } = useSession();

  useEffect(() => {
    if (selectedData) {
      setId(selectedData.id);
      setFormData({
        name: selectedData.name,
        category_id: selectedData.category.id,
        equipment_tree_id: selectedData.equipment_tree.id,
        system_tag: selectedData.system_tag,
        assetnum: selectedData.assetnum,
        location_tag: selectedData.location_tag,
        parent_id: selectedData.parent_id,
      });
    }
  }, [selectedData]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Silakan perbaiki input yang salah");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PFI_APP_URL}/equipment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Equipment berhasil diperbaharui");
        mutate();
        handleModal();
      } else {
        toast.error("Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error("Terjadi kesalahan saat memperbarui data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      <Modal isOpen={isOpen} onOpenChange={handleModal} size="xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Update Equipment
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
                    placeholder={selectedData.category.name}
                    value={formData.category_id}
                    onChange={handleChange}
                    isInvalid={!!errors.category_id}
                    errorMessage={errors.category_id}
                  >
                    {categories.map((ctg) => (
                      <SelectItem key={ctg.id} value={ctg.id}>
                        {ctg.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Equipment Level"
                    name="equipment_tree_id"
                    labelPlacement="outside"
                    placeholder={selectedData.equipment_tree.name}
                    value={formData.equipment_tree_id}
                    onChange={handleChange}
                    isInvalid={!!errors.equipment_tree_id}
                    errorMessage={errors.equipment_tree_id}
                  >
                    {eqTrees.map((eq) => (
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
                  />
                  <Input
                    type="text"
                    name="assetnum"
                    label="Asset Number"
                    placeholder="Masukkan Asset Number"
                    labelPlacement="outside"
                    value={formData.assetnum}
                    onChange={handleChange}
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
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-4 h-4 border-2 border-t-2 border-white-800 rounded-full animate-spin me-2" />
                      Loading ...
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModal;
