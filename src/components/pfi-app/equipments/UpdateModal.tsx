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

  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [eqTreeId, setEqTreeId] = React.useState("");
  const [systemTag, setSystemTag] = React.useState("");
  const [assetNum, setAssetNum] = React.useState("");
  const [locationTag, setLocationTag] = React.useState("");
  const [parent_id, setParentId] = React.useState(null);

  const session = useSession();

  useEffect(() => {
    if (selectedData) {
      setId(selectedData.id);
      setName(selectedData.name);
      setCategoryId(selectedData.category.id);
      setEqTreeId(selectedData.equipment_tree.id);
      setSystemTag(selectedData.system_tag);
      setAssetNum(selectedData.assetnum);
      setLocationTag(selectedData.location_tag);
      setParentId(selectedData.parent_id);
    }
  }, [selectedData]);

  const handleSubmit = async (e: React.FormEvent) => {
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
                <div className="flex flex-row mb-3">
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
                </div>
                <div className="flex flex-row mb-3 gap-4">
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
                </div>
                <div className="flex flex-row mb-3 gap-4">
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
