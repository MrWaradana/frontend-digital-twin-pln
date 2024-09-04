import React from "react";
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "JENIS PARAMETER", uid: "parameter", sortable: true },
  { name: "PERIODE", uid: "periode", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const parameterOptions = [
  { name: "Target", uid: "Target" },
  { name: "Key Performance Indicator (KPI)", uid: "kpi" },
  { name: "Current", uid: "Current" },
];

const users = [
  {
    id: 1,
    parameter: "target",
    role: "CEO",
    team: "Management",
    status: "active",
    periode: "2024-01-01",
    avatar: "#",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    parameter: "kpi",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    periode: "2024-01-07",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    parameter: "current",
    role: "Sr. Dev",
    team: "Development",
    status: "active",
    periode: "2024-01-14",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    parameter: "current",
    role: "C.M.",
    team: "Marketing",
    status: "vacation",
    periode: "2024-01-21",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    parameter: "current",
    role: "S. Manager",
    team: "Sales",
    status: "active",
    periode: "2024-01-28",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
  {
    id: 6,
    parameter: "current",
    role: "P. Manager",
    team: "Management",
    periode: "2024-02-07",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "brian.kim@example.com",
    status: "Active",
  },
  {
    id: 7,
    parameter: "current",
    role: "Designer",
    team: "Design",
    status: "paused",
    periode: "2024-02-14",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
    email: "michael.hunt@example.com",
  },
  {
    id: 8,
    parameter: "current",
    role: "HR Manager",
    team: "HR",
    status: "active",
    periode: "2024-02-21",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
    email: "samantha.brooks@example.com",
  },
  {
    id: 9,
    parameter: "current",
    role: "F. Manager",
    team: "Finance",
    status: "vacation",
    periode: "2024-02-28",
    avatar: "https://i.pravatar.cc/150?img=4",
    email: "frank.harrison@example.com",
  },
  {
    id: 10,
    parameter: "current",
    role: "Ops Manager",
    team: "Operations",
    status: "active",
    periode: "2024-03-07",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "emma.adams@example.com",
  },
  {
    id: 11,
    parameter: "current",
    role: "Jr. Dev",
    team: "Development",
    status: "active",
    periode: "2024-03-14",
    avatar: "https://i.pravatar.cc/150?img=8",
    email: "brandon.stevens@example.com",
  },
  {
    id: 12,
    parameter: "current",
    role: "P. Manager",
    team: "Product",
    status: "paused",
    periode: "2024-03-21",
    avatar: "https://i.pravatar.cc/150?img=10",
    email: "megan.richards@example.com",
  },
  {
    id: 13,
    parameter: "current",
    role: "S. Manager",
    team: "Security",
    status: "active",
    periode: "2024-03-28",
    avatar: "https://i.pravatar.cc/150?img=12",
    email: "oliver.scott@example.com",
  },
  {
    id: 14,
    parameter: "current",
    role: "M. Specialist",
    team: "Marketing",
    status: "active",
    periode: "2024-04-07",
    avatar: "https://i.pravatar.cc/150?img=16",
    email: "grace.allen@example.com",
  },
  {
    id: 15,
    parameter: "current",
    role: "IT Specialist",
    team: "I. Technology",
    status: "paused",
    periode: "2024-04-14",
    avatar: "https://i.pravatar.cc/150?img=15",
    email: "noah.carter@example.com",
  },
  {
    id: 16,
    parameter: "current",
    role: "Manager",
    team: "Sales",
    status: "active",
    periode: "2024-04-21",
    avatar: "https://i.pravatar.cc/150?img=20",
    email: "ava.perez@example.com",
  },
  {
    id: 17,
    parameter: "current",
    role: "Data Analyst",
    team: "Analysis",
    status: "active",
    periode: "2024-04-28",
    avatar: "https://i.pravatar.cc/150?img=33",
    email: "liam.johnson@example.com",
  },
  {
    id: 18,
    parameter: "current",
    role: "QA Analyst",
    team: "Testing",
    status: "active",
    periode: "2024-05-07",
    avatar: "https://i.pravatar.cc/150?img=29",
    email: "sophia.taylor@example.com",
  },
  {
    id: 19,
    parameter: "current",
    role: "Administrator",
    team: "Information Technology",
    status: "paused",
    periode: "2024-05-14",
    avatar: "https://i.pravatar.cc/150?img=50",
    email: "lucas.harris@example.com",
  },
  {
    id: 20,
    parameter: "current",
    role: "Coordinator",
    team: "Operations",
    status: "active",
    periode: "2024-05-21",
    avatar: "https://i.pravatar.cc/150?img=45",
    email: "mia.robinson@example.com",
  },
];

export { columns, users, parameterOptions as statusOptions };
