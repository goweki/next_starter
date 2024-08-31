import {
  Mp as _Mp,
  Legislation as _Legislation,
  Constituency as _Constituency,
  Vote as _Vote,
  Contribution as _Contribution,
} from "@prisma/client";

// extends the Mp type to include the constituency relation
export type Mp = _Mp & {
  constituency?: _Constituency;
};

export function isMp(obj: any): obj is Mp {
  return (
    // typeof obj === 'object' &&
    // obj !== null &&
    // typeof obj.id === 'number' &&
    // typeof obj.name === 'string' &&
    // typeof obj.constituencyId === 'string' &&
    // typeof obj.party === 'string'
    // Add other property checks as needed

    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("constituency") &&
    obj.hasOwnProperty("lastName")
  );
}

export function isLegislation(obj: any): obj is Mp {
  return (
    // typeof obj === 'object' &&
    // obj !== null &&
    // typeof obj.id === 'number' &&
    // typeof obj.name === 'string' &&
    // typeof obj.constituencyId === 'string' &&
    // typeof obj.party === 'string'
    // Add other property checks as needed

    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("title") &&
    obj.hasOwnProperty("Debate")
  );
}

export type Legislation = _Legislation & {
  votes?: _Vote[];
  Debate?: _Contribution[];
};
