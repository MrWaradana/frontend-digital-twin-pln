import { ContentLayout } from "../../../containers/ContentLayout";
import { Card, CardBody, User, Button, Link } from "@nextui-org/react";
import { Pencil2Icon } from "@radix-ui/react-icons";

export default function Page() {
  return (
    <ContentLayout title="View Page">
      <Card>
        <CardBody className="relative">
          <div className="absolute  top-4 right-4">
            <Button
              as={Link}
              startContent={<Pencil2Icon />}
              href="/admin/edit"
              color="primary"
              variant="solid"
            >
              Edit
            </Button>
          </div>
          <div className="flex flex-col gap-8">
            <p className="font-bold text-4xl">Nama User</p>
            <div>
              <p>Role: Role User</p>
              <p>Position: Position User</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </ContentLayout>
  );
}
