import React from "react";
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "PARAMETER", uid: "parameter", sortable: true },
  { name: "UOM", uid: "uom" },
  { name: "REFERENCE DATA", uid: "reference", sortable: true },
  { name: "EXISTING DATA", uid: "existing", sortable: true },
  { name: "GAP", uid: "gap", sortable: true },
  { name: "FAKTOR KOREKSI (% HR)", uid: "hr", sortable: true },
  { name: "FAKTOR KOREKSI (DEVIASI)", uid: "deviasi", sortable: true },
  { name: "NILAI LOSSES (% ABSOLUTE)", uid: "absolute", sortable: true },
  { name: "NILAI LOSSES (kCal/kWh)", uid: "kcal", sortable: true },
  { name: "SYMPTOMS", uid: "symptomps", sortable: true },
  { name: "POTENTIAL BENEFIT", uid: "benefit", sortable: true },
  { name: "ACTION MENUTUP GAP", uid: "action-gap", sortable: true },
  { name: "BIAYA UNTUK CLOSING GAP (Rp.)", uid: "biaya-gap", sortable: true },
  { name: "RATIO BENEFIT TO COST", uid: "ratio", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Target", uid: "target" },
  { name: "Key Performance Indicator (KPI)", uid: "kpi" },
  { name: "Current", uid: "current" },
];

const users = [
  {
    id: 1,
    parameter: "Boiler fuel efficiency (LHV)",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "CEO",
    team: "Management",
    status: "active",
    periode: "2024-01-01",
    avatar: "#",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    parameter: "Boiler fuel efficiency (HHV)",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Sr. Dev",
    team: "Development",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "C.M.",
    team: "Marketing",
    status: "vacation",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "S. Manager",
    team: "Sales",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
  {
    id: 6,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "P. Manager",
    team: "Management",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "brian.kim@example.com",
    status: "Active",
  },
  {
    id: 7,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Designer",
    team: "Design",
    status: "paused",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
    email: "michael.hunt@example.com",
  },
  {
    id: 8,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "HR Manager",
    team: "HR",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
    email: "samantha.brooks@example.com",
  },
  {
    id: 9,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "F. Manager",
    team: "Finance",
    status: "vacation",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=4",
    email: "frank.harrison@example.com",
  },
  {
    id: 10,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Ops Manager",
    team: "Operations",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "emma.adams@example.com",
  },
  {
    id: 11,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Jr. Dev",
    team: "Development",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=8",
    email: "brandon.stevens@example.com",
  },
  {
    id: 12,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "P. Manager",
    team: "Product",
    status: "paused",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=10",
    email: "megan.richards@example.com",
  },
  {
    id: 13,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "S. Manager",
    team: "Security",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=12",
    email: "oliver.scott@example.com",
  },
  {
    id: 14,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "M. Specialist",
    team: "Marketing",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=16",
    email: "grace.allen@example.com",
  },
  {
    id: 15,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "IT Specialist",
    team: "I. Technology",
    status: "paused",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=15",
    email: "noah.carter@example.com",
  },
  {
    id: 16,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Manager",
    team: "Sales",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=20",
    email: "ava.perez@example.com",
  },
  {
    id: 17,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Data Analyst",
    team: "Analysis",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=33",
    email: "liam.johnson@example.com",
  },
  {
    id: 18,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "QA Analyst",
    team: "Testing",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=29",
    email: "sophia.taylor@example.com",
  },
  {
    id: 19,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Administrator",
    team: "Information Technology",
    status: "paused",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=50",
    email: "lucas.harris@example.com",
  },
  {
    id: 20,
    parameter: "current",
    uom: "%",
    reference: "5,0",
    existing: "5,0",
    gap: "2,4",
    hr: "1",
    deviasi: "1",
    absolute: "",
    kcal: "",
    symptomps: "Higher",
    benefit: "",
    "action-gap": "",
    "biaya-gap": "",
    ratio: "",
    role: "Coordinator",
    team: "Operations",
    status: "active",
    periode: "2024-01-01",
    avatar: "https://i.pravatar.cc/150?img=45",
    email: "mia.robinson@example.com",
  },
];

export { columns, users, statusOptions };
