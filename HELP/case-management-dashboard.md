# Case Management Dashboard

## What this module does

The Case Management Dashboard is the central operational hub for law firms in NepalCRM. It provides an immediate overview of active matters, upcoming court hearings, court positioning, caseload statistics, and stale matters that require attorney attention.

## What was built

- `CaseDashboardPage.tsx`: Primary page component composing layout, fetching firm dashboard metrics, handling permission checks (`CASE_MANAGEMENT:VIEW`), and managing refresh/error states.
- `CaseDashboardLayout.tsx`: Responsive two-column dashboard grid providing an ~74% main content area on the left and an ~26% utility sidebar on the right on desktop, with vertical stacking on tablet and mobile.
- `CasePositioningSection.tsx`: Orchestrates case filtering, search, and table presentation.
- `CasePositioningToolbar.tsx`: Top filter toolbar providing client-side status filtering, matter type filtering, real-time search across matter titles, numbers, court references and court names, and reset actions.
- `CasePositioningTable.tsx`: Streamlined 5-column data table displaying matter details (title, initials avatar, number, type), court name, dot status badges, last hearing details (with days elapsed), and next court events with client-side pagination (`< 1 2 3 >`) and interactive, keyboard-accessible clickable rows.
- `DashboardStatsPanel.tsx`: Compact caseload statistics card with an active-to-total ratio progress bar and breakdown rows for Active, Total, Closed, Dormant, Today's Events, and Stale matters.
- `CourtEventsPanel.tsx`: Sidebar card displaying today's scheduled hearings (Peshi/Tarik), scheduled times, courtroom/judge assignments, or a clean empty state with a direct shortcut to the calendar.
- `StaleMattersPanel.tsx`: Sidebar card displaying cases without recent hearings, days since last hearing badges, and a direct shortcut to the stale matters view.
- `ContextualHelpCard.tsx`: Dark-slate legal workflow helper card with a watermark scale icon providing quick navigation to all matters.

## API Endpoints

Consumed by the dashboard:

- `GET /api/v1/dashboard/firm`
  - Auth required: Yes (`Authorization: Bearer <accessToken>`)
  - Request body: None
  - Success response: Status `200 OK`
  ```json
  {
    "success": true,
    "responseCode": 200,
    "message": "Dashboard fetched successfully",
    "data": {
      "stats": {
        "totalMatters": 2,
        "activeMatters": 2,
        "dormantMatters": 0,
        "closedMatters": 0,
        "todayEventsCount": 0,
        "staleCount": 0
      },
      "todayEvents": [],
      "casePositioning": [],
      "staleCases": []
    }
  }
  ```
  - Error responses:
    - `401 Unauthorized`: Token missing or expired.
    - `403 Forbidden`: User role lacks `CASE_MANAGEMENT:VIEW` permission.
    - `500 Internal Server Error`: Backend error message.

## Example request/response

```bash
curl -X GET "https://api.nepalcrm.com/api/v1/dashboard/firm" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Accept: application/json"
```

Response:

```json
{
  "success": true,
  "message": "Dashboard fetched successfully",
  "responseCode": 200,
  "data": {
    "casePositioning": [
      {
        "matterId": "f9885873-e5cc-4190-9400-5358c20b020f",
        "matterNumber": "TLAW-MAT-2026-00001",
        "matterTitle": "Dicorece",
        "matterType": "CIVIL",
        "matterStatus": "ACTIVE",
        "courtCaseId": "0ee8765f-568d-45c3-809f-3896db3ac6ab",
        "ourCourtCaseRef": "TLAW-MAT-2026-00001-DC1",
        "courtName": "Kathmandu District Court",
        "stage": "FILED",
        "caseStatus": "ACTIVE",
        "advocateId": "31fbb032-c559-4151-aaff-785f9f3dcb63",
        "lastHearingDate": "2026-09-28",
        "lastHearingType": "PESHI",
        "lastHearingStatus": "SCHEDULED",
        "lastHearingOutcome": null,
        "nextEventDate": "2026-09-26",
        "nextEventType": "PESHI",
        "nextEventCourtRoom": null,
        "nextEventJudge": null,
        "totalEvents": 2,
        "daysSinceLastHearing": 13,
        "stale": false
      }
    ],
    "staleCases": [],
    "stats": {
      "totalMatters": 2,
      "activeMatters": 2,
      "dormantMatters": 0,
      "closedMatters": 0,
      "todayEventsCount": 0,
      "staleCount": 0
    },
    "todayEvents": []
  }
}
```

## Frontend implementation notes

- **Hooks & State**: Uses `useFirmDashboardQuery` from `../api/dashboard.api` (React Query key `["firm-dashboard"]`). Refetching is triggered by the "Refresh" action button without manual cache mutation.
- **Strict Typing**: Fully typed with `CaseDashboardData`, `CasePositioning`, `TodayEvent`, `MatterType`, and `CourtCaseStage`. Zero usage of TypeScript `any`.
- **Date & Value Safety**: Handles null dates, null outcomes, null court rooms, and null judges gracefully with `—` fallbacks.
- **Client-Side Filtering & Pagination**: The toolbar provides real-time local filtering by status, type, and search query across the fetched array without additional API requests. Pagination divides data into 5 records per page with active page indicators.
- **Mobile Responsiveness**: On desktop (`xl` and above), a two-column grid (`minmax(0, 2.8fr) minmax(320px, 1fr)`) separates the table and sidebar. On tablet and mobile (`base` to `lg`), the sidebar stacks beneath the table. The table container scrolls horizontally on narrow mobile screens while keeping the surrounding application layout fixed.
- **Navigation**: Preserves existing navigation paths: row clicks route to `/cases/:matterNumber`, header actions route to `/cases`, `/stale-matters`, and `/cases/create`.

## Open items / not yet implemented

- None for this dashboard redesign. Backend provides advocate display name in `TodayEvent`, which is used for matching advocate IDs in `CasePositioning` when present; otherwise neutral "Assigned" / "—" indicator is displayed.
