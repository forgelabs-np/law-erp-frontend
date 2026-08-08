import {
  Avatar,
  Badge,
  Box,
  Grid,
  HStack,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Building2,
  Calendar,
  Clock,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { UserResponseType } from "@/api/userManagement";

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg?: string;
}

const InfoTile = ({ icon, label, value, iconBg = "gray.50" }: InfoTileProps) => (
  <Box
    bg="gray.50"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="12px"
    p={3}
    transition="all 0.2s"
    _hover={{ bg: "gray.100", borderColor: "gray.200" }}
  >
    <HStack gap={3} align="flex-start">
      <Box
        bg={iconBg}
        borderRadius="lg"
        p={2}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
      <Stack gap={0} minW={0}>
        <Text fontSize="xs" color="gray.500" fontWeight="500">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="600" color="gray.800">
          {value}
        </Text>
      </Stack>
    </HStack>
  </Box>
);

export const UserInfoCard = ({ user }: { user: UserResponseType }) => {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      p={6}
      boxShadow="0 1px 3px rgba(0,0,0,0.04)"
    >
      {/* Profile Header */}
      <HStack gap={5} align="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
        <Avatar.Root size="2xl" colorPalette="blue">
          <Avatar.Fallback name={user.fullName} />
        </Avatar.Root>
        <Stack gap={1.5} flex={1}>
          <Text fontSize="xl" fontWeight="700" color="gray.900">
            {user.fullName}
          </Text>
          <Text fontSize="sm" color="gray.500">
            @{user.username}
          </Text>
          <HStack gap={2} flexWrap="wrap" mt={1}>
            <Badge
              bg="blue.50"
              color="blue.700"
              px="2.5"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {user.userType}
            </Badge>
            <Badge
              bg={user.isBlocked ? "red.50" : "green.50"}
              color={user.isBlocked ? "red.700" : "green.700"}
              px="2.5"
              py="1"
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {user.isBlocked ? "Blocked" : "Active"}
            </Badge>
          </HStack>
        </Stack>
      </HStack>

      <Separator my={5} />

      {/* Info Tiles Grid */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={3}
      >
        <InfoTile
          icon={<Mail size={16} color="#3b82f6" />}
          iconBg="blue.50"
          label="Email"
          value={user.email}
        />
        <InfoTile
          icon={<Phone size={16} color="#8b5cf6" />}
          iconBg="purple.50"
          label="Mobile"
          value={user.mobileNo || "N/A"}
        />
        <InfoTile
          icon={<Building2 size={16} color="#0891b2" />}
          iconBg="cyan.50"
          label="Firm"
          value={
            user.firmName
              ? `${user.firmName}${user.firmCode ? ` (${user.firmCode})` : ""}`
              : "N/A"
          }
        />
        <InfoTile
          icon={<Shield size={16} color="#f59e0b" />}
          iconBg="orange.50"
          label="Assigned Role"
          value={user.roleName || "No role"}
        />
        <InfoTile
          icon={<Clock size={16} color="#10b981" />}
          iconBg="green.50"
          label="Last Login"
          value={user.lastLogin || "Never"}
        />
        <InfoTile
          icon={<UserIcon size={16} color="#6b7280" />}
          iconBg="gray.100"
          label="User Type"
          value={user.userType}
        />
      </Grid>
    </Box>
  );
};
