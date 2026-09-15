import {
  Button,
  Center,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  HStack,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  Portal,
  DialogPositioner,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";

import { useFirmByIdQuery, useGetFirmsQuery } from "@/api/firmManagement";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Stepper } from "@/pages/User/CaseManagement/components/wizard";

import { Step1CreateFirm } from "./Step1CreateFirm";
import { Step2EnableModules } from "./Step2EnableModules";
import { Step3AssignPermissions } from "./Step3AssignPermissions";

const STEPS = [
  { id: 1, title: "Create Firm" },
  { id: 2, title: "Enable Modules" },
  { id: 3, title: "Assign Permissions" },
];

export interface OnboardingState {
  createdFirmId: string | null;
  createdFirmAdminId: string | null;
  createdFirmAdminRoleId: string | null;
  createdFirmAdminUsername: string | null;
  createdFirmName: string | null;
}

const INITIAL_STATE: OnboardingState = {
  createdFirmId: null,
  createdFirmAdminId: null,
  createdFirmAdminRoleId: null,
  createdFirmAdminUsername: null,
  createdFirmName: null,
};

interface FirmOnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export const FirmOnboardingModal = ({
  open,
  onClose,
}: FirmOnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState>(INITIAL_STATE);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    open: exitConfirmOpen,
    onOpen: onExitConfirmOpen,
    onClose: onExitConfirmClose,
  } = useDisclosure();

  const queryClient = useGetFirmsQuery();

  // Ref to trigger Step 1 form submit from footer
  const step1SubmitRef = useRef<(() => void) | null>(null);

  // Fetch firm details when navigating back to Step 1
  const {
    data: firmDetails,
    isLoading: isFirmDetailsLoading,
    isFetching: isFirmDetailsFetching,
    isSuccess: isFirmDetailsSuccess,
  } = useFirmByIdQuery(onboardingState.createdFirmId ?? "", {
    enabled:
      Boolean(onboardingState.createdFirmId) &&
      currentStep === 0 &&
      !isCompleted,
  });

  const handleStep1Success = useCallback(
    (data: {
      firmId: string;
      adminId?: string;
      adminRoleId?: string;
      adminUsername?: string;
      firmName?: string;
    }) => {
      setOnboardingState({
        createdFirmId: data.firmId,
        createdFirmAdminId: data.adminId ?? null,
        createdFirmAdminRoleId: data.adminRoleId ?? null,
        createdFirmAdminUsername: data.adminUsername ?? null,
        createdFirmName: data.firmName ?? null,
      });
      setCurrentStep(1);
    },
    []
  );

  const handleStep2Complete = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const handleStep3Complete = useCallback(() => {
    setIsCompleted(true);
  }, []);

  const handleFinish = useCallback(() => {
    // Invalidate firm list to refresh
    queryClient.refetch();
    setCurrentStep(0);
    setOnboardingState(INITIAL_STATE);
    setIsCompleted(false);
    onClose();
  }, [queryClient, onClose]);

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setOnboardingState(INITIAL_STATE);
    setIsCompleted(false);
    onClose();
  }, [onClose]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleExitClick = useCallback(() => {
    // If firm has been created (Step 1 completed), show confirmation
    if (onboardingState.createdFirmId) {
      onExitConfirmOpen();
    } else {
      handleClose();
    }
  }, [onboardingState.createdFirmId, onExitConfirmOpen, handleClose]);

  const handleConfirmExit = useCallback(() => {
    onExitConfirmClose();
    handleClose();
  }, [onExitConfirmClose, handleClose]);

  const handleStep1Submit = useCallback(() => {
    if (step1SubmitRef.current) {
      step1SubmitRef.current();
    }
  }, []);

  const renderStepContent = useCallback(() => {
    if (isCompleted) {
      return (
        <Stack gap={6} py={8} px={4} alignItems="center" textAlign="center">
          <Stack gap={2} alignItems="center">
            <Text textStyle="heading_4" fontWeight="600">
              Firm Setup Completed
            </Text>
            <Text color="gray.500" maxW="400px">
              The firm and administrator have been successfully configured.
            </Text>
          </Stack>

          <Stack gap={2} alignItems="flex-start" mt={4}>
            <HStack gap={2}>
              <Text color="green.500" fontWeight="600">
                ✓
              </Text>
              <Text fontSize="sm">Firm Created</Text>
            </HStack>
            <HStack gap={2}>
              <Text color="green.500" fontWeight="600">
                ✓
              </Text>
              <Text fontSize="sm">Modules Enabled</Text>
            </HStack>
            <HStack gap={2}>
              <Text color="green.500" fontWeight="600">
                ✓
              </Text>
              <Text fontSize="sm">Permissions Assigned</Text>
            </HStack>
          </Stack>
        </Stack>
      );
    }

    // Show loading when fetching firm details for Step 1 (navigating back)
    if (
      currentStep === 0 &&
      onboardingState.createdFirmId &&
      (isFirmDetailsLoading || isFirmDetailsFetching)
    ) {
      return (
        <Center py={12}>
          <Spinner size="lg" color="primary.500" />
        </Center>
      );
    }

    // Only pass initialData when we have successfully fetched firm details
    // This prevents resetting form with undefined on initial load
    const shouldPassInitialData =
      Boolean(onboardingState.createdFirmId) && isFirmDetailsSuccess;

    switch (currentStep) {
      case 0:
        return (
          <Step1CreateFirm
            onSuccess={handleStep1Success}
            initialData={shouldPassInitialData ? firmDetails : null}
            onSubmitRef={step1SubmitRef}
            createdFirmId={onboardingState.createdFirmId}
          />
        );
      case 1:
        return (
          <Step2EnableModules
            firmId={onboardingState.createdFirmId ?? ""}
            onContinue={handleStep2Complete}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step3AssignPermissions
            firmId={onboardingState.createdFirmId ?? ""}
            onComplete={handleStep3Complete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    isCompleted,
    onboardingState.createdFirmId,
    isFirmDetailsLoading,
    isFirmDetailsFetching,
    isFirmDetailsSuccess,
    firmDetails,
    handleStep1Success,
    handleStep2Complete,
    handleStep3Complete,
    handleBack,
  ]);

  return (
    <>
      <DialogRoot
        open={open}
        onOpenChange={(details) => {
          if (!details.open) {
            handleExitClick();
          }
        }}
        size="xl"
        placement="center"
      >
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent
              maxH="90vh"
              display="flex"
              flexDirection="column"
              my="auto"
            >
              <DialogCloseTrigger />

              {/* Header - Fixed */}
              <DialogHeader flexShrink={0} pb={2}>
                <DialogTitle>Create New Firm</DialogTitle>
                <Text fontSize="sm" color="gray.500">
                  Set up a new firm with modules and permissions
                </Text>
              </DialogHeader>

              {/* Stepper - Fixed */}
              {!isCompleted && (
                <Stack px={6} py={2} flexShrink={0}>
                  <Stepper steps={STEPS} currentStep={currentStep} />
                </Stack>
              )}

              {/* Step Content - Scrollable */}
              <DialogBody flex="1" minH="0" overflowY="auto" px={6} py={4}>
                {renderStepContent()}
              </DialogBody>

              {/* Footer - Fixed */}
              <DialogFooter
                flexShrink={0}
                borderTop="1px solid"
                borderColor="gray.100"
              >
                {isCompleted ? (
                  <Button variant="primary" onClick={handleFinish}>
                    Finish
                  </Button>
                ) : (
                  <HStack gap={3} w="100%" justifyContent="space-between">
                    <HStack gap={3}>
                      {currentStep > 1 && (
                        <Button variant="outline" onClick={handleBack}>
                          Back
                        </Button>
                      )}
                    </HStack>
                    <HStack gap={3}>
                      {currentStep === 0 && (
                        <HStack>
                          <Button onClick={handleClose} variant="outline">
                            Close
                          </Button>

                          <Button variant="primary" onClick={handleStep1Submit}>
                            Create Firm & Continue
                          </Button>
                        </HStack>
                      )}
                      {currentStep === 1 && (
                        <Button variant="primary" onClick={handleStep2Complete}>
                          Continue
                        </Button>
                      )}
                      {currentStep === 2 && (
                        <Button variant="primary" onClick={handleStep3Complete}>
                          Complete Setup
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                )}
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        open={exitConfirmOpen}
        onClose={onExitConfirmClose}
        title="Exit Firm Setup?"
        action="exit the firm setup"
        handleSubmit={handleConfirmExit}
      />
    </>
  );
};
