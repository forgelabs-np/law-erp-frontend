import React from "react";
import { createRoot } from "react-dom/client";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { Provider } from "@/shared/provider/Provider";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { useAuthStore } from "@/shared/stores/auth.store";
import { DashboardPage } from "@/pages/User/Dashboard/DashboardPage";

const params = new URLSearchParams(window.location.search);
const role = params.get("role") ?? "";
const mode = params.get("mode") ?? "full";
const isInner = params.get("inner") === "1";
const root = document.getElementById("probe-root")!;

// ─── Outer mode: render the dashboard in a scaled desktop-width frame ──────
if (!isInner) {
  root.innerHTML = "";
  const scale = 0.31;
  const frame = document.createElement("iframe");
  frame.src = `/dashboard-probe.html?inner=1&role=${encodeURIComponent(role)}&mode=${mode}`;
  frame.style.width = "1440px";
  frame.style.height = "1100px";
  frame.style.border = "0";
  frame.style.transform = `scale(${scale})`;
  frame.style.transformOrigin = "top left";
  const holder = document.createElement("div");
  holder.style.width = `${1440 * scale}px`;
  holder.style.height = `${1100 * scale}px`;
  holder.style.overflow = "hidden";
  holder.appendChild(frame);
  root.appendChild(holder);
} else {
  bootApp();
}

// ─── Mock payloads (shapes follow the documented dashboard contracts) ───────

