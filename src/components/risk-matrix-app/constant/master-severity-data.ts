export type severity = {
    ID: string | number;
    name: string;
    keterangan: string | null;
};

export const masterSeverityData: severity[] = [
    {
        ID: 1,
        name: "Low",
        keterangan: "Operational Disruption",
    },
    {
        ID: 2,
        name: "Moderate",
        keterangan: "Efficiency Loss",
    },
    {
        ID: 3,
        name: "Medium High",
        keterangan: "Environmental Impact",
    },
    {
        ID: 4,
        name: "High",
        keterangan: "Equipment Damage",
    },
    {
        ID: 5,
        name: "Severe",
        keterangan: "Catastrophic Failure",
    },
];
