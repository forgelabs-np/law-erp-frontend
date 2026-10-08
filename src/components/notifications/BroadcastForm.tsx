import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useBroadcastMutation } from "@/api/notifications";
import {
  broadcastSchema,
  type BroadcastSchemaType,
} from "@/validations/broadcast.validation";
import { FormWrapper } from "@/shared/components/form/wrapper";

const AUDIENCE_OPTIONS = [
  { value: "ALL", label: "All firm users" },
  { value: "ADVOCATE", label: "Advocates" },
  { value: "PARALEGAL", label: "Paralegals" },
  { value: "CLIENT", label: "Clients" },
  { value: "FIRM_ADMIN", label: "Firm Admins" },
];

interface BroadcastFormProps {
  onSuccess?: () => void;
}

export const BroadcastForm = ({ onSuccess }: BroadcastFormProps) => {
  const broadcastMutation = useBroadcastMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<BroadcastSchemaType>({
    resolver: yupResolver(broadcastSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      body: "",
      audience: "ALL",
    },
  });

  const onSubmit = (data: BroadcastSchemaType) => {
    broadcastMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="stretch" gap="4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <FormWrapper
              label="Title"
              required
              errorText={errors.title?.message}
            >
              <Input
                {...field}
                placeholder="e.g. Office closed for holidays"
                maxLength={200}
                disabled={broadcastMutation.isPending}
              />
            </FormWrapper>
          )}
        />

        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <FormWrapper
              label="Message"
              required
              errorText={errors.body?.message}
            >
              <Textarea
                {...field}
                placeholder="Enter your announcement message..."
                maxLength={2000}
                rows={4}
                resize="vertical"
                disabled={broadcastMutation.isPending}
              />
            </FormWrapper>
          )}
        />

        <Controller
          name="audience"
          control={control}
          render={({ field }) => (
            <FormWrapper
              label="Audience"
              required
              errorText={errors.audience?.message}
            >
              <Box
                as="select"
                {...field}
                px="3"
                py="2"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                fontSize="sm"
                bg="white"
                // disabled={broadcastMutation.isPending}
                _focus={{ borderColor: "blue.500", outline: "none" }}
              >
                {AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Box>
            </FormWrapper>
          )}
        />

        <Text fontSize="xs" color="gray.500">
          The announcement will be sent to{" "}
          <Text as="span" fontWeight="600" color="gray.700">
            {AUDIENCE_OPTIONS.find((o) => o.value === "ALL")?.label}
          </Text>{" "}
          as a broadcast notification.
        </Text>

        <HStack justify="flex-end" pt="2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => reset()}
            disabled={broadcastMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            loading={broadcastMutation.isPending}
            disabled={broadcastMutation.isPending || !isValid}
            bg="blue.600"
            color="white"
            _hover={{ bg: "blue.700" }}
          >
            Send Announcement
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
