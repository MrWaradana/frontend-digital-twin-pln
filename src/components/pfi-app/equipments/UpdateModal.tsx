import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

const UpdateModal = ({
  categories,
  mutate,
  isOpen,
  handleModal,
  selectedData,
}: {
  categories: any;
  mutate: any;
  isOpen: boolean;
  handleModal: any;
  selectedData: any; // Accepting the selected data
}) => {
  const [loading, setLoading] = React.useState(false);
  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  const session = useSession();

  useEffect(() => {
    if (selectedData) {
      setId(selectedData.id);
      setName(selectedData.name);
      setDescription(selectedData.description);
      setCategoryId(selectedData.category.id);
    }
  }, [selectedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        description,
        category_id: categoryId,
        parent_id: null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PFI_APP_URL}/equipment/` + id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status == 200) {
        toast.success("Equipment berhasil diperbaharui");
        mutate();
        setLoading(false);
        handleModal();
      } else {
        toast.error("Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
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
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Input
                    type="text"
                    label="Name"
                    placeholder="Enter equipment name"
                    labelPlacement="outside"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Select
                    label="Category"
                    labelPlacement="outside"
                    placeholder="Select category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    {categoryId && (
                      <SelectItem key={categoryId} value={categoryId}>
                        {categories.find((ctg: any) => ctg.id === categoryId)
                          ?.name || "Selected Category"}
                      </SelectItem>
                    )}

                    {categories
                      .filter((ctg: any) => ctg.id !== categoryId)
                      .map((ctg: any) => (
                        <SelectItem key={ctg.id} value={ctg.id}>
                          {ctg.name}
                        </SelectItem>
                      ))}
                  </Select>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Textarea
                    label="Description"
                    placeholder="Enter equipment description"
                    labelPlacement="outside"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
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
