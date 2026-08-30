import * as yup from "yup";

// Court Event Form (used in CourtEventFormModal and CalendarEventFormModal)
export const courtEventSchema = yup.object({
  eventType: yup.string().required("Event type is required"),
  scheduledDate: yup.string().required("Date is required"),
  scheduledTime: yup.string().notRequired(),
  endTime: yup.string().notRequired(),
  attendingAdvocateId: yup.string().notRequired(),
  judgeName: yup.string().trim().notRequired(),
  courtRoom: yup.string().trim().notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type CourtEventSchemaType = yup.InferType<typeof courtEventSchema>;

// Calendar Event Form (includes matter number)
export const calendarEventSchema = yup.object({
  matterNumber: yup.string().required("Matter is required"),
  eventType: yup.string().required("Event type is required"),
  scheduledDate: yup.string().required("Date is required"),
  scheduledTime: yup.string().notRequired(),
  endTime: yup.string().notRequired(),
  attendingAdvocateId: yup.string().notRequired(),
  judgeName: yup.string().trim().notRequired(),
  courtRoom: yup.string().trim().notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type CalendarEventSchemaType = yup.InferType<typeof calendarEventSchema>;

// Add Party Form
export const partySchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  mobileNo: yup.string().trim().notRequired(),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .notRequired()
    .test("is-empty-or-valid", "Enter a valid email address", (value) => {
      if (!value) return true;
      return yup.string().email().isValidSync(value);
    }),
  roleType: yup.string().required("Role is required"),
  representation: yup.string().required("Representation is required"),
  isOurClient: yup.boolean().required(),
  clientId: yup.string().notRequired(),
});

export type PartySchemaType = yup.InferType<typeof partySchema>;

// Edit Matter Form
export const editMatterSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: yup.string().trim().notRequired(),
  assignedPartnerId: yup.string().notRequired(),
  status: yup.string().required("Status is required"),
});

export type EditMatterSchemaType = yup.InferType<typeof editMatterSchema>;

// Event Held Form
export const eventHeldSchema = yup.object({
  outcome: yup
    .string()
    .trim()
    .required("Outcome is required")
    .min(2, "Please describe what happened"),
  outcomeType: yup.string().required("Outcome type is required"),
  nextEventType: yup.string().required("Next event type is required"),
  nextEventDate: yup.string().when("nextEventType", {
    is: (val: string) => val === "TARIK" || val === "PESHI",
    then: (schema) => schema.required("Next date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  nextEventTime: yup.string().notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type EventHeldSchemaType = yup.InferType<typeof eventHeldSchema>;

// Judgment Form
export const judgmentSchema = yup.object({
  judgmentDate: yup.string().required("Judgment date is required"),
  judgmentSummary: yup
    .string()
    .trim()
    .required("Judgment summary is required")
    .min(2, "Judgment summary must be at least 2 characters"),
  decisionInFavorOfPartyId: yup.string().notRequired(),
  partyIsState: yup.boolean().required(),
});

export type JudgmentSchemaType = yup.InferType<typeof judgmentSchema>;
