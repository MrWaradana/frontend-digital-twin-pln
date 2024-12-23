"use client";

import OverviewContainer from "@/components/containers/OverviewContainer";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import { ContentLayout } from "@/containers/ContentLayout";
import { useGetDataEquipmentTree } from "@/lib/APIs/lcca-app/useGetDataEquipmentTree";
import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Tree, TreeHeaderTemplateOptions } from "primereact/tree";
import { useEffect, useMemo, useState } from "react";
import HeaderCard from "@/components/lcca-app/HeaderCard";
import { formatTextToUrl } from "@/lib/format-text";
import { useGetDataEquipmentById } from "@/lib/APIs/lcca-app/useGetDataEquipmentById";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Page() {
  return (
    <OverviewContainer
      containerClassName="main-container"
      navbarTitle="Life Cycle Cost Analysis"
    >
      <div className="flex justify-between">
        <div className="bg-white dark:bg-neutral-800 w-full px-8 py-7 shadow-lg rounded-lg">
          <h1 className="font-bold text-2xl dark:text-white">TJB UNIT 3</h1>
          <div className={`flex flex-row gap-3 my-3`}>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Nilai Aset Awal</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black pl-3">
                  <h2 className="text-5xl font-bold">5.95</h2>
                  <small className={`text-xs text-neutral-400`}>Triliun</small>
                </div>
              </div>
            </HeaderCard>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Masa Manfaat</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black  pl-3">
                  <h2 className="text-5xl font-bold">30</h2>
                  <small className={`text-xs text-neutral-400`}>Tahun</small>
                </div>
              </div>
            </HeaderCard>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white dark:bg-black h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Tahun COD</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black  pl-3">
                  <h2 className="text-5xl font-bold">2013</h2>
                  <small className={`text-xs text-neutral-400`}>Tahun</small>
                </div>
              </div>
            </HeaderCard>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white dark:bg-black h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Daya Mampu (Netto)</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black  pl-3">
                  <h2 className="text-5xl font-bold">615</h2>
                  <small className={`text-xs text-neutral-400`}>MW</small>
                </div>
              </div>
            </HeaderCard>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white dark:bg-black h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Daya Terpasang</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black  pl-3">
                  <h2 className="text-5xl font-bold">660</h2>
                  <small className={`text-xs text-neutral-400`}>MW</small>
                </div>
              </div>
            </HeaderCard>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white dark:bg-black h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Sisa Masa Manfaat</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black  pl-3">
                  <h2 className="text-5xl font-bold">19</h2>
                  <small className={`text-xs text-neutral-400`}>Tahun</small>
                </div>
              </div>
            </HeaderCard>
            <HeaderCard>
              {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white dark:bg-black h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
              <p className="text-sm font-semibold">Revenue</p>
              <div
                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
              >
                <div className="bg-white dark:bg-black  pl-3">
                  <h2 className="text-5xl font-bold">10</h2>
                  <small className={`text-xs text-neutral-400`}>Tahun</small>
                </div>
              </div>
            </HeaderCard>
          </div>
          <TreeExample />
          {/* <EchartExample /> */}
        </div>
      </div>
    </OverviewContainer>
  );
}

interface TreeExample {}

function TreeExample(props: TreeExample) {
  const [nodes, setNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({ "0": true, "0-0": true });

  const { data: session } = useSession();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading } = useGetDataEquipmentTree(
    session?.user.access_token,
    page,
    "fcc04e6d-6836-4a28-b567-4a0f0d3a6116"
  );

  function customHeader({
    filterContainerClassName,
    filterIconClasssName,
    filterInput,
    filterElement,
    element,
    props,
  }: TreeHeaderTemplateOptions) {
    return (
      //  @ts-ignore
      <div className="flex items-center" {...props}>
        <div className={filterContainerClassName}>
          <i className={filterIconClasssName}></i>
        </div>
        {/* @ts-ignore */}
        <Input
          placeholder="Search by equipment name..."
          {...filterInput}
        ></Input>
      </div>
    );
  }

  // Utility function to transform categories to tree nodes
  const transformCategory = (equipment_master, parentKey: string = "") => {
    const currentKey = parentKey
      ? `${parentKey}-${equipment_master.id}`
      : `${equipment_master.id}`;

    return {
      key: currentKey,
      label: equipment_master.name,
      data: `${equipment_master.name}`, // You can customize this
      assetnum: `${equipment_master.assetnum}`,
      children: equipment_master.children
        ? equipment_master.children.map((child) =>
            transformCategory(child, currentKey)
          )
        : [],
    };
  };

  useEffect(() => {
    if (!data) return;

    const _nodes = data.items.map((equipment_master) =>
      transformCategory(equipment_master)
    );

    // @ts-ignore
    setNodes(_nodes);
    setTotalPages(data.totalPages);
  }, [data]);

  if (isLoading) {
    return <SkeletonTable />;
  }

  const expandAll = () => {
    let _expandedKeys = {};

    for (let node of nodes) {
      expandNode(node, _expandedKeys);
    }

    // @ts-ignore
    setExpandedKeys(_expandedKeys);
  };

  const collapseAll = () => {
    // @ts-ignore
    setExpandedKeys({});
  };

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true;

      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  const nodeTemplate = (node) => {
    // Check if the node is a leaf (has no children)
    if (!node.children || node.children.length === 0) {
      return (
        <a
          // href={`/lcca-app/${formatTextToUrl(node.data)}`}
          href={
            node.data == "ABSORBER AGITATOR A"
              ? `/lcca-app/${node.assetnum}`
              : "#"
          }
          className={
            node.data == "ABSORBER AGITATOR A"
              ? `text-blue-600 hover:text-blue-800 hover:underline`
              : `cursor-not-allowed`
          }
          onClick={(e) => {
            e.stopPropagation(); // Prevent tree node toggle
          }}
        >
          {node.data}
        </a>
      );
    }

    // Return default label for non-leaf nodes
    return <div className="">{node.data}</div>;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* <div className="flex flex-wrap gap-4 mb-4">
                <Button type="button" icon="pi pi-plus" label="Expand All" onClick={expandAll} />
                <Button type="button" icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
            </div> */}

      <Tree
        value={nodes}
        filter
        filterMode="lenient"
        expandedKeys={expandedKeys}
        onToggle={(e) => {
          // @ts-ignore
          setExpandedKeys(e.value);
        }}
        className="w-full md:w-30rem custom-tree-filter"
        header={customHeader}
        filterPlaceholder="Search by name"
        nodeTemplate={nodeTemplate}
      />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (page > 1) setPage((prev) => prev - 1);
              }}
              isActive={false}
              className={page === 1 ? "hidden" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (page < totalPages) setPage((prev) => prev + 1);
              }}
              className={page < totalPages ? "" : "hidden"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
