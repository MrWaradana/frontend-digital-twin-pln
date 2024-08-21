"use client";

import { useState } from "react";
import { ContentLayout } from "../../../containers/ContentLayout";
import { Card, CardBody, User, Button, Link, Input } from "@nextui-org/react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Check } from "lucide-react";

export default function Page() {
  const [valueName, setValueName] = useState("Nama User");
  const [valueEmail, setValueEmail] = useState("Nama User");
  const [valuePosition, setValuePosition] = useState("Role User");
  const [valueRole, setValueRole] = useState("Position User");
  return (
    <ContentLayout title="View Page">
      <Card>
        <CardBody className="relative">
          <div className="md:absolute flex gap-4 top-4 right-4 mb-6">
            <Button
              as={Link}
              startContent={<CheckIcon />}
              href="/admin/view"
              color="primary"
              variant="solid"
            >
              Save
            </Button>
            <Button
              as={Link}
              startContent={<Cross1Icon />}
              href="/admin/view"
              color="danger"
              variant="solid"
            >
              Cancel
            </Button>
          </div>
          <div className="flex flex-col gap-8">
            <Input
              label="Nama"
              placeholder="Your name"
              value={valueName}
              onValueChange={setValueName}
              className="max-w-sm"
            />
            <Input
              label="Email"
              type="email"
              placeholder="Your email"
              value={valueEmail}
              onValueChange={setValueEmail}
              className="max-w-sm"
            />
            <div className="flex flex-col gap-6">
              <p className="flex gap-2 items-center">
                Role:{" "}
                <Input
                  placeholder="Your Role"
                  value={valueRole}
                  onValueChange={setValueRole}
                  className="max-w-sm"
                />
              </p>
              <p className="flex gap-2 items-center">
                Position:{" "}
                <Input
                  placeholder="Your Position"
                  value={valuePosition}
                  onValueChange={setValuePosition}
                  className="max-w-sm"
                />
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </ContentLayout>
  );
}
