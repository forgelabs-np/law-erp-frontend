import { useCallback, useState } from "react";
import type { UseFormClearErrors, UseFormSetValue } from "react-hook-form";

import type { Client } from "@/pages/User/ClientManagement/types";
import type { ProjectSchemaType } from "@/validations";

import type {
  CreateProjectRequest,
  ProjectClientType,
} from "../types/project.types";

/** Step 1 = client type selection, step 2 = the project details form. */
export type ProjectCreateStep = "select" | "form";

interface UseProjectCreateFlowArgs {
  clientType: ProjectClientType | null;
  setClientType: (clientType: ProjectClientType | null) => void;
  setValue: UseFormSetValue<ProjectSchemaType>;
  clearErrors: UseFormClearErrors<ProjectSchemaType>;
}

/**
 * Shared create-project flow logic used by BOTH the Projects page modal and
 * the dedicated Create Project page, so the two flows never diverge:
 *
 * - `step`: "select" (client type) → "form" (project details), with a back
 *   navigation that preserves the selected client type and entered values.
 * - `selectClientType`: when the user switches client type, the client field
 *   belonging to the OTHER mode is cleared so a stale value can never leak
 *   into the next submission.
 * - `reset`: full reset used when the modal/page flow is closed or cancelled.
 */
export const useProjectCreateFlow = ({
  clientType,
  setClientType,
  setValue,
  clearErrors,
}: UseProjectCreateFlowArgs) => {
  const [step, setStep] = useState<ProjectCreateStep>("select");

  const selectClientType = useCallback(
    (type: ProjectClientType) => {
      if (type === clientType) return;

      if (type === "new") {
        // Leaving "Existing Client": drop the selected client user.
        setValue("clientUserId", "");
        clearErrors("clientUserId");
      } else {
        // Leaving "New Client": drop the typed client name.
        setValue("clientName", "");
        clearErrors("clientName");
      }
      setClientType(type);
    },
    [clientType, setClientType, setValue, clearErrors]
  );

  const goToForm = useCallback(() => setStep("form"), []);
  const goToSelection = useCallback(() => setStep("select"), []);

  const reset = useCallback(() => {
    setClientType(null);
    setStep("select");
  }, [setClientType]);

  return { step, selectClientType, goToForm, goToSelection, reset };
};

/**
 * Builds the create-project payload for the selected client type using the
 * existing `CreateProjectRequest` contract — no renamed/invented fields and
 * only the client information relevant to the active mode:
 *
 * - Existing Client → `clientUserId` plus the selected client's name (kept in
 *   sync with the selection; the projects list/details display `clientName`,
 *   so it is never left stale or empty).
 * - New Client → typed `clientName`, and `clientUserId` is omitted entirely
 *   rather than sent empty.
 */
export const buildCreateProjectPayload = (
  data: ProjectSchemaType,
  clientType: ProjectClientType | null,
  clients: Client[]
): CreateProjectRequest => {
  const base = {
    name: data.name,
    ownerId: data.ownerId,
    startDate: data.startDate,
    targetEndDate: data.targetEndDate,
    description: data.description,
  };

  if (clientType === "existing") {
    const selectedClient = clients.find(
      (client) => client.id === data.clientUserId
    );

    return {
      ...base,
      clientName: selectedClient?.fullName ?? "",
      clientUserId: data.clientUserId,
    };
  }

  return {
    ...base,
    // `clientName` is only part of the form in "New Client" mode, where it is
    // validated as required; the fallback keeps the payload type-safe.
    clientName: data.clientName ?? "",
  };
};
