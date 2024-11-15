export type equipments = {
    ID: string | number;
    name: string;
    parentsID: string | number | null;
    systemTag: string | null;
}


export const equipmentsData: equipments[] = [
    {
        ID: 1,
        name: 'Boiler',
        parentsID: null,
        systemTag: null
    },
    {
        ID: 2,
        name: 'Turbine',
        parentsID: null,
        systemTag: null
    },
    {
        ID: 3,
        name: 'Boiler Feedwater Pump Turbine System',
        parentsID: 1,
        systemTag: 'BFT'
    },
    {
        ID: 4,
        name: 'Boiler reheater system',
        parentsID: 1,
        systemTag: 'BRS'
    },
    {
        ID: 5,
        name: 'Boiler superheater System',
        parentsID: 1,
        systemTag: 'BSS'
    },
    {
        ID: 6,
        name: 'HP Turbine Bypass System',
        parentsID: 2,
        systemTag: 'HPB'
    },
    {
        ID: 7,
        name: 'LP Turbine Bypass System',
        parentsID: 2,
        systemTag: 'LPB'
    },
    {
        ID: 8,
        name: 'Turbine Gland Steam Seal System',
        parentsID: 2,
        systemTag: 'GSS'
    },
    {
        ID: 9,
        name: 'Boiler Drum and Water',
        parentsID: 1,
        systemTag: 'BDW'
    },
    {
        ID: 10,
        name: 'Main Turbine Lube Oil',
        parentsID: 2,
        systemTag: 'LOS'
    },
];