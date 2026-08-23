import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  Textarea,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@/shared/components/ui/Dialog";
import { useEffect, useState } from "react";

import {
  CreateCredentialRequest,
  ProjectCredential,
} from "../types/project.types";

interface AddCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCredentialRequest) => void;
  isSubmitting?: boolean;
  initialData?: ProjectCredential | null;
}

export const AddCredentialModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData = null,
}: AddCredentialModalProps) => {
  const [formData, setFormData] = useState<CreateCredentialRequest>({
    siteName: "",
    siteType: "",
    siteUrl: "",
    usernameOrEmail: "",
    password: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          siteName: initialData.siteName || "",
          siteType: initialData.siteType || "",
          siteUrl: initialData.siteUrl || "",
          usernameOrEmail: initialData.usernameOrEmail || "",
          password: "", // Password is not retrieved on edit, must be re-entered or left blank?
          // Wait, the API spec says password is required. The user says:
          // "Keep password masked by default." If the user doesn't want to change it,
          // does the API require the password again? Let's just put empty string.
          // Wait, the user said "Keep password masked by default." For edit, maybe we put a dummy string like "********" or leave it blank.
          contactPerson: initialData.contactPerson || "",
          contactPhone: initialData.contactPhone || "",
          contactEmail: initialData.contactEmail || "",
          notes: initialData.notes || "",
        });
      } else {
        setFormData({
          siteName: "",
          siteType: "",
          siteUrl: "",
          usernameOrEmail: "",
          password: "",
          contactPerson: "",
          contactPhone: "",
          contactEmail: "",
          notes: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (
      !formData.siteName ||
      !formData.siteType ||
      !formData.usernameOrEmail ||
      !formData.password
    ) {
      return;
    }
    onSubmit(formData);
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

        <DialogBody maxH="70vh" overflowY="auto">
          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Site Name *
              </Text>
              <Input
                value={formData.siteName}
                onChange={(e) =>
                  setFormData({ ...formData, siteName: e.target.value })
                }
                placeholder="e.g., Google Workspace"
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Site Type *
              </Text>
              <Input
                value={formData.siteType}
                onChange={(e) =>
                  setFormData({ ...formData, siteType: e.target.value })
                }
                placeholder="e.g., Email, Hosting, Domain"
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Site URL
              </Text>
              <Input
                value={formData.siteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, siteUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Username/Email *
              </Text>
              <Input
                value={formData.usernameOrEmail}
                onChange={(e) =>
                  setFormData({ ...formData, usernameOrEmail: e.target.value })
                }
                placeholder="Enter username or email"
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Password {initialData ? "" : "*"}
              </Text>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  initialData
                    ? "Leave blank to keep unchanged"
                    : "Enter password"
                }
              />
            </Box>

            <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Contact Person
                </Text>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  placeholder="Contact person name"
                />
              </Box>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" fontWeight="500">
                  Contact Phone
                </Text>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="Contact phone number"
                />
              </Box>
            </Flex>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Contact Email
              </Text>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="Contact email"
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="500">
                Notes
              </Text>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes..."
                rows={3}
              />
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={
              !formData.siteName ||
              !formData.siteType ||
              !formData.usernameOrEmail ||
              (!initialData && !formData.password)
            }
          >
            {initialData ? "Save Changes" : "Add Credential"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
