import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Separator,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock,
  Key,
  Loader2,
  Shield,
  ShieldCheck,
  User as UserIcon,
  UserX,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import {
  useUserProfileQuery,
  useUserPermissionsQuery,
  useUserActivityQuery,
  useResetPasswordMutation,
} from "@/api/userManagement";
import { Avatar } from "@/shared/components/ui";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/shared/components/ui/Accordion";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { ROUTES_CONFIG } from "@/shared/config";

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const {
    open: resetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useUserProfileQuery(userId ?? "");
  const { data: permissions, isLoading: permsLoading } =
    useUserPermissionsQuery(userId ?? "");
  const { data: activityData, isLoading: activityLoading } =
    useUserActivityQuery(userId ?? "");
  const { mutate: resetPassword, isPending: isResetPending } =
    useResetPasswordMutation();

  if (profileError) {
    return (
      <Box textAlign="center" py={12} px={8}>
        <Text fontSize="lg" color="red.500" mb={4}>
          Failed to load user profile
        </Text>
        <Button
          onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
          variant="outline"
        >
          Back to Users
        </Button>
      </Box>
    );
  }

  if (profileLoading) {
    return (
      <Stack gap={6} p={8}>
        <HStack gap={4}>
          <Skeleton borderRadius="full" boxSize="80px" />
          <Stack gap={2}>
            <Skeleton height="24px" width="200px" />
            <Skeleton height="16px" width="140px" />
          </Stack>
        </HStack>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="100px" borderRadius="lg" />
          ))}
        </Grid>
        <Skeleton height="200px" borderRadius="lg" />
      </Stack>
    );
  }

  if (!profile) return null;

  // ── Permissions ───────────────────────────────────────────────────────────
  // API returns { allPermissions: [...], byModule: [{ moduleName, permissions }], ... }
  const byModule: {
    moduleName?: string;
    permissions?: string[];
    module?: string;
    actions?: string[];
  }[] = (permissions as any)?.byModule ?? [];
  const allPermissions: any[] = (permissions as any)?.allPermissions ?? [];

  // Build groupedPermissions from byModule: each item has a module name + permission/action array
  const groupedPermissions: Record<string, string[]> = {};
  for (const mod of byModule) {
    const moduleName = mod.moduleName || mod.module || "General";
    const perms: string[] = mod.permissions ?? mod.actions ?? [];
    groupedPermissions[moduleName] = perms;
  }

  const permissionsCount = allPermissions.length;
  const modulesCount = byModule.length;

  // ── Activity ──────────────────────────────────────────────────────────────
  const activities = Array.isArray(activityData) ? activityData : [];
  const actionsThisMonth = activities.length;

  return (
    <Stack gap={6} p={8}>
      {/* Back button */}
      <Button
        variant="ghost"
        alignSelf="flex-start"
        onClick={() => navigate(ROUTES_CONFIG.USER.USER_MANAGEMENT)}
        size="sm"
      >
        ← Back to Users
      </Button>

      {/* Header Card */}
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
      >
        <HStack
          gap={6}
          align="center"
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <Avatar name={profile.fullName} size="2xl" colorPalette="blue" />
          <Stack gap={1} flex={1}>
            <HStack gap={3} align="center" flexWrap="wrap">
              <Text textStyle="heading_3" fontWeight="700">
                {profile.fullName}
              </Text>
              <Badge
                bg={profile.isActive ? "green.100" : "red.100"}
                color={profile.isActive ? "green.700" : "red.700"}
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {profile.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge
                bg="blue.100"
                color="blue.700"
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {profile.userType}
              </Badge>
            </HStack>
            <Text color="gray.500" fontSize="sm">
              @{profile.username}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {profile.email}
            </Text>
          </Stack>
          <VStack gap={2} align="flex-end">
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              // leftIcon={<Key size={14} />}
              onClick={onResetOpen}
            >
              Reset Password
            </Button>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              // leftIcon={<UserX size={14} />}
              disabled
            >
              Deactivate
            </Button>
          </VStack>
        </HStack>

        <Separator my={4} />

        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={4}
          fontSize="sm"
        >
          <Stack gap={0}>
            <Text color="gray.500">Last Login</Text>
            <Text fontWeight="500">
              {(profile as any).lastLogin
                ? format(
                    new Date((profile as any).lastLogin),
                    "MMM d, yyyy HH:mm"
                  )
                : "—"}
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text color="gray.500">Created</Text>
            <Text fontWeight="500">
              {(profile as any).createdAt
                ? format(new Date((profile as any).createdAt), "MMM d, yyyy")
                : "—"}
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text color="gray.500">Updated</Text>
            <Text fontWeight="500">
              {(profile as any).updatedAt
                ? format(new Date((profile as any).updatedAt), "MMM d, yyyy")
                : "—"}
            </Text>
          </Stack>
          <Stack gap={0}>
            <Text color="gray.500">Portal Access</Text>
            <Text fontWeight="500">
              {(profile as any).portalAccessEnabled ? "Enabled" : "Disabled"}
            </Text>
          </Stack>
        </Grid>
      </Box>

      {/* Statistics Cards */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={4}
      >
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={5}
        >
          <HStack gap={3}>
            <Box bg="blue.50" borderRadius="lg" p={3}>
              <Activity size={20} color="blue.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="2xl" fontWeight="700" color="gray.800">
                {actionsThisMonth}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Actions This Month
              </Text>
            </Stack>
          </HStack>
        </Box>

        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={5}
        >
          <HStack gap={3}>
            <Box bg="purple.50" borderRadius="lg" p={3}>
              <ShieldCheck size={20} color="purple.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="2xl" fontWeight="700" color="gray.800">
                {permissionsCount}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Permissions
              </Text>
            </Stack>
          </HStack>
        </Box>

        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={5}
        >
          <HStack gap={3}>
            <Box bg="green.50" borderRadius="lg" p={3}>
              <Shield size={20} color="green.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="2xl" fontWeight="700" color="gray.800">
                {modulesCount}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Modules
              </Text>
            </Stack>
          </HStack>
        </Box>

        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          p={5}
        >
          <HStack gap={3}>
            <Box bg="orange.50" borderRadius="lg" p={3}>
              <Clock size={20} color="orange.600" />
            </Box>
            <Stack gap={0}>
              <Text fontSize="2xl" fontWeight="700" color="gray.800">
                {activities.length}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Recent Activities
              </Text>
            </Stack>
          </HStack>
        </Box>
      </Grid>

      {/* Permissions by Module */}
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
      >
        <HStack justifyContent="space-between" mb={4}>
          <Text fontWeight="600" fontSize="md" color="gray.700">
            Permissions by Module
          </Text>
          <Text fontSize="sm" color="gray.500">
            {permissionsCount} total
          </Text>
        </HStack>

        {permsLoading ? (
          <Stack gap={3}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="48px" borderRadius="md" />
            ))}
          </Stack>
        ) : Object.keys(groupedPermissions).length === 0 ? (
          <NoDataAvailable content="No permissions found" />
        ) : (
          <AccordionRoot multiple>
            {Object.entries(groupedPermissions).map(([module, perms]) => (
              <AccordionItem key={module} value={module}>
                <AccordionItemTrigger>
                  <HStack gap={4} flex={1} justify="space-between">
                    <Text fontWeight="500" fontSize="sm">
                      {module}
                    </Text>
                    <Badge
                      bg="gray.100"
                      color="gray.600"
                      px="2"
                      py="0.5"
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {perms.length}
                    </Badge>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent>
                  <HStack gap={2} flexWrap="wrap" py={2}>
                    {perms.map((perm) => (
                      <Badge
                        key={perm}
                        bg="blue.50"
                        color="blue.700"
                        px="2"
                        py="1"
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="500"
                      >
                        {perm}
                      </Badge>
                    ))}
                  </HStack>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        )}
      </Box>

      {/* Recent Activity Preview */}
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={6}
      >
        <HStack justifyContent="space-between" mb={4}>
          <Text fontWeight="600" fontSize="md" color="gray.700">
            Recent Activity
          </Text>
          {userId && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              // rightIcon={<ChevronRight size={14} />}
              onClick={() => navigate(`/user-management/${userId}/activity`)}
            >
              View All
            </Button>
          )}
        </HStack>

        {activityLoading ? (
          <Stack gap={3}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="42px" borderRadius="md" />
            ))}
          </Stack>
        ) : activities.length === 0 ? (
          <NoDataAvailable content="No recent activity" />
        ) : (
          <Stack gap={3}>
            {activities.slice(0, 5).map((activity: any, index: number) => (
              <HStack key={activity.id || index} gap={3} py={2}>
                <Box bg="gray.100" borderRadius="full" p={2} flexShrink={0}>
                  <Activity size={14} color="gray.500" />
                </Box>
                <Stack gap={0} flex={1}>
                  <Text fontSize="sm" fontWeight="500" color="gray.700">
                    {activity.summary || activity.action || "Activity"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {activity.createdAt
                      ? format(
                          new Date(activity.createdAt),
                          "MMM d, yyyy HH:mm"
                        )
                      : ""}
                    {activity.ipAddress ? ` · ${activity.ipAddress}` : ""}
                  </Text>
                </Stack>
              </HStack>
            ))}
          </Stack>
        )}
      </Box>

      <ConfirmationDialog
        open={resetOpen}
        onClose={() => {
          onResetClose();
        }}
        title="Reset Password?"
        action="reset this user's password"
        handleSubmit={() => {
          if (userId) {
            resetPassword(userId);
            onResetClose();
          }
        }}
        submitActionPending={isResetPending}
      />
    </Stack>
  );
};
