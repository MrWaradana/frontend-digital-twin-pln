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

export default function Page() {
    return (
        <OverviewContainer
            containerClassName="main-container"
            navbarTitle="LCCA"
            headerTitle="Overview"
        >
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white w-full px-4 py-4 shadow-lg rounded-lg">
                    <h1 className="font-bold text-2xl">
                        Test Tree
                    </h1>
                    <TreeExample />
                </div>
                <div className="bg-white w-full px-4 py-4 shadow-lg rounded-lg">
                    <h1 className="font-bold text-2xl">
                        Chart Example
                    </h1>
                    <EchartExample />
                </div>
            </div>

        </OverviewContainer>
    )
}


interface TreeExample { }

function TreeExample(props: TreeExample) {
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({ '0': true, '0-0': true });

    const { data: session } = useSession()

    const { data, isLoading } = useGetDataEquipmentTree(session?.user.access_token)


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

        const _nodes = data.map(equipment_master => transformCategory(equipment_master));

        // @ts-ignore
        setNodes(_nodes);
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
        </div>
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
