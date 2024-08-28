import { faker } from "@faker-js/faker";

export type ParetoType = {
  parameter: string;
  uom: string;
  cdd: number;
  average: number;
  gap: number;
  hr: number;
  deviasi: number;
  absolute: number;
  kcal: number;
  symptomps: "Higher" | "Lower";
  benefit: number;
  actionGap: string;
  closing: number;
  ratio: number;
  actions: string;
};

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: "relationship" | "complicated" | "single";
  subRows?: Person[];
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPareto = (): ParetoType => {
  return {
    parameter: faker.person.bio(),
    uom: "%",
    cdd: faker.number.float({ fractionDigits: 2 }),
    average: faker.number.float({ fractionDigits: 2 }),
    gap: faker.number.float({ fractionDigits: 2 }),
    hr: faker.number.float({ fractionDigits: 2 }),
    deviasi: faker.number.float({ fractionDigits: 2 }),
    absolute: faker.number.float({ fractionDigits: 2 }),
    kcal: faker.number.float({ fractionDigits: 2 }),
    symptomps: faker.helpers.shuffle<ParetoType["symptomps"]>([
      "Higher",
      "Lower",
    ])[0]!,
    benefit: faker.number.float({ fractionDigits: 2 }),
    actionGap: "Action",
    closing: faker.number.float({ fractionDigits: 2 }),
    ratio: faker.number.float({ fractionDigits: 2 }),
    actions: "Action",
  };
};
// const newPerson = (): ParetoType => {
//   return {
//     parameter: faker.person.bio,

//     firstName: faker.person.firstName(),
//     lastName: faker.person.lastName(),
//     age: faker.number.int(40),
//     visits: faker.number.int(1000),
//     progress: faker.number.int(100),
// status: faker.helpers.shuffle<Person["status"]>([
//   "relationship",
//   "complicated",
//   "single",
// ])[0]!,
//   };
// };

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): ParetoType[] => {
    const len = lens[depth]!;
    return range(len).map((d): ParetoType => {
      return {
        ...newPareto(),
        // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };
  //   console.log(makeDataLevel(), "DATALEVEL");
  return makeDataLevel();
}
