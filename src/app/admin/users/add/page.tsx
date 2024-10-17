"use client";

import React, { useState } from "react";
import { Input, Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ContentLayout } from "@/containers/ContentLayout";
import { useGetRoles } from "@/lib/APIs/useGetRoles";
import { useSession } from "next-auth/react";
import { AUTH_API_URL } from "../../../../lib/api-url";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";

export default function Page() {
  const route = useRouter();
  const { data: session } = useSession();
  const { data, isLoading, isValidating, error, mutate } = useGetRoles(
    session?.user.access_token
  );

  const roleData = data?.roles ?? [];

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    position: "position",
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
      const response = await fetch(`${AUTH_API_URL}/users`, {
        method: "POST",
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

  if (isLoading || isValidating) {
    return (
      <ContentLayout title="Add New User">
        <div className="min-w-full flex justify-center items-center">
          <Spinner label={`Loading...`} />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Add New User">
      <form onSubmit={handleSave} className="space-y-4 max-w-md mx-auto">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Choose a username"
        />
        {/* <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
        /> */}

        <Input
          label="Password"
          variant="bordered"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeClosedIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        {/* <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          placeholder="Enter your position"
        /> */}
        <Select
          label="Role"
          placeholder="Select a role"
          name="role_id"
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
        <Button type="submit" color="primary" isLoading={isLoadingSubmit}>
          Register
        </Button>
      </form>
    </ContentLayout>
  );
}
