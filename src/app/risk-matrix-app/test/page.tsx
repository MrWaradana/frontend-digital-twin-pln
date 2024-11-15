"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";
import { useGetLikelihoods } from "@/lib/APIs/risk-matrix/useGetLikelihood";
import { useGetSeverities } from "@/lib/APIs/risk-matrix/useGetSeverity";
import {
  useGetEquipments,
  useGetEquipment,
  Equipment,
} from "@/lib/APIs/risk-matrix/useGetEquipment";
import {
  useGetPofs,
  Pof,
  GroupedPofData,
} from "@/lib/APIs/risk-matrix/useGetPof";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StringHeaderIdentifier } from "@tanstack/react-table";

export default function EChartsRiskMatrixPreciseScatter() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [severities, setSeverities] = useState<any[]>([]);
  const [likelihoods, setLikelihoods] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [pofs, setPofs] = useState<any[]>([]);
  const [rawPofYears, setRawPofYears] = useState<any[]>([]);
  const [subEquipments, setSubEquipmets] = useState<any>([]);
  // const [pofYears, setPofYears] = useState<any[]>([]);
  const [searchEquipment, setSearchEquipment] = useState<any>(null);
  const [searchSubEquipment, setSearchSubEquipment] = useState<string | null>(
    null
  );
  const [searchYear, setSearchYear] = useState<any | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [equipmentWithoutSub, setEquipmentWithoutSub] = useState<any>(null);

  // Get Severities
  const {
    data: severityDatas,
    isLoading: loadingSeverity,
    mutate: mutateSeverity,
  } = useGetSeverities();

  // Get Likelihoods
  const {
    data: likelihoodDatas,
    isLoading: loadingLikelihood,
    mutate: mutateLikelihood,
  } = useGetLikelihoods();

  // Get Equipments & its sub
  const {
    data: equipmentDatas,
    isLoading: loadingEquipment,
    mutate: mutateEquipment,
  } = useGetEquipments();

  // Get Predict of Failure
  const {
    data: pofDatas,
    isLoading: loadingPof,
    mutate: mutatePof,
  } = useGetPofs(searchYear, searchEquipment, searchSubEquipment);

  // Get & Set Equipment ID
  const handleSearchEquipmentChange = (event: any) => {
    const selectedIndex = event.target.options.selectedIndex;
    setSearchEquipment(event.target.options[selectedIndex].getAttribute("key"));
    // const equipment = useGetEquipment(searchEquipment);
  };

  // Get & Set Sub-Equipment ID
  const handleSearchSubEquipmentChange = (event: any) => {
    const selectedIndex = event.target.options.selectedIndex;
    if (searchEquipment) {
      setSearchSubEquipment(
        event.target.options[selectedIndex].getAttribute("key")
      );
    }
  };

  // Check severities
  useEffect(() => {
    if (!loadingSeverity && severityDatas) setSeverities(severityDatas);
  }, [loadingSeverity, severityDatas]);

  // Check likelihoods
  useEffect(() => {
    if (!loadingLikelihood && likelihoodDatas) setLikelihoods(likelihoodDatas);
  }, [loadingLikelihood, likelihoodDatas]);

  // Check equipments
  useEffect(() => {
    if (!loadingEquipment && equipmentDatas) {
      setEquipments(equipmentDatas);
    }
  }, [loadingEquipment, equipmentDatas]);

  // Get All Years in PoF for the First Time
  const pofYears = useMemo(() => {
    if (!pofDatas && loadingPof) return [];

    const setOfYears = Array.from(
      new Set(pofDatas?.map((item) => item.year))
    ).sort();
    return setOfYears;
  }, [loadingPof, pofDatas]);

  // GET EQUIPMENT WITHOUT ITS SUB-EQUIPMENT (useMemo version)
  // const equipmentWithoutSub = useMemo(() => {
  // if (!loadingEquipment && equipmentDatas) {
  //   return equipmentDatas.map((eqItem) => {
  //     const { sub_equipments = [], ...equipment } = eqItem;
  //     return equipment;
  //   });
  // }
  // }, [loadingEquipment, equipmentDatas]);

  // GET EQUIPMENT WITHOUT ITS SUB-EQUIPMENT (useEffect version)
  useEffect(() => {
    if (!loadingEquipment && equipmentDatas) {
      const eqDatas = equipmentDatas.map((eqItem) => {
        const { sub_equipments = [], ...equipment } = eqItem;
        return equipment;
      });
      setEquipmentWithoutSub(eqDatas);
    }
  }, [loadingEquipment, equipmentDatas]);

  // SET SUB-EQUIPMENT
  useEffect(() => {
    if (equipmentDatas && !loadingEquipment && searchEquipment) {
      const subEquipmentData = equipmentDatas[searchEquipment - 1];
      setSubEquipmets(subEquipmentData.sub_equipments);
    }
  }, [equipmentDatas, loadingEquipment, searchEquipment]);

  // Function to group, limit, and prepare data for the chart
  const processPofData = (POF: Pof[]): GroupedPofData[] => {
    const groupedData = POF.reduce((acc, item) => {
      const key = `${item.likelihood}-${item.severity}`;

      if (!acc[key]) {
        acc[key] = {
          likelihood: item.likelihood,
          severity: item.severity,
          values: [],
          equipments: [],
          allData: [], // Stores all items for details view on click
        };
      }

      // Push item to `allData` and prepare values and equipment names
      acc[key].allData.push(item);
      acc[key].values.push(item.value);
      acc[key].equipments.push(item.equipment.name);

      return acc;
    }, {} as Record<string, GroupedPofData>);

    // Prepare data for scatter chart
    return Object.values(groupedData).map((group) => {
      const latestData = group.allData.slice(-5); // Limit to latest 5 entries

      // FORMAT FOR TOOLTIP SCATTER POINT CHART
      return {
        likelihood: group.likelihood,
        severity: group.severity,
        equipments: latestData.map((data) => data.equipment.name),
        values: latestData.map((data) => data.value),
        allData: group.allData, // All entries for on-click details
      };
    });
  };

  // APPLY & FILTERED POF CHART DATA
  const filteredAndProcessedPofData = useMemo(() => {
    if (loadingPof && !pofDatas) return [];

    return processPofData(pofDatas ?? []);
  }, [pofDatas, loadingPof]);
  console.log("WRYYYYYYYYYYYYY");
  console.log(filteredAndProcessedPofData);

  useEffect(() => {
    if (
      chartRef.current &&
      !loadingSeverity &&
      !loadingLikelihood &&
      !loadingPof
    ) {
      const myChart = echarts.init(chartRef.current);

      // const pofDataScatterChart = ;
      // const mergedPofData = [];
      // const pofDataMap = {};

      // const pofData: any[] = pofs;
      // console.log("=================POF DATA=================");
      // console.log(pofData);

      // const data: any[] = [
      //   {
      //     name: "Dataset A",
      //     likelihood: 3.7,
      //     severity: 2.5,
      //     count: 50,
      //     dataset: Array.from({ length: 50 }, () => ({
      //       value: Math.random() * 5,
      //       date: new Date(
      //         2023,
      //         Math.floor(Math.random() * 12),
      //         Math.floor(Math.random() * 28) + 1
      //       ),
      //     })),
      //   },
      // ];

      const data = filteredAndProcessedPofData;

      const option = {
        title: {
          text: "Risk Matrix Chart (Precise Scatter Placement)",
          subtext: "Datasets represented by scatter points",
          left: "center",
        },
        tooltip: {
          formatter: function (params) {
            const data = params.data;
            if (data && data.length > 0) {
              // const avgValue = (
              //   data.dataset.reduce((sum, item) => sum + item.value, 0) /
              //   data.count
              // ).toFixed(2);
              // const latestDate = new Date(
              //   Math.max(...data.dataset.map((item) => item.date))
              // );
              return `
                Likelihood: ${data.likelihood}<br/>
                Severity: ${data.severity}<br/>
                Equipments: [${data.equipment}]<br/>
                Values: [${data.values}]
              `;
            } else {
              return `
                no Data
              `;
            }
          },
        },
        // grid: {
        //   left: "10%", // Adjust padding for overall positioning if needed
        //   right: "10%",
        //   top: "10%",
        //   bottom: "10%",
        //   containLabel: true,
        // },
        xAxis: [
          {
            type: "category",
            data: severities.map((item) => `${item.name}`),
            // name: "Severity",
            nameLocation: "middle",
            nameGap: 25,
            splitArea: {
              show: true,
            },
          },
          {
            type: "value",
            min: 1,
            max: 5,
            show: false,
          },
        ],
        yAxis: [
          {
            type: "category",
            data: likelihoods.map((item) => `${item.name}`),
            // name: "Likelihood",
            nameLocation: "middle",
            nameGap: 25,
            splitArea: {
              show: true,
            },
          },
          {
            type: "value",
            min: 1,
            max: 5,
            show: false,
          },
        ],

        visualMap: {
          min: 1,
          max: 3,
          // show: false,
          calculable: true,
          orient: "horizontal",
          left: "center",
          // top: "30%",
          // bottom: "10%",
          inRange: {
            // color: ["#52c41a", "#faad14", "#f5222d"],
            color: ["#f4f4f4", "#f4f4f4", "#f4f4f4"],
          },
          textStyle: {
            color: "#333",
          },
        },
        series: [
          {
            name: "Risk Matrix",
            type: "heatmap",
            itemStyle: {
              borderWidth: 8,
              borderColor: "rgba(255, 255, 255, 1)",
              borderRadius: 15,
            },
            data: [
              [0, 4, 3],
              [1, 4, 3],
              [2, 4, 3],
              [3, 4, 3],
              [4, 4, 3],
              [0, 3, 2],
              [1, 3, 2],
              [2, 3, 2],
              [3, 3, 2],
              [4, 3, 3],
              [0, 2, 2],
              [1, 2, 2],
              [2, 2, 2],
              [3, 2, 2],
              [4, 2, 3],
              [0, 1, 1],
              [1, 1, 1],
              [2, 1, 2],
              [3, 1, 2],
              [4, 1, 3],
              [0, 0, 1],
              [1, 0, 1],
              [2, 0, 2],
              [3, 0, 2],
              [4, 0, 3],
            ],
            label: {
              show: false,
              formatter: function (params) {
                return ["Low", "Medium", "High"][params.data[2] - 1];
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
          {
            name: "Datasets",
            type: "scatter",
            itemStyle: {
              borderWidth: 8,
              // borderColor: "rgba(255, 255, 255, 1)",
              // borderRadius: 15,
            },
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: data.map((item) => ({
              value: [item.severity - 1, item.likelihood - 1],
              symbolSize: 20, // Math.sqrt(item.count) * 2,
              itemStyle: {
                color: "#333",
                opacity: 0.8,
              },
              // ...item,
            })),
            // label: {
            //   show: false,
            //   formatter: function (param) {
            //     return param.data.name;
            //   },
            //   position: "inside",
            //   fontSize: 12,
            //   fontWeight: "bold",
            //   color: "#fff",
            // },
          },
        ],
      };

      myChart.setOption(option);
      // Cleanup
      return () => {
        myChart.dispose();
      };
    }
  }, [
    severities,
    likelihoods,
    equipments,
    pofs,
    loadingSeverity,
    loadingLikelihood,
    loadingEquipment,
    loadingPof,
    filteredAndProcessedPofData,
  ]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Start: Search Parameter */}
      <div className="search-param columns-3">
        {/* Start: Select Year */}
        <Select
          value={searchYear?.toString() || ""}
          onValueChange={(value) => setSearchYear(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tahun..." />
          </SelectTrigger>
          <SelectContent>
            {pofYears.map((value: string | number, key: number) => (
              <SelectItem key={key} value={`${value}`}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* End: Select Year */}

        {/* Start: Select Equipment */}
        <Select
          value={searchEquipment || ""}
          onValueChange={(value) => setSearchEquipment(value)}
          // onValueChange={(event) => handleSearchEquipmentChange(event)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Equipment..." />
          </SelectTrigger>
          <SelectContent>
            {equipments.map((item) => (
              <SelectItem key={item.id} value={`${item.id}`}>
                {item["name"]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* End: Select Equipment */}

        {/* Start: Select Sub-Equipment */}
        <Select
          value={searchSubEquipment || ""}
          onValueChange={(value) => setSearchSubEquipment(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sub Equipment..." />
          </SelectTrigger>
          <SelectContent>
            {subEquipments.map((item: any) => (
              <SelectItem key={item.id} value={`${item.id}`}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* End: Select Sub-Equipment */}
      </div>
      {/* End: Search Parameter */}

      {/* Start: Risk Matrix Chart */}
      <div ref={chartRef} style={{ width: "100%", height: "100vh" }}></div>
      {/* End: Risk Matrix Chart */}

      {/* Start: Test Pof Data */}
      <div>{JSON.stringify(pofDatas)}</div>
      <hr />
      <br />
      {/* <div>{JSON.stringify(equipmentWithoutSub)}</div> */}
      <hr />
      <br />
      {/* <div>{JSON.stringify(equipmentDatas)}</div> */}
      <hr />
      <br />
      {/* <div>{JSON.stringify(subEquipments)}</div> */}
    </div>
  );
}
