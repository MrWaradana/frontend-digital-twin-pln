"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import { Card, CardBody, Input } from "@nextui-org/react";

import { Tree } from 'primereact/tree';
import { Button } from "primereact/button";
// theme
import 'primereact/resources/themes/lara-light-cyan/theme.css';


export default function ComponentPage() {
    const [mode, setMode] = React.useState<'dark' | 'light'>('light');
    const [color, setColor] = React.useState('sky');
    function toggleMode() {
        return mode === 'dark' ? setMode('light') : setMode('dark');
    }

    const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-600';

    return (
        <main>
            <section
                className={clsx(mode === 'dark' ? 'bg-dark' : 'bg-white', color)}
            >
                <div
                    className={clsx(
                        'layout min-h-screen py-20',
                        mode === 'dark' ? 'text-white' : 'text-black'
                    )}
                >
                    <h1 className="font-bold text-4xl">Components</h1>
                    {/* <ArrowLink direction='left' className='mt-2' href='/'>
              Back to Home
            </ArrowLink> */}


                    <ol className='mt-8 space-y-6 w-1/2'>
                        <li className='space-y-2 min-h-100px'>
                            <Card>
                                <CardBody>
                                    <h2 className='text-lg md:text-xl'>Charts</h2>
                                    <EchartExample />
                                </CardBody>
                            </Card>
                        </li>
                        <li>
                            <Card>
                                <CardBody>
                                    <h2>Tree</h2>
                                    {/* <TreeExample /> */}
                                    <ControlledDemo />
                                </CardBody>
                            </Card>
                        </li>
                    </ol>
                </div>
            </section>
        </main>
    );
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

interface TreeExampleProps { }

function TreeExample(props: TreeExampleProps) {
    const { } = props

    const data = [{
        key: '0',
        label: 'Documents',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
            {
                key: '0-0',
                label: 'Work',
                data: 'Work Folder',
                icon: 'pi pi-fw pi-cog',
                children: [
                    { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                    { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                ]
            },
            {
                key: '0-1',
                label: 'Home',
                data: 'Home Folder',
                icon: 'pi pi-fw pi-home',
                children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
            }
        ]
    },
    {
        key: '1',
        label: 'Pictures',
        data: 'Pictures Folder',
        icon: 'pi pi-fw pi-image',
        children: [
            { key: '1-0', label: 'barcelona.jpg', icon: 'pi pi-fw pi-file', data: 'Barcelona Photo' },
            { key: '1-1', label: 'logo.jpg', icon: 'pi pi-fw pi-file', data: 'PrimeFaces Logo' },
            { key: '1-2', label: 'primeui.png', icon: 'pi pi-fw pi-file', data: 'PrimeUI Logo' }
        ]
    }];

    return (
        <Tree value={data} className="w-full" filter filterMode="lenient" filterPlaceholder="Search" />
    )


}

function ControlledDemo() {
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({'0': true, '0-0': true});

    const data = [{
        key: '0',
        label: 'Documents',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
            {
                key: '0-0',
                label: 'Work',
                data: 'Work Folder',
                icon: 'pi pi-fw pi-cog',
                children: [
                    { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                    { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                ]
            },
            {
                key: '0-1',
                label: 'Home',
                data: 'Home Folder',
                icon: 'pi pi-fw pi-home',
                children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
            }
        ]
    },
    {
        key: '1',
        label: 'Pictures',
        data: 'Pictures Folder',
        icon: 'pi pi-fw pi-image',
        children: [
            { key: '1-0', label: 'barcelona.jpg', icon: 'pi pi-fw pi-file', data: 'Barcelona Photo' },
            { key: '1-1', label: 'logo.jpg', icon: 'pi pi-fw pi-file', data: 'PrimeFaces Logo' },
            { key: '1-2', label: 'primeui.png', icon: 'pi pi-fw pi-file', data: 'PrimeUI Logo' }
        ]
    }];

    const expandAll = () => {
        let _expandedKeys = {};

        for (let node of nodes) {
            expandNode(node, _expandedKeys);
        }

        setExpandedKeys(_expandedKeys);
    };

    const collapseAll = () => {
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

    useEffect(() => {
        setNodes(data);
    }, []);
    
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-4 mb-4">
                <Button type="button" icon="pi pi-plus" label="Expand All" onClick={expandAll} />
                <Button type="button" icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
            </div>

            <Tree value={nodes} filter filterMode="lenient" expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className="w-full md:w-30rem" />
        </div>
    )
}

