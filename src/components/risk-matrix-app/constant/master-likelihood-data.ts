export type likelihood = {
    ID: string | number;
    name: string;
    keterangan: string | null;
}


export const masterLikelihoodData: likelihood[] = [
    {
        ID: "1",
        name: "Rare",
        keterangan: "Very Unlikely (Rare) – Less than 1% Probability",
    },
    {
        ID: "2",
        name: "Infrequent",
        keterangan: "Unlikely (Infrequent) – 1% to 10% Probability",
    },
    {
        ID: "3",
        name: "Occasional",
        keterangan: "Moderate Likelihood (Occasional) – 10% to 30% Probability",
    },
    {
        ID: "4",
        name: "Frequent",
        keterangan: "Likely (Frequent) – 30% to 60% Probability",
    },
    {
        ID: "5",
        name: "Almost Certain",
        keterangan: "Very Likely (Almost Certain) – 60% to 100% Probability",
    },
];
// ?