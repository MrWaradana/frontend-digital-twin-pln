"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Spinner,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ContentLayout } from "@/containers/ContentLayout";
import { useGetRoles } from "@/lib/APIs/useGetRoles";
import { useSession } from "next-auth/react";
import { AUTH_API_URL } from "@/lib/api-url";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import { useGetUser } from "@/lib/APIs/useGetUser";

export default function Page({ params }: { params: { userId: string } }) {
  const formRef = useRef<HTMLFormElement>(null);
  const route = useRouter();
  const { data: session } = useSession();

  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);

  const [loading, setLoading] = useState(false);

  const { data, isLoading, isValidating, error, mutate } = useGetRoles(
    session?.user.access_token
  );

  const {
    data: dataUser,
    error: userError,
    mutate: userMutate,
    isValidating: userValidating,
    isLoading: userLoading,
  } = useGetUser(session?.user.access_token, params.userId);

  const userData: any = dataUser ?? [];
  const roleData = data?.roles ?? [];

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    // password: ,
    // position: "position",
    role_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    try {
      const response = await fetch(`${AUTH_API_URL}/users/${params.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("User registered successfully");
        setIsLoadingSubmit(false);
        toast.success("User registered successfully");
        setTimeout(() => {
          route.push("/admin/users");
        }, 1000);
        // Reset form or redirect user
      } else {
        console.error("Registration failed");
        setIsLoadingSubmit(false);
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(`Error during registration: ${error}`);
      setIsLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || "",
        role_id: userData.role_id || "",
      });
    }
  }, [userData]);

  // const selectedUserData = userData.filter((item) => item.id === params.userId);

  const ConfirmationModal = (
    <Modal
      isOpen={confirmationModalOpen}
      onOpenChange={setConfirmationModalOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirm Submission</ModalHeader>
            <ModalBody>Are you sure you want to submit this data?</ModalBody>
            <ModalFooter>
              <Button variant="light" color="danger" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="success"
                // type="submit" // This submits the form
                isLoading={loading}
                onPress={() => {
                  formRef.current?.requestSubmit(); // Programmatically submit the form
                  onClose(); // Close modal after submission
                }}
              >
                Confirm Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  if (isLoading || isValidating || userLoading || userValidating) {
    return (
      <ContentLayout title={`Edit User data`}>
        <div className="min-w-full flex justify-center items-center">
          <Spinner label={`Loading...`} />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={`Edit ${userData.name} data`}>
      {ConfirmationModal}
      {/* {JSON.stringify(userData)} */}
      <form
        onSubmit={handleSave}
        className="space-y-4 max-w-md mx-auto"
        //@ts-ignore
        ref={formRef}
      >
        <Input
          label="Name"
          name="name"
          //@ts-ignore
          value={formData.name}
          // defaultValue={userData?.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          //@ts-ignore
          // defaultValue={userData?.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
        <Input
          label="Username"
          name="username"
          value={formData.username}
          //@ts-ignore
          // defaultValue={userData?.username}
          onChange={handleInputChange}
          placeholder="Choose a username"
        />
        <Select
          label="Role"
          placeholder="Select a role"
          name="role_id"
          //@ts-ignore
          selectedKeys={[formData.role_id]}
          onChange={(e) =>
            handleInputChange({
              target: { name: "role_id", value: e.target.value },
            })
          }
        >
          {roleData.map((item, index) => {
            return (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            );
          })}
        </Select>
        <div className="flex justify-between">
          <Button
            as={Link}
            href="/admin/users"
            color="secondary"
            isLoading={isLoadingSubmit}
          >
            Back to all users
          </Button>
          <Button
            type="button"
            onClick={() => {
              setConfirmationModalOpen(true); // Open modal to confirm submission
            }}
            color="primary"
            isLoading={isLoadingSubmit}
          >
            Submit
          </Button>
        </div>
      </form>
    </ContentLayout>
  );
}
