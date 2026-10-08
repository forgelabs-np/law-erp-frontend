import {
  Box,
  Button,
  Card,
  Grid,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Palette } from "lucide-react";

import { BrandColorField } from "./BrandColorField";
import { BrandPreview } from "./BrandPreview";

interface FirmBrandingSectionProps {
  branding: {
    primaryColor: string;
    secondaryColor: string;
  };
  setBranding: React.Dispatch<
    React.SetStateAction<{
      primaryColor: string;
      secondaryColor: string;
    }>
  >;
  brandingErrors: Record<string, string>;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export const FirmBrandingSection = ({
  branding,
  setBranding,
  brandingErrors,
  onSave,
  isLoading,
}: FirmBrandingSectionProps) => {
  return (
    <Card.Root border="1px solid" borderColor="gray.200" shadow="xs" borderRadius="xl">
      <Card.Header pb={4} borderBottom="1px solid" borderColor="gray.100">
        <HStack gap={3}>
          <Box
            p={2}
            bg="primary.50"
            color="primary.600"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Palette size={18} />
          </Box>
          <Box>
            <Heading size="md" fontWeight="600" color="gray.900">
              Firm Branding
            </Heading>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              Customize primary and secondary colors across your firm's portal.
            </Text>
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body pt={6}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} alignItems="start">
          {/* Controls column */}
          <Stack gap={5}>
            <BrandColorField
              label="Primary Brand Color"
              description="Main brand color used for buttons, active links, and highlights."
              value={branding.primaryColor}
              onChange={(val) =>
                setBranding((prev) => ({ ...prev, primaryColor: val }))
              }
              error={brandingErrors.primaryColor}
              placeholder="#1A237E"
            />

            <BrandColorField
              label="Secondary Brand Color"
              description="Secondary color used for subtle surfaces, badges, and accents."
              value={branding.secondaryColor}
              onChange={(val) =>
                setBranding((prev) => ({ ...prev, secondaryColor: val }))
              }
              error={brandingErrors.secondaryColor}
              placeholder="#E3F2FD"
            />

            <Box pt={2}>
              <Button
                onClick={onSave}
                loading={isLoading}
                loadingText="Saving Branding..."
                colorPalette="primary"
                size="md"
                px={6}
              >
                Save Branding
              </Button>
            </Box>
          </Stack>

          {/* Live Preview column */}
          <Box>
            <BrandPreview
              primaryColor={branding.primaryColor}
              secondaryColor={branding.secondaryColor}
            />
          </Box>
        </Grid>
      </Card.Body>
    </Card.Root>
  );
};
