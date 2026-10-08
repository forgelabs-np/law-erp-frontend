import {
  Box,
  Button,
  Card,
  Field,
  HStack,
  Heading,
  Image,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FileImage, Info, Upload } from "lucide-react";
import { Switch } from "@/shared/components/ui";

interface FirmLogoSectionProps {
  logoUrl: string | null;
  logoAllowed: boolean;
  logoFile: File | null;
  logoError: string | null;
  onToggleAllowed: (details: { checked: boolean }) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => Promise<void>;
  isToggleLoading: boolean;
  isUploadLoading: boolean;
}

export const FirmLogoSection = ({
  logoUrl,
  logoAllowed,
  logoFile,
  logoError,
  onToggleAllowed,
  onFileChange,
  onUpload,
  isToggleLoading,
  isUploadLoading,
}: FirmLogoSectionProps) => {
  return (
    <Card.Root h="100%" border="1px solid" borderColor="gray.200" shadow="xs" borderRadius="xl">
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
            <Upload size={18} />
          </Box>
          <Box>
            <Heading size="md" fontWeight="600" color="gray.900">
              Firm Logo
            </Heading>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              Manage the logo displayed across your firm's NepalCRM experience.
            </Text>
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body pt={6}>
        <Stack gap={6} w="100%">
          {/* Current Logo Preview / Empty State */}
          <Box>
            <Text fontWeight="500" fontSize="sm" color="gray.700" mb={2.5}>
              Current Logo
            </Text>

            {logoUrl ? (
              <Box
                p={4}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                display="inline-block"
                shadow="2xs"
              >
                <Image
                  src={logoUrl}
                  alt="Firm Logo"
                  maxWidth="220px"
                  maxHeight="120px"
                  objectFit="contain"
                />
              </Box>
            ) : (
              <Box
                p={6}
                bg="gray.50"
                border="1px dashed"
                borderColor="gray.200"
                borderRadius="lg"
                textAlign="center"
                maxW="340px"
              >
                <VStack gap={2}>
                  <Box p={2.5} bg="gray.100" color="gray.400" borderRadius="full">
                    <FileImage size={22} />
                  </Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    No logo uploaded
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Your firm's custom logo will appear here once uploaded.
                  </Text>
                </VStack>
              </Box>
            )}
          </Box>

          <Separator borderColor="gray.100" />

          {/* Toggle logo upload permission */}
          <Field.Root>
            <HStack justify="space-between" align="center" gap={4}>
              <Box>
                <Text fontWeight="500" fontSize="sm" color="gray.800">
                  Enable Logo Uploads
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Allow firm members to upload a custom logo
                </Text>
              </Box>
              <Switch
                checked={logoAllowed}
                onCheckedChange={onToggleAllowed}
                disabled={isToggleLoading}
              />
            </HStack>
          </Field.Root>

          {/* Upload Controls when enabled */}
          {logoAllowed ? (
            <Stack gap={4} p={5} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Field.Root invalid={!!logoError}>
                <Field.Label fontWeight="500" fontSize="sm" color="gray.700">
                  Upload Custom Logo
                </Field.Label>
                <VStack
                  p={6}
                  border="2px dashed"
                  borderColor={logoError ? "red.300" : "gray.300"}
                  borderRadius="md"
                  bg="white"
                  gap={2}
                  cursor="pointer"
                  position="relative"
                  _hover={{ borderColor: "primary.400" }}
                  transition="all 0.15s"
                >
                  <Upload size={24} className="text-gray-400" />
                  <Text fontSize="sm" fontWeight="500" color="gray.700">
                    Click to choose or drag an image here
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    PNG, JPG, JPEG or WEBP (Max 200 KiB)
                  </Text>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onFileChange}
                    disabled={isUploadLoading}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </VStack>

                {logoFile && (
                  <Box mt={2} p={2.5} bg="primary.50" borderRadius="md" border="1px solid" borderColor="primary.200">
                    <Text fontSize="xs" fontWeight="500" color="primary.800">
                      Selected File: {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
                    </Text>
                  </Box>
                )}

                {logoError && (
                  <Text color="red.500" fontSize="xs" mt={1}>
                    {logoError}
                  </Text>
                )}
              </Field.Root>

              <Box pt={1}>
                <Button
                  onClick={onUpload}
                  loading={isUploadLoading}
                  loadingText="Uploading Logo..."
                  colorPalette="primary"
                  size="md"
                  disabled={!logoFile}
                  px={6}
                >
                  Upload Logo
                </Button>
              </Box>
            </Stack>
          ) : (
            <HStack gap={2} p={3.5} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200" color="gray.600">
              <Box flexShrink={0} display="flex">
                <Info size={16} />
              </Box>
              <Text fontSize="xs">
                Logo uploads are currently disabled. Enable them above to upload a logo.
              </Text>
            </HStack>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
