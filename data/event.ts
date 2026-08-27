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
  role: string;
  company: string;
  category: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
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
  dateRange: "September 12–13",
  registerUrl: "https://unstop.com/hackathons/quantexa-hackhere",
};

export const sponsors: Sponsor[] = [
  { name: "Sponsor 1", logoPath: "/sponsors/wp_sponsor_1.jpeg" },
  { name: "Sponsor 2", logoPath: "/sponsors/wp_sponsor_2.jpeg" },
  { name: "Sponsor 3", logoPath: "/sponsors/wp_sponsor_3.jpeg" },
  { name: "Sponsor 4", logoPath: "/sponsors/wp_sponsor_4.jpeg" },
  { name: "Sponsor 5", logoPath: "/sponsors/wp_sponsor_5.jpeg" },
  { name: "Sponsor 6", logoPath: "/sponsors/calendar_sponsor.png" },
];

export const tracks: Track[] = [
  { 
    id: "cyber-security", 
    title: "Cyber Security", 
    description: "Personalised Vulnerability Triage - Turn public CVE, KEV, and EPSS data into explainable, prioritised threat intelligence tailored to specific organizational profiles.", 
    icon: "shield",
    prize: "₹15K Track Pool + Internships"
  },
  { 
    id: "med-tech", 
    title: "Med-Tech", 
    description: "AI-Assisted Meniscus & Knee Implant Sizing - Segment knee structures, measure meniscus thickness for osteoarthritis assessment, and estimate patient-specific implant sizing.", 
    icon: "activity",
    prize: "₹15K Track Pool + Internships"
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
    date: "September 1 – September 11",
    description: "Explore challenge tracks, review technical documentation, refine your architecture, and prepare for the physical build sprint.",
  },
  {
    phase: "PHASE 3",
    title: "BUILD (24H OFFLINE SPRINT)",
    date: "September 12 – September 13",
    description: "Build your working prototype live at SNS IHUB, Coimbatore over a continuous 24-hour period. Problem statements will be provided on the spot.",
  },
  {
    phase: "PHASE 4",
    title: "PITCH & GRAND FINALE AWARDS",
    date: "September 13",
    description: "Present your working prototype live to our jury panel and chief guests to compete for ₹30K cash prizes, internships & certifications.",
  },
];

export const juries: JuryMember[] = [
  {
    id: "jury-5",
    name: "Dr. Kaushik Hatti, PhD",
    role: "CISO & Chief Data Scientist",
    company: "Rezilyens LLC",
    category: "Jury Member",
    bio: "CISO & Chief Data Scientist at Rezilyens LLC with 18+ years in AI & Cybersecurity. GAISA 4.0 'Best Use of AI' & BW 40 Under 40 awardee.",
    image: "/juries/kaushik.jpeg",
    linkedin: "https://www.linkedin.com/in/kaushik-hatti/",
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
    id: "jury-4",
    name: "Subhashini S",
    role: "HR and Insurance Trainer",
    company: "Pronoia IMF",
    category: "Jury Member",
    bio: "HR and Insurance Trainer at Pronoia IMF, empowering talent and professional excellence.",
    image: "/juries/jury_4.jpeg",
    linkedin: "https://www.linkedin.com/in/s-subhashini-625794230?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
];

export const faqs: FAQItem[] = [
  { question: "Who can participate?", answer: "QUANTEXA is open to developers, designers, students, and tech enthusiasts. Both beginners and experienced hackers are welcome!" },
  { question: "What is the team size?", answer: "Teams can range from 1 to 4 participants. Form your team prior to the event or connect with teammates during Day 1 networking." },
  { question: "Is there a registration fee?", answer: "The registration fee is ₹1,000 per team, which grants direct entry to the 24-hour offline hackathon grand finale at SNS IHUB, Coimbatore." },
  { question: "Where is QUANTEXA held?", answer: "QUANTEXA takes place in person at SNS IHUB, Coimbatore (September 12–13)." },
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

