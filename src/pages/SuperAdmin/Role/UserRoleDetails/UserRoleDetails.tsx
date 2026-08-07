import { HStack, Stack, Text, IconButton, Spinner, Center } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTES_CONFIG } from "@/shared/config";
import { UserResponseType } from "@/api/userManagement";
import { UserInfoCard } from "./components/UserInfoCard";
import { RoleInfoCard } from "./components/RoleInfoCard";
import { RolePermissionsSection } from "./components/RolePermissionsSection";

export const UserRoleDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = (location.state as { user?: UserResponseType })?.user;

  if (!user) {
    return (
      <Center p={10}>
        <Text>User not found. Please go back and try again.</Text>
      </Center>
    );
  }

  return (
    <Stack gap={6} padding={8}>
      <Stack gap={4}>
        <HStack gap={2}>
          <Link to={ROUTES_CONFIG.USER.ROLE_MANAGEMENT}>
            <Text fontSize="sm" color="gray.500" _hover={{ color: "blue.500", textDecoration: "underline" }}>
              Role Management
            </Text>
          </Link>
          <Text fontSize="sm" color="gray.400">/</Text>
          <Text fontSize="sm" color="gray.900" fontWeight="600">
            {user.fullName}
          </Text>
        </HStack>
        
        <HStack gap={4}>
          <IconButton
            variant="ghost"
            onClick={() => navigate(ROUTES_CONFIG.USER.ROLE_MANAGEMENT)}
            aria-label="Back"
          >
            <ArrowLeft />
          </IconButton>
          <Stack gap={1}>
            <Text textStyle="heading_4">User Role Details</Text>
            <Text textStyle="paragraph_regular" color="gray.500">
              View assigned role and manage role permissions.
            </Text>
          </Stack>
        </HStack>
      </Stack>

      <UserInfoCard user={user} />
      
      {user.roleId ? (
        <Stack gap={8}>
          <RoleInfoCard roleId={user.roleId} />
          <RolePermissionsSection roleId={user.roleId} />
        </Stack>
      ) : (
        <Center p={10}>
          <Text>No role assigned to this user.</Text>
        </Center>
      )}
    </Stack>
  );
};

export default UserRoleDetails;
