export type OperationScheduleEvent = {
  name: string;
  venue: string;
  time: string;
};

export const operationSchedule = {
  day1: [
    { name: "Paper Presentation", venue: "Edison Hall", time: "9:30 AM – 12:30 PM" },
    { name: "IoT Simulators", venue: "IoT Lab — 1st Floor", time: "1:00 PM – 3:00 PM" },
    { name: "Link Logic", venue: "IoT Smart Classroom", time: "10:00 AM – 12:30 PM" },
    { name: "E-Sports", venue: "Embedded Lab — II nd Floor", time: "9:30 AM – 3:00 PM" },
    { name: "Juice Matching Challenge", venue: "Class Room 215", time: "9:30 AM – 3:00 PM" },
    { name: "Wrong Answer Only", venue: "Class Room 216", time: "9:30 AM – 3:00 PM" },
  ],
  day2: [
    { name: "Workshop", venue: "Edison Hall", time: "9:30 AM – 12:30 PM" },
    { name: "Reverse Coding", venue: "IoT Lab — 1st Floor", time: "1:00 PM – 3:00 PM" },
    { name: "Cup Chaos", venue: "Class Room 215", time: "9:30 AM – 3:00 PM" },
    { name: "Pass it, Twist it", venue: "Class Room 216", time: "9:30 AM – 3:00 PM" },
    { name: "Balloon Cup Rush", venue: "Class Room 217", time: "9:30 AM – 3:00 PM" },
  ],
} as const satisfies Record<"day1" | "day2", readonly OperationScheduleEvent[]>;
