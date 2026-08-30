import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  Textarea,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@/shared/components/ui/Dialog";
import { useEffect } from "react";

import {
  CreateCredentialRequest,
  ProjectCredential,
} from "../types/project.types";
import { credentialSchema, CredentialSchemaType } from "@/validations";

interface AddCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCredentialRequest) => void;
  isSubmitting?: boolean;
  initialData?: ProjectCredential | null;
}

const defaultValues: CredentialSchemaType = {
  siteName: "",
  siteType: "",
  siteUrl: "",
  usernameOrEmail: "",
  password: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  notes: "",
};

export const AddCredentialModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData = null,
}: AddCredentialModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CredentialSchemaType>({
    defaultValues,
    resolver: yupResolver(credentialSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    context: { isEdit: !!initialData },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          siteName: initialData.siteName || "",
          siteType: initialData.siteType || "",
          siteUrl: initialData.siteUrl || "",
          usernameOrEmail: initialData.usernameOrEmail || "",
          password: "",
          contactPerson: initialData.contactPerson || "",
          contactPhone: initialData.contactPhone || "",
          contactEmail: initialData.contactEmail || "",
          notes: initialData.notes || "",
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmitHandler = (data: CredentialSchemaType) => {
    onSubmit(data as CreateCredentialRequest);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxW="600px" w="90vw">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Credential" : "Add Credential"}
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogBody maxH="70vh" overflowY="auto">
            <VStack gap={4} align="stretch">
              <Controller
                name="siteName"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Site Name *
                    </Text>
                    <Input
                      {...field}
                      placeholder="e.g., Google Workspace"
                      borderColor={errors.siteName ? "red.500" : undefined}
                    />
                    {errors.siteName && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {errors.siteName.message}
                      </Text>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="siteType"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Site Type *
                    </Text>
                    <Input
                      {...field}
                      placeholder="e.g., Email, Hosting, Domain"
                      borderColor={errors.siteType ? "red.500" : undefined}
                    />
                    {errors.siteType && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {errors.siteType.message}
                      </Text>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="siteUrl"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Site URL
                    </Text>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="https://..."
                    />
                  </Box>
                )}
              />

              <Controller
                name="usernameOrEmail"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Username/Email *
                    </Text>
                    <Input
                      {...field}
                      placeholder="Enter username or email"
                      borderColor={
                        errors.usernameOrEmail ? "red.500" : undefined
                      }
                    />
                    {errors.usernameOrEmail && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {errors.usernameOrEmail.message}
                      </Text>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Password {initialData ? "" : "*"}
                    </Text>
                    <Input
                      {...field}
                      type="password"
                      placeholder={
                        initialData
                          ? "Leave blank to keep unchanged"
                          : "Enter password"
                      }
                      borderColor={errors.password ? "red.500" : undefined}
                    />
                    {errors.password && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {errors.password.message}
                      </Text>
                    )}
                  </Box>
                )}
              />

              <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
                <Controller
                  name="contactPerson"
                  control={control}
                  render={({ field }) => (
                    <Box flex={1}>
                      <Text mb={1} fontSize="sm" fontWeight="500">
                        Contact Person
                      </Text>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Contact person name"
                      />
                    </Box>
                  )}
                />
                <Controller
                  name="contactPhone"
                  control={control}
                  render={({ field }) => (
                    <Box flex={1}>
                      <Text mb={1} fontSize="sm" fontWeight="500">
                        Contact Phone
                      </Text>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Contact phone number"
                      />
                    </Box>
                  )}
                />
              </Flex>

              <Controller
                name="contactEmail"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Contact Email
                    </Text>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="email"
                      placeholder="Contact email"
                      borderColor={errors.contactEmail ? "red.500" : undefined}
                    />
                    {errors.contactEmail && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {errors.contactEmail.message}
                      </Text>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Text mb={1} fontSize="sm" fontWeight="500">
                      Notes
                    </Text>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Additional notes..."
                      rows={3}
                    />
                  </Box>
                )}
              />
            </VStack>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {initialData ? "Save Changes" : "Add Credential"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
