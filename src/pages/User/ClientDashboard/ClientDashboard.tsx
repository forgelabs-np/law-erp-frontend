import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "@/pages/User/Dashboard/DashboardLayout";

import { StatCardData } from "../Dashboard/StatCard";

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const statCards: StatCardData[] = [
    {
      id: "open-matters",
      label: "Open matters",
      value: 18,
      linkText: "View all matters",
      onClick: () => navigate("/matters"),
    },
    {
      id: "upcoming-deadlines",
      label: "Upcoming deadlines",
      value: 7,
      linkText: "View deadlines",
      onClick: () => navigate("/deadlines"),
    },
    {
      id: "todays-tasks",
      label: "Today's tasks",
      value: 12,
      linkText: "View my tasks",
      onClick: () => navigate("/tasks"),
    },
    {
      id: "recent-contacts",
      label: "Recent contacts",
      value: 8,
      linkText: "View contacts",
      onClick: () => navigate("/contacts"),
    },
  ];
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Your practice at a glance"
      statCards={statCards}
      calendar={{
        selectedDate,
        onDateChange: setSelectedDate,
        todayLabel: "Wed, May 21",
        tasks: [
          { time: "9:00 AM", label: "Client call – Johnson v. Smith" },
          { time: "10:30 AM", label: "Draft demand letter – Patel" },
          { time: "12:00 PM", label: "Court filing – Williams Estate" },
          { time: "2:30 PM", label: "Review discovery – Anderson" },
          { time: "4:00 PM", label: "Follow up – Taylor" },
        ],
        onViewFullCalendar: () => navigate("/calendar"),
      }}
      urgentDeadlines={{
        items: [
          {
            id: "1",
            month: "MAY",
            day: 23,
            title: "Response to Motion – Johnson v. Smith",
            dueLabel: "Due in 2 days",
            onClick: () => {},
          },
          {
            id: "2",
            month: "MAY",
            day: 27,
            title: "Expert Disclosure – Anderson v. Green",
            dueLabel: "Due in 6 days",
            onClick: () => {},
          },
          {
            id: "3",
            month: "MAY",
            day: 30,
            title: "Discovery Responses – Patel v. Lee",
            dueLabel: "Due in 9 days",
            onClick: () => {},
          },
        ],
      }}
      activeMatters={{
        matters: [
          {
            id: "1",
            client: "Johnson, Michael",
            caseType: "Personal Injury",
            stage: "Discovery",
            lastUpdate: "May 20, 2025",
            nextAction: "Review medical records",
          },
          {
            id: "2",
            client: "Patel, Priya",
            caseType: "Contract Dispute",
            stage: "Pleading",
            lastUpdate: "May 19, 2025",
            nextAction: "File response to motion",
          },
          {
            id: "3",
            client: "Johnson, Michael",
            caseType: "Personal Injury",
            stage: "Discovery",
            lastUpdate: "May 20, 2025",
            nextAction: "Review medical records",
          },
          {
            id: "4",
            client: "Patel, Priya",
            caseType: "Contract Dispute",
            stage: "Pleading",
            lastUpdate: "May 19, 2025",
            nextAction: "File response to motion",
          },
          {
            id: "5",
            client: "Johnson, Michael",
            caseType: "Personal Injury",
            stage: "Discovery",
            lastUpdate: "May 20, 2025",
            nextAction: "Review medical records",
          },
          {
            id: "6",
            client: "Patel, Priya",
            caseType: "Contract Dispute",
            stage: "Pleading",
            lastUpdate: "May 19, 2025",
            nextAction: "File response to motion",
          },
        ],
        onRowClick: (matter) => navigate(`/matters/${matter.id}`),
        onViewAll: () => navigate("/matters"),
      }}
    />
  );
};
