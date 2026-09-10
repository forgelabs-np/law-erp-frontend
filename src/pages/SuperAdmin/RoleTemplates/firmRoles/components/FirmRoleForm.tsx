import { Card, Grid, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Controller } from "react-hook-form";

import { useRoleTemplatesQuery } from "@/api/roleTemplate";
import InputField from "@/shared/components/inputField";
import { FormProvider, ReactSelect } from "@/shared/components";
import { Switch } from "@/shared/components/ui";
import { SelectOptionType } from "@/shared/types";

import { FirmRoleFormValues } from "../types";

/**
 * Reusable form body for creating a custom role on a firm (Super Admin).
 * The parent template is the role's permission ceiling / lineage anchor and
 * is REQUIRED. SUPER_ADMIN is never offered as a base template.
 */
export const FirmRoleForm = ({
  methods,
}: {
  methods: ReturnType<typeof import("react-hook-form").useForm<FirmRoleFormValues>>;
}) => {
  const { control } = methods;
  const { data: templates } = useRoleTemplatesQuery();

  // Only active, editable system templates can anchor a firm role
  const parentOptions: SelectOptionType[] = useMemo(
    () =>
      (templates ?? [])
        .filter(
          (template) =>
            template.isActive &&
            template.code !== "SUPER_ADMIN" &&
            template.isSystem !== false
        )
        .map((template) => ({
          label: `${template.name} (${template.code})`,
          value: template.id,
        })),
    [templates]
  );

  return (
    <Stack gap={6}>
      {/* Role details */}
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
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={{ base: 4, md: 5 }}
          >
            <InputField
              control={control}
              name="name"
              label="Role Name"
              placeholder="e.g. Senior Advocate"
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
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Stack gap={2} justify="center">
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    Status
                  </Text>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(details) =>
                      field.onChange(details.checked)
                    }
                  >
                    {field.value ? "Active" : "Inactive"}
                  </Switch>
                </Stack>
              )}
            />
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* Base template / parent role */}
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
          <Stack gap={0}>
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              Base Template (Parent Role)
            </Text>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              The selected template acts as this role&apos;s permission ceiling.
              SUPER_ADMIN cannot be used as a base template.
            </Text>
          </Stack>
        </Card.Header>
        <Card.Body px={{ base: 4, md: 6 }} py={5}>
          <FormProvider methods={methods}>
            <ReactSelect
              name="parentRoleId"
              label="Base Template"
              placeholder="Select base template"
              options={parentOptions}
              required
            />
          </FormProvider>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
