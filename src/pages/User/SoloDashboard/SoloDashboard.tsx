import {
  DashboardLayout,
  NewCustomerEntry,
  PipelineColumnData,
  SummaryItem,
} from "@/pages/User/Dashboard/DashboardLayout";

const soloNewCustomers: NewCustomerEntry[] = [
  { label: "Mon", value: 5, active: true },
  { label: "Tue", value: 8, active: false },
  { label: "Wed", value: 6, active: true },
  { label: "Thu", value: 3, active: false },
  { label: "Fri", value: 9, active: true },
];

const soloSummary: SummaryItem[] = [
  {
    id: "tasks",
    title: "Tasks in progress",
    value: "34",
    label: "Active",
    accent: false,
  },
  {
    id: "revenue",
    title: "Opportunities value",
    value: "$9.240",
    label: "Monthly",
    accent: true,
  },
];

const soloPipeline: PipelineColumnData[] = [
  {
    id: "contacted",
    name: "Contacted",
    cards: [
      {
        id: "nodepulse",
        title: "NodePulse",
        description: "Legal guidance for cloud-native companies.",
        dueDate: "12 Apr",
        comments: 3,
        attachments: 2,
        manager: "Olivia",
        address: "Tech Park, Floor 7",
      },
      {
        id: "verdance",
        title: "Verdance",
        description: "Sustainable business consulting for small teams.",
        dueDate: "14 Apr",
        comments: 2,
        attachments: 1,
        manager: "Sanjay",
        address: "Greenway Avenue, 27",
      },
      {
        id: "craftify",
        title: "Craftify",
        description: "Creative agency support for branding and IP.",
        dueDate: "No due date",
        comments: 1,
        attachments: 0,
        manager: "Mira",
        address: "Design Loft, 9B",
      },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    cards: [
      {
        id: "altwaves",
        title: "AltWaves",
        description: "Audio production and licensing services.",
        dueDate: "18 Apr",
        comments: 5,
        attachments: 2,
        manager: "Jasper",
        address: "Studio Square, 3",
      },
      {
        id: "nimbus",
        title: "Nimbus",
        description: "Business analytics and compliance tools.",
        dueDate: "20 Apr",
        comments: 1,
        attachments: 4,
        manager: "Karen",
        address: "Data Hub, 22",
      },
    ],
  },
  {
    id: "offer",
    name: "Offer Sent",
    cards: [
      {
        id: "pulsehealth",
        title: "PulseHealth",
        description: "Medical device adoption and regulatory approval.",
        dueDate: "25 Apr",
        comments: 2,
        attachments: 1,
        manager: "Reza",
        address: "Health Lane, 12",
      },
      {
        id: "ricore",
        title: "Ricore Labs",
        description: "Prototype development for pharmaceutical startups.",
        dueDate: "April 29",
        comments: 4,
        attachments: 2,
        manager: "Ebony",
        address: "Lab Street, 40",
        highlight: true,
      },
    ],
  },
  {
    id: "closed",
    name: "Deal Closed",
    cards: [
      {
        id: "finova",
        title: "Finova",
        description: "Financial platform legalization and tax advisory.",
        dueDate: "01 Apr",
        comments: 2,
        attachments: 4,
        manager: "Grace",
        address: "Commerce Tower, 11",
      },
      {
        id: "lumea",
        title: "Lumea",
        description: "Clean energy exchange and tariffs compliance.",
        dueDate: "07 Apr",
        comments: 3,
        attachments: 2,
        manager: "Victor",
        address: "Energy Plaza, 8",
      },
    ],
  },
];

export const SoloDashboard = () => {
  return (
    <DashboardLayout
      title="Solo dashboard"
      subtitle="Stay on top of your deals, case progress, and new customers."
      newCustomers={soloNewCustomers}
      dealSuccessRate={74}
      summaryItems={soloSummary}
      pipelineColumns={soloPipeline}
    />
  );
};
