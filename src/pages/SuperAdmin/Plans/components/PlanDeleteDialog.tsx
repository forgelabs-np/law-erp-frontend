import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useDeletePlanMutation } from "@/api/planManagement";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/shared/components/ui";
import { Plan } from "@/shared/types/plan";
import {
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/shared/utils/apiError";

export const PlanDeleteDialog = ({
  open,
  onClose,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
}) => {
  const { mutateAsync, isPending } = useDeletePlanMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReferenced, setIsReferenced] = useState(false);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIsReferenced(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!plan || isPending) return;
    setErrorMessage(null);
    setIsReferenced(false);
    try {
      await mutateAsync(plan.id);
      onClose();
    } catch (error) {
      // The backend message is the authority — surface it directly.
      setErrorMessage(
        getApiErrorMessage(error, "The plan could not be deleted.")
      );
      setIsReferenced(getApiErrorStatus(error) === 409);
    }
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={() => {
        if (!isPending) onClose();
      }}
      closeOnInteractOutside={false}
      closeOnEscape={!isPending}
    >
      <DialogBackdrop />
      <DialogContent borderRadius="2xl" maxW="lg">
        <DialogCloseTrigger disabled={isPending} />
        <DialogHeader>
          <DialogTitle fontSize="lg">Delete plan?</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Stack gap={4}>
            <Text fontSize="sm" color="gray.600" lineHeight="1.7">
              <Text as="span" fontWeight="600">
                {plan?.name ?? "This plan"}
              </Text>{" "}
              and its module links will be permanently removed. This cannot be
              undone.
            </Text>

            <Box
              borderWidth="1px"
              borderColor="orange.200"
              bg="orange.50"
              borderRadius="lg"
              px={4}
              py={3}
            >
              <Text fontSize="xs" color="gray.700" lineHeight="1.7">
                A plan that a firm is subscribed to cannot be deleted. Deactivate
                it instead — deactivated plans stop appearing on the pricing page
                and cannot be used for new trials or conversions, while existing
                firms keep working.
              </Text>
            </Box>

            {errorMessage && (
              <Box
                borderWidth="1px"
                borderColor="red.200"
                bg="red.50"
                borderRadius="lg"
                px={4}
                py={3}
                role="alert"
              >
                <Text fontSize="xs" color="red.700" lineHeight="1.7">
                  {errorMessage}
                  {isReferenced &&
                    " Deactivate this plan instead of deleting it."}
                </Text>
              </Box>
            )}
          </Stack>
        </DialogBody>

        <DialogFooter gap={3}>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            bg="red.600"
            color="white"
            _hover={{ bg: "red.700" }}
            loading={isPending}
            onClick={handleDelete}
          >
            Delete plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