const FULL: Record<string, unknown> = {
  "dashboard/super-admin": {
    firmStats: {
      totalFirms: 42,
      activeFirms: 33,
      suspendedFirms: 4,
      trialFirms: 5,
    },
    userStats: {
      totalUsers: 318,
      activeUsers: 274,
      byRole: { ADVOCATE: 120, CLIENT: 140, PARALEGAL: 41, FIRM_ADMIN: 17 },
    },
    caseStats: { totalMatters: 970, activeMatters: 640, closedMatters: 330 },
    scraperStats: {
      courtsTracked: 91,
      totalHearings: 5120,
      totalMatches: 412,
      lastScrapeTime: "2026-09-18T09:15:00Z",
    },
    trialAlerts: { expiringThisWeek: 3, expired: 1 },
    recentActivity: [
      {
        summary: "Firm Everest Legal was onboarded",
        action: "FIRM_CREATED",
        entityType: "FIRM",
        userName: "platform.admin",
        createdAt: "2026-09-18T08:00:00Z",
      },
      {
        summary: "Client portal access enabled for Ram Sharma",
        action: "CLIENT_PORTAL_ENABLED",
        entityType: "CLIENT",
        userName: "firm.admin",
        createdAt: "2026-09-17T12:30:00Z",
      },
    ],
    matterTrends: [
      {
        date: "2026-09-12",
        totalMatters: 880,
        activeMatters: 590,
        closedMatters: 290,
        staleMatters: 41,
      },
      {
        date: "2026-09-13",
        totalMatters: 900,
        activeMatters: 600,
        closedMatters: 300,
        staleMatters: 38,
      },
      {
        date: "2026-09-14",
        totalMatters: 918,
        activeMatters: 612,
        closedMatters: 306,
        staleMatters: 36,
      },
      {
        date: "2026-09-15",
        totalMatters: 930,
        activeMatters: 620,
        closedMatters: 310,
        staleMatters: 33,
      },
      {
        date: "2026-09-16",
        totalMatters: 945,
        activeMatters: 628,
        closedMatters: 317,
        staleMatters: 30,
      },
      {
        date: "2026-09-17",
        totalMatters: 958,
        activeMatters: 634,
        closedMatters: 324,
        staleMatters: 28,
      },
      {
        date: "2026-09-18",
        totalMatters: 970,
        activeMatters: 640,
        closedMatters: 330,
        staleMatters: 26,
      },
    ],
  },
  "dashboard/firm": {
    caseStats: {
      totalMatters: 128,
      activeMatters: 74,
      dormantMatters: 12,
      closedMatters: 42,
      staleMatters: 7,
    },
    todayEvents: [
      {
        eventId: "e1",
        matterNumber: "TLAW-MAT-2026-00002",
        matterTitle: "ABC Industries vs XYZ Ltd.",
        eventType: "TARIK",
        scheduledDate: "2026-09-19",
        scheduledTime: "10:30:00",
        status: "SCHEDULED",
        courtRoom: "3",
        judgeName: "Hon. R. Shrestha",
      },
      {
        eventId: "e2",
        matterNumber: "TLAW-MAT-2026-00012",
        matterTitle: "Ram Sharma vs Sita Thapa",
        eventType: "PESHI",
        scheduledDate: "2026-09-19",
        scheduledTime: "13:00:00",
        status: "SCHEDULED",
        courtRoom: "1",
      },
    ],
    upcomingHearings: [
      {
        eventId: "e3",
        matterNumber: "TLAW-MAT-2026-00011",
        matterTitle: "State vs Ramesh Kumar",
        eventType: "PESHI",
        scheduledDate: "2026-09-24",
        scheduledTime: "11:00:00",
        status: "SCHEDULED",
        courtName: "Lalitpur District Court",
      },
      {
        eventId: "e4",
        matterNumber: "TLAW-MAT-2026-00010",
        matterTitle: "Anita Shrestha vs Rajan Shrestha",
        eventType: "TARIK",
        scheduledDate: "2026-09-24",
        scheduledTime: "10:00:00",
        status: "SCHEDULED",
      },
      {
        eventId: "e5",
        matterNumber: "TLAW-MAT-2026-00009",
        matterTitle: "Nepal Telecom vs Global Link",
        eventType: "TARIK",
        scheduledDate: "2026-09-29",
        status: "SCHEDULED",
      },
      {
        eventId: "e6",
        matterNumber: "TLAW-MAT-2026-00002",
        matterTitle: "ABC Industries vs XYZ Ltd.",
        eventType: "PESHI",
        scheduledDate: "2026-10-02",
        status: "SCHEDULED",
      },
    ],
    invoiceStats: {
      totalInvoices: 86,
      paidInvoices: 61,
      unpaidInvoices: 25,
      overdueInvoices: 6,
      totalAmount: 2480000,
      paidAmount: 1810000,
      outstandingAmount: 670000,
      overdueAmount: 145000,
    },
    overdueInvoices: [
      {
        invoiceId: "i1",
        invoiceNumber: "INV-2026-0088",
        clientName: "Ram Sharma",
        amount: 45000,
        currency: "NPR",
        dueDate: "2026-08-30",
        status: "OVERDUE",
      },
      {
        invoiceId: "i2",
        invoiceNumber: "INV-2026-0091",
        clientName: "Himal Foods",
        amount: 100000,
        currency: "NPR",
        dueDate: "2026-09-02",
        status: "OVERDUE",
      },
    ],
    renewalStats: {
      totalRenewals: 40,
      dueThisMonth: 6,
      overdueRenewals: 2,
      upcomingRenewals: 9,
    },
    upcomingRenewals: [
      {
        renewalId: "r1",
        projectCode: "PRJ-2026-14",
        projectName: "Trademark Renewal – Himal Foods",
        renewalType: "TRADEMARK",
        clientName: "Himal Foods",
        dueDate: "2026-10-02",
      },
    ],
    teamCaseload: [
      {
        userId: "u1",
        userName: "Anita Shrestha",
        role: "ADVOCATE",
        openMatters: 18,
        totalMatters: 26,
      },
      {
        userId: "u2",
        userName: "Bikash Thapa",
        role: "PARALEGAL",
        openMatters: 11,
        totalMatters: 15,
      },
      {
        userId: "u3",
        userName: "Sunita Rai",
        role: "ADVOCATE",
        openMatters: 7,
        totalMatters: 9,
      },
    ],
    recentActivity: [
      {
        summary: "Hearing outcome recorded for TLAW-MAT-2026-00002",
        action: "EVENT_HELD",
        entityType: "COURT_EVENT",
        userName: "Anita Shrestha",
        createdAt: "2026-09-18T12:20:00Z",
      },
    ],
  },
  "dashboard/employee": {
    myCaseStats: { openMatters: 18, upcomingHearings: 4, staleMatters: 2 },
    myTodayEvents: [
      {
        eventId: "e3",
        matterNumber: "TLAW-MAT-2026-00002",
        matterTitle: "ABC Industries vs XYZ Ltd.",
        eventType: "TARIK",
        scheduledDate: "2026-09-19",
        scheduledTime: "10:30:00",
        status: "SCHEDULED",
        courtRoom: "3",
      },
    ],
    myUpcomingHearings: [
      {
        eventId: "e4",
        matterNumber: "TLAW-MAT-2026-00012",
        matterTitle: "Ram Sharma vs Sita Thapa",
        eventType: "PESHI",
        scheduledDate: "2026-09-27",
        status: "SCHEDULED",
      },
      {
        eventId: "e7",
        matterNumber: "TLAW-MAT-2026-00010",
        matterTitle: "Anita Shrestha vs Rajan Shrestha",
        eventType: "TARIK",
        scheduledDate: "2026-09-27",
        status: "SCHEDULED",
      },
      {
        eventId: "e8",
        matterNumber: "TLAW-MAT-2026-00009",
        matterTitle: "Nepal Telecom vs Global Link",
        eventType: "PESHI",
        scheduledDate: "2026-10-01",
        status: "SCHEDULED",
      },
    ],
    myUpcomingDeadlines: [
      {
        eventId: "d1",
        matterNumber: "TLAW-MAT-2026-00010",
        matterTitle: "Anita Shrestha vs Rajan Shrestha",
        eventType: "DEADLINE",
        scheduledDate: "2026-09-22",
        purpose: "File written statement",
      },
      {
        eventId: "d2",
        matterNumber: "TLAW-MAT-2026-00002",
        matterTitle: "ABC Industries vs XYZ Ltd.",
        eventType: "DEADLINE",
        scheduledDate: "2026-10-01",
        purpose: "Submit evidence",
      },
    ],
    myStaleMatters: [
      {
        matterId: "m9",
        matterNumber: "TLAW-MAT-2026-00009",
        matterTitle: "Nepal Telecom vs Global Link",
        matterType: "CIVIL",
        matterStatus: "DORMANT",
        courtName: "Kathmandu District Court",
      },
    ],
    recentUpdates: [
      {
        summary: "Document uploaded to TLAW-MAT-2026-00002",
        action: "DOCUMENT_UPLOADED",
        entityType: "DOCUMENT",
        userName: "Anita Shrestha",
        createdAt: "2026-09-18T09:00:00Z",
      },
    ],
  },
  "dashboard/client": {
    myMatterStats: { totalMatters: 3, activeMatters: 2, closedMatters: 1 },
    myMatters: [
      {
        matterId: "m1",
        matterNumber: "TLAW-MAT-2026-00002",
        matterTitle: "ABC Industries vs XYZ Ltd.",
        matterType: "CIVIL",
        matterStatus: "ACTIVE",
        courtName: "Kathmandu District Court",
        nextEventDate: "2026-09-19",
      },
      {
        matterId: "m2",
        matterNumber: "TLAW-MAT-2026-00007",
        matterTitle: "Himal Foods Trademark Opposition",
        matterType: "CORPORATE",
        matterStatus: "ACTIVE",
        courtName: "Patan High Court",
      },
    ],
    myNextHearing: {
      eventId: "e5",
      matterNumber: "TLAW-MAT-2026-00002",
      matterTitle: "ABC Industries vs XYZ Ltd.",
      eventType: "TARIK",
      scheduledDate: "2026-09-19",
      scheduledTime: "10:30:00",
      courtRoom: "3",
      courtName: "Kathmandu District Court",
      attendingAdvocateName: "Anita Shrestha",
    },
    myUpcomingEvents: [
      {
        eventId: "e6",
        matterNumber: "TLAW-MAT-2026-00002",
        matterTitle: "ABC Industries vs XYZ Ltd.",
        eventType: "PESHI",
        scheduledDate: "2026-10-04",
        status: "SCHEDULED",
      },
    ],
    myInvoiceStats: {
      totalInvoices: 5,
      paidInvoices: 3,
      unpaidInvoices: 2,
      overdueInvoices: 1,
      totalAmount: 320000,
      paidAmount: 190000,
      outstandingAmount: 130000,
    },
    myOutstandingInvoices: [
      {
        invoiceId: "i9",
        invoiceNumber: "INV-2026-0102",
        amount: 80000,
        currency: "NPR",
        dueDate: "2026-09-25",
        status: "UNPAID",
      },
    ],
    myRecentUpdates: [
      {
        summary: "Invoice INV-2026-0102 issued",
        action: "INVOICE_CREATED",
        entityType: "INVOICE",
        userName: "Billing",
        createdAt: "2026-09-17T15:00:00Z",
      },
    ],
  },
};

