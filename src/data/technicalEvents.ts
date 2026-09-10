import { Cpu, FileText, Network, TerminalSquare, Wrench, type LucideIcon } from "lucide-react";

export type TechnicalEvent = {
  id: string;
  name: string;
  category: "TECHNICAL";
  details: string;
  icon: LucideIcon;
  code: string;
};

export const technicalEvents: TechnicalEvent[] = [
  {
    id: "01",
    name: "PAPER PRESENTATION",
    category: "TECHNICAL",
    details: "Paper Presentation — Event Instructions\n\n1. All participants must carry a valid College ID card for verification.\n2. Participants should report to the venue at least 15 minutes before the event starts.\n3. Each paper presentation entry must be registered individually; group or duplicate registrations are not allowed.\n4. Participants must present their paper in a clear and structured format with proper topic explanation.\n5. The presentation should be within the allotted time limit and should be delivered in a professional manner.\n6. Participants must ensure their content is original and relevant to the event theme.\n7. The use of unauthorized materials, external assistance, or copied content will lead to disqualification.\n8. Judges will evaluate the content, delivery, clarity, and innovation of the presentation.\n9. The decision of the judges will be final and binding.\n10. Exciting prizes will be awarded to the winners based on their performance."
    ,
    icon: FileText,
    code: "PPR-01",
  },
  {
    id: "02",
    name: "WORKSHOP",
    category: "TECHNICAL",
    details: "Workshop — Event Instructions\n\n1. Participants must carry a valid College ID card for verification.\n2. All participants must report to the workshop venue at least 15 minutes before the session begins.\n3. Each participant must complete an individual registration before attending.\n4. Participants are expected to attend the workshop with attention and follow the instructions given by the coordinators.\n5. Laptops and required materials should be brought if specified by the workshop organizers.\n6. Attendance will be monitored during the session.\n7. Participants must not disturb the session or interfere with the facilitator.\n8. Any participant found using unauthorized resources or causing disruption may be removed from the event.\n9. The decision of the organizers and judges will be final and binding.\n10. Certificates and rewards will be provided based on participation and performance."
    ,
    icon: Wrench,
    code: "WSP-02",
  },
  {
    id: "03",
    name: "IoT SIMULATOR",
    category: "TECHNICAL",
    details: "IoT Simulator – Event Instructions\n\nDay 1 – AN | 1:00 PM to 3:00 PM\n\n1. All participants are required to carry a valid College ID Card for verification.\n2. Participants are requested to report to the venue at least 15 minutes prior to the commencement of the session.\n3. Participants must bring their own laptop with a working internet connection for the hands-on IoT simulation session.\n4. Participants are advised to ensure that their laptop is fully charged and ready for the session.\n5. Participants should have the required browser and software/tools installed or accessible before the session begins.\n6. Participants are expected to follow the IoT Simulator instructions and guidelines provided by the organizers throughout the event.\n7. Participants must not share their login credentials, simulation work, or submissions with other participants during the session.\n8. Participants are required to complete and submit their simulation task within the allotted session time (1:00 PM – 3:00 PM).\n9. Participants must ensure that their final simulation and required submission details are successfully submitted before leaving the session.\n10. Any technical issues encountered during the session should be immediately reported to the event coordinators for assistance.\n11. Participants must maintain discipline and follow all instructions provided by the event coordinators.\n12. The decision of the event coordinators and judges will be final and binding.\n13. Exciting prizes will be awarded to the winners based on their final performance and standings.\n14. The organizers reserve the right to modify the rules, challenges, or event format if required for the smooth conduct of the event."
    ,
    icon: Cpu,
    code: "IOT-03",
  },
  {
    id: "04",
    name: "LINK LOGIC",
    category: "TECHNICAL",
    details: "Link Logic – Event Instructions\n\n1. All participants are required to carry a valid College ID card for verification.\n2. Participants must report to the event venue at least 15 minutes before the commencement of the event.\n3. Each participant must complete an individual registration. Group registrations are not permitted.\n4. Participants will be provided with a series of logic-based questions, puzzles, clues, and problem-solving challenges.\n5. Participants must identify the correct link, pattern, sequence, or logical connection between the given clues.\n6. All challenges must be completed within the specified time limit.\n7. Participants are not allowed to use mobile phones, the internet, AI tools, or assistance from other participants unless explicitly permitted by the organizers.\n8. Participants must submit their answers through the method specified by the event coordinators.\n9. Any form of copying, communication with other participants, or use of unauthorized resources will result in disqualification.\n10. Points will be awarded based on the correctness of answers and/or the time taken to complete each challenge.\n11. In case of a tie, an additional tie-breaker challenge may be conducted.\n12. Participants must maintain discipline and follow all instructions provided by the event coordinators.\n13. The decision of the event coordinators and judges will be final and binding.\n14. Exciting prizes will be awarded to the winners based on their final performance and standings.\n15. The organizers reserve the right to modify the rules, challenges, or event format if required for the smooth conduct of the event."
    ,
    icon: Network,
    code: "LNK-04",
  },
  {
    id: "05",
    name: "REVERSE CODING",
    category: "TECHNICAL",
    details: "Reverse Coding - Event Instructions\n\n1. Participants must carry a valid College ID card for verification.\n2. Participants must report at least 15 minutes before the event.\n3. Individual registration is required; group registration is not permitted.\n4. Participants will be provided with the required coding environment or platform.\n5. The problem statements will be displayed/provided along with sample inputs and outputs.\n6. Participants must write code that produces the required output for the given test cases.\n7. Participants may use only the programming languages specified by the organizers.\n8. Internet access, AI tools, mobile phones, or external assistance will not be permitted unless explicitly allowed.\n9. Code must be submitted within the specified time limit.\n10. Points will be awarded based on correctness, number of test cases passed, and/or submission time.\n11. Any form of plagiarism or unfair practice will result in disqualification.\n12. In case of a tie, a tie-breaker coding challenge may be conducted.\n13. The decision of the judges will be final and binding.\n14. Exciting prizes will be awarded to the winners based on their final performance.\n15. The organizers reserve the right to modify the rules or challenge format if required."
    ,
    icon: TerminalSquare,
    code: "RVC-05",
  },
];
