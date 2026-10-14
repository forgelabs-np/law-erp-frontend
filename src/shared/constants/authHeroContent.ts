import caseManagementIllustration from "@/assets/svgs/login/img -3.svg";
import clientRecordsIllustration from "@/assets/svgs/login/img 1.svg";
import teamCollaborationIllustration from "@/assets/svgs/login/img-2.svg";
import clientCommunicationIllustration from "@/assets/svgs/login/img-4.svg";
import caseRecordsIllustration from "@/assets/svgs/login/img-5.svg";
import legalPracticeIllustration from "@/assets/svgs/login/img-6.svg";
import documentManagementIllustration from "@/assets/svgs/login/img-7.svg";
import courtHearingsIllustration from "@/assets/svgs/login/img-8.svg";

/**
 * Static brand block rendered above the rotating illustration.
 * Kept beside the slide content so the hero has a single source of copy.
 */
export const AUTH_HERO_BRAND = {
  name: "Tarikh",
  tagline: "Simplify your LawFirm with our user friendly admin dashboard.",
} as const;

export interface AuthHeroSlide {
  /** Stable key — also used as the animation key for the slide. */
  id: string;
  /** Bundled SVG illustration (Vite asset URL). */
  image: string;
  title: string;
  description: string;
}

/**
 * Single source of truth for the shared authentication hero.
 *
 * The illustration, heading and description of a slide always travel together,
 * and captions describe capability that the platform actually provides.
 */
export const AUTH_HERO_SLIDES: AuthHeroSlide[] = [
  {
    id: "case-management",
    image: caseManagementIllustration,
    title: "Case & Matter Management",
    description:
      "Organise matter details, case notes and key dates in one workspace.",
  },
  {
    id: "client-records",
    image: clientRecordsIllustration,
    title: "Client Records",
    description:
      "Keep client details and matter history together for quick reference.",
  },
  {
    id: "team-collaboration",
    image: teamCollaborationIllustration,
    title: "Team Collaboration",
    description:
      "Share matters and documents with the right members of your firm.",
  },
  {
    id: "client-communication",
    image: clientCommunicationIllustration,
    title: "Client Communication",
    description:
      "Keep client conversations and case updates in a single record.",
  },
  {
    id: "case-records",
    image: caseRecordsIllustration,
    title: "Digital Case Records",
    description:
      "Track matter progress and case information without paper files.",
  },
  {
    id: "legal-practice",
    image: legalPracticeIllustration,
    title: "Built for Legal Practice",
    description:
      "A practice management platform shaped around how law firms work.",
  },
  {
    id: "document-management",
    image: documentManagementIllustration,
    title: "Document Management",
    description: "Store, organise and share case documents in one place.",
  },
  {
    id: "court-hearings",
    image: courtHearingsIllustration,
    title: "Court Hearing Tracking",
    description:
      "Follow hearing dates and case status alongside your matter records.",
  },
];
