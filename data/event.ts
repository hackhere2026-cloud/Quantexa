export interface EventInfo {
  name: string;
  presentedBy: string;
  tagline: string;
  city: string;
  venue: string;
  mapUrl: string;
  dateRange: string;
  registerUrl: string;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;
  prize: string;
}

export interface EventPhase {
  phase: string;
  title: string;
  date: string;
  description: string;
}

export interface Sponsor {
  name: string;
  logoPath: string;
}

export interface JuryMember {
  id: string;
  name: string;
  degrees?: string;
  role: string;
  company: string;
  category: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  isLocked?: boolean;
  isMain?: boolean;
  badge?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  image: string;
  linkedin?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const event: EventInfo = {
  name: "QUANTEXA",
  presentedBy: "HackHere",
  tagline: "Decoding Risks. Engineering Solutions.",
  city: "Coimbatore",
  venue: "SNS IHUB",
  mapUrl: "https://maps.app.goo.gl/5Qv5T9LsVeL58uxd8",
  dateRange: "September 19–20",
  registerUrl: "https://unstop.com/hackathons/quantexa-hackhere-1745790",
};

export const sponsors: Sponsor[] = [
  { name: "Featherless", logoPath: "/sponsors/featherless.png" },
  { name: "ELRO Tech", logoPath: "/sponsors/elro.jpeg" },
  { name: "LeSuccess", logoPath: "/sponsors/lesuccess.png" },
  { name: "DELYON", logoPath: "/sponsors/delyon.png" },
  { name: "ELYON", logoPath: "/sponsors/elyon.jpeg" },
  { name: "HackHere", logoPath: "/sponsors/hackhere.png" },
];

export const tracks: Track[] = [
  { 
    id: "quantum-technology", 
    title: "Quantum Technology", 
    description: "Quantum Computing, Quantum Information Processing & Decision Intelligence - Build quantum-inspired algorithms, quantum cryptography, decision intelligence frameworks, and deep tech quantum simulations.", 
    icon: "atom",
    prize: "Internships"
  },
  { 
    id: "finance-technology", 
    title: "Finance Technology", 
    description: "FinTech Innovation & Risk Telemetry - Build automated financial risk scoring, fraud detection algorithms, algorithmic trading tools, and secure decentralized financial telemetry.", 
    icon: "trending-up",
    prize: "Internships"
  },
];

export const phases: EventPhase[] = [
  {
    phase: "PHASE 1",
    title: "LAUNCH & REGISTRATION",
    date: "Registration Open on Unstop",
    description: "Direct entry registration — Register your team of 1–4 participants on Unstop to secure your slot for the 24-hour offline grand finale.",
  },
  {
    phase: "PHASE 2",
    title: "PREPARATION & IDEATION",
    date: "September 1 – September 18",
    description: "Explore challenge tracks, review technical documentation, refine your architecture, and prepare for the physical build sprint.",
  },
  {
    phase: "PHASE 3",
    title: "BUILD (24H OFFLINE SPRINT)",
    date: "September 19 – September 20",
    description: "Build your working prototype live at SNS IHUB, Coimbatore over a continuous 24-hour period. Problem statements will be provided on the spot.",
  },
  {
    phase: "PHASE 4",
    title: "PITCH & GRAND FINALE AWARDS",
    date: "September 20",
    description: "Present your working prototype live to our jury panel and chief guests to compete for ₹30K cash prizes, internships & certifications.",
  },
];

export const juries: JuryMember[] = [
  {
    id: "jury-1",
    name: "Dr. M. Saravanakumar",
    degrees: "MBA., Ms(IT)., M.Phil., Ph.D.",
    role: "Dean",
    company: "Anna University Regional Campus Coimbatore",
    category: "Jury Member",
    bio: "Dean at Anna University Regional Campus Coimbatore, driving academic leadership, technological innovation, and empowering the next generation of engineers.",
    image: "/juries/dr_m_saravanakumar.png",
    isMain: true,
    badge: "Chief Jury & Evaluator",
  },
  {
    id: "jury-3",
    name: "Reinard Abhishek J",
    role: "HR",
    company: "ELRO Tech",
    category: "Jury Member",
    bio: "HR at ELRO Tech, empowering talent acquisition, organizational growth, and human resources strategy.",
    image: "/juries/jury_3.jpeg",
  },
  {
    id: "jury-2",
    name: "Dr. A. Kumar",
    role: "Dean – Projects & Student Affairs\nHead of Artificial Intelligence & Data Science",
    company: "RVS College of Engineering and Technology",
    category: "Chief Guest",
    bio: "Dean – Projects & Student Affairs and Head of AI & DS at RVS College of Engineering and Technology, fostering academic innovation and advanced AI research.",
    image: "/juries/dr_a_kumar.jpeg",
    badge: "Chief Guest",
  },
];

export const faqs: FAQItem[] = [
  { question: "Who can participate?", answer: "QUANTEXA is open to developers, designers, students, and tech enthusiasts. Both beginners and experienced hackers are welcome!" },
  { question: "What is the team size?", answer: "Teams can range from 1 to 4 participants. Form your team prior to the event or connect with teammates during Day 1 networking." },
  { question: "Is there a registration fee?", answer: "The registration fee is ₹1,000 per team, which grants direct entry to the 24-hour offline hackathon grand finale at SNS IHUB, Coimbatore." },
  { question: "Where is QUANTEXA held?", answer: "QUANTEXA takes place in person at SNS IHUB, Coimbatore (September 19–20)." },
  { question: "What are the prizes and perks?", answer: "₹30,000 in cash prizes, direct internship offers from partner companies, and professional mentoring sessions for participants." },
  { question: "What should I bring?", answer: "Bring your laptop, charger, valid ID, and enthusiasm to build!" },
];

export const teamMembers: TeamMember[] = [
  {
    id: "team-1",
    name: "Ezhil K K",
    role: "CEO",
    company: "HackHere",
    bio: "Chief Executive Officer",
    image: "/team/team_3.jpeg",
    linkedin: "https://www.linkedin.com/in/ezhilkathirvelan/",
  },
  {
    id: "team-2",
    name: "RITHIKA S",
    role: "COO",
    company: "HackHere",
    bio: "Chief Operating Officer",
    image: "/team/team_1.jpeg",
    linkedin: "https://www.linkedin.com/in/rithika-somasundaram/",
  },
  {
    id: "team-3",
    name: "SHUBAASHREE S",
    role: "CMO",
    company: "HackHere",
    bio: "Chief Marketing Officer",
    image: "/team/team_2.jpeg",
    linkedin: "https://www.linkedin.com/in/shubaashreesureshbabu/",
  },
  {
    id: "team-4",
    name: "K GURU PRAKASH",
    role: "CTO",
    company: "HackHere",
    bio: "Chief Technology Officer",
    image: "/team/team_guru.png",
    linkedin: "https://www.linkedin.com/in/k-guru-prakash-9a4184337/",
  },
];

