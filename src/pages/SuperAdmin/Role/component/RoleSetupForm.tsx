import { Card, Grid, Stack, Text } from "@chakra-ui/react";
import { Control } from "react-hook-form";

import { PermissionAssignment } from "@/components/PermissionAssignment";
import InputField from "@/shared/components/inputField";

import { RoleFormValues } from "../types";

export const RoleSetupForm = ({
  control,
}: {
  isOpen: boolean;
  control: Control<RoleFormValues>;
}) => {
  return (
    <Stack gap={6}>
      {/* ── Role Details ────────────────────────────────────────── */}
      <Card.Root
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Card.Header
          px={{ base: 4, md: 6 }}
          py={4}
          bg="gray.50"
          borderBottomWidth="1px"
          borderColor="gray.100"
        >
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            Role Details
          </Text>
        </Card.Header>
        <Card.Body px={{ base: 4, md: 6 }} py={5}>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
            gap={{ base: 4, md: 5 }}
          >
            <InputField
              control={control}
              name="name"
              label="Role Name"
              placeholder="e.g. Admin"
              required
            />
            <InputField
              control={control}
              name="code"
              label="Role Code"
              placeholder="Enter Role Code"
              required
            />
            <InputField
              control={control}
              name="description"
              label="Description"
              placeholder="Enter Description"
            />
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* ── Permissions Section (shared permission assignment UI) ── */}
      <PermissionAssignment control={control} fieldNamePrefix="permissions" />
    </Stack>
  );
};
