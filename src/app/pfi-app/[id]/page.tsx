"use client";

import { PFIContentLayout } from "@/containers/PFIContentLayout";
import boiler from "../../../../public/boiler-system.png";
import Image from "next/image";
import TableShow from "@/components/pfi-app/TableShow";
import { Button, Link } from "@nextui-org/react";
import router from "next/router";
import { ChevronLeftIcon } from "lucide-react";

export default function Page() {
  const systems = [
    {
      id: 1,
      name: "Kanan",
      equipment_tree: {
        id: 1,
        name: "Tree 1",
      },
      asset_number: "123456",
      location_tag: "Location 1",
      system_tag: "System 1",
      category: {
        id: 1,
        name: "Category 1",
      },
    },
    {
      id: 2,
      name: "Kiri",
      equipment_tree: {
        id: 2,
        name: "Tree 2",
      },
      asset_number: "123457",
      location_tag: "Location 2",
      system_tag: "System 2",
      category: {
        id: 2,
        name: "Category 2",
      },
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Category 1",
    },
    {
      id: 2,
      name: "Category 2",
    },
  ];

  const eqTrees = [
    {
      id: 1,
      name: "Tree 1",
    },
    {
      id: 2,
      name: "Tree 2",
    },
  ];

  const isValidating = false;
  const mutate = () => {};

  return (
    <PFIContentLayout title="Intelligent P-F Interval Equipments">
      <div className="w-full text-left">
        <Button
          as={Link}
          onPress={() => router.back()}
          color="primary"
          size="sm"
          className="mb-10"
        >
          <ChevronLeftIcon size={12} />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-800">Equipment Lists</h1>
        <p className="text-sm text-gray-600 mt-2">
          Manage your equipment efficiently by viewing the list below.
        </p>
      </div>

      <div className="flex flex-row items-center justify-center mt-24">
        {/* Content */}
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          <div className="container items-center justify-center text-left">
            <h3 className="text-black-500 mb-5">Overall Observation</h3>

            <Image src={boiler} alt="Boiler system" className="text-center" />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          {/* Table disini */}
          <TableShow
            dataRow={systems}
            categories={categories}
            eqTrees={eqTrees}
            mutate={mutate}
            isValidating={isValidating}
            parent_id={null}
          />
        </div>
      </div>
    </PFIContentLayout>
  );
}