const EMPTY: Record<string, unknown> = {
  "dashboard/super-admin": {
    firmStats: {},
    userStats: { byRole: [] },
    caseStats: {},
    scraperStats: {},
    trialAlerts: {},
    recentActivity: [],
    matterTrends: [],
  },
  "dashboard/firm": {
    caseStats: {},
    todayEvents: [],
    upcomingHearings: [],
    invoiceStats: {},
    overdueInvoices: [],
    renewalStats: {},
    upcomingRenewals: [],
    teamCaseload: [],
    recentActivity: [],
  },
  "dashboard/employee": {
    myCaseStats: {},
    myTodayEvents: [],
    myUpcomingHearings: [],
    myUpcomingDeadlines: [],
    myStaleMatters: [],
    recentUpdates: [],
  },
  "dashboard/client": {
    myMatterStats: {},
    myMatters: [],
    myNextHearing: null,
    myUpcomingEvents: [],
    myInvoiceStats: {},
    myOutstandingInvoices: [],
    myRecentUpdates: [],
  },
};

function bootApp() {
  const requested: string[] = [];

  LawFirmCRMClient.defaults.adapter = async (
    config: InternalAxiosRequestConfig
  ) => {
    const url = config.url ?? "";
    requested.push(url);
    const key = Object.keys(FULL).find((endpoint) => url.includes(endpoint));
    const source = mode === "empty" ? EMPTY : FULL;
    return {
      data: {
        success: true,
        message: "ok",
        responseCode: 200,
        data: key ? source[key] : {},
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    } as AxiosResponse;
  };

  useAuthStore.setState({
    user: { username: "probe", email: "probe@example.com", role },
    firm: {
      id: "firm-1",
      name: "Probe & Associates",
      code: "PROBE",
      trial: false,
      daysRemaining: null,
      trialExpiresAt: null,
      status: "ACTIVE",
    },
    role,
    isInitialized: true,
    isLoading: false,
    permissions: [],
    modules: [],
  });

  const publish = () => {
    const text = root.innerText;
    (window as unknown as { __probe: unknown }).__probe = {
      role,
      mode,
      requestedUrls: Array.from(new Set(requested)),
      requestCount: requested.length,
      heading: text.split("\n")[0] ?? "",
      svgCount: root.querySelectorAll("svg.recharts-surface").length,
      hasObjectObject: text.includes("[object Object]"),
      hasUndefined: text.includes("undefined") || text.includes("NaN"),
      horizontalOverflow: root.scrollWidth > root.clientWidth,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      rootWidth: `${root.clientWidth}`,
      text: text.replace(/\s+/g, " ").slice(0, 2400),
    };
  };

  const Probe = () => {
    React.useEffect(() => {
      const timers = [1200, 2500, 4000, 6000].map((delay) =>
        window.setTimeout(publish, delay)
      );
      return () => timers.forEach(window.clearTimeout);
    }, []);
    return <DashboardPage />;
  };

  createRoot(root).render(
    <Provider>
      <Probe />
    </Provider>
  );
}
