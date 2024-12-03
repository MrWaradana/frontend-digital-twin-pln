'use client';

import OverviewContainer from "@/components/containers/OverviewContainer";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import { ContentLayout } from "@/containers/ContentLayout";
import { useGetDataEquipmentTree } from "@/lib/APIs/useGetDataEquipmentTree";
import { Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Tree, TreeHeaderTemplateOptions } from "primereact/tree";
import { useEffect, useMemo, useState } from "react";
import ReactECharts from 'echarts-for-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Card,
    CardContent
} from "@/components/ui/card"
import { cn } from "@/lib/utils";

export default function Page() {
    return (
        <OverviewContainer
            containerClassName="main-container"
            navbarTitle="LCCA App"
        >
            <div className="flex justify-between">
                <div className="bg-white w-full px-8 py-7 shadow-lg rounded-lg">
                    <h1 className="font-bold text-2xl">
                        TJB UNIT 3
                    </h1>
                    <div className={`flex flex-row gap-3 my-3`}>
                        <HeaderCard>
                            {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
                            <p className="text-sm font-semibold">
                            Nilai Aset Awal
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
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
                            <p className="text-sm font-semibold">
                                Masa Manfaat
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
                                    <h2 className="text-5xl font-bold">30</h2>
                                    <small className={`text-xs text-neutral-400`}>Tahun</small>
                                </div>
                            </div>
                        </HeaderCard>
                        <HeaderCard>
                            {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
                            <p className="text-sm font-semibold">
                                Tahun COD
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
                                    <h2 className="text-5xl font-bold">2013</h2>
                                    <small className={`text-xs text-neutral-400`}>Tahun</small>
                                </div>
                            </div>
                        </HeaderCard>
                        <HeaderCard>
                            {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
                            <p className="text-sm font-semibold">
                                Daya Mampu (Netto)
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
                                    <h2 className="text-5xl font-bold">615</h2>
                                    <small className={`text-xs text-neutral-400`}>MW</small>
                                </div>
                            </div>
                        </HeaderCard>
                        <HeaderCard>
                            {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
                            <p className="text-sm font-semibold">
                                Daya Terpasang
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
                                    <h2 className="text-5xl font-bold">660</h2>
                                    <small className={`text-xs text-neutral-400`}>MW</small>
                                </div>
                            </div>
                        </HeaderCard>
                        <HeaderCard>
                            {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
                            <p className="text-sm font-semibold">
                                Sisa Masa Manfaat
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
                                    <h2 className="text-5xl font-bold">19</h2>
                                    <small className={`text-xs text-neutral-400`}>Tahun</small>
                                </div>
                            </div>
                        </HeaderCard>
                        <HeaderCard>
                            {/* <div className="pl-[6px] bg-gradient-to-b from-pink-500 to-purple-500">
                                <div className="bg-white h-full w-full p-4">
                                    Content goes here
                                </div>
                            </div> */}
                            <p className="text-sm font-semibold">
                                Revenue
                            </p>
                            <div
                                className={`pl-[5px] bg-gradient-to-b from-[#1C9EB6] to-white flex flex-col`}
                            >
                                <div className="bg-white pl-3">
                                    <h2 className="text-5xl font-bold">10</h2>
                                    <small className={`text-xs text-neutral-400`}>Tahun</small>
                                </div>
                            </div>
                        </HeaderCard>
                        
                    </div>
                    <EchartExample />
                </div>
            </div>

        </OverviewContainer>
    )
}


interface HeaderCardProps {
    children: React.ReactNode
    className?: string
}

export function HeaderCard(HeaderCardProps) {
    const { children, className } = HeaderCardProps
    { `shadow-2xl w-full bg-white rounded-3xl hover:-translate-y-1 transition ease-soft-spring` }

    return (
        <Card className={cn("shadow-2xl w-full bg-white rounded-3xl hover:-translate-y-1 transition ease-soft-spring", `${className}`)}>
            <CardContent className="flex flex-col justify-around pt-5 gap-4">
                {/* <p className="text-sm font-semibold">
                        Revenue
                    </p>
                    <span
                        className={`border-l-4 pl-3 border-blue-400 flex flex-col`}
                    >
                        <h2 className="text-5xl font-bold">10</h2>
                        <small className={`text-xs text-neutral-400`}>Tahun</small>
                    </span> */}
                {children}

            </CardContent>
        </Card>
    )
}


interface TreeExample { }

function TreeExample(props: TreeExample) {
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({ '0': true, '0-0': true });

    const { data: session } = useSession()


    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { data, isLoading } = useGetDataEquipmentTree(session?.user.access_token, page)

    function customHeader({ filterContainerClassName, filterIconClasssName, filterInput, filterElement, element, props }: TreeHeaderTemplateOptions) {
        return (
            //  @ts-ignore
            <div className="flex items-center" {...props}>
                <div className={filterContainerClassName}>
                    <i className={filterIconClasssName}></i>
                </div>
                {/* @ts-ignore */}
                <Input {...filterInput}></Input>
            </div>
        );
    }

    // Utility function to transform categories to tree nodes
    const transformCategory = (equipment_master, parentKey: string = '') => {
        const currentKey = parentKey ? `${parentKey}-${equipment_master.id}` : `${equipment_master.id}`;

        return {
            key: currentKey,
            label: equipment_master.name,
            data: `${equipment_master.name}`, // You can customize this
            children: equipment_master.children ? equipment_master.children.map(child => transformCategory(child, currentKey)) : []
        };
    };

    useEffect(() => {
        if (!data) return;

        const _nodes = data.items.map(equipment_master => transformCategory(equipment_master));

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
            />
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(prev => prev - 1)} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">{page}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={() => setPage(prev => prev + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div>
    )
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
    )
}

interface EchartExampleProps { }

function EchartExample(props: EchartExampleProps) {
    const { } = props

    const xAxisData = ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']

    const chartOption = {
        title: {
            text: 'Distribution of Something',
            subtext: 'Fake Data'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            // prettier-ignore
            data: xAxisData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} W'
            },
            axisPointer: {
                snap: true
            }
        },
        visualMap: {
            show: false,
            dimension: 0,
            pieces: [
                {
                    lte: 6,
                    color: 'green'
                },
                {
                    gt: 6,
                    lte: 8,
                    color: 'green'
                },
                {
                    gt: 8,
                    lte: 14,
                    color: 'green'
                },
                {
                    gt: 14,
                    lte: 17,
                    color: 'green'
                },
                {
                    gt: 17,
                    color: 'green'
                }
            ]
        },
        series: [
            {
                name: 'Bar',
                data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            },
            {
                name: 'Electricity Down',
                type: 'line',
                smooth: true,
                // prettier-ignore
                data: xAxisData.map((year, index) => {
                    const totalPoints = xAxisData.length - 1;
                    const progress = index / totalPoints;  // 0 to 1
                    const y = Math.round(2000 * (1 - progress * progress));  // Curve formula

                    return y
                }),
            },
            {
                name: 'Electricity Up',
                type: 'line',
                smooth: true,
                // prettier-ignore
                data: xAxisData.map((year, index) => {
                    const maxValue = 2000;
                    const minValue = 1;
                    const progress = index / (xAxisData.length - 1);  // 0 to 1
                    const value = Math.round(minValue + (maxValue - minValue) * (progress * progress));

                    return value;
                }),
                markArea: {
                    itemStyle: {
                        color: 'rgba(255, 173, 177, 0.4)'
                    },
                    data: [
                        [
                            {
                                name: 'Intersection',
                                xAxis: '16:15'
                            },
                            {
                                xAxis: '17:30'
                            }
                        ],
                    ]
                }
            }
        ]
    };

    return (

        <ReactECharts option={chartOption} ></ReactECharts>


    )

}
