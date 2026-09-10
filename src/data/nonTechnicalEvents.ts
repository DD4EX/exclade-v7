import {
  CircleDot,
  CircleHelp,
  FlaskConical,
  Gamepad2,
  Network,
  RotateCw,
  type LucideIcon,
} from "lucide-react";

export type NonTechnicalEvent = {
  id: string;
  name: string;
  category: "NON-TECHNICAL";
  status: "READY";
  details: string;
  icon: LucideIcon;
};

export const nonTechnicalEvents: NonTechnicalEvent[] = [
  {
    id: "01",
    name: "E-SPORT (FREE FIRE)",
    category: "NON-TECHNICAL",
    status: "READY",
    details: "E-SPORTS (FREE FIRE) – Event Instructions\n\n1. Team registration is allowed, and each team must register with the required number of players.\n2. All players are required to carry a valid College ID card for verification.\n3. Only registered players with valid entry confirmation will be allowed to participate in the match.\n4. No Gloo Wall breaking or any other prohibited gameplay method is allowed.\n5. The use of hackers, scripts, modified game files, third-party applications, or any unfair means is strictly prohibited.\n6. Players found using hacks or any unauthorized tools will be immediately disqualified from the event.\n7. Players must join the room only through the official room ID and password provided by the organizers.\n8. No unregistered or outside players will be allowed into the room under any circumstances.\n9. Players must join the room within the specified time. Late entry may not be permitted.\n10. Players must follow all instructions given by the event coordinators throughout the match.\n11. Any form of cheating, teaming with opponents, or intentional exploitation of game glitches may result in disqualification.\n12. The organizers reserve the right to verify players and take necessary action in case of rule violations.\n13. The decision of the event coordinators and judges will be final and binding.\n14. The organizers reserve the right to modify the rules or match format if required for the smooth conduct of the event.\n15. Cash prizes will be awarded to the winning teams/players based on their performance and final standings in the event."
    ,
    icon: Gamepad2,
  },
  {
    id: "02",
    name: "JUICE MATCHING CHALLENGE",
    category: "NON-TECHNICAL",
    status: "READY",
    details: "Juice Matching Challenge – Event Instructions\n\n1. All participants are required to carry a valid College ID card for verification.\n2. Participants must report to the event venue at least 15 minutes before the commencement of the event.\n3. Each participant must complete an individual registration. Group registrations are not permitted.\n4. A set of empty juice cans will be placed inside a covered box in a specific arrangement.\n5. The arrangement inside the box will not be visible to the participant at any point during the challenge.\n6. Participants will be provided with an identical set of empty juice cans outside the box.\n7. Participants must use their memory, observation, and logical thinking to guess the hidden arrangement.\n8. The participant must arrange the available juice cans to match the hidden pattern inside the box.\n9. Participants are not allowed to open, lift, move, or look inside the covered box.\n10. Participants must complete their arrangement within the specified time limit.\n11. No hints, assistance, mobile phones, or communication with other participants will be permitted during the challenge.\n12. The arrangement will be checked by the event coordinators after the participant completes the challenge.\n13. The winner will be determined based on accuracy and completion time. A participant who correctly matches the hidden arrangement in the shortest time will be declared the winner.\n14. Any attempt to view the hidden arrangement, use unfair means, or disturb the setup may result in immediate disqualification.\n15. The decision of the event coordinators and judges will be final and binding."
    ,
    icon: FlaskConical,
  },
  {
    id: "03",
    name: "WRONG ANSWERS ONLY",
    category: "NON-TECHNICAL",
    status: "READY",
    details: "Wrong Answers Only – Event Instructions\n\n1. All participants are required to carry a valid College ID card for verification.\n2. Participants must report to the event venue at least 15 minutes before the commencement of the event.\n3. Each participant must complete an individual registration. Group registrations are not permitted.\n4. Participants will be asked a series of simple questions, but only intentionally wrong answers are allowed.\n5. Participants must answer each question within the specified time limit.\n6. Giving the correct answer, even accidentally, may result in elimination or a penalty.\n7. Participants are encouraged to give creative, funny, and unexpected wrong answers while keeping them appropriate.\n8. Participants must not use mobile phones, the internet, or assistance from others during the game.\n9. Participants must not interrupt or influence another participant while they are answering.\n10. Any participant who deliberately delays answering or refuses to participate may be eliminated.\n11. The event may consist of multiple rounds, with the questions becoming faster or more challenging in each round.\n12. Participants who provide answers that are considered correct by the judges will be eliminated according to the rules of the round.\n13. Any inappropriate, offensive, or disrespectful answers may result in immediate disqualification.\n14. The decision of the event coordinators and judges will be final and binding.\n15. The participant who successfully survives all rounds with the most valid wrong answers will be declared the winner."
    ,
    icon: CircleHelp,
  },
  {
    id: "04",
    name: "Cup Chaos",
    category: "NON-TECHNICAL",
    status: "READY",
    details: "Cup Chaos – Event Instructions\n\n1. All participants are required to carry a valid College ID card for verification.\n2. Participants must report to the event venue at least 15 minutes before the commencement of the event.\n3. Each participant must complete an individual registration. Group registrations are not permitted.\n4. Participants must carefully listen to the instructions and demonstrations given by the event coordinators.\n5. Participants will be provided with the required cups and other materials for the challenge.\n6. Participants must complete the assigned cup challenges within the specified time limit.\n7. Participants may be required to stack, arrange, rearrange, or dismantle cups according to the instructions given for each round.\n8. Participants must use only the permitted materials and methods during the game.\n9. Knocking over the cup arrangement or performing an incorrect sequence may result in a penalty or time addition, as decided by the organizers.\n10. Participants are not allowed to intentionally interfere with another participant's game or use unfair methods.\n11. The event may consist of multiple rounds, with the difficulty increasing in each subsequent round.\n12. Winners will be determined based on accuracy, successful completion, and the fastest time.\n13. Any participant violating the rules or displaying inappropriate behaviour may be disqualified.\n14. The decision of the event coordinators and judges will be final and binding.\n15. The organizers reserve the right to modify the rules or event format if required for the smooth conduct of the event."
    ,
    icon: CircleDot,
  },
  {
    id: "05",
    name: "Pass it, Twist it",
    category: "NON-TECHNICAL",
    status: "READY",
    details: "Pass It, Twist It – Event Instructions\n\n1. All participants are required to carry a valid College ID card for verification.\n2. Participants must report to the event venue at least 15 minutes before the commencement of the event.\n3. Each participant must complete an individual registration. Group registrations are not permitted.\n4. Participants must carefully listen to the instructions and commands given by the event coordinators.\n5. The game will involve passing the object and performing the announced actions, such as passing, twisting, reversing, clapping, or other challenges.\n6. Participants must perform the announced action within the given time limit. Delayed or incorrect actions may result in elimination.\n7. The object must be passed only in the direction instructed by the event coordinators.\n8. Participants are not allowed to intentionally drop, throw, hide, or obstruct the game object.\n9. Any participant who violates the rules, disrupts the game, or engages in unfair practices may be disqualified.\n10. The difficulty and speed of the game may be increased during subsequent rounds to test the participants' reaction time, concentration, and coordination.\n11. The decision of the event coordinators and judges will be final and binding.\n12. Participants must maintain proper discipline and follow all safety instructions throughout the event.\n13. Participants who are eliminated from a round must leave the playing area without disturbing the ongoing game.\n14. The participant who successfully completes the final round according to the rules will be declared the winner.\n15. The organizers reserve the right to modify the game rules or event format if required for the smooth conduct of the event."
    ,
    icon: Network,
  },
  {
    id: "06",
    name: "Balloon Cup Rush",
    category: "NON-TECHNICAL",
    status: "READY",
    details: "Balloon Cup Rush – Event Instructions\n\n1. All participants are required to carry a valid College ID card for verification.\n2. Participants must report to the event venue at least 15 minutes before the commencement of the event.\n3. Each participant must complete an individual registration. Group registrations are not permitted.\n4. Participants must carefully listen to and follow all instructions given by the event coordinators before and during the game.\n5. Each participant will be provided with the required balloons and cups for the game.\n6. Participants must complete the assigned task by moving the cups using the balloon without directly touching the cups with their hands.\n7. Participants must complete the challenge within the specified time limit.\n8. If a balloon bursts or a cup falls, participants must follow the instructions given by the event coordinators before continuing.\n9. Participants are not allowed to intentionally touch, throw, kick, or move the cups using their hands or any unauthorized method.\n10. Any attempt to use unfair means or interfere with another participant's game may result in immediate disqualification.\n11. Participants must complete the given course or challenge in the correct sequence as instructed by the organizers.\n12. The winner will be determined based on successful completion of the challenge and the fastest recorded time.\n13. Participants must maintain discipline and ensure that their actions do not cause injury or disturbance to others.\n14. The decision of the event coordinators and judges will be final and binding.\n15. The organizers reserve the right to modify the rules, time limits, or game format if required for the smooth conduct of the event."
    ,
    icon: RotateCw,
  },
];