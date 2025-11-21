import { PresenceRecord } from "@/types/types";

export const demoPresenceRecords :Array<PresenceRecord> = [
  // --- Employé (ID 2) : Semaine du 10 au 14 Novembre 2025 ---
  {
    id: 1,
    userId: 2,
    date: new Date("2025-11-10"),
    flags: ["PRESENT"],
    checkIn: "08:10",
    createdAt: new Date()
  },
  {
    id: 2,
    userId: 2,
    date: new Date("2025-11-11"),
    flags: ["PRESENT", "LATE"],
    checkIn: "09:02",
    createdAt: new Date()
  },
  {
    id: 3,
    userId: 2,
    date: new Date("2025-11-12"),
    flags: ["ABSENT"],
    checkIn: undefined,
    createdAt: new Date()
  },
  {
    id: 4,
    userId: 2,
    date: new Date("2025-11-13"),
    flags: ["EXCEPTIONAL"],
    comment: "Rendez-vous administratif",
    createdAt: new Date()
  },
  {
    id: 5,
    userId: 2,
    date: new Date("2025-11-14"),
    flags: ["FIELD"],
    checkIn: "08:03",
    createdAt: new Date()
  },

  // --- RH (ID 3) : même période ---
  {
    id: 6,
    userId: 3,
    date: new Date("2025-11-10"),
    flags: ["PRESENT"],
    checkIn: "08:00",
    createdAt: new Date()
  },
  {
    id: 7,
    userId: 3,
    date: new Date("2025-11-11"),
    flags: ["PRESENT"],
    checkIn: "08:04",
    createdAt: new Date()
  },
  {
    id: 8,
    userId: 3,
    date: new Date("2025-11-12"),
    flags: ["ON_LEAVE"],
    createdAt: new Date()
  },
  {
    id: 9,
    userId: 3,
    date: new Date("2025-11-13"),
    flags: ["ABSENT"],
    createdAt: new Date()
  },
  {
    id: 10,
    userId: 3,
    date: new Date("2025-11-14"),
    flags: ["PRESENT", "LATE"],
    checkIn: "09:15",
    createdAt: new Date()
  },

  // --- Manager (ID 1) : focus présence constante ---
  {
    id: 11,
    userId: 1,
    date: new Date("2025-11-10"),
    flags: ["PRESENT"],
    checkIn: "07:55",
    createdAt: new Date()
  },
  {
    id: 12,
    userId: 1,
    date: new Date("2025-11-11"),
    flags: ["PRESENT"],
    checkIn: "08:05",
    createdAt: new Date()
  },
  {
    id: 13,
    userId: 1,
    date: new Date("2025-11-12"),
    flags: ["FIELD"],
    checkIn: "08:12",
    createdAt: new Date()
  },
  {
    id: 14,
    userId: 1,
    date: new Date("2025-11-13"),
    flags: ["PRESENT"],
    checkIn: "07:58",
    createdAt: new Date()
  },
  {
    id: 15,
    userId: 1,
    date: new Date("2025-11-14"),
    flags: ["EXCEPTIONAL"],
    comment: "Réunion extérieure",
    createdAt: new Date()
  }
];