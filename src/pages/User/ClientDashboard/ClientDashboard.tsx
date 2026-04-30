import {
  DashboardLayout,
  NewCustomerEntry,
  PipelineColumnData,
  SummaryItem,
} from "@/pages/User/Dashboard/DashboardLayout";

const clientNewCustomers: NewCustomerEntry[] = [
  { label: "Mon", value: 7, active: true },
  { label: "Tue", value: 10, active: false },
  { label: "Wed", value: 9, active: true },
  { label: "Thu", value: 4, active: false },
  { label: "Fri", value: 11, active: true },
];

const clientSummary: SummaryItem[] = [
  {
    id: "tasks",
    title: "Tasks in progress",
    value: "53",
    label: "In progress",
    accent: false,
  },
  {
    id: "prepayments",
    title: "Prepayments from customers",
    value: "$15.890",
    label: "Today",
    accent: true,
  },
];

const clientPipeline: PipelineColumnData[] = [
  {
    id: "contacted",
    name: "Contacted",
    cards: [
      {
        id: "bytebridge",
        title: "ByteBridge",
        description:
          "Corporate and personal data protection on a turnkey basis.",
        dueDate: "18 Apr",
        comments: 2,
        attachments: 1,
        manager: "Alicia",
        address: "Suit 4A, Downtown",
      },
      {
        id: "aisynergy",
        title: "AI Synergy",
        description: "Innovative solutions based on artificial intelligence.",
        dueDate: "21 Apr",
        comments: 1,
        attachments: 3,
        manager: "Bryan",
        address: "Cyber Park, 210",
      },
      {
        id: "leadboost",
        title: "LeadBoost Agency",
        description: "Lead attraction and automation for small businesses.",
        dueDate: "No due date",
        comments: 4,
        attachments: 7,
        manager: "Nina",
        address: "Main Strand, Block C",
      },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    cards: [
      {
        id: "skillup",
        title: "SkillUp Hub",
        description: "Platform for professional development of specialists.",
        dueDate: "09 Mar",
        comments: 4,
        attachments: 1,
        manager: "Elliot",
        address: "Union Hall, 16",
      },
      {
        id: "therawell",
        title: "Thera Well",
        description: "Platform for psychological support and consultations.",
        dueDate: "No due date",
        comments: 7,
        attachments: 2,
        manager: "Sofia",
        address: "Harbor Side, 3",
      },
      {
        id: "swiftcargo",
        title: "SwiftCargo",
        description: "International transportation of chemical goods.",
        dueDate: "23 Apr",
        comments: 2,
        attachments: 5,
        manager: "Luke",
        address: "Port District, A-12",
      },
    ],
  },
  {
    id: "offer",
    name: "Offer Sent",
    cards: [
      {
        id: "fitlife",
        title: "FitLife Nutrition",
        description: "Nutritious food and nutraceuticals for individuals.",
        dueDate: "10 Mar",
        comments: 1,
        attachments: 3,
        manager: "Maya",
        address: "Health Plaza, 62",
      },
      {
        id: "primeestate",
        title: "Prime Estate",
        description:
          "Agency-developer of low-rise elite and commercial real estate.",
        dueDate: "16 Apr",
        comments: 1,
        attachments: 1,
        manager: "Antony Cardenas",
        address: "540 Realty Blvd, Miami, FL 33132",
        highlight: true,
      },
      {
        id: "nextgen",
        title: "NextGen University",
        description: "Educational hub for new economy talent development.",
        dueDate: "25 Apr",
        comments: 1,
        attachments: 0,
        manager: "Hannah",
        address: "Campus Drive, Zone 9",
      },
    ],
  },
  {
    id: "closed",
    name: "Deal Closed",
    cards: [
      {
        id: "cloudsphere",
        title: "CloudSphere",
        description: "Cloud services for data storage and processing.",
        dueDate: "24 Mar",
        comments: 2,
        attachments: 1,
        manager: "Jason",
        address: "Tower 7, Green Park",
      },
      {
        id: "advantagemedi",
        title: "Advantage Medi",
        description:
          "Full cycle of digital advertising and social media promotion.",
        dueDate: "05 Apr",
        comments: 1,
        attachments: 3,
        manager: "Tara",
        address: "Media Center, Bay 14",
      },
      {
        id: "safebank",
        title: "Safebank Solutions",
        description: "Innovative financial technologies and digital payments.",
        dueDate: "30 Mar",
        comments: 4,
        attachments: 7,
        manager: "Ibrahim",
        address: "Finance District, 5B",
      },
    ],
  },
];

export const ClientDashboard = () => {
  return (
    <DashboardLayout
      title="Client dashboard"
      subtitle="Monitor client progress, deals, and customer activity in one place."
      newCustomers={clientNewCustomers}
      dealSuccessRate={68}
      summaryItems={clientSummary}
      pipelineColumns={clientPipeline}
    />
  );
};
